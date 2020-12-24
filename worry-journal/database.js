const CHECK_STRING = 'V4uXtP6j8q19elXY';
const DATABASE_VERSION = 1.0;

async function hashPassword(passwd) {
    // We just need to convert the password into something aes can
    // use as a key. This isn't stored anywhere so it doesn't
    // need to be robust against attacks.
    const msgBuffer = new TextEncoder().encode(passwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return new Uint8Array(hashBuffer);
}

async function decryptString(s, passwd) {
    const key = await hashPassword(passwd);
    const stringBytes = aesjs.utils.hex.toBytes(s);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key);
    const decryptedBytes = aesCtr.decrypt(stringBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

async function encryptString(s, passwd) {
    const key = await hashPassword(passwd);
    const stringBytes = aesjs.utils.utf8.toBytes(s);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key);
    var encryptedBytes = aesCtr.encrypt(stringBytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
}

export class Database {
    constructor() {
        this.items = [];
        this.passwd = null;
        this.encryptedState = localStorage.getItem('encrypted-state');
        if (this.encryptedState) {
            this.encryptedState = JSON.parse(this.encryptedState);
        }
    }

    hasPassword() {
        return this.passwd !== null;
    }

    hasState() {
        return this.encryptedState !== null;
    }

    async setPassword(passwd) {
        // Check if there is any data we can load.
        if (this.encryptedState) {
            const {encryptedCheckString} = this.encryptedState;
            const decryptedCheck = await decryptString(encryptedCheckString, passwd);
            if (decryptedCheck !== CHECK_STRING) {
                throw new DOMException(
                    'Invalid password for current encrypted state.',
                    'Invalid password');
            }
            const {encryptedItems} = this.encryptedState;
            this.items = JSON.parse(await decryptString(encryptedItems, passwd));
        }
        this.passwd = passwd;
        this.sync();
    }

    ensureDatabaseMutable() {
        if (!this.passwd) {
            throw new DOMException(
                'Attempted to mutate database with no password set.',
                'No Password Set');
        }
    }

    updateItem(id, newItem) {
        this.ensureDatabaseMutable();
        const itemIndex = this.items.findIndex(i => i.id === id);
        if (itemIndex < 0) {
            throw Error('No item found with supplied id.');
        }
        this.items[itemIndex] = {
            ...this.items[itemIndex],
            ...newItem
        };
        this.sync();
    }

    addItem(item) {
        this.ensureDatabaseMutable();
        item.id = uuid.v4();
        item.date = Date.now();
        this.items.push(item);
        this.sync();
    }

    removeItem(id) {
        this.ensureDatabaseMutable();
        this.items = this.items.filter(i => i.id !== id);
        this.sync();
    }

    async sync() {
        // TODO(): race condition handling.
        const encryptedCheckString = await encryptString(CHECK_STRING, this.passwd);
        const encryptedItems = await encryptString(JSON.stringify(this.items), this.passwd);
        const serializableState = {
            version: DATABASE_VERSION,
            encryptedCheckString,
            encryptedItems
        };
        localStorage.setItem('encrypted-state', JSON.stringify(serializableState));
    }
}
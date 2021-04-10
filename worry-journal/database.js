const CHECK_STRING = 'V4uXtP6j8q19elXY';
const DATABASE_VERSION = 1.1;
const DEV = false;

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
    constructor(onChange) {
        this.items = [];
        this._retorts = [];
        this.passwd = DEV ? '1234' : null;
        this.encryptedState = localStorage.getItem('encrypted-state');
        this.onChange = onChange;
        if (this.encryptedState) {
            this.encryptedState = JSON.parse(this.encryptedState);
        }
        if (this.encryptedState && DEV) {
            this.decrypt(this.passwd);
        }
    }

    hasPassword() {
        return this.passwd !== null;
    }

    hasState() {
        return this.encryptedState !== null;
    }

    async decrypt(passwd) {
        const {encryptedCheckString} = this.encryptedState;
        const decryptedCheck = await decryptString(encryptedCheckString, passwd);
        if (decryptedCheck !== CHECK_STRING) {
            throw new DOMException(
                'Invalid password for current encrypted state.',
                'Invalid password');
        }
        const {encryptedItems, encryptedRetorts} = this.encryptedState;
        this.items = JSON.parse(await decryptString(encryptedItems, passwd));
        this._retorts = encryptedRetorts ? JSON.parse(await decryptString(encryptedRetorts, passwd)) : [];
        this.onChange();
    }

    async setPassword(passwd) {
        // Check if there is any data we can load.
        if (this.encryptedState) {
            await this.decrypt(passwd);
        }
        // Decrypt would have raised a exception of the password was wrong, if we made it here
        // we can trust the password.
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
        this._retorts = this._retorts.filter(r => r.parentID !== id);
        this.sync();
    }

    getRetorts(parentID) {
        return this._retorts.filter(r => r.parentID === parentID);
    }

    addRetort(retort) {
        if (!retort.parentID) {
            throw new Error('Retort must include a parentID');
        }
        if(!this.items.find(item => item.id === retort.parentID)) {
            throw new Error('Retort must include a valid parentID pointing to a existing item.');
        }

        this.ensureDatabaseMutable();
        retort.id = uuid.v4();
        retort.date = Date.now();
        this._retorts.push(retort);
        this.sync();
    }
    
    removeRetort(id) {
        this.ensureDatabaseMutable();
        this._retorts = this._retorts.filter(i => i.id !== id);
        this.sync();
    }

    async sync() {
        // TODO(): race condition handling.
        const encryptedCheckString = await encryptString(CHECK_STRING, this.passwd);
        const encryptedItems = await encryptString(JSON.stringify(this.items), this.passwd);
        const encryptedRetorts = await encryptString(JSON.stringify(this._retorts), this.passwd);
        const serializableState = {
            version: DATABASE_VERSION,
            encryptedCheckString,
            encryptedItems,
            encryptedRetorts
        };
        localStorage.setItem('encrypted-state', JSON.stringify(serializableState));
        this.onChange();
    }
}
const CHECK_STRING = 'V4uXtP6j8q19elXY';
const DATABASE_VERSION = 1.2;

function extractFromEncryptedState(key, encryptedState) {
    if (!encryptedState) {
        throw new Error(`No such field "${key}" in encrypted state.`);
    }
    if (key === 'encryptedWorries' && !encryptedState.encryptedWorries) {
        // 1.1 -> 1.2 upgrade handling.
        return encryptedState.encryptedItems;
    }
    return encryptedState[key];
}

function getFlags() {
    const host = location.host.split(':')[0];
    if ( host !== "127.0.0.1" && host !== "localhost" ) {
        return new Map();
    }
    return new URL(location.href).searchParams || new Map();
}

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
        this.worries = [];
        this.thoughts = [];
        this._retorts = [];
        this.passwd = getFlags().has('skipLogin') ? '1234' : null;
        this.encryptedState = localStorage.getItem('encrypted-state');
        this.readyResolver = null;
        this.onReadyListeners = [];
        if (this.encryptedState) {
            this.encryptedState = JSON.parse(this.encryptedState);
        }
        if (this.encryptedState && getFlags().has('skipLogin')) {
            this.decrypt(this.passwd);
        }
    }
    
    onReady(callback) {
        this.onReadyListeners.push(callback);
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
        const encryptedWorries = extractFromEncryptedState('encryptedWorries', this.encryptedState);
        const encryptedThoughts = extractFromEncryptedState('encryptedThoughts', this.encryptedState);
        const encryptedRetorts = extractFromEncryptedState('encryptedRetorts', this.encryptedState);
        this.worries = JSON.parse(await decryptString(encryptedWorries, passwd));
        this.thoughts = encryptedThoughts ? JSON.parse(await decryptString(encryptedThoughts, passwd)) : [];
        this._retorts = encryptedRetorts ? JSON.parse(await decryptString(encryptedRetorts, passwd)) : [];
        this.onReadyListeners.map(l => l());
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

    updateWorryItem(id, newItem) {
        this.ensureDatabaseMutable();
        const itemIndex = this.worries.findIndex(i => i.id === id);
        if (itemIndex < 0) {
            throw Error('No worry found with supplied id.');
        }
        this.worries[itemIndex] = {
            ...this.worries[itemIndex],
            ...newItem
        };
        this.sync();
    }

    addWorryItem(item) {
        this.ensureDatabaseMutable();
        item.id = uuid.v4();
        item.date = Date.now();
        this.worries.push(item);
        this.sync();
    }

    removeWorryItem(id) {
        this.ensureDatabaseMutable();
        this.worries = this.worries.filter(i => i.id !== id);
        this._retorts = this._retorts.filter(r => r.parentID !== id);
        this.sync();
    }

    updateThoughtDiaryItem(item) {
        this.ensureDatabaseMutable();
        if (item.id) {
            const thoughtIndex = this.thoughts.findIndex(i => i.id === item.id);
            if (thoughtIndex < 0) {
                throw Error('No thought found with supplied id.');
            }
            this.thoughts[thoughtIndex] = {
                ...this.thoughts[thoughtIndex],
                ...item
            };
        } else {
            item.id = uuid.v4();
            item.date = Date.now();
            this.thoughts.push(item);
        }
        this.sync();
    }

    removeThoughtDiaryItem(thoughtId) {
        this.ensureDatabaseMutable();
        this.thoughts = this.thoughts.filter(i => i.id !== thoughtId);
        this.sync();
    }


    removeWorryItem(id) {
        this.ensureDatabaseMutable();
        this.worries = this.worries.filter(i => i.id !== id);
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
        if(!this.worries.find(item => item.id === retort.parentID)) {
            throw new Error('Retort must include a valid parentID pointing to a existing worry item.');
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
        const encryptedWorries = await encryptString(JSON.stringify(this.worries), this.passwd);
        const encryptedThoughts = await encryptString(JSON.stringify(this.thoughts), this.passwd);
        const encryptedRetorts = await encryptString(JSON.stringify(this._retorts), this.passwd);
        const serializableState = {
            version: DATABASE_VERSION,
            encryptedCheckString,
            encryptedWorries,
            encryptedThoughts,
            encryptedRetorts
        };
        localStorage.setItem('encrypted-state', JSON.stringify(serializableState));
    }
}
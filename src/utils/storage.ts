import {} from '.';

const isFalsyNotZero = (obj: unknown) => {
    return obj === 0 ? false : [undefined, null, '', false].includes(obj as any);
};

interface LocalStorageOptions {
    prefix?: string;
    isSecret?: boolean;
    type?: 'localStorage' | 'sessionStorage';
}
interface StorageSetData {
    value: unknown;
    expire?: number;
}

export class BrowserStorage {
    private config: LocalStorageOptions = { prefix: 'huang' };
    private storage: Storage;
    constructor(options: LocalStorageOptions = {}) {
        this.storage = options?.type === 'sessionStorage' ? sessionStorage : localStorage;
    }

    public setItem<T>(key: string, value: T, expire?: number) {
        try {
            if (!key) {
                return;
            }
            const data = {
                expire: isFalsyNotZero(expire) ? undefined : Date.now() + expire!,
                value,
            };
            const stringifyData = JSON.stringify(data);
            this.storage.setItem(this.addPrefix(key), stringifyData);
        } catch (e) {
            console.log({ err: e, message: `setItem error, key: ${key}` });
        }
    }

    public setMany<T extends unknown[]>(keys: string[], values: T, expires: number[] = []) {
        if (!keys || !keys?.length || !values || !values?.length) {
            return;
        }
        keys.forEach((item, index) => {
            this.setItem(item, values[index], expires[index]);
        });
    }

    public getItem<T>(key: string): T | null {
        try {
            if (!key) {
                return null;
            }
            const stringifyData = this.storage.getItem(this.addPrefix(key));
            if (!stringifyData) {
                return null;
            }
            const { value, expire } = JSON.parse(stringifyData) as StorageSetData;
            if (expire && expire < Date.now()) {
                this.removeItem(key);
                return null;
            }
            return value as T;
        } catch (e) {
            console.log({ err: e, message: `getItem error, key: ${key}` });
            return null;
        }
    }

    public getMany<T extends Record<string, unknown>>(keys: string[]): T {
        if (!keys || !keys?.length) {
            return {} as T;
        }
        const obj: Record<string, unknown> = {};
        keys.forEach(item => {
            const value = this.getItem(item);
            obj[item] = value;
        });
        return obj as T;
    }

    public has(key: string) {
        if (!key) {
            return false;
        }
        const keys = this.getAllKeys();
        return keys.includes(key);
    }

    public removeItem(key: string) {
        if (!key) {
            return;
        }
        this.storage.removeItem(this.addPrefix(key));
    }

    public removeMany(keys: string[]) {
        if (!keys || !keys?.length) {
            return;
        }
        keys.forEach(item => {
            this.removeItem(item);
        });
    }

    public clear() {
        this.storage.clear();
    }

    public getAll() {
        const obj: Record<string, unknown> = {};
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.removePrefix(this.storage.key(i)!);
            const value = this.getItem(key);
            !!key && !!value && (obj[key] = value);
        }
        return obj;
    }

    public getAllKeys() {
        const arr: string[] = [];
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            arr.push(this.removePrefix(key!));
        }
        return arr;
    }

    public getStorageLength() {
        return this.storage.length;
    }

    private addPrefix(key: string) {
        const { prefix = '' } = this.config;
        const modifyPrefix = prefix ? `${prefix}_` : '';
        return `${modifyPrefix}${key}`;
    }

    private removePrefix(key: string) {
        const { prefix = '' } = this.config;
        const realLength = prefix ? prefix.length + 1 : 0;
        return key.slice(realLength);
    }
}

export default BrowserStorage;

import { LocalStorageHelper, type Store } from '@lania/utils';

type PersistentPluginOptions = {
    storageKey: string; // 用于存储状态的键
    valueKey?: string[];
};

export class PersistentPlugin {
    private storageKey: string;
    private valueKey?: string[];

    constructor(options: PersistentPluginOptions) {
        this.storageKey = options.storageKey;
        this.valueKey = options.valueKey;
    }

    onInit(store: Store): void {
        // 从存储中恢复状态
        const storedState = LocalStorageHelper.get<any>(this.storageKey) || {};
        if (!this.valueKey) {
            store.setState('', storedState);
            return;
        }
        this.valueKey.forEach(key => {
            const value = storedState[key];
            if (value) {
                store.setState(key, value);
            }
        });
    }

    onStateChange(_store: Store, newState: Record<string, any>): void {
        if (!this.valueKey) {
            LocalStorageHelper.set(this.storageKey, newState);
            return;
        }
        const state = this.valueKey.reduce((acc: Record<string, any>, key) => {
            acc[key] = newState[key];
            return acc;
        }, {});
        LocalStorageHelper.set(this.storageKey, state);
    }
}

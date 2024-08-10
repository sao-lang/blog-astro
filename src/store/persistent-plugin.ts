import { LocalStorageHelper, type Store, type StorePlugin } from '@lania/utils';
import type { State } from '.';

type PersistentPluginOptions = {
    storageKey: string; // 用于存储状态的键
    valueKey?: string[];
};

export const REHYDRATE = '@@INIT_FROM_STORAGE';

export class PersistentPlugin implements StorePlugin {
    private storageKey: string;

    constructor(options: PersistentPluginOptions) {
        this.storageKey = options.storageKey;
    }

    onInit(store: Store<State, any>): void {
        // 从存储中恢复状态
        const storedState = LocalStorageHelper.get<State>(this.storageKey);
        if (storedState) {
            store.dispatch({ type: REHYDRATE, payload: storedState });
            return;
        }
    }

    onStateChange(_store: Store<State, any>, newState: Record<string, any>): void {
        LocalStorageHelper.set(this.storageKey, newState);
    }

    onError(store: any, error: Error) {
        console.error(error);
    }
}

import type { State } from '@/store';
import store from '@/store';
import { reactive } from 'vue';

export interface StoreDerivedState {
    isSimple: boolean;
    isLight: boolean;
}

export const useSettingHook = (onSettingChange?: (setting: State['setting']) => void) => {
    const setting = reactive<StoreDerivedState>({ isLight: true, isSimple: true });
    store.watchProperty(
        'setting',
        value => {
            const derivedState = store.getDerivedState();
            Object.assign(setting, derivedState);
            onSettingChange?.(value);
        },
        { immediate: true, deep: true },
    );
    return setting;
};

export default useSettingHook;

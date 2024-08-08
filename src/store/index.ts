import { Lang, Theme } from '@/enums';
import { Store } from '@lania/utils';
import { PersistentPlugin, REHYDRATE } from './persistent-plugin';
import { PERSISTENT_PLUGIN_STORED_KEY, STORE_SETTING_KEY } from '@/const';
export type State = {
    setting: {
        lang: Lang;
        theme: Theme;
    };
};
export const actions = {
    SET_LIGHT: { type: 'SET_LIGHT', payload: { theme: Theme.light } },
    SET_DARK: { type: 'SET_DARK', payload: { theme: Theme.dark } },
    SET_ZH_CN: { type: 'SET_ZH_CN', payload: { lang: Lang.zh_CN } },
    SET_ZH_TW: { type: 'SET_ZH_TW', payload: { lang: Lang.zh_TW } },
};
const initialState: State = { setting: { lang: Lang.zh_CN, theme: Theme.light } };
const persistentPlugin = new PersistentPlugin({
    storageKey: PERSISTENT_PLUGIN_STORED_KEY,
});
const store = new Store({
    initialState,
    reducers: {
        [REHYDRATE]: (state, payload: Record<string, any>) => {
            const newState = { ...state, ...payload };
            return newState;
        },
        SET_THEME: (state, payload: Record<string, any>) => {
            return { ...state, setting: { ...state.setting, ...payload } };
        },
        SET_LANG: (state, payload: Record<string, any>) => {
            return { ...state, setting: { ...state.setting, ...payload } };
        },
    },
    plugins: [persistentPlugin],
});

export default store;

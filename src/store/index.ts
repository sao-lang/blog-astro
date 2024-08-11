import { Lang, Theme } from '@/enums';
import { Store } from '@lania/utils';
import { PersistentPlugin, REHYDRATE } from './persistent-plugin';
import { DISPATCH_LANG_KEY, DISPATCH_THEME_KEY, PERSISTENT_PLUGIN_STORED_KEY } from '@/const';
import { nextTick } from 'vue';
import message from '@/utils/message';
export type State = {
    setting: {
        lang: Lang;
        theme: Theme;
    };
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
        [DISPATCH_THEME_KEY]: (state, payload: Record<string, any>) => {
            return { ...state, setting: { ...state.setting, ...payload } };
        },
        [DISPATCH_LANG_KEY]: (state, payload: Record<string, any>) => {
            return { ...state, setting: { ...state.setting, ...payload } };
        },
    },
    plugins: [persistentPlugin],
    derivedState: {
        isSimple: state => {
            return state.setting.lang === Lang.zh_CN;
        },
        isLight: state => {
            return state.setting.theme === Theme.light;
        },
    },
});

export const actions = {
    setTheme: (theme: Theme, showMessage = false) => {
        store.dispatch({ type: DISPATCH_THEME_KEY, payload: { theme } });
        showMessage &&
            nextTick(() => {
                message.success(
                    theme === Theme.dark ? '你已经切换成深色模式' : '你已经切换成浅色模式',
                    1000,
                );
            });
    },
    setLang: (lang: Lang, showMessage = false) => {
        store.dispatch({ type: DISPATCH_THEME_KEY, payload: { lang } });
        showMessage &&
            nextTick(() => {
                message.success(
                    lang === Lang.zh_TW ? '你已经切换成繁体' : '你已经切换成简体',
                    1000,
                );
            });
    },
};

export default store;

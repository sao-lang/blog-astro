import { Lang, Theme } from '@/enums';
import { Store } from '@lania/utils';
import { PersistentPlugin } from './persistent-plugin';
import { PERSISTENT_PLUGIN_STORED_KEY, STORE_SETTING_KEY } from '@/const';
export type State = {
    setting: {
        lang: Lang;
        theme: Theme;
    };
};
export const actions = {
    setLight: { type: 'setLight', payload: { theme: Theme.light } },
    setDark: { type: 'setDark', payload: { theme: Theme.dark } },
    setZH_CN: { type: 'setZH_CN', payload: { lang: Lang.zh_CN } },
    setZH_TW: { type: 'setZH_CN', payload: { lang: Lang.zh_TW } },
};
const initialState: State = { setting: { lang: Lang.zh_CN, theme: Theme.light } };
// const reducer: ModuleReducer = (state = initialState, action) => {
//     switch (action?.type) {
//         case 'setLight':
//         case 'setDark':
//         case 'setZH_CN':
//         case 'setZH_TW':
//             return { ...state, ...action.payload };
//         default:
//             return state;
//     }
// };
const persistentPlugin = new PersistentPlugin({
    storageKey: PERSISTENT_PLUGIN_STORED_KEY,
    valueKey: [STORE_SETTING_KEY],
});
const store = new Store(initialState);
store.addPlugin(persistentPlugin)

export default store;

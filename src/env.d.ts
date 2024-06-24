/// <reference types="astro/client" />

import type { BrowserStorage } from "./utils";
import type { DefineComponent } from "vue";

declare global {
    interface Window {
        storage: BrowserStorage;
    }
}

declare module '*.vue' {
    import { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

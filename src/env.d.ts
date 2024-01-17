/// <reference types="astro/client" />

import type { BrowserStorage } from "./utils";

declare global {
    interface Window {
        storage: BrowserStorage;
    }
}
import type BrowserStorage from '@utils/storage';

declare let storage: BrowserStorage;
declare let window: Window & globalThis  & { storage: BrowserStorage };

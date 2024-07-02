export * from './translate';
export * from './storage';
export type Fn = (...args: any) => any;
export type FnArgsType<F extends Function> = F extends (...args: infer A) => any ? A : never;

export type FnReturnType<K extends Fn> = (...args: FnArgsType<K>) => ReturnType<K>;

/**
 * @name debounce
 * @description 防抖函数
 * @param {(...args: any[]) => unknown} fn 回调函数
 * @param {number} wait 间隔时间
 * @param {boolean} immediate 是否立即执行
 */
export const debounce = <T extends Fn>(fn: T, wait?: number, immediate?: boolean): FnReturnType<T> & { cancel: () => void } => {
    let timeout: NodeJS.Timeout | null;
    let result: ReturnType<T>;
    function debounced(this: unknown, ...args: FnArgsType<T>) {
        if (timeout) {
            clearTimeout(timeout);
        }
        if (immediate) {
            const callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait || 1000);
            if (callNow) {
                result = fn.apply(this, args);
            }
        } else {
            timeout = setTimeout(() => {
                result = fn.apply(this, args);
            }, wait || 1000);
        }
        return result;
    }
    debounced.cancel = function () {
        if (timeout) {
            clearTimeout(timeout);
        }
    };
    return debounced;
};

type ThrottleOptions = { leading?: boolean; trailing?: boolean };
/**
 * @name throttle
 * @description 节流函数
 * @param {(...args: unknown[]) => unknown} fn 回调函数
 * @param {number} wait 间隔时间
 * @param {ThrottleOptions} options leading  开始就执行 trailing 最后也执行，两者相斥
 */
export const throttle = <T extends Fn>(func: T, wait = 1000, options?: ThrottleOptions): FnReturnType<T> & { cancel: () => void } => {
    let timeout: NodeJS.Timeout | null = null;
    let previous = 0;
    let result: ReturnType<T>;
    if (!options) {
        options = {};
    }
    function throttled(this: unknown, ...args: FnArgsType<T>) {
        const now: number = new Date().getTime();
        if (!previous && options?.leading === false) {
            previous = now;
        }
        const remaining: number = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(this, args);
        } else if (!timeout && options?.trailing !== false) {
            timeout = setTimeout(() => {
                previous = options?.leading === false ? 0 : Date.now();
                timeout = null;
                result = func.apply(this, args);
            }, remaining);
        }
        return result;
    }
    throttled.cancel = function () {
        if (timeout) {
            clearTimeout(timeout);
        }
        previous = 0;
    };
    return throttled;
};

const transformLyricTime = (time: string) => {
    const min = Number(time.slice(0, 2));
    const s = Number(time.slice(3, time.length));
    return min * 60 + s;
};

export const handleLyric = (lrc?: string) => {
    if (!lrc) {
        return [];
    }
    const lrcArr = lrc.split('\n');
    const regex = /\[(\d{2}:\d{2}\.\d{2})\](.+)/g;
    return lrcArr
        .map((lrc) => {
            const match = [...lrc.matchAll(regex)][0];
            if (!match) {
                return undefined;
            }
            const originalTime = match[1];

            const lyric = match[2];
            return { time: transformLyricTime(originalTime), lyric };
        })
        .filter(Boolean) as {
        time: number;
        lyric: string;
    }[];
};

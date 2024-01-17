import Typed from 'typed.js';
import $ from 'jquery';
import { exchange } from '@utils/index';

const typedWords = ['去国十年老尽，少年心', '老夫聊发少年狂'];

export const exchangeTypedWords = (openSimple: boolean) => {
    for (let index = 0; index < typedWords.length; index++) {
        typedWords[index] = exchange(typedWords[index], openSimple);
    }
    initTyped(typedWords);
};

let typed: Typed;
export const initTyped = (words?: string[]) => {
    if (typed) {
        typed.destroy();
    }
    typed = new Typed($('.layout-main-typed-inner')[0], {
        strings: words || typedWords,
        typeSpeed: 100,
        backSpeed: 100,
        loop: true,
        backDelay: 5000,
    });
};

initTyped();

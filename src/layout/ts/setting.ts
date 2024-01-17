import { scrollbar } from './scroll';
import $ from 'jquery';
import { translate } from '@utils/index';
import { exchangeTypedWords } from './typed';

scrollbar.addListener(({ offset, limit }) => {
    $('.layout-scrollbar-progress-num').html(((offset.y / limit.y) * 100).toFixed());
});

const gearContainer = $('.layout-gear-container').on('click', e => {
    const settingOther = $('.layout-setting-other');
    if (gearContainer.hasClass('layout-setting-icon-active')) {
        gearContainer.removeClass('layout-setting-icon-active');
        settingOther.css('right', '-60px');
    } else {
        gearContainer.addClass('layout-setting-icon-active');
        settingOther.css('right', '20px');
    }
});

$('.layout-scroll-up').on('click', () => {
    scrollbar.scrollTo(0, 0, 500);
});

$('.layout-scroll-down').on('click', () => {
    scrollbar.scrollTo(0, scrollbar.limit.y, 500);
});

const transformMode = $('.layout-transform-mode').on('click', e => {
    if (transformMode.hasClass('layout-setting-icon-active')) {
        window.storage.setItem('mode', 'light');
        transformMode.removeClass('layout-setting-icon-active');
    } else {
        localStorage.setItem('mode', 'dark');
        transformMode.addClass('layout-setting-icon-active');
    }
});

$('.layout-transform-character').on('click', () => {
    const traditionalIcon = $('.layout-traditional-transform');
    const simplifiedIcon = $('.layout-simplified-transform');
    if (traditionalIcon.hasClass('none')) {
        traditionalIcon.removeClass('none');
        simplifiedIcon.addClass('none');
        translate(false);
        window.storage.setItem('isSimplified', false);
        exchangeTypedWords(false);
    } else {
        simplifiedIcon.removeClass('none');
        traditionalIcon.addClass('none');
        translate(true);
        window.storage.setItem('isSimplified', true);
        exchangeTypedWords(true);
    }
});

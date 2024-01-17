import BrowserStorage from '@utils/storage';
import $ from 'jquery';
import { exchangeTypedWords } from './typed';
import { translate } from '@utils/translate';

$(window).on('load', () => {
    window.storage = new BrowserStorage();
    const isSimplified = window.storage.getItem('isSimplified');
    if (isSimplified) {
        $('.layout-traditional-transform').addClass('none');
    } else {
        $('.layout-simplified-transform').addClass('none');
        exchangeTypedWords(false);
        translate(false);
    }
    const mode = window.storage.getItem('mode');
    if (mode === 'dark') {
        $('.layout-transform-mode').addClass('layout-setting-icon-active');
    }
});

import ScrollBar from 'smooth-scrollbar';
import $ from 'jquery';

export const scrollbar = ScrollBar.init($('.layout-main')[0]);

$('.layout-main-down').on('click', () => {
    const mainOffsetHeight = $('.layout-main').outerHeight()!;
    const headerOffsetHeight = $('.layout-header').outerHeight()!;
    const limit = mainOffsetHeight - headerOffsetHeight;
    scrollbar.scrollTo(0, limit, 500);
});

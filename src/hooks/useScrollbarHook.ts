import ScrollBar from 'smooth-scrollbar';
import type { ScrollListener } from 'smooth-scrollbar/interfaces';
export const useScrollbarHook = (el: Ref<HTMLElement>, onScroll?: ScrollListener) => {
    const scrollbar = ref<ScrollBar>();

    onMounted(() => {
        scrollbar.value = ScrollBar.init(el.value!);
        onScroll && scrollbar.value.addListener(onScroll);
    });
    onUnmounted(() => {
        onScroll && scrollbar.value?.removeListener(onScroll);
    });

    return scrollbar;
};

export default useScrollbarHook;

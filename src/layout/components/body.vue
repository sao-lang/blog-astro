<script lang="ts" setup>
    import ScrollBar from 'smooth-scrollbar';
    import Typed from 'typed.js';
    import Player from '@/components/player-new/index.vue';
    import Icon from '@/components/icon/index.vue';
    import ContextMenu from '@/components/context-menu/index.vue';
    import Setting from '@/components/setting/index.vue';
    import { convertChinese, convertPageChinese } from '@lania/utils';
    import simpledToTraditional from '@lania/utils-json/simpledToTraditional.json';
    import traditionalToSimpled from '@lania/utils-json/traditionalToSimpled.json';
    import '@lania/utils/message.css';
    import { Lang } from '@/enums';
    import type { ContextMenuExpose } from '@/components/context-menu/types';
    import type { ScrollListener } from 'smooth-scrollbar/interfaces/scrollbar';
    import useSettingHook from '@/hooks/useSettingHook';

    const typedRef = ref<HTMLSpanElement>();
    const typed = ref<Typed>();
    const scrollbarRef = ref<HTMLDivElement>();
    const headerContainerRef = ref<HTMLHeadElement>();
    const scrollbar = ref<ScrollBar>();
    const scrollBarProgress = ref(0);
    const typedWords = ref<string[]>(['去国十年老尽，少年心', '老夫聊发少年狂']);
    const contextMenuRef = ref<ContextMenuExpose>();
    const setting = useSettingHook();

    watch(
        () => setting.isLight,
        isLight => {
            const dataset = document.body.dataset;
            !isLight ? (dataset.theme = 'dark') : delete dataset.theme;
        },
        { immediate: true },
    );
    watch(
        () => setting.isSimple,
        isSimple => {
            setTimeout(() => {
                const apis = {
                    [Lang.zh_CN]: {
                        convert: (text: string) => convertChinese(text, traditionalToSimpled),
                        convertInElement: () => convertPageChinese(traditionalToSimpled),
                    },
                    [Lang.zh_TW]: {
                        convert: (text: string) => convertChinese(text, simpledToTraditional),
                        convertInElement: () => convertPageChinese(simpledToTraditional),
                    },
                };
                const api = apis[isSimple ? Lang.zh_CN : Lang.zh_TW];
                typedWords.value = typedWords.value.map(word => api.convert(word));
                initTyped();
                api.convertInElement();
            }, 100);
        },
        { immediate: true },
    );

    onMounted(() => {
        initTyped();
        initScrollBar();
    });
    onUnmounted(() => {
        scrollbar.value?.removeListener(handleScrollbarScroll);
    });
    const initTyped = (words?: string[]) => {
        if (typed.value) {
            typed.value.destroy();
        }
        typed.value = new Typed(typedRef.value, {
            strings: words || typedWords.value,
            typeSpeed: 100,
            backSpeed: 100,
            loop: true,
            backDelay: 5000,
        });
    };
    const initScrollBar = () => {
        scrollbar.value = ScrollBar.init(scrollbarRef.value!);
        scrollbar.value.addListener(handleScrollbarScroll);
    };
    const handleClickDownIcon = () => {
        const mainContainer = scrollbarRef.value as HTMLDivElement;
        const headerContainer = headerContainerRef.value as HTMLDivElement;
        const limit = mainContainer.offsetHeight - headerContainer.offsetHeight;
        scrollbar.value!.scrollTo(0, limit, 500);
    };
    const handleClickScroll = (type: 'down' | 'up') => {
        scrollbar.value!.scrollTo(0, type === 'up' ? 0 : scrollbar.value!.limit.y, 500);
    };
    const handleScrollbarScroll: ScrollListener = ({ offset, limit }) => {
        contextMenuRef.value?.closeMenu();
        scrollBarProgress.value = Math.floor((offset.y / limit.y) * 100);
    };
</script>

<template>
    <div>
        <ContextMenu ref="contextMenuRef" @to-top="() => handleClickScroll('up')">
            <header class="layout-header" ref="headerContainerRef" />
            <main class="layout-main" ref="scrollbarRef">
                <div class="layout-main-top">
                    <span class="layout-main-typed-container">
                        <span class="layout-main-typed-inner" ref="typedRef"></span>
                    </span>
                    <div class="animate-bounce-down layout-main-down" @click="handleClickDownIcon">
                        <Icon name="down1" class="layout-main-down-icon" />
                    </div>
                </div>
                <div class="layout-main-content">
                    <slot></slot>
                </div>
            </main>
        </ContextMenu>
    </div>
    <Setting
        :scroll-progress="scrollBarProgress"
        @scroll-to-bottom="() => handleClickScroll('down')"
        @scroll-to-top="() => handleClickScroll('up')"
    />
    <Player />
    <!-- <Player client:only="vue" /> -->
</template>

<style lang="scss" scoped>
    .animate-bounce-down {
        animation: bounce-down 1.5s linear infinite;
    }
    .layout-header {
        position: fixed;
        width: 100%;
        height: 60px;
        z-index: 1;
        background: linear-gradient(
            120deg,
            rgba(97, 192, 191, 0.208) 0,
            rgba(255, 182, 185, 0.208) 100%
        );
        backdrop-filter: blur(10px);
        transition: all 1s;
    }

    .layout-main {
        height: 100vh;
        background: url('../../public/imgs/home_bg.webp') left top no-repeat;
        overflow-x: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        .layout-main-top {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            height: 100vh;

            .layout-main-typed-container {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                padding: 0 10px;
                height: 50px;
                border-radius: 5px;
                font-size: 20px;
                color: var(--typed-text-color);
                background-color: var(--typed-bg-color);
                transition: all 0.3s;
            }

            .layout-main-down {
                position: absolute;
                bottom: 10px;
                cursor: pointer;
            }
            .layout-main-down-icon {
                font-size: 40px;
                color: var(--debounced-down-icon-text-color);
                transition: all 0.3s;
            }
        }
        .layout-main-content {
            min-height: 100vh;
            padding: 0 150px;
        }
    }
</style>

<style lang="scss">
    .layout-main {
        .scrollbar-track {
            background-color: var(--scrollbar-track-color);
        }
        .scrollbar-thumb {
            background-color: var(--scrollbar-thumb-color);
        }
    }
</style>

<script lang="ts" setup>
    import { onMounted, reactive, ref } from 'vue';
    import ScrollBar from 'smooth-scrollbar';
    import Typed from 'typed.js';
    import Icon from '@/components/icon/index.vue';
    import { BrowserStorage, exchange, translate } from '@/utils';
    const settingValues = reactive<{ isSimplified: boolean; isDark: boolean }>({
        isSimplified: true,
        isDark: false,
    });

    const typedRef = ref<HTMLSpanElement>();
    const typed = ref<Typed>();
    const scrollbarRef = ref<HTMLDivElement>();
    const scrollbar = ref<ScrollBar>();

    const scrollBarProgress = ref('0');
    const showSetting = ref(false);

    const typedWords = ref<string[]>(['去国十年老尽，少年心', '老夫聊发少年狂']);

    onMounted(() => {
        initStorage();
        initTyped();
        initScrollBar();
    });
    const initStorage = () => {
        window.storage = new BrowserStorage();
        settingValues.isSimplified = window.storage.getItem('isSimplified') as boolean;
        settingValues.isDark = window.storage.getItem('isDark') as boolean;
        if (settingValues.isSimplified) {
            translate(false);
        }
    };
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
        scrollbar.value.addListener(({ offset, limit }) => {
            scrollBarProgress.value = ((offset.y / limit.y) * 100).toFixed();
        });
    };

    const handleClickDownIcon = () => {
        const mainContainer = document.querySelector('.layout-main') as HTMLDivElement;
        const headerContainer = document.querySelector('.layout-header') as HTMLDivElement;
        const limit = mainContainer.offsetHeight - headerContainer.offsetHeight;
        scrollbar.value!.scrollTo(0, limit, 500);
    };
    const handleClickSettingIcon = () => {
        showSetting.value = !showSetting.value;
    };
    const handleClickScroll = (type: 'down' | 'up') => {
        scrollbar.value!.scrollTo(0, type === 'up' ? 0 : scrollbar.value!.limit.y, 500);
    };
    const handleChangeMode = () => {
        const { isDark } = settingValues;
        window.storage.setItem('isDark', !isDark);
        settingValues.isDark = !isDark;
    };
    const handleChangeSimplified = () => {
        const { isSimplified } = settingValues;
        settingValues.isSimplified = !isSimplified;
        window.storage.setItem('isSimplified', !isSimplified);
        translate(isSimplified);
        for (let index = 0; index < typedWords.value.length; index++) {
            typedWords.value[index] = exchange(typedWords.value[index], isSimplified);
        }
        initTyped(typedWords.value);
    };
</script>

<template>
    <div :class="{ dark: settingValues.isDark }">
        <header class="layout-header" />
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
        <div class="layout-setting">
            <span class="layout-setting-other" :style="{ right: !showSetting ? '-60px' : '20px' }">
                <button class="layout-transform-character" @click="handleChangeSimplified">
                    <Icon
                        name="fanzhuanjian"
                        :class="['layout-traditional-transform', 'layout-setting-icon']"
                        v-if="settingValues.isSimplified"
                    />
                    <Icon
                        name="jianzhuanfan"
                        class="layout-simplified-transform layout-setting-icon"
                        v-else
                    />
                </button>
                <button
                    :class="[
                        'layout-transform-mode',
                        { 'layout-setting-icon-active': settingValues.isDark },
                    ]"
                    @click="handleChangeMode"
                >
                    <Icon name="yueguang" class="layout-setting-icon" />
                </button>
            </span>
            <button
                :class="['layout-gear-container', { 'layout-setting-icon-active': showSetting }]"
                @click="handleClickSettingIcon"
            >
                <Icon name="shezhi" class="layout-setting-icon" />
            </button>
            <button class="layout-scrollbar-progress">
                <span class="layout-scrollbar-progress-num">{{ scrollBarProgress }}</span>
                <span class="layout-scroll-up" @click="() => handleClickScroll('up')">
                    <Icon name="up" class="layout-setting-icon" />
                </span>
            </button>
            <button class="layout-scroll-down" @click="() => handleClickScroll('down')">
                <Icon name="down" class="layout-setting-icon" />
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '../style/index.scss';
    @use '../style/dark.scss';
</style>

<template>
    <div class="layout-setting">
        <span class="layout-setting-other" :style="{ right: !showAllSetting ? '-60px' : '20px' }">
            <button class="layout-transform-character" @click="handleLangChange">
                <Icon
                    name="fanzhuanjian"
                    :class="['layout-traditional-transform', 'layout-setting-icon']"
                    v-if="settingValues.lang === Lang.zh_CN"
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
                    { 'layout-setting-icon-active': settingValues.theme === Theme.dark },
                ]"
                @click="handleThemeChange"
            >
                <Icon name="yueguang" class="layout-setting-icon" />
            </button>
        </span>
        <button
            :class="['layout-gear-container', { 'layout-setting-icon-active': showAllSetting }]"
            @click="handleToggleShowAllSettings"
        >
            <Icon name="shezhi" class="layout-setting-icon" />
        </button>
        <button class="layout-scrollbar-progress">
            <span class="layout-scrollbar-progress-num">{{ props.scrollProgress }}</span>
            <span class="layout-scroll-up" @click="handleScrollTopBtnClick">
                <Icon name="up" class="layout-setting-icon" />
            </span>
        </button>
        <button class="layout-scroll-down" @click="handleScrollBottomBtnClick">
            <Icon name="down" class="layout-setting-icon" />
        </button>
    </div>
</template>
<script setup lang="ts">
    import { reactive, ref, type PropType } from 'vue';
    import Icon from '@/components/icon/index.vue';
    import { Lang, Theme } from '@/enums';
    import store, { actions, type State } from '@/store';

    const props = defineProps({
        theme: {
            type: String as PropType<Theme>,
            default: Theme.light,
        },
        lang: {
            type: String as PropType<Lang>,
            default: Lang.zh_CN,
        },
        scrollProgress: {
            type: Number,
            default: 0,
        },
    });
    const settingValues = reactive((store.getState() as State).setting);
    const emits = defineEmits(['themeChange', 'langChange', 'scrollToTop', 'scrollToBottom']);
    const showAllSetting = ref(false);

    store.watchProperty('setting', (value: State['setting']) => {
        Object.assign(settingValues, value);
        console.log({ setting: value });
    });

    const handleLangChange = () => {
        store.setState('setting.lang', settingValues.lang === Lang.zh_CN ? Lang.zh_TW : Lang.zh_CN);
    };
    const handleThemeChange = () => {
        store.setState(
            'setting.theme',
            settingValues.theme === Theme.light ? Theme.dark : Theme.light,
        );
    };
    const handleToggleShowAllSettings = () => {
        showAllSetting.value = !showAllSetting.value;
    };
    const handleScrollTopBtnClick = () => {
        emits('scrollToTop');
    };
    const handleScrollBottomBtnClick = () => {
        emits('scrollToBottom');
    };
</script>

<style lang="scss" scoped>
    .layout-setting {
        display: flex;
        flex-direction: column;
        position: fixed;
        bottom: 50px;
        right: 20px;

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 40px;
            height: 40px;
            border-radius: 5px;
            background-color: var(--setting-btn-bg-color);
            color: var(--text-color);
            border: 0;
            cursor: pointer;
            margin-top: 5px;
            font-size: 20px;
            transition: all 0.5s;
            &:hover {
                @extend .layout-setting-icon-active;
            }
        }
        .layout-setting-icon {
            font-size: 25px;
        }
        .layout-setting-icon-active {
            background-color: var(--setting-btn-active-bg-color);
            .layout-setting-icon {
                color: var(--setting-btn-active-text-color);
            }
        }
        .layout-gear-container {
            &:hover {
                @extend .layout-setting-icon-active;
            }
            .layout-setting-icon {
                animation: rotate 2s linear infinite;
            }
        }
        .layout-scrollbar-progress {
            &:hover {
                .layout-scroll-up {
                    display: flex;
                }
                .layout-scrollbar-progress-num {
                    display: none;
                }
            }
            .layout-scroll-up {
                display: none;
                justify-content: center;
                align-items: center;
                height: 100%;
            }
        }
        .layout-setting-other {
            position: fixed;
            bottom: 185px;
            right: -60px;
            transition: all 0.5s;
        }
    }
</style>

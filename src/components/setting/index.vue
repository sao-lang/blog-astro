<template>
    <div class="layout-setting">
        <span class="layout-setting-other" :style="{ right: !showAllSetting ? '-60px' : '20px' }">
            <button class="layout-transform-character" @click="handleLangChange">
                <Icon
                    :name="!setting.isSimple ? 'fanzhuanjian' : 'jianzhuanfan'"
                    :class="[
                        !setting.isSimple
                            ? 'layout-traditional-transform'
                            : 'layout-simplified-transform',
                        'layout-setting-icon',
                    ]"
                />
            </button>
            <button
                :class="[
                    'layout-transform-mode',
                    { 'layout-setting-icon-active': !setting.isLight },
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
                <Icon name="up-1" class="layout-setting-icon" />
            </span>
        </button>
        <button class="layout-scroll-down" @click="handleScrollBottomBtnClick">
            <Icon name="down-2" class="layout-setting-icon" />
        </button>
    </div>
</template>
<script setup lang="ts">
    import { nextTick, ref } from 'vue';
    import Icon from '@/components/icon/index.vue';
    import { Lang, Theme } from '@/enums';
    import { actions } from '@/store';
    import message from '@/utils/message';
    import useSettingHook from '@/hooks/useSettingHook';
    const props = defineProps({
        scrollProgress: {
            type: Number,
            default: 0,
        },
    });
    const emits = defineEmits(['themeChange', 'langChange', 'scrollToTop', 'scrollToBottom']);
    const showAllSetting = ref(false);
    const setting = useSettingHook();

    const handleLangChange = () => {
        const lang = setting.isSimple ? Lang.zh_TW : Lang.zh_CN;
        actions.setLang(lang, true);
    };
    const handleThemeChange = () => {
        const theme = setting.isLight ? Theme.dark : Theme.light;
        actions.setTheme(theme, true);
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

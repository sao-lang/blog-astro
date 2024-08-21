<template>
    <slot />
    <Teleport to="body">
        <ul
            v-if="showMenu"
            :style="{ ...position }"
            class="context-menu-container"
            ref="contextMenuContainerRef"
        >
            <li class="first-line">
                <button
                    class="first-line-button"
                    v-for="{ icon, onClick } in commonItems"
                    :key="icon"
                    @click="onClick"
                >
                    <Icon :name="icon" class="first-line-icon" />
                </button>
            </li>
            <li
                v-for="({ label, icon, onClick }, index) in musicItems"
                :key="label"
                :class="{ 'music-items': index === musicItems.length - 1 }"
                @click="() => onClick?.()"
            >
                <button>
                    <Icon :name="icon" class="item-icon" />
                    <span v-for="letter in label.split('')">{{ letter }}</span>
                </button>
            </li>
            <li
                v-for="{ label, icon, onClick, onMouseEnter, onMouseLeave } in settingItems"
                :key="label"
                @click="() => onClick?.()"
                @mouseenter="() => onMouseEnter?.()"
                @mouseleave="() => onMouseLeave?.()"
            >
                <button>
                    <Icon :name="icon" class="item-icon" />
                    <span v-for="letter in label.split('')">{{ letter }}</span>
                </button>
            </li>
        </ul>
    </Teleport>
</template>

<script lang="ts" setup>
    import { onMounted, ref, reactive, nextTick, onBeforeUnmount, computed, watch } from 'vue';
    import type { Position } from './types';
    import Icon from '@/components/icon/index.vue';
    import useSettingHook from '@/hooks/useSettingHook';
    import { IconType, Lang, Theme } from '@/enums';
    import { copy } from '@lania/utils';
    import message from '@/utils/message';
    import { actions } from '@/store';

    const emits = defineEmits(['search', 'toTop']);
    defineExpose({
        closeMenu: () => {
            closeMenu();
        },
    });

    const showMenu = ref(false);
    const position = reactive<Position>({ top: 0, left: 0 });
    const contextMenuContainerRef = ref<HTMLDivElement>();
    const setting = useSettingHook();
    const shouldPrevent = ref(true);
    const commonItems = ref([
        {
            icon: IconType.previous,
            onClick: () => {},
        },
        { icon: IconType.next, onClick: () => {} },
        { icon: IconType.refresh, onClick: () => location.reload() },
        { icon: IconType.up, onClick: () => emits('toTop') },
    ]);
    const settingItems = computed(() => [
        {
            icon: IconType.copy,
            onClick: async () => {
                await copy({ text: location.href });
                message.success('复制成功');
            },
            label: '复制链接',
        },
        {
            icon: !setting.isLight ? IconType.sun : IconType.moon,
            onClick: () => actions.setTheme(setting.isLight ? Theme.dark : Theme.light, true),
            label: !setting.isLight ? '浅色模式' : '深色模式',
        },
        {
            icon: !setting.isSimple ? IconType.traditionalChinese : IconType.simpleChinese,
            onClick: () => actions.setLang(setting.isSimple ? Lang.zh_TW : Lang.zh_CN, true),
            label: setting.isSimple ? '中文繁体' : '中文简体',
        },
        { icon: IconType.search, onClick: () => emits('search'), label: '搜索文章' },
        {
            icon: IconType.closeMenu,
            label: '右键菜单',
            onMouseEnter: () => (shouldPrevent.value = false),
            onMouseLeave: () => (shouldPrevent.value = true),
        },
        { icon: IconType.openMenu, label: '关闭菜单' },
    ]);
    const musicItems = computed(() => [
        {
            icon: IconType.play,
            onClick: () => {},
            label: '播放音乐',
        },
        {
            icon: IconType.nextSong,
            onClick: () => {},
            label: '下一首歌',
        },
    ]);

    onMounted(() => {
        window.addEventListener('contextmenu', handleWindowContextmenu);
        window.addEventListener('click', handleWindowClick);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('contextmenu', handleWindowContextmenu);
        window.removeEventListener('click', handleWindowClick);
    });

    const handleWindowContextmenu = (e: MouseEvent) => {
        if (!shouldPrevent.value) {
            shouldPrevent.value = true;
            showMenu.value = false;
            return;
        }
        e.preventDefault();
        const { x, y } = e;
        showMenu.value = true;
        nextTick(() => {
            const offsetWidth = contextMenuContainerRef.value!.offsetWidth;
            const offsetHeight = contextMenuContainerRef.value!.offsetHeight;
            if (x < offsetWidth || innerWidth - x > offsetWidth) {
                Object.assign(position, { left: `${x}px`, right: undefined });
            } else {
                Object.assign(position, { left: undefined, right: `${innerWidth - x}px` });
            }
            if (y < offsetHeight || innerHeight - y > offsetHeight) {
                Object.assign(position, { top: `${y}px`, bottom: undefined });
            } else {
                Object.assign(position, { top: undefined, bottom: `${innerHeight - y}px` });
            }
        });
    };
    const handleWindowClick = () => {
        closeMenu();
    };
    const closeMenu = () => {
        showMenu.value = false;
    };
</script>
<style lang="scss">
    @import '@lania/utils-scss/mixin.scss';
    .context-menu-container {
        @include fixed($z-index: 10);
        @include box-model(
            $width: 150px,
            $border: 2px solid var(--context-menu-border-color),
            $border-radius: 5px
        );
        @include background($color: var(--card-bg-color));
        li {
            @include box-model($width: 100%, $padding: 8px, $box-sizing: border-box);
            @include list-style();
            button {
                @include flex-container($justify-content: space-between, $align-items: center);
                @include box-model($width: 100%, $padding: 5px, $border: 0, $border-radius: 5px);
                @include cursor(pointer);
                @include background($color: transparent);
                @include text(17px, var(--text-color));
                @include hover {
                    @include text($color: var(--setting-btn-active-text-color));
                    @include background(var(--context-menu-btn-hover-bg-color));
                }
                @include transition(all, 0.15s);
            }
            .item-icon {
                @include text(22px);
            }
        }

        .first-line {
            @include flex-container($justify-content: space-between, $align-items: center);
            @include border-bottom(2px, dashed, var(--context-menu-border-color));
            .first-line-button {
                @include flex-container($justify-content: center);
                @include box-model(
                    $width: 30px,
                    $height: 30px,
                    $padding: 0,
                    $border: 0,
                    $border-radius: 5px
                );
                @include text(17px);
            }
        }

        .music-items {
            @include border-bottom(2px, dashed, var(--context-menu-border-color));
        }
    }
</style>

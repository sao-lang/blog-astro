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
                <button class="first-line-button" v-for="{ name, onClick } in icons" :key="name">
                    <Icon :name="name" class="first-line-icon" @click="onClick" />
                </button>
            </li>
            <li v-for="{ label, name, onClick } in items" :key="label">
                <button>
                    <Icon :name="name" class="item-icon" @click="onClick" />
                    <!-- <span class="item-label">{{ label }}</span> -->
                    <span v-for="letter in label.split('')">{{ letter }}</span>
                </button>
            </li>
        </ul>
    </Teleport>
</template>

<script lang="ts" setup>
    import {
        onMounted,
        ref,
        reactive,
        nextTick,
        onUnmounted,
        onBeforeUnmount,
        computed,
    } from 'vue';
    import type { Position } from './types';
    import Icon from '@/components/icon/index.vue';
    import useSettingHook from '@/hooks/useSettingHook';

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
    const icons = ref([
        { name: 'previous-2', onClick: () => {} },
        { name: 'next-2', onClick: () => {} },
        { name: 'refresh', onClick: () => {} },
        { name: 'up-1', onClick: () => emits('toTop') },
    ]);
    const items = computed(() => [
        { name: 'copy', onClick: () => {}, label: '复制链接' },
        {
            name: !setting.isLight ? 'taiyang' : 'yueguang',
            onClick: () => {},
            label: !setting.isLight ? '浅色模式' : '深色模式',
        },
        {
            name: !setting.isSimple ? 'fanzhuanjian' : 'jianzhuanfan',
            onClick: () => {},
            label: setting.isSimple ? '中文繁体' : '中文简体',
        },
        { name: 'sousuo', onClick: () => emits('search'), label: '搜索文章' },
        { name: 'shouqicaidan-guanbi', onClick: () => closeMenu, label: '关闭菜单' },
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
        e.preventDefault();
        const { x, y } = e;
        showMenu.value = true;
        Object.assign(position, { top: y + 'px', left: x + 'px' });
        nextTick(() => {
            const offsetWidth = contextMenuContainerRef.value!.offsetWidth;
            const offsetHeight = contextMenuContainerRef.value!.offsetHeight;
            if (innerWidth - x > offsetWidth) {
                Object.assign(position, { left: `${x}px`, right: undefined });
            } else {
                Object.assign(position, { left: undefined, right: `${-x}px` });
            }
            if (innerHeight - y > offsetHeight) {
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
    .context-menu-container {
        position: fixed;
        z-index: 10;
        width: 150px;
        background-color: var(--card-bg-color);
        border-radius: 5px;
        border: 2px solid var(--context-menu-border-color);
        li {
            width: 100%;
            padding: 8px;
            list-style: none;
            box-sizing: border-box;

            button {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 5px;
                border: 0;
                border-radius: 5px;
                cursor: pointer;
                background-color: transparent;
                color: var(--text-color);
                font-size: 17px;
                &:hover {
                    color: var(--setting-btn-active-text-color);
                    background-color: var(--context-menu-btn-hover-bg-color);
                }
            }
            .item-icon {
                font-size: 22px;
            }
        }

        .first-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px dashed var(--context-menu-border-color);
            .first-line-button {
                justify-content: center;
                width: 30px;
                height: 30px;
                padding: 0;
                border: 0;
                font-size: 17px;
            }
        }
    }
</style>

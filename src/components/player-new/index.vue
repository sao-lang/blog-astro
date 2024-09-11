<template>
    <div class="fixed left-0 bottom-0 w-66 h-66 player">
        <img
            :src="current.singerPhoto"
            class="relative w-full h-full object-cover player__singer-photo"
        />
        <div
            class="absolute top-0 bg-white player__toolbar-container transition-all duration-500 ease-in-out"
            :style="{ left: `${toolbarLeft}px` }"
        >
            <div class="flex justify-between items-center w-full player__toolbar-top">
                <span class="truncate leading-none player__song-info">
                    {{ title }}
                </span>
                <div class="flex player__song-info"></div>
            </div>
            <div
                class="flex justify-center items-center absolute top-0 right-0 h-full cursor-pointer player__toolbar-toggle"
                @click="isToolbarOpen = !isToolbarOpen"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { songs } from '@/mock/songs';
    const currentIndex = ref(0);
    const current = computed(() => songs[currentIndex.value]);
    const isToolbarOpen = ref(false);
    const toolbarLeft = computed(() => (isToolbarOpen.value ? 66 : -268));
    const title = computed(() => `${current.value.singer}-${current.value.name}`);
</script>

<style lang="scss">
    @import '@lania/utils-scss/mixin.scss';
    .player {
        background-color: var(--bg-color);
        width: 66px;
        height: 66px;
        .player__singer-photo {
            z-index: 2;
        }
        .player__toolbar-container {
            left: 66px;
            width: 346px;
            height: 66px;
            padding: 14px 19px 0 10px;
            .player__toolbar-top {
                .player__song-info {
                    max-width: 212px;
                    font-size: 14px;
                }
            }
            .player__toolbar-toggle {
                width: 12px;
                background-color: #e6e6e6;
            }
        }
    }
</style>

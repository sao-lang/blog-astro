<template>
    <div class="fixed left-0 bottom-0 w-66 h-66 player">
        <img
            :src="current.singerPhoto"
            class="relative w-full h-full object-cover player__singer-photo"
        />
        <ul
            class="flex flex-col absolute left-0 bg-white player__song-list"
            :class="[
                isListOpen ? 'player__song-list--show' : 'player__song-list--hidden',
                { 'transition-all duration-700': isToolbarOpen },
            ]"
        >
            <li
                class="flex justify-between items-center relative w-full cursor-pointer player__song-item"
                :class="{
                    'player__song-item--no-border': index === songs.length - 1,
                    'player__song-item--selected': index === currentIndex,
                }"
                v-for="({ id, name, singer }, index) in songs"
                :key="id"
                @click="() => handleSongChange('click', index)"
            >
                <span
                    class="absolute left-0 player__song-item-flag"
                    v-if="index === currentIndex"
                />
                <span>{{ name }}</span>
                <span>{{ singer }}</span>
            </li>
        </ul>
        <div
            class="flex flex-col justify-between absolute top-0 bg-white transition-all duration-500 ease-in-out player__toolbar"
            :class="[isToolbarOpen ? 'player__toolbar--show' : 'player__toolbar--hidden']"
        >
            <div class="flex justify-between items-center w-full player__toolbar-top">
                <span class="truncate leading-none player__song-info">
                    {{ title }}
                </span>
                <div class="flex justify-center items-center player__controls">
                    <Icon
                        v-for="{ type, onClick } in icons"
                        :key="type"
                        :name="type"
                        class="cursor-pointer player__controls-button"
                        @click="onClick"
                    />
                </div>
            </div>
            <div class="flex items-center player__toolbar-bottom">
                <Progress v-model:percent="percent" class="player__progress" />
                <div class="flex player__song-time">
                    <span class="leading-none">
                        {{ formatDuration(totalTime * percent) }} /
                        {{ formatDuration(totalTime) }}
                    </span>
                </div>
                <div class="flex absolute player__controls-button-song">
                    <Icon
                        class="cursor-pointer player__controls-button"
                        v-for="{ type, onClick } in toolIcons"
                        :key="type"
                        :name="type"
                        @click="onClick"
                    />
                </div>
            </div>
            <div
                class="flex justify-center items-center absolute cursor-pointer player__toolbar-toggle"
                @click="isToolbarOpen = !isToolbarOpen"
            >
                <Icon :name="openIcon" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { songs } from '@/mock/songs';
    import Icon from '@/components/icon/index.vue';
    import Progress from '@/components/progress/index.vue';
    import { IconType } from '@/enums';
    import { formatDuration } from './helper';
    import type { SongChangeType } from '@/types';

    const currentIndex = ref(0);
    const current = computed(() => songs[currentIndex.value]);
    const isToolbarOpen = ref(false);
    const isListOpen = ref(false);
    const title = computed(() => `${current.value.singer}-${current.value.name}`);
    const icons = computed(() => [
        { type: IconType.previousSong, onClick: () => {} },
        { type: IconType.pause, onClick: () => {} },
        { type: IconType.nextSong, onClick: () => {} },
        { type: IconType.openMenu, onClick: () => (isListOpen.value = !isListOpen.value) },
    ]);
    const toolIcons = computed(() => [
        { type: IconType.voice, onClick: () => {} },
        { type: isSingleLoop.value ? IconType.singlePlay : IconType.circlePlay, onClick: () => {} },
    ]);
    const openIcon = computed(() => (isToolbarOpen.value ? IconType.left : IconType.right));
    const totalTime = ref(0);
    const percent = ref(0);
    const isSingleLoop = ref(false);

    const handleSongChange = (type: SongChangeType, index?: number) => {
        if (type === 'click') {
            currentIndex.value = index!;
        }
    };

    watch(isToolbarOpen, isToolbarOpen => {
        if (!isToolbarOpen) {
            isListOpen.value = false;
        }
    });
</script>

<style lang="scss" scoped>
    .player {
        background-color: var(--bg-color);
        width: 66px;
        height: 66px;
    }

    .player__singer-photo {
        z-index: 2;
    }

    .player__toolbar {
        left: 66px;
        width: 334px;
        height: 66px;
        padding: 10px 10px;
        border-top: 1px solid #e6e6e6;
    }

    .player__toolbar-top {
        display: flex;
        justify-content: space-between;
    }

    .player__song-info {
        max-width: 212px;
        font-size: 14px;
        color: #858585;
        font-family: Arial, Helvetica, sans-serif;
    }

    .player__controls-button {
        margin-left: 12px;
        font-size: 14px;
        color: #858585;
    }

    .player__toolbar-toggle {
        top: -1px;
        right: -18px;
        width: 18px;
        height: 66px;
        font-size: 12px;
        background-color: #e6e6e6;
    }

    .player__toolbar--show {
        left: 66px;
    }

    .player__toolbar--hidden {
        left: -268px;
    }

    .player__song-list {
        width: 400px;
        height: 250px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .player__song-item {
        flex-shrink: 0;
        height: 33px;
        padding: 0 12px;
        border-bottom: 1px solid #e6e6e6;
        font-size: 14px;
        color: #858585;
        font-family: Arial, Helvetica, sans-serif;

        &:hover {
            background-color: #e9e9e9;
        }
    }

    .player__song-item--selected {
        background-color: #e9e9e9;
    }

    .player__song-item--no-border {
        border-bottom: 0;
    }

    .player__song-item-flag {
        left: 1px;
        width: 3px;
        height: 22px;
        background-color: orangered;
    }

    .player__song-list--hidden {
        top: 66px;
    }

    .player__song-list--show {
        top: -250px;
    }

    .player__progress {
        width: 160px;
        margin-left: 4px;
    }

    .player__song-time {
        margin-left: 10px;
        font-size: 14px;
        color: #858585;
        font-family: Arial, Helvetica, sans-serif;
    }

    .player__controls-button-song {
        right: 10px;
    }
</style>

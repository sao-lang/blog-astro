<template>
    <div class="fixed left-0 bottom-0 w-66 h-66 player">
        <img
            :src="current.singerPhoto"
            class="relative w-full h-full object-cover player__singer-photo"
        />
        <ul
            ref="scrollbarRef"
            class="flex flex-col absolute left-0 bg-white player__song-list"
            :class="[
                isListOpen ? 'player__song-list--open' : 'player__song-list--close',
                !showLyrics ? 'player__song-list--show' : 'player__song-list--hide',
                {
                    'transition-all duration-700': isToolbarOpen,
                },
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
                <span class="truncate player__song-name">{{ name }}</span>
                <span class="flex items-center">
                    <span>{{ singer }}</span>
                    <Icon
                        v-if="index === currentIndex"
                        :name="IconType.lyric"
                        class="player__song-item-lrc-icon"
                        @click.stop="showLyrics = true"
                    />
                </span>
            </li>
        </ul>
        <div
            class="flex flex-col absolute left-0 bg-white cursor-pointer player__lyrics-container"
            :class="[
                isListOpen ? 'player__lyrics-container--open' : 'player__lyrics-container--close',
                { 'transition-all duration-700': isToolbarOpen },
                showLyrics ? 'player__lyrics-container--show' : 'player__lyrics-container--hide',
            ]"
            @click="showLyrics = false"
        >
            <ul
                class="player__lyrics-inner"
                ref="lyricsContainerRef"
                v-if="current.lyrics?.length > 0"
            >
                <li
                    v-for="(lyric, index) in current.lyrics"
                    :key="lyric.time"
                    class="flex items-center player__lyric-item"
                    :class="{ 'player__lyric-item--current': currentLrcIndex === index }"
                    :style="{ height: `${LRC_SHOW_LIMIT}%` }"
                >
                    {{ lyric.line }}
                </li>
            </ul>
            <div v-else class="flex justify-center items-center player__lyrics--no-lyrics">
                暂无歌词
            </div>
        </div>
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
                        @click.stop="onClick"
                        @mousedown.stop
                        @mousemove.stop
                    />
                </div>
            </div>
            <div class="flex items-center player__toolbar-bottom">
                <Progress
                    v-model:percent="percent"
                    class="player__progress"
                    @mouseup="handleProgressMouseUp"
                    @mousedown="isMouseDown = true"
                    @change="handlePercentChange"
                />
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
                    <!-- <div class="absolute player__volume-bar-wrapper"> </div> -->
                    <Progress
                        v-if="showVolumeBar"
                        class="player__volume-bar"
                        direction="vertical"
                        :bar-style="{ position: 'absolute', height: '50px', width: '4px' }"
                        v-model:percent="volume"
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
        <audio
            class="hidden"
            ref="audioRef"
            @loadedmetadata="handleAudioLoadedmetadata"
            @timeupdate="handleAudioTimeUpdate"
            @pause="() => (isPlayed = false)"
            @play="() => (isPlayed = true)"
            @ended="handleAudioEnded"
        >
            <source :src="current.source" />
        </audio>
    </div>
</template>

<script setup lang="ts">
    import { songs } from '@/mock/songs';
    import Icon from '@/components/icon/index.vue';
    import Progress from '@/components/progress/index.vue';
    import { IconType } from '@/enums';
    import {
        formatDuration,
        getCurrentIndex,
        getLrcIndexFromCurrentTime,
        parseLyric,
    } from './helper';
    import type { SongChangeType } from '@/types';
    import useScrollbarHook from '@/hooks/useScrollbarHook';
    import { LRC_SHOW_LIMIT } from './const';
    import { throttle } from '@lania/utils';
    const currentIndex = ref(0);
    const current = computed(() => {
        const currentSong = songs[currentIndex.value];
        return { ...currentSong, lyrics: parseLyric(currentSong?.lyric) };
    });
    const isToolbarOpen = ref(false);
    const isListOpen = ref(false);
    const title = computed(() => `${current.value.singer}-${current.value.name}`);
    const icons = computed(() => [
        {
            type: IconType.previousSong,
            onClick: () => {
                handleSongChange('prev');
            },
        },
        {
            type: isPlayed.value ? IconType.play : IconType.pause,
            onClick: () => {
                const audio = audioRef.value;
                audio?.paused ? audio.play() : audio?.pause();
            },
        },
        {
            type: IconType.nextSong,
            onClick: () => {
                handleSongChange('next');
            },
        },
        { type: IconType.openMenu, onClick: () => (isListOpen.value = !isListOpen.value) },
        // { type: IconType.lyric, onClick: () => (showLyrics.value = !showLyrics.value) },
    ]);
    const toolIcons = computed(() => [
        { type: IconType.voice, onClick: () => (showVolumeBar.value = !showVolumeBar.value) },
        {
            type: isSingleLoop.value ? IconType.singlePlay : IconType.circlePlay,
            onClick: () => (isSingleLoop.value = !isSingleLoop.value),
        },
    ]);
    const openIcon = computed(() => (isToolbarOpen.value ? IconType.left : IconType.right));
    const totalTime = ref(0);
    const percent = ref(0);
    const isSingleLoop = ref(false);
    const scrollbarRef = ref<HTMLDivElement>();
    const lyricsContainerRef = ref<HTMLUListElement>();
    const scrollbar = useScrollbarHook(scrollbarRef as Ref<HTMLDivElement>);
    const isPlayed = ref(false);
    const volume = ref(1);
    const isMouseDown = ref(false);
    const audioRef = ref<HTMLAudioElement>();
    const showLyrics = ref(false);
    const currentLrcIndex = ref(0);
    const showVolumeBar = ref(false);

    watch(isToolbarOpen, isToolbarOpen => {
        if (!isToolbarOpen) {
            isListOpen.value = false;
            showVolumeBar.value = false;
        }
    });
    watch(
        currentIndex,
        currentIndex => {
            nextTick(() => {
                const songItemEl = document.querySelector('.player__song-item') as HTMLLIElement;
                scrollbar.value?.scrollTo(0, songItemEl.offsetHeight * currentIndex, 300);
            });
        },
        { immediate: true },
    );
    watch(
        () => volume.value,
        volume => {
            audioRef.value!.volume = volume;
        },
    );
    watch(currentLrcIndex, value => {
        nextTick(() => {
            const lrcItemEl = lyricsContainerRef.value?.childNodes[1] as HTMLLIElement;
            const { height } = lrcItemEl!.getBoundingClientRect();
            lyricsContainerRef.value?.scrollTo({
                top: value > LRC_SHOW_LIMIT / 2 ? (value - LRC_SHOW_LIMIT / 2) * height : 0,
                behavior: 'smooth',
            });
        });
    });

    const handleSongChange = (type: SongChangeType, index?: number) => {
        if (currentIndex.value === index) {
            isPlayed.value
                ? (showLyrics.value = true)
                : ((isPlayed.value = true), audioRef.value?.play());
            return;
        }
        audioRef.value?.pause();
        isPlayed.value = false;
        percent.value = 0;
        currentIndex.value =
            type === 'click' ? index! : getCurrentIndex(type, songs, currentIndex.value);
        currentLrcIndex.value = 0;
        audioRef.value!.src = current.value.source;
        audioRef.value?.load();
        audioRef.value?.play();
        isPlayed.value = true;
    };
    const handleProgressMouseUp = (value: number) => {
        isMouseDown.value = false;
        const currentTime = Math.floor(totalTime.value * value);
        (audioRef.value as HTMLAudioElement).currentTime = currentTime;
    };
    const handlePercentChange = (value: number) => {
        const currentTime = Math.floor(totalTime.value * value);
        currentLrcIndex.value = getLrcIndexFromCurrentTime(currentTime, current.value.lyrics);
    };
    const handleAudioLoadedmetadata = (e: Event) => {
        const target = e.target as HTMLAudioElement;
        totalTime.value = target.duration;
        volume.value = target.volume;
    };
    const handleAudioTimeUpdate = throttle(
        (e: Event) => {
            if (isMouseDown.value) {
                return;
            }
            const currentTime = (e.target as HTMLAudioElement).currentTime;
            percent.value = Number((currentTime / totalTime.value).toFixed(4));
            currentLrcIndex.value = getLrcIndexFromCurrentTime(currentTime, current.value.lyrics);
        },
        1000,
        { leading: true, trailing: false },
    );
    const handleAudioEnded = (e: Event) => {
        const target = e.target as HTMLAudioElement;
        if (!isSingleLoop.value) {
            currentIndex.value =
                currentIndex.value === songs.length - 1 ? 0 : currentIndex.value + 1;
            target.src = current.value.source;
            target.load();
        }
        isPlayed.value = true;
        target.play();
        percent.value = 0;
    };
</script>

<style lang="scss" scoped>
    @use './index.scss';
</style>

<script setup lang="ts">
    import Icon from '@/components/icon/index.vue';
    import Progress from '@/components/progress/index.vue';
    import { throttle } from '@/utils';
    import { computed, onMounted, ref, watch } from 'vue';
    import { formatDuration, getCurrentIndex, getLrcFromCurrentTime, parseLyric } from './helper';
    import type { Song } from './types';

    const props = withDefaults(defineProps<{ songs: Song[] }>(), {});

    const isMouseDown = ref(false);
    const isSingleLoop = ref(false);
    const isPlayed = ref(false);
    const totalTime = ref(0);
    const audioRef = ref<HTMLAudioElement>();
    const currentIndex = ref(0);
    const volume = ref(1);
    const showVoiceSlider = ref(false);
    const percent = ref(0);
    const current = computed(() => {
        const currentSong = props.songs[currentIndex.value];
        return { ...currentSong, lyrics: parseLyric(currentSong?.lyric) };
    });
    const lyric = ref(current.value?.lyrics[0]?.line ?? '暂无歌词');

    watch(
        () => volume.value,
        volume => {
            audioRef.value!.volume = volume;
        },
    );

    const handleSliderMouseDown = () => {
        isMouseDown.value = true;
    };
    const handleSliderMouseUp = (value: number) => {
        isMouseDown.value = false;
        const currentTime = Math.floor(totalTime.value * value);
        (audioRef.value as HTMLAudioElement).currentTime = currentTime;
    };
    const handleSongChange = (type: 'prev' | 'next') => {
        if (!audioRef.value) {
            return;
        }
        const isPaused = !isPlayed.value;
        audioRef.value?.pause();
        isPlayed.value = false;
        percent.value = 0;
        currentIndex.value = getCurrentIndex(type, props.songs, currentIndex.value);
        lyric.value = current.value?.lyrics[0]?.line ?? '暂无歌词';
        audioRef.value.src = current.value.source;
        audioRef.value.load();
        if (!isPaused) {
            audioRef.value?.play();
            isPlayed.value = true;
        }
    };
    const handleClickStart = () => {
        const audio = audioRef.value;
        audio?.paused ? audio.play() : audio?.pause();
    };
    const handleAudioTimeUpdate = throttle(
        (e: Event) => {
            if (isMouseDown.value) {
                return;
            }
            const currentTime = (e.target as HTMLAudioElement).currentTime;
            percent.value = Number((currentTime / totalTime.value).toFixed(4));
            const newLrc = getLrcFromCurrentTime(currentTime, current.value.lyrics);
            lyric.value = newLrc;
        },
        1000,
        { leading: true, trailing: false },
    );
    const handleAudioEnded = (e: Event) => {
        const target = e.target as HTMLAudioElement;
        if (!isSingleLoop.value) {
            currentIndex.value =
                currentIndex.value === props.songs.length - 1 ? 0 : currentIndex.value + 1;
            target.src = current.value.source;
            target.load();
        }
        lyric.value = current.value?.lyrics[0]?.line ?? '暂无歌词';
        isPlayed.value = true;
        target.play();
        percent.value = 0;
    };
    const handleAudioLoadedmetadata = (e: Event) => {
        const target = e.target as HTMLAudioElement;
        totalTime.value = target.duration;
        volume.value = target.volume;
    };
    const handlePercentChange = (value: number) => {
        const currentTime = Math.floor(totalTime.value * value);
        const newLrc = getLrcFromCurrentTime(currentTime, current.value.lyrics);
        lyric.value = newLrc;
    };
</script>

<template>
    <div class="player">
        <div class="player-song-info">
            <div class="player-opt-btns">
                <span
                    @click="() => (isSingleLoop = !isSingleLoop)"
                    class="player-opt-btn-container"
                >
                    <Icon name="xunhuanbofang" class="player-opt-btn" v-if="!isSingleLoop" />
                    <Icon name="danqvxunhuan" class="player-opt-btn" v-else />
                </span>
                <span class="player-opt-btn-container">
                    <span @click="() => (showVoiceSlider = !showVoiceSlider)">
                        <Icon name="voice" class="player-opt-btn" />
                    </span>
                    <Progress
                        v-model:percent="volume"
                        class="player-voice-slider"
                        v-show="showVoiceSlider"
                    />
                </span>
            </div>
            <img class="player-singer-portrait" :src="current.singerPhoto" />
            <div class="player-title">
                <span class="player-song-name">{{ current.name }}</span>
                <span class="player-singer-name">{{ current.singer }}</span>
                <span class="player-lyric">{{ lyric ?? '当前暂无歌词' }}</span>
            </div>
            <div class="player-song-progress">
                <Progress
                    v-model:percent="percent"
                    @mouseup="handleSliderMouseUp"
                    @mousedown="handleSliderMouseDown"
                    @change="handlePercentChange"
                />
                <div class="player-song-time">
                    <span>{{ formatDuration(totalTime * percent) }}</span>
                    <span>{{ formatDuration(totalTime) }}</span>
                </div>
            </div>
            <div class="player-start-btns">
                <span @click="() => handleSongChange('prev')">
                    <Icon name="previous" class="player-opt-btn" />
                </span>
                <span @click="handleClickStart">
                    <Icon name="pause" class="player-opt-btn" v-if="!isPlayed" />
                    <Icon name="play" class="player-opt-btn" v-else />
                </span>
                <span @click="() => handleSongChange('next')">
                    <Icon name="next" class="player-opt-btn" />
                </span>
            </div>
            <audio
                class="player-audio"
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

        <div class="player-lyrics"></div>
    </div>
</template>

<style scoped lang="scss">
    @use './index.scss';
</style>

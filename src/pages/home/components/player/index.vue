<script setup lang="ts">
import Icon from '@components/icon/index.vue';
import Slider from '@components/slider/index.vue';

import { handleLyric, throttle } from '@utils/index';

import { computed, onMounted, ref, watch } from 'vue';

interface Song { name: string; singer: string; lyric?: string; singerPhoto?: string; source: string }

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
    return { ...currentSong, lyric: handleLyric(currentSong.lyric) };
});
const lyric = ref(current.value?.lyric[0]?.lyric ?? '暂无歌词');

watch(() => percent.value, (percent) => {
    console.log({ percent })
})

onMounted(() => {
    console.log({ lyric: current.value?.lyric })
})

const getLrcFromCurrentTime = (currentTime: number) => {
    const findIndex = current.value.lyric.reverse().findIndex(({ time }) => currentTime >= time) ?? 0;
    const newLrc = current.value.lyric[findIndex - 1]?.lyric ?? '';
    console.log({ newLrc, findIndex })
    if (newLrc && newLrc !== lyric.value) {
        lyric.value = newLrc;
    }
}
const handleSliderMouseDown = () => {
    isMouseDown.value = true;
}
const handleSliderMouseUp = () => {
    isMouseDown.value = false;
}
const handleClickChangeSong = (type: 'prev' | 'next') => {
    if (!audioRef.value) {
        return;
    }
    const isPaused = !isPlayed.value;
    audioRef.value?.pause();
    isPlayed.value = false;
    percent.value = 0;
    if (type === 'next') {
        currentIndex.value = currentIndex.value === props.songs.length - 1 ? 0 : currentIndex.value + 1;
    } else {
        currentIndex.value = currentIndex.value === 0 ? props.songs.length - 1 : currentIndex.value - 1;
    }
    lyric.value = current.value?.lyric[0]?.lyric ?? '暂无歌词';
    audioRef.value.src = current.value.source;
    audioRef.value.load();
    if (!isPaused) {
        audioRef.value?.play();
        isPlayed.value = true;
    }
}
const handleClickStart = () => {
    if (audioRef.value?.paused) {
        audioRef.value.play();
    } else {
        audioRef.value?.pause();
    }
}
const handleAudioTimeUpdate = throttle((e: Event) => {
    const currentTime = (e.target as HTMLAudioElement).currentTime;
    console.log({ currentTime })
    percent.value = Number((currentTime / totalTime.value).toFixed(4));
    getLrcFromCurrentTime(currentTime);
}, 1000, { leading: true });
const handleAudioEnded = (e: Event) => {
    // const target = e.target as HTMLAudioElement;
    // if (!isSingleLoop.value) {
    //     currentIndex.value = currentIndex.value === props.songs.length - 1 ? 0 : currentIndex.value + 1;
    //     target.src = current.value.source;
    //     target.load();
    // }
    // lyric.value = current.value?.lyric[0]?.lyric ?? '暂无歌词';
    // isPlayed.value = true;
    // target.play();
    // percent.value = 0;
}

const handleAudioLoadedmetadata = (e: Event) => {
    const target = e.target as HTMLAudioElement;
    totalTime.value = target.duration;
    volume.value = target.volume;
}

const handlePercentChange = (value: number) => {
    console.log(value);
    const currentTime = Math.floor(totalTime.value * value);
    (audioRef.value as HTMLAudioElement).currentTime = currentTime;
    getLrcFromCurrentTime(currentTime);
}

const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration - minutes * 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    // console.log(`${formattedMinutes}:${formattedSeconds}`)
    return `${formattedMinutes}:${formattedSeconds}`;
}


</script>


<template>
    <div class="player">
        <div class="player-opt-btns">
            <span @click="() => isSingleLoop = !isSingleLoop" class="player-opt-btn-container">
                <Icon name="xunhuanbofang" class="player-opt-btn" v-if="!isSingleLoop" />
                <Icon name="danqvxunhuan" class="player-opt-btn" v-else />
            </span>
            <span class="player-opt-btn-container">
                <span @click="() => showVoiceSlider = !showVoiceSlider">
                    <Icon name="voice" class="player-opt-btn" />
                </span>
                <!-- <Progress :percent="volume" @change="handlePercentChange" width="90px" height="6px"
                    class="player-voice-slider" v-show="showVoiceSlider" /> -->
            </span>
        </div>
        <img class="player-singer-portrait" :src="current.singerPhoto" />
        <div class="player-title">
            <span class="player-song-name">{{ current.name }}</span>
            <span class="player-singer-name">{{ current.singer }}</span>
            <span class="player-lyric">{{ lyric ?? '当前暂无歌词' }}</span>
        </div>
        <div class="player-song-progress">

            <Slider v-model:percent="percent" @change="handlePercentChange" />
            <div class="player-song-time">
                <span>{{ formatDuration(totalTime * percent) }}</span>
                <span>{{ formatDuration(totalTime) }}</span>
            </div>

        </div>
        <div class="player-start-btns">
            <span @click="() => handleClickChangeSong('prev')">
                <Icon name="previous" class="player-opt-btn" />
            </span>
            <span @click="handleClickStart">
                <Icon name="pause" class="player-opt-btn" v-if="!isPlayed" />
                <Icon name="play" class="player-opt-btn" v-else />
            </span>
            <span @click="() => handleClickChangeSong('next')">
                <Icon name="next" class="player-opt-btn" />
            </span>
        </div>
        <audio class="player-audio" ref="audioRef" @loadedmetadata="handleAudioLoadedmetadata"
            @timeupdate="handleAudioTimeUpdate" @pause="() => isPlayed = false" @play="() => isPlayed = true"
            @ended="handleAudioEnded">
            <source :src="current.source" />
        </audio>
    </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>


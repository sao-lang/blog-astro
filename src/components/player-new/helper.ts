import type { Lyric, SongChangeType, Song } from '@/types';
import { FLOAT_TIME } from '../player/const';

export const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration - minutes * 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
};

export const getLrcIndexFromCurrentTime = (currentTime: number, lyrics: Lyric[]) => {
    if (currentTime > lyrics[lyrics.length - 1].time - FLOAT_TIME) {
        return lyrics.length - 1;
    }
    const findIndex = lyrics.findIndex(({ time }) => currentTime < time - FLOAT_TIME);
    return findIndex < 0 ? 0 : findIndex - 1;
};

const transformLyricTime = (time: string) => {
    const min = Number(time.slice(0, 2));
    const s = Number(time.slice(3, time.length));
    return min * 60 + s;
};

export const parseLyric = (lrc?: string) => {
    if (!lrc) {
        return [];
    }
    const lrcArr = lrc.split('\n');
    const regex = /\[(\d{2}:\d{2}\.\d{2})\](.+)/g;
    return lrcArr
        .map(lrc => {
            const match = [...lrc.matchAll(regex)][0];
            if (!match) {
                return undefined;
            }
            const originalTime = match[1];

            const lyric = match[2];
            return { time: transformLyricTime(originalTime), line: lyric };
        })
        .filter(Boolean) as Lyric[];
};

export const getCurrentIndex = (type: SongChangeType, songs: Song[], currentIndex: number) => {
    if (type === 'click') {
        return currentIndex;
    }
    if (type === 'next') {
        return currentIndex === songs.length - 1 ? 0 : currentIndex + 1;
    }
    return currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
};

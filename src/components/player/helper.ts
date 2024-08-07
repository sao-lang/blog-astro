import { FLOAT_TIME } from './const';
import type { Lyric, OperationType, Song } from './types';

export const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration - minutes * 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
};

export const getLrcFromCurrentTime = (currentTime: number, lyrics: Lyric[]) => {
    let index = 0;
    if (currentTime > lyrics[lyrics.length - 1].time - FLOAT_TIME) {
        index = lyrics.length - 1;
    } else {
        const findIndex = lyrics.findIndex(({ time }) => currentTime < time - FLOAT_TIME);
        index = findIndex < 0 ? 0 : findIndex - 1;
    }
    const { line } = lyrics[index];
    return line;
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

export const getCurrentIndex = (type: OperationType, songs: Song[], currentIndex: number) => {
    if (type === 'next') {
        return currentIndex === songs.length - 1 ? 0 : currentIndex + 1;
    } else {
        return currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    }
};

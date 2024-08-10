
type Lyric = {
    time: number;
    lyric: string;
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
            const min = Number(originalTime.slice(0, 2));
            const s = Number(originalTime.slice(3, originalTime.length));
            return { time: min * 60 + s, lyric };
        })
        .filter(Boolean) as Lyric[];
};

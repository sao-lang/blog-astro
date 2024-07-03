export interface Lyric {
    line: string;
    time: number;
}
export interface Song {
    name: string;
    singer: string;
    lyric?: string;
    singerPhoto?: string;
    source: string;
    lyrics?: Lyric[];
}

export type OperationType = 'next' | 'prev';
import type { Song } from '@/components/player/types';
import request from '@/utils/request';

export const getPlayerSongs = async () => {
    try {
        const { fetch } = request.get<Song[]>('http://127.0.0.1:10000/songs');
        const res = await fetch();
        return res;
    } catch (e) {
        console.error(e);
        return [];
    }
};

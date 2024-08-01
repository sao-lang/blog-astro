import type { Song } from '@/pages/home/components/player/types';
import request from '@/utils/request';

export const getSongs = async () => {
    try {
        const { fetch } = request.get<Song[]>('http://127.0.0.1:10000/songs');
        const res = await fetch();
        return res;
    } catch (e) {
        console.error(e);
        return [];
    }
};

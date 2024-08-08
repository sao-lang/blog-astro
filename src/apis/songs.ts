import type { Song } from '@/components/player/types';
// import request from '@/utils/request';
import { http as request } from './request';

export const getPlayerSongs = async () => {
    try {
        const res = await request.get<Song[]>('http://127.0.0.1:10000/songs');
        console.log({ res });
        return res.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

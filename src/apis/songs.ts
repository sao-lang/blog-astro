import type { Song } from '@/components/player/types';
// import request from '@/utils/request';
import request from './request';
import { songs } from '@/mock/songs';

export const getPlayerSongs = async () => {
    // return request.get<Song[]>('/songs') as unknown as Song[];
    return songs;
};

import type { Song } from '@/components/player/types';
// import request from '@/utils/request';
import request from './request';

export const getPlayerSongs = async () => {
    return request.get<Song[]>('/songs') as unknown as Song[];
};

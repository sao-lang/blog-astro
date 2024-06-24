import { request } from "./request"

export const getSongs = () => {
    return request('http://127.0.0.1:9089/songs', 'GET')
}
import message from '@/utils/message';
import { AxiosWrapper } from '@lania/utils';

const http = new AxiosWrapper(
    { baseURL: 'http://127.0.0.1:10000' },
    {
        request: {
            onFulfilled: config => {
                // if (window) {
                //     const token = window?.storage.getItem('token');
                //     if (token) {
                //         config.headers!['Authorization'] = `Bearer ${token}`;
                //     }
                // }
                return config;
            },
            onRejected: (error: any) => {
                console.error('Request Error:', error);
                return Promise.reject(error);
            },
        },
        response: {
            onFulfilled: response => {
                const res = response.data;
                if (res.code !== 200) {
                    console.error(`Response Error: ${res.message}`);
                    return Promise.reject(new Error(res.message || 'Error'));
                } else {
                    return res.data;
                }
            },
            onRejected: (error: any) => {
                const { response } = error;
                if (response) {
                    const status = response.status;
                    switch (status) {
                        case 400:
                            console.error('Bad Request: 请求错误，请检查请求参数');
                            break;
                        case 401:
                            console.error('Unauthorized: 未授权，请重新登录');
                            break;
                        case 403:
                            console.error('Forbidden: 拒绝访问，权限不足');
                            break;
                        case 404:
                            console.error('Not Found: 请求资源不存在');
                            break;
                        case 500:
                            console.error('Internal Server Error: 服务器错误，请稍后重试');
                            break;
                        default:
                            console.error(
                                `Error ${status}: ${response.data?.message || '未知错误'}`,
                            );
                    }
                } else {
                    console.error('Network Error: 网络错误，请检查您的网络连接');
                }
                message.error(error);
                return Promise.reject(error);
            },
        },
    },
);

export default http;

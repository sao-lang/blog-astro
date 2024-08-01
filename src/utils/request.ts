import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type CancelTokenSource,
    type InternalAxiosRequestConfig,
} from 'axios';

// 定义接口来描述响应结构
interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

// 创建一个axios实例
const service: AxiosInstance = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // if (window) {
        //     const token = window?.storage.getItem('token');
        //     if (token) {
        //         config.headers!['Authorization'] = `Bearer ${token}`;
        //     }
        // }
        return config;
    },
    (error: any) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    },
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        const res = response.data;
        if (res.code !== 200) {
            console.error(`Response Error: ${res.message}`);
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return res.data;
        }
    },
    (error: any) => {
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
                    console.error(`Error ${status}: ${response.data?.message || '未知错误'}`);
            }
        } else {
            console.error('Network Error: 网络错误，请检查您的网络连接');
        }
        return Promise.reject(error);
    },
);

// 封装常用的请求方法，并支持取消功能
const request = {
    get<T = any, K = any>(url: string, params?: K, config?: AxiosRequestConfig) {
        const source: CancelTokenSource = axios.CancelToken.source();
        return {
            fetch: () => {
                return service.get<T>(url, {
                    params,
                    cancelToken: source.token,
                    ...config,
                }) as unknown as Promise<T>;
            },
            cancel: source.cancel,
        };
    },

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        const source: CancelTokenSource = axios.CancelToken.source();
        return {
            fetch: () => {
                return service.post<T>(url, {
                    data,
                    cancelToken: source.token,
                    ...config,
                }) as unknown as Promise<T>;
            },
            cancel: source.cancel,
        };
    },

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        const source: CancelTokenSource = axios.CancelToken.source();
        return {
            fetch: () => {
                return service.put<T>(url, {
                    data,
                    cancelToken: source.token,
                    ...config,
                }) as unknown as Promise<T>;
            },
            cancel: source.cancel,
        };
    },

    delete<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        const source: CancelTokenSource = axios.CancelToken.source();
        return {
            fetch: () => {
                return service.delete<T>(url, {
                    data,
                    cancelToken: source.token,
                    ...config,
                }) as unknown as Promise<T>;
            },
            cancel: source.cancel,
        };
    },
};

export default request;

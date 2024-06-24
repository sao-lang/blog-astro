import axios from 'axios';
export const request = async (url: string, method: string, params?: Record<string, any>) => {
    const response = await fetch(url, { method });
    return await response.json();
};

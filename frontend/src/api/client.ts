import axios, { InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from '../constants/config';

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        metadata?: {
            startTime: Date;
        };
    }
}

export const api = axios.create({
    baseURL: `${CONFIG.BASE_URL}`,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    config.metadata = { startTime: new Date() };

    const url = `${config.url ?? ''}`;

    console.log('🚀', config.method?.toUpperCase(), url);
    if (config.data) {
        console.log('👉 DATA:', config.data);
    }
    return config;
});

api.interceptors.response.use(
    (res) => {
        const duration =
            new Date().getTime() -
            (res.config.metadata?.startTime?.getTime() ?? 0);

        console.log('✅ response:', res.config.url ?? '', ' || status:', res.status, ' || time:', `${duration}ms`);
        console.log('👉 response:', res.data);
        return res;
    },
    (err) => {
        console.log(
            `🔥 ERROR ${err.config?.method?.toUpperCase()} ${err.config?.url}`
        );

        console.log({
            message: err.message,
            code: err.code,
            status: err.response?.status,
            url: err.config?.url,
            baseURL: err.config?.baseURL,
            data: err.response?.data,
        });

        if (!err.response) {
            console.log('🚨 NETWORK ERROR (no response)');
        }
        return Promise.reject(err);
    }
);


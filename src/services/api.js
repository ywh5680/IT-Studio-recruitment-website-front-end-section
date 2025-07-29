import axios from 'axios';

const api = axios.create({
    baseURL: 'http://100.64.0.17/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        // 处理请求错误
        alert("请求失败！");
        return Promise.reject(error);
    }
);

export default api;
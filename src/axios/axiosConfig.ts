import axios from 'axios';
import type { AxiosInstance } from 'axios';


const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://192.168.1.40:8081/api', // Thay đổi URL này với URL API của bạn
    // baseURL: 'http://localhost:8081/api', // Thay đổi URL này với URL API của bạn

    timeout: 10000, // Thay đổi thời gian timeout nếu cần
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.request.use(config => {
    const currentLanguage = localStorage.getItem('language') || 'en'; // Lấy ngôn ngữ từ localStorage hoặc mặc định là 'en'
    config.headers['Accept-Language'] = currentLanguage;
    return config;
}, error => {
    return Promise.reject(error);
});


export default axiosInstance;

import axios from 'axios';
import AuthService from './AuthService';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

instance.interceptors.request.use(
    config => {
        const user = AuthService.getCurrentUser();
        if (user && user.access) {
            config.headers.Authorization = 'Bearer ' + user.access;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;
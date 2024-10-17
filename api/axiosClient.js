import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'https://192.168.1.17:7190/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default axiosClient;
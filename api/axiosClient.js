import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://125.212.252.4:5158/api',
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
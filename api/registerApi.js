import axiosClient from "./axiosClient";

const registerApi = {
    register(data) {
        const url = "/ImportRegistrations";
        return axiosClient.post(url, data);
    }
};

export default registerApi;
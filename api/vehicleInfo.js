import axiosClient from "./axiosClient";

const vehicleInfo = {
    getInfo(id) {
        const url = `/importRegistrations/vehiclenumber/${id}`;
        return axiosClient.get(url);
    }
}

export default vehicleInfo;
import axiosClient from "./axiosClient";

const vehicleQueueApi = {
    getAll() {
        const url = "/ImportRegistrations/queueList";
        return axiosClient.get(url);
    }
}

export default vehicleQueueApi;
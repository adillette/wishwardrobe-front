import { userLocationApi } from "./axiosConfig";

async function getLocation(userId) {
    try {
        const response = await userLocationApi.get(`/${userId}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
}

async function updateLocation(userId,lat,lon,enabled) {
    const response = await userLocationApi.put('/updatelocations',{ userId, lat, lon, enabled });
    return response.data;
}

export default{getLocation,updateLocation};
import { userLocationApi } from "./axiosConfig";

async function getLocation() {
    try {
        const response = await userLocationApi.get(`/me`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
}

async function updateLocation(lat,lon,enabled) {
    const response = await userLocationApi.put('/updatelocations',{ lat, lon, enabled });
    return response.data;
}

async function sendNow( lat, lon) {
  const response = await userLocationApi.post(`/send-now`, { lat, lon })
  return response.data
}

export default{getLocation,updateLocation,sendNow};
import { weatherApi } from "./axiosConfig";

//위치로 날씨 조회 (MSA Weather Service 연결)

async function getWeatherByLocation(location) {
  try {
    const response = await weatherApi.get('/weather', {
      params: { location }
    });
    return response.data;
  } catch (error) {
    console.error('날씨 정보 조회 실패:', error);
    throw error;
  }
}

// 위경도로 날씨 조회 (GPS 좌표 기반)

async function getWeatherByCoordinates(lat , lon) {
  try {
    const response = await weatherApi.get('/weather/coordinates', {
      params: {
        lat: lat,
        lon: lon
      }
    });
    return response.data;
  } catch (error) {
    console.error('위경도 기반 날씨 정보 조회 실패:', error);
    throw error;
  }
}

// 통합 날씨 정보 조회 (병렬)
 
async function getIntegratedWeatherByCoordinates(latitude, longitude) {
  const startTime = performance.now();
  try {
    const response = await weatherApi.get('/weather/integrated/coordinates', {
      params: { lat: latitude, lon: longitude }
    });
    const endTime = performance.now();
    console.log(`병렬 조회 완료: ${(endTime - startTime).toFixed(2)}ms`);
    return { data: response.data, time: endTime - startTime };
  } catch (error) {
    console.error('병렬 조회 실패:', error);
    throw error;
  }
}




export default {
  getWeatherByLocation,
  getWeatherByCoordinates,
  getIntegratedWeatherByCoordinates
};

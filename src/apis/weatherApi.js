import { weatherApi } from "./axiosConfig";

/**
 * ✅ 위치로 날씨 조회 (MSA Weather Service 연결)
 * @param {string} location - 위치 정보 (예: "역삼동")
 * @returns {Promise} - 날씨 예보 정보 (WeatherForecastDTO)
 */
async function getWeatherByLocation(location) {
  try {
    const response = await weatherApi.get('/api/v1/weather', {
      params: { location }
    });
    return response.data;
  } catch (error) {
    console.error('날씨 정보 조회 실패:', error);
    throw error;
  }
}

/**
 * ✅ 위경도로 날씨 조회 (GPS 좌표 기반)
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Promise} - 날씨 예보 정보 (WeatherForecastDTO)
 */
async function getWeatherByCoordinates(latitude, longitude) {
  try {
    const response = await weatherApi.get('/api/v1/weather/coordinates', {
      params: {
        lat: latitude,
        lon: longitude
      }
    });
    return response.data;
  } catch (error) {
    console.error('위경도 기반 날씨 정보 조회 실패:', error);
    throw error;
  }
}

/**
 * ✅ 통합 날씨 정보 조회 (병렬)
 */
async function getIntegratedWeatherParallel(location, station, areaNo) {
  const startTime = performance.now();
  try {
    const response = await weatherApi.get('/api/v1/weather/integrated', {
      params: { location, station, areaNo }
    });
    const endTime = performance.now();
    console.log(`⚡ 병렬 조회 완료: ${(endTime - startTime).toFixed(2)}ms`);
    return { data: response.data, time: endTime - startTime };
  } catch (error) {
    console.error('병렬 조회 실패:', error);
    throw error;
  }
}




export default {
  getWeatherByLocation,
  getWeatherByCoordinates,
  
  getIntegratedWeatherParallel
};

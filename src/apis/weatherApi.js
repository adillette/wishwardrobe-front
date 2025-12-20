import { weatherApi } from './axiosConfig';

// Weather 서비스 API 함수들
export const weatherService = {
  // 현재 날씨 조회
  getCurrentWeather: async (location) => {
    try {
      const response = await weatherApi.get('/weather/current', {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error('현재 날씨 조회 실패:', error);
      throw error;
    }
  },

  // 날씨 예보 조회
  getWeatherForecast: async (location, days = 7) => {
    try {
      const response = await weatherApi.get('/weather/forecast', {
        params: { location, days }
      });
      return response.data;
    } catch (error) {
      console.error('날씨 예보 조회 실패:', error);
      throw error;
    }
  },

  // 옷 추천 정보 조회
  getClothingRecommendation: async (location) => {
    try {
      const response = await weatherApi.get('/weather/recommendation', {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error('옷 추천 정보 조회 실패:', error);
      throw error;
    }
  }
};

export default weatherService;

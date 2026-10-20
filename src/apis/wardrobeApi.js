
import "./axiosConfig";
import { wardrobeApi } from "./axiosConfig";

// 특정 사용자의 옷 전체 조회 (옷장 목록용)
async function getClothesByUserId(userId) {
  const response = await wardrobeApi.get(`/clothes/user/${userId}`);
  return response.data;
}

// 위경도로 옷 추천 (MSA 방식, Weather Service 연동)

async function getRecommendedClothesByCoordinates(userId, lat, lon, category = null) {
  const params = {
    userId,
    lat,
    lon
  };

  if (category) {
    params.category = category;
  }

  const response = await wardrobeApi.get('/clothes/recommendations/coordinates', { params });
  return response.data;
}

// 위치 정보로 옷 추천 (MSA 방식)

async function getRecommendedClothes(userId, location, category = null) {
  const params = {
    userId,
    location
  };

  if (category) {
    params.category = category;
  }

  const response = await wardrobeApi.get('/clothes/recommendations', { params });
  return response.data;
}

// 온도로 옷 추천 (레거시 방식)

async function getRecommendedClothesByTemperature(userId, temperature, category = null) {
  const params = {
    userId,
    temperature
  };

  if (category) {
    params.category = category;
  }

  const response = await wardrobeApi.get('/clothes/recommendations/by-temperature', { params });
  return response.data;
}

// 옷 추가

async function addClothes(formData) {
  const response = await wardrobeApi.post('/clothes/add', formData ,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

// 옷 업데이트

async function updateClothes(clothesId, formData) {
  const response = await wardrobeApi.put(`/clothes/${clothesId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

// 옷 삭제
 
async function deleteClothes(clothesId) {
  const response = await wardrobeApi.delete(`/clothes/${clothesId}`);
  return response.data;
}

// 옷장 히스토리 조회 (2일전, 어제, 오늘)
 
async function getWardrobeHistory(userId, temperatureHistory, category = null) {
  const requests = temperatureHistory.map(async (item) => {
    const clothes = await getRecommendedClothesByTemperature(userId, item.temperature, category);
    return {
      date: item.date,
      temperature: item.temperature,
      clothes: clothes
    };
  });
  
  return Promise.all(requests);
}

export default {
  getClothesByUserId,
  getRecommendedClothesByCoordinates,
  getRecommendedClothes,
  getRecommendedClothesByTemperature,
  addClothes,
  updateClothes,
  deleteClothes,
  getWardrobeHistory
};

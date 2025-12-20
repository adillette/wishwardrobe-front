import { wardrobeApi } from './axiosConfig';

// Wardrobe 서비스 API 함수들
export const wardrobeService = {
  // 옷장 목록 조회
  getClothes: async () => {
    try {
      const response = await wardrobeApi.get('/clothes');
      return response.data;
    } catch (error) {
      console.error('옷장 목록 조회 실패:', error);
      throw error;
    }
  },

  // 특정 카테고리 옷 조회
  getClothesByCategory: async (category) => {
    try {
      const response = await wardrobeApi.get(`/clothes/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('카테고리별 옷 조회 실패:', error);
      throw error;
    }
  },

  // 옷 추가
  addClothing: async (clothingData) => {
    try {
      const response = await wardrobeApi.post('/clothes', clothingData);
      return response.data;
    } catch (error) {
      console.error('옷 추가 실패:', error);
      throw error;
    }
  },

  // 옷 수정
  updateClothing: async (clothingId, clothingData) => {
    try {
      const response = await wardrobeApi.put(`/clothes/${clothingId}`, clothingData);
      return response.data;
    } catch (error) {
      console.error('옷 수정 실패:', error);
      throw error;
    }
  },

  // 옷 삭제
  deleteClothing: async (clothingId) => {
    try {
      const response = await wardrobeApi.delete(`/clothes/${clothingId}`);
      return response.data;
    } catch (error) {
      console.error('옷 삭제 실패:', error);
      throw error;
    }
  }
};

export default wardrobeService;

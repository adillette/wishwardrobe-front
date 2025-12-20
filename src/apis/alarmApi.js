import { alarmApi } from './axiosConfig';

// Alarm 서비스 API 함수들
export const alarmService = {
  // 알람 목록 조회
  getAlarms: async () => {
    try {
      const response = await alarmApi.get('/alarms');
      return response.data;
    } catch (error) {
      console.error('알람 목록 조회 실패:', error);
      throw error;
    }
  },

  // 알람 생성
  createAlarm: async (alarmData) => {
    try {
      const response = await alarmApi.post('/alarms', alarmData);
      return response.data;
    } catch (error) {
      console.error('알람 생성 실패:', error);
      throw error;
    }
  },

  // 알람 수정
  updateAlarm: async (alarmId, alarmData) => {
    try {
      const response = await alarmApi.put(`/alarms/${alarmId}`, alarmData);
      return response.data;
    } catch (error) {
      console.error('알람 수정 실패:', error);
      throw error;
    }
  },

  // 알람 삭제
  deleteAlarm: async (alarmId) => {
    try {
      const response = await alarmApi.delete(`/alarms/${alarmId}`);
      return response.data;
    } catch (error) {
      console.error('알람 삭제 실패:', error);
      throw error;
    }
  }
};

export default alarmService;

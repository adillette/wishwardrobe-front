import axios from "axios";

// Alarm 서비스용 axios 인스턴스 (8081)
export const alarmApi = axios.create({
  baseURL: "http://localhost:8081",
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Wardrobe 서비스용 axios 인스턴스 (8082)
export const wardrobeApi = axios.create({
  baseURL: "http://localhost:8082",
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Weather 서비스용 axios 인스턴스 (8083)
export const weatherApi = axios.create({
  baseURL: "http://localhost:8083",
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 필요시 인터셉터 추가 예시
// alarmApi.interceptors.request.use(
//   config => {
//     // 요청 전 처리 (예: 토큰 추가)
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// alarmApi.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     // 에러 처리
//     return Promise.reject(error);
//   }
// );

export default {
  alarmApi,
  wardrobeApi,
  weatherApi
};
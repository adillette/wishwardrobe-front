import axios from "axios";

// 개발 환경에서는 직접 MSA 서비스 포트로, 운영(Docker) 환경에서는 Nginx 프록시를 통해 접근
const isDevelopment = process.env.NODE_ENV === 'development';

const CLOTHES_API_URL = isDevelopment
  ? 'http://localhost:8081/api'
  : '/api';

const WEATHER_API_URL = isDevelopment
  ? 'http://localhost:8082'
  : '/api/weather';

const NOTIFICATION_API_URL = isDevelopment
  ? 'http://localhost:8083'
  : '/api/notification';

// Clothes (Wardrobe) 서비스용 axios 인스턴스 (WebMVC)
export const wardrobeApi = axios.create({
  baseURL: CLOTHES_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Weather 서비스용 axios 인스턴스 (WebFlux)
export const weatherApi = axios.create({
  baseURL: WEATHER_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Notification (Alarm) 서비스용 axios 인스턴스 (WebFlux)
export const alarmApi = axios.create({
  baseURL: NOTIFICATION_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});


export default {
  alarmApi,
  wardrobeApi,
  weatherApi
};
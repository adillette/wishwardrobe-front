import axios from "axios";

// 개발 환경에서는 직접 MSA 서비스 포트로, 운영(Docker) 환경에서는 Nginx 프록시를 통해 접근
const isDevelopment = process.env.NODE_ENV === 'development';

const CLOTHES_API_URL = isDevelopment
  ? 'http://localhost:8081/api'
  : '/api';

const WEATHER_API_URL = isDevelopment
  ? 'http://localhost:8082'
  : '/api';

const NOTIFICATION_API_URL = isDevelopment
  ? 'http://localhost:8083'
  : '/api/notification';


const USER_LOCATION_API_URL = isDevelopment
 ? 'http://localhost:8083/api/user-location'
  : '/api/user-location';

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

export const userLocationApi = axios.create({
  baseURL: USER_LOCATION_API_URL,
  headers: { 'Content-Type' : 'application/json' },
  timeout: 10000
})



export const memberApi = axios.create({
  baseURL: CLOTHES_API_URL, 
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});



// 1) 토큰을 브라우저에 저장하고 꺼내는 도구
const TOKEN_KEY = "jwt";

export const tokenStorage = {
  get() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* 무시 */ }
  },
  remove() {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* 무시 */ }
  },
};

// 2) 요청이 나가기 전에 토큰을 붙인다
memberApi.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3) 서버가 401(토큰 없음/만료)로 답하면 로그인 화면으로 보낸다
memberApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    // 로그인 실패도 401이라서 로그인 요청은 제외한다
    if (status === 401 && !url.includes("/users/login")) {
      tokenStorage.remove();
      try { localStorage.removeItem("user"); } catch { /* 무시 */ }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default {
  memberApi,
  alarmApi,
  wardrobeApi,
  weatherApi,
  userLocationApi
};
<template>
  <div class="weather-wardrobe-container">
    <!-- 사이드바 -->
    <aside class="sidebar">
      <nav class="nav-menu">
        <button class="nav-item" @click="navigateTo('fingerprint')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
          </svg>
        </button>
        <button class="nav-item" @click="navigateTo('grid')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="8" height="8"/>
            <rect x="13" y="3" width="8" height="8"/>
            <rect x="3" y="13" width="8" height="8"/>
            <rect x="13" y="13" width="8" height="8"/>
          </svg>
        </button>
        <button class="nav-item" @click="navigateTo('chart')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v7H3zm4-6h2v13H7zm4-2h2v15h-2zm4 4h2v11h-2zm4-5h2v16h-2z"/>
          </svg>
        </button>
        <button class="nav-item" @click="navigateTo('card')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="18" height="14" rx="2"/>
          </svg>
        </button>
        <button class="nav-item" @click="navigateTo('globe')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>
        <button class="nav-item" @click="navigateTo('settings')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
          </svg>
        </button>
        <button class="nav-item" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
      </nav>
    </aside>

    <!-- 메인 컨텐츠 -->
    <main class="main-content">
      <div class="background-image"></div>
      
      <div class="content-wrapper">
        <!-- 타이틀 -->
        <h1 class="main-title">
          Today's<br>weather<br>and<br>wardrobe
        </h1>

        <!-- 현재 날씨 카드 -->
        <div class="current-weather-card">
          <div class="location-display" v-if="currentLocationName">
            <span class="location-label">위치:</span>
            <span class="location-name">{{ currentLocationName }}</span>
          </div>
          <div class="temperature">{{ currentTemperature }}°C</div>
        </div>

        <!-- 컨텐츠 컨테이너 (가로 분할) -->
        <div class="content-container">
          <!-- 왼쪽: 옷차림 히스토리 카드들 -->
          <div class="wardrobe-history">
            <div 
              v-for="(item, index) in wardrobeHistory" 
              :key="index" 
              class="wardrobe-card"
            >
              <div class="card-header">{{ item.day }}</div>
              <div class="card-temp">{{ item.temperature }}°C</div>
              <div class="clothing-list">
                <div 
                  v-for="(clothing, idx) in item.clothes" 
                  :key="idx" 
                  class="clothing-item"
                >
                  <img 
                    v-if="clothing.imageUrl" 
                    :src="clothing.imageUrl" 
                    :alt="clothing.name" 
                    class="clothing-image"
                  />
                  <span class="clothing-name">{{ clothing.name }}</span>
                </div>
                <div v-if="!item.clothes || item.clothes.length === 0" class="no-clothes">
                  추천 옷 없음
                </div>
              </div>
            </div>
          </div>

          <!-- 오른쪽: 날씨 상세 정보 카드 (세로 스택) -->
          <div class="weather-details">
            <div class="detail-card">
              <div class="detail-label">Highest</div>
              <div class="detail-value">{{ highestTemp }}°C</div>
              <div class="detail-location">{{ highestLocation }}</div>
            </div>
            <div class="detail-card">
              <div class="detail-label">low</div>
              <div class="detail-value">{{ lowestTemp }}°C</div>
              <div class="detail-location">{{ lowestLocation }}</div>
            </div>
            <div class="detail-card">
              <div class="detail-label">Before</div>
              <div class="detail-value">{{ beforeTemp }}°C</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import wardrobeApi from '@/apis/wardrobeApi';
import weatherApi from '@/apis/weatherApi';

export default {
  name: 'WeatherWardrobe',
  setup() {
    // 반응형 상태 변수들 정의
    const currentCoordinates = ref({ lat: 37.5665, lon: 126.9780 }); // 서울 기본 좌표
    const currentLocationName = ref(''); // 백엔드에서 받아온 위치명
    const currentTemperature = ref(10);
    const highestTemp = ref(12);
    const highestLocation = ref('Incheon');
    const lowestTemp = ref(0);
    const lowestLocation = ref('Busan');
    const beforeTemp = ref('+5');
    
    //** 옷차림 히스토리 데이터
    const wardrobeHistory = ref([
      {
        day: '2 days ago',
        temperature: 8,
        clothes: []
      },
      {
        day: 'yesterday',
        temperature: 10,
        clothes: []
      },
      {
        day: 'today',
        temperature: 12,
        clothes: []
      }
    ]);

    //** 네비게이션 함수
    const navigateTo = (page) => {
      console.log(`Navigating to ${page}`);
      // 실제 라우팅 로직 구현
    };

    //** 뒤로가기 함수
    const goBack = () => {
      console.log('Going back');
      // 실제 뒤로가기 로직 구현
    };



    //** 기상청 API에서 날씨 데이터 가져오기
    const fetchWeatherData = async (location) => {
      try {
        let response;
      
        if(currentCoordinates.value?.lat&& currentCoordinates.value?.lon)

        response= await weatherApi.getWeatherByCoordinates(currentCoordinates.value.lat,currentCoordinates.value.lon);
        
        else  response = await weatherApi.getWeatherByLocation(location);
        
        console.log("현재 온도",response);
        //** 응답 데이터로 상태 업데이트
        if (response) {
          // 백엔드 WeatherForecastDTO 구조에 맞춰 매핑
          currentTemperature.value = response.maxTemperature || response.minTemperature || 10;
          highestTemp.value = response.maxTemperature || 12;
          lowestTemp.value = response.minTemperature || 0;
          
          // 위치 정보는 카카오 API에서 이미 설정했으므로 백엔드 응답으로 덮어쓰지 않음

          console.log('날씨 데이터 로드 성공:', response);
        }
      } catch (error) {
        console.error('날씨 데이터 로드 실패:', error);
        //** 에러 발생 시 기본값 사용
      }
    };

    //** 사용자의 현재 위치 가져오기 (Geolocation API)
    const getCurrentPosition = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            currentCoordinates.value = { lat: latitude, lon: longitude };
            
            try {
              // 카카오맵 Reverse Geocoding으로 위도/경도 → 지역명 변환
              const locationName = await reverseGeocode(latitude, longitude);
              currentLocationName.value = locationName; // 위치명 저장
              
              resolve(locationName);
            } catch (error) {
              console.error('Reverse Geocoding 실패:', error);
              // 실패 시 기본 지역명 사용
              currentLocationName.value = '서울';
              resolve('서울');
            }
          },
          (error) => {
            console.error('위치 정보 가져오기 실패:', error);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      });
    };

    //** 카카오맵 JavaScript SDK로 좌표를 지역명으로 변환 (Reverse Geocoding)
    const reverseGeocode = async (lat, lon) => {
      return new Promise((resolve, reject) => {
        try {
          // Kakao Maps SDK 로드 확인
          if (!window.kakao || !window.kakao.maps) {
            console.error('Kakao Maps SDK가 로드되지 않았습니다');
            reject(new Error('Kakao Maps SDK not loaded'));
            return;
          }

          // Geocoder 초기화
          window.kakao.maps.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();

            // 좌표로 주소 검색
            geocoder.coord2Address(lon, lat, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                if (result && result.length > 0) {
                  const address = result[0].address;
                  // "3단계" 지역명 반환 (구/군/시)
                  const locationName = address.region_3depth_name || address.region_2depth_name;
                  console.log('지역명 변환 성공:', locationName);
                  resolve(locationName);
                } else {
                  console.error('주소를 찾을 수 없습니다');
                  reject(new Error('주소를 찾을 수 없습니다'));
                }
              } else {
                console.error('Geocoding 실패:', status);
                reject(new Error(`Geocoding failed with status: ${status}`));
              }
            });
          });
        } catch (error) {
          console.error('Reverse Geocoding 에러:', error);
          reject(error);
        }
      });
    };

    //** 옷장 히스토리 데이터 가져오기 (2일전, 어제, 오늘)
    const fetchWardrobeHistory = async (userId, location) => {
      try {
        //** 날씨 데이터를 기반으로 온도 정보 가져오기
        // 실제로는 과거 날씨 데이터를 가져와야 하지만, 
        // 여기서는 임시로 현재 온도 기준으로 ±2도씩 차이를 줍니다
        const temperatureHistory = [
          { date: '2 days ago', temperature: currentTemperature.value - 2 },
          { date: 'yesterday', temperature: currentTemperature.value },
          { date: 'today', temperature: currentTemperature.value + 2 }
        ];

        //** 옷 추천 API 호출
        const historyData = await wardrobeApi.getWardrobeHistory(userId, temperatureHistory);
        
        //** wardrobeHistory 업데이트
        wardrobeHistory.value = wardrobeHistory.value.map((item, index) => ({
          ...item,
          temperature: historyData[index]?.temperature || item.temperature,
          clothes: historyData[index]?.clothes || []
        }));

        console.log('옷장 히스토리 로드 성공:', historyData);
      } catch (error) {
        console.error('옷장 히스토리 로드 실패:', error);
      }
    };

    // 컴포넌트 마운트 시 날씨 데이터 로드
    onMounted(async () => {
      try {
        //1. 사용자 현재 위치 가져오기 (Geolocation API)
        const userLocation = await getCurrentPosition();
        console.log('사용자 위치:', userLocation);
        
        //2. 위치 기반으로 날씨 데이터 조회
        await fetchWeatherData(userLocation);
        
        // 3. 옷장 히스토리 로드
        const userId = 1; // 임시 userId (실제로는 로그인 정보에서 가져와야 함)
        await fetchWardrobeHistory(userId, userLocation);
        
      } catch (error) {
        // 위치 가져오기 실패 시 기본 위치 사용
        console.error('위치 정보 접근 실패, 기본 위치 사용:', error);
        await fetchWeatherData('서울');
        
        const userId = 1;
        await fetchWardrobeHistory(userId, '서울');
      }
      
      // 주기적으로 날씨 데이터 업데이트 (10분마다)
      setInterval(async () => {
        try {
          const userLocation = await getCurrentPosition();
          await fetchWeatherData(userLocation);
        } catch (error) {
          await fetchWeatherData('서울');
        }
      }, 600000); // 600000ms = 10분
    });

    return {
      currentLocationName,
      currentCoordinates,
      currentTemperature,
      highestTemp,
      highestLocation,
      lowestTemp,
      lowestLocation,
      beforeTemp,
      wardrobeHistory,
      navigateTo,
      goBack,
      getCurrentPosition
    };
  }
};
</script>

<style scoped>
.weather-wardrobe-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  
}

.sidebar {
  width: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  z-index: 100;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.nav-item {
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.main-content {
  flex: 1;
  position: relative;
  overflow-y: auto;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-image: url('~@/../public/images/main2.jpg');
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.background-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(52, 152, 219, 0.3);
}

.content-wrapper {
  position: relative;
  z-index: 2;
  padding: 40px 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.main-title {
  font-size: 60px;
  font-weight: 700;
  color: white;
  margin-top: 50px;
  margin-bottom: 40px;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  max-width: 300px;
}

.current-weather-card {
  position: absolute;
  top: 260px;
  right: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.location-display {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.location-label {
  font-weight: 500;
  color: #888;
}

.location-name {
  font-weight: 600;
  color: #333;
}

.temperature {
  font-size: 56px;
  font-weight: 700;
  color: #333;
}

/* 컨텐츠 컨테이너 - 가로 분할 */
.content-container {
  display: flex;
  margin-top: 40px;
  gap: 20px;
}

/* 왼쪽 옷차림 히스토리 */
.wardrobe-history {
  display: flex;
  gap: 20px;
  
  margin-bottom: 20px; /* 아래 상세 카드와의 간격 조정 */
  width: 80%; 
}

.wardrobe-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.wardrobe-card:hover {
  transform: translateY(-8px);
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}

.clothing-image {
  width: 100%;
  aspect-ratio: 3/4;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clothing-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 오른쪽 날씨 상세 정보 카드 - 세로 스택 */
.weather-details {
  display: flex;
  flex-direction: column; /* 세로 스택으로 변경 */
  gap: 20px;
  flex: 1; /* 왼쪽 컨텐츠의 1/3 너비 */
}

.detail-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.detail-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.detail-location {
  font-size: 14px;
  color: #888;
}

/* 반응형 레이아웃 */
@media (max-width: 1024px) {
  .content-container {
    flex-direction: column;
  }
  
  .wardrobe-history, 
  .weather-details {
    width: 100%;
  }
  
  .current-weather-card {
    position: static;
    margin-bottom: 20px;
    max-width: 250px;
  }
  
  .main-title {
    margin-bottom: 80px;
  }
  
  .wardrobe-history {
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
    padding: 10px 0;
  }
  
  .nav-item {
    width: 40px;
    height: 40px;
  }
  
  .content-wrapper {
    padding: 20px 30px;
  }
  
  .main-title {
    font-size: 32px;
  }
}
</style>
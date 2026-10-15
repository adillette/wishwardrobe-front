<template>
  <div class="app-container">
    <!-- 메인 컨테이너 -->
    <div class="main-container">
      <!-- 날씨 정보 섹션 -->
      <div class="weather-section">
        <div class="weather-header">
          <div class="what-to-wear">
            <button @click="toggleModal" class="wear-button">
              What to wear?
            </button>
          </div>
        </div>
        
        <div class="weather-display">
          <h1 class="time">{{ currentTimeText }}</h1>
          <p class="weather-condition">{{ conditionInfo.label }} · {{ currentLocationName || '위치 확인 중' }}</p>
          
          <div class="sun-icon">
            <span class="condition-emoji">{{ conditionInfo.emoji }}</span>
          </div>
          
          <h2 class="temperature">{{ currentTemperature }}°C</h2>
          
          <div class="temperature-cards">
            <div class="temp-card yesterday">
              <h3>lowest</h3>
              <div class="temp-card-content">
                <div class="temp-icon"><span class="small-emoji">🥶</span></div>
                <div class="temp-details">
                  <p>Low {{ lowestTemp }}°c</p>
                </div>
              </div>
            </div>
            
            <div class="temp-card today">
              <h3>highest</h3>
              <div class="temp-card-content">
                <div class="temp-icon"><span class="small-emoji">🔥</span></div>
                <div class="temp-details">
                  <p>High {{ highestTemp }}°c</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 오른쪽 전체 컨테이너 -->
      <div class="right-container">
        <!-- 옷장 영역 (상단 2 비율) -->
        <div class="wardrobe-area">
          <!-- 옷장 메인 영역 (왼쪽 2 비율) -->
          <div class="wardrobe-main">
            <div class="wardrobe-container">
              <h2 class="section-title">my wardrobe</h2>
              
              <div class="wardrobe-gallery">
                <button class="nav-btn prev" @click="prevOutfit">
                  <span>&#10094;</span>
                </button>
                
                <div class="wardrobe-item">
                  <!-- 실제 상의 이미지 -->
                  <img v-if="currentTop?.imageUrl" :src="currentTop.imageUrl" :alt="currentTop.name" class="clothing-image" />
                  <p v-else class="no-clothes">추천 상의 없음</p>
                  <p v-if="currentTop" class="clothing-name">{{ currentTop.name }}</p>
                </div>
                
                <button class="nav-btn next" @click="nextOutfit">
                  <span>&#10095;</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 액세서리+하의 영역 (오른쪽 1 비율) -->
          <div class="accessories-bottom-area">
            <div class="accessories-container">
              <h2 class="section-title">my Acc</h2>
              <div class="accessory-item">
                <!-- 실제 가방 이미지 -->
                <img v-if="recommended.accessory?.imageUrl" :src="recommended.accessory.imageUrl" :alt="recommended.accessory.name" class="clothing-image" />
                <p v-else class="no-clothes">추천 없음</p>
              </div>
            </div>
            
            <div class="bottom-container">
              <h2 class="section-title">Bottom</h2>
              <div class="bottom-item">
                <!-- 실제 하의 이미지 -->
                <img v-if="recommended.bottom?.imageUrl" :src="recommended.bottom.imageUrl" :alt="recommended.bottom.name" class="clothing-image" />
                <p v-else class="no-clothes">추천 없음</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 날씨 예보 영역 (하단 1 비율) - 개별 카드 형태로 수정 -->
        <div class="forecast-area">
          <div class="forecast">
            <div v-for="(day, index) in forecast.slice(0,3)" :key="index" class="forecast-day-card">
              <p class="day-name">{{ day.name }}</p>
              <div class="forecast-icon">
                <span class="small-emoji">{{ day.emoji }}</span>
              </div>
              <p class="forecast-temp">{{ day.high }}° <span class="low-temp">{{ day.low }}°</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    
    <!-- 모달 컴포넌트 - 세 번째 이미지 스타일 적용 -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="toggleModal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title">Wardrobe</div>
          
          <div class="search-container">
            <div class="search-bar">
              <input type="text" v-model="searchQuery" placeholder="Search..." />
              <button class="search-btn">🔍</button>
            </div>
          </div>
        </div>
        
        <div class="category-grid">
          <div class="category-row">
            <div 
              v-for="category in categories.slice(0, 4)" 
              :key="category.name"
              class="category-item"
              @click="selectCategory(category.name)"
            >
              <div class="category-icon">
                <component :is="category.icon" />
              </div>
              <p>{{ category.name }}</p>
            </div>
          </div>
          <div class="category-row">
            <div 
              v-for="category in categories.slice(4, 8)" 
              :key="category.name"
              class="category-item"
              @click="selectCategory(category.name)"
            >
              <div class="category-icon">
                <component :is="category.icon" />
              </div>
              <p>{{ category.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, h } from 'vue'
import { defineOptions } from 'vue'
import weatherApi from '@/apis/weatherApi'
import wardrobeApi from '@/apis/wardrobeApi'
import locationApi from '@/apis/locationApi'
import { getCurrentUserId } from '@/constants/user'
// 컴포넌트 이름 설정
defineOptions({
  name: 'WhatToWearApp'
})

const USER_ID = getCurrentUserId()

// 반응형 데이터 정의
const isModalOpen = ref(false) // 모달 열림/닫힘 상태
const searchQuery = ref('') // 검색어
const currentOutfitIndex = ref(0) // 현재 선택된 상의 인덱스
const notificationEnabled = ref(false)

// 날씨 데이터
const currentCoordinates = ref({ lat: 37.5665, lon: 126.9780 }) // 서울 기본 좌표
const currentLocationName = ref('')
const currentTemperature = ref(10)
const highestTemp = ref(12)
const lowestTemp = ref(0)

// 하늘/강수 상태 (백엔드 skyCondition, precipitationType)
const skyCondition = ref('')
const precipitationType = ref('')

const CONDITIONS = {
  clear: { emoji: '☀️', label: '맑음' },
  cloudy: { emoji: '⛅', label: '구름많음' },
  overcast: { emoji: '☁️', label: '흐림' },
  rain: { emoji: '🌧️', label: '비' },
  sleet: { emoji: '🌨️', label: '비/눈' },
  snow: { emoji: '❄️', label: '눈' },
  shower: { emoji: '🌦️', label: '소나기' }
}

// 기상청 코드("1","3","4" / "1"~"4") 와 한글 문자열 모두 처리
const toConditionKey = (sky, pty) => {
  const p = String(pty ?? '').trim()
  if (p === '4' || p.includes('소나기')) return 'shower'
  if (p === '2' || p.includes('비/눈') || p.includes('진눈')) return 'sleet'
  if (p === '1' || p.includes('비')) return 'rain'
  if (p === '3' || p.includes('눈')) return 'snow'
  const k = String(sky ?? '').trim()
  if (k === '4' || k.includes('흐림')) return 'overcast'
  if (k === '3' || k.includes('구름')) return 'cloudy'
  return 'clear'
}

const conditionInfo = computed(
  () => CONDITIONS[toConditionKey(skyCondition.value, precipitationType.value)]
)

// 현재 시각 표시
const formatTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()
const currentTimeText = ref(formatTime())
let clockTimer = null

// 오늘 날씨 기반 추천 의상 (카테고리별)
const recommended = ref({ top: [], bottom: null, accessory: null })
const currentTop = computed(() => recommended.value.top[currentOutfitIndex.value] ?? null)


const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// LocalDate가 "2026-10-15" 문자열로 온다고 가정 (배열 형태로 오면 아래처럼 분기 추가)
const parseLocalDate = (value) => {
  const [y, m, d] = String(value).split('-').map(Number)
  return new Date(y, m - 1, d)
}

// dailyForecasts 한 항목 → forecast-day-card가 쓰는 모양으로 변환
const toForecastCard = (day, index) => {
  const key = toConditionKey(day.skyCondition, day.precipitationType)   // 기존 함수 재사용
  return {
    name: index === 0 ? 'Today' : DAY_NAMES[parseLocalDate(day.date).getDay()],
    emoji: CONDITIONS[key].emoji,
    high: day.maxTemperature != null ? Math.round(day.maxTemperature) : '-',
    low: day.minTemperature != null ? Math.round(day.minTemperature) : '-'
  }
}


// 서버에 저장된 알림 위치 동기화
const syncNotificationLocation = async () => {
  try {
    const saved = await locationApi.getLocation(USER_ID)
    notificationEnabled.value = saved?.enabled ?? false
    if (notificationEnabled.value) {
      await locationApi.updateLocation(
        USER_ID,
        currentCoordinates.value.lat,
        currentCoordinates.value.lon,
        true
      )
    }
  } catch (error) {
    console.error('알림 위치 동기화 실패:', error)
  }
}

// 날씨 데이터 조회 (좌표 우선, 없으면 지역명)
const fetchWeatherData = async (location) => {
  try {
    const { lat, lon } = currentCoordinates.value
    const response = lat && lon
      ? await weatherApi.getWeatherByCoordinates(lat, lon)
      : await weatherApi.getWeatherByLocation(location)

    if (response) {
      currentTemperature.value = response.maxTemperature || response.minTemperature || 10
      highestTemp.value = response.maxTemperature || 12
      lowestTemp.value = response.minTemperature || 0
      skyCondition.value = response.skyCondition ?? ''
      precipitationType.value = response.precipitationType ?? ''

      if(response.dailyForecasts?.length){
        forecast.value= response.dailyForecasts.map(toForecastCard)
      }

    }
  } catch (error) {
    console.error('날씨 데이터 로드 실패:', error)
  }
}

// 오늘 날씨에 맞는 상의/하의/액세서리 추천 조회
const fetchRecommendedClothes = async () => {
  try {
    const { lat, lon } = currentCoordinates.value
    const [top, bottom, accessory] = await Promise.all(
      ['TOP', 'BOTTOM', 'ACCESSORY'].map(category =>
        wardrobeApi.getRecommendedClothesByCoordinates(USER_ID, lat, lon, category)
      )
    )
    recommended.value = {
      top: top || [],
      bottom: bottom?.[0] ?? null,
      accessory: accessory?.[0] ?? null
    }
    currentOutfitIndex.value = 0
  } catch (error) {
    console.error('추천 의상 로드 실패:', error)
  }
}

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
          if (!window.kakao) {
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



// 날씨 예보 데이터
const forecast = ref([])

// 의상 카테고리 아이콘 컴포넌트들을 이모지로 정의
const TShirtIcon = {
  render: () => h('span', { class: 'emoji-icon' }, '👕')
}

const JacketIcon = {
  render: () => h('span', { class: 'emoji-icon' }, '🧥')
}

const DressIcon = {
  render: () => h('span', { class: 'emoji-icon' }, '👗')
}

const JeansIcon = {
  render: () => h('span', { class: 'emoji-icon' }, '👖')
}

const ShirtIcon = {
  render: () => h('span', { class: 'emoji-icon' }, '👔')
}

const CardiganIcon = {
  render: () => h('span', { class: 'emoji-icon' }, '🧶')
}

const SkirtIcon = {
  render: () => h('span', { class: 'emoji-icon' }, '🩱')
}

const ShoesIcon = {
  render: () => h('span', { class: 'emoji-icon' }, '👟')
}

// 카테고리 목록
const categories = ref([
  { name: '티셔츠', icon: TShirtIcon },
  { name: '자켓', icon: JacketIcon },
  { name: '드레스', icon: DressIcon },
  { name: '청바지', icon: JeansIcon },
  { name: '셔츠', icon: ShirtIcon },
  { name: '가디건', icon: CardiganIcon },
  { name: '스커트', icon: SkirtIcon },
  { name: '신발', icon: ShoesIcon }
])

// 메서드들 정의
const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const prevOutfit = () => {
  const len = recommended.value.top.length
  if (!len) return
  currentOutfitIndex.value = (currentOutfitIndex.value - 1 + len) % len
}

const nextOutfit = () => {
  const len = recommended.value.top.length
  if (!len) return
  currentOutfitIndex.value = (currentOutfitIndex.value + 1) % len
}

const selectCategory = (categoryName) => {
  console.log(`선택된 카테고리: ${categoryName}`) // 카테고리 선택 로직 구현 예정
}

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  clockTimer = setInterval(() => { currentTimeText.value = formatTime() }, 30000)
  try {
    const userLocation = await getCurrentPosition()
    await fetchWeatherData(userLocation)
    await syncNotificationLocation()
  } catch (error) {
    console.error('초기화 중 오류 발생:', error)
    currentLocationName.value = currentLocationName.value || '서울'
    await fetchWeatherData('서울')
  }
  await fetchRecommendedClothes()
})

onBeforeUnmount(() => clearInterval(clockTimer))
</script>

<style scoped>
/* 업로드된 색상 팔레트 적용 */
:root {
  --primary-dark: #004030;   /* 진한 녹색 */
  --primary-medium: #4A9782; /* 중간 녹색 */
  --primary-beige: #DCD0A8;  /* 베이지 */
  --primary-ivory: #FFF9E5;  /* 아이보리 */
}

.small-emoji {
  font-size: 36px;
  line-height: 1;
}

.condition-emoji {
  font-size: 96px;
  line-height: 1;
}

/* 전체 앱 컨테이너 */
.app-container {
 
  background-color: #FFF9E5;
  min-height: 100vh;
  padding: 20px;
  margin-top: 50px;
  position: relative;
 
}

/* 메인 컨테이너 레이아웃 - 1:1 비율 */
.main-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 20px;
  height: calc(100vh - 40px);
}

/* 날씨 섹션 */
.weather-section {
  flex: 1;
  background-color: #f9f8f7;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.what-to-wear {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-dark);
}

.weather-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.time {
  font-size: 56px;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 5px 0;
}

.weather-condition {
  font-size: 24px;
  color: #888;
  margin: 0 0 30px 0;
}

.sun-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.temperature {
  font-size: 48px;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 40px 0;
}

.temperature-cards {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.temp-card {
  flex: 1;
}

.temp-card h3 {
  font-size: 16px;
  color: var(--primary-dark);
  margin: 0 0 10px 0;
}

.temp-card-content {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.temp-icon {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.temp-details p {
  margin: 5px 0;
  font-size: 14px;
  color: var(--primary-dark);
}

/* 오른쪽 전체 컨테이너 */
.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 옷장 영역 - 상단 2 비율 */
.wardrobe-area {
  flex: 2;
  display: flex;
  gap: 20px;
}

/* 옷장 메인 영역 - 왼쪽 2 비율 */
.wardrobe-main {
  flex: 2;
  display: flex;
  gap: 20px;
}

/* 액세서리+하의 영역 - 오른쪽 1 비율 */
.accessories-bottom-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 날씨 예보 영역 - 하단 1 비율 */
.forecast-area {
  flex: 1;
}

/* 개별 컨테이너 스타일 */
.wardrobe-container, .accessories-container, .bottom-container {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 94%;
}

/* 액세서리와 하의 컨테이너는 1:1 비율 */
.accessories-container, .bottom-container {
  flex: 1;
}

/* 액세서리와 하의 아이템 크기 조정 */
.accessory-item, .bottom-item {
  width: 100%;
  height: calc(100% - 50px); /* 제목 공간 확보 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 실제 의류 이미지 스타일 */
.clothing-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0 0 15px 0;
  text-align: center;
}

.wardrobe-gallery {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wardrobe-item {
  width: 100%;
  height: calc(100% - 50px); /* 제목 공간 확보 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-btn {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--primary-dark);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background-color 0.2s ease;
}

.nav-btn:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.nav-btn.prev {
  left: 10px;
}

.nav-btn.next {
  right: 10px;
}

/* 예보 영역 */
.forecast-area {
  width: 100%;
}

/* 예보 섹션 - 개별 카드 형태로 수정 */
.forecast {
  background-color: transparent;
  border-radius: 16px;
  margin-top: 5px;
  padding: 0;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  height: 95%;
  align-items: stretch;
}

.forecast-day-card {
  background-color:#f9f8f7;
  border-radius: 20px;
  padding: 20px 15px;
  text-align: center;
  flex: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(220, 208, 168, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.forecast-day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.day-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: var(--primary-dark);
}

.forecast-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forecast-temp {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--primary-dark);
}

.low-temp {
  font-weight: normal;
  opacity: 0.7;
}

/* What to wear 버튼 */
.wear-button {
  position: absolute;
  margin-right: 700px;
  top: 45px;
  right: calc(50% - 150px);
  padding: 10px 20px;
  background-color: #DCD0A8;
  border: 2px solid #888;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  cursor: pointer;
  transition: all 0.3s ease;
}

.wear-button:hover {
  background-color: #4A9782;
  color: white;
}

/* 모달 스타일 - 세 번째 이미지 기반 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  width: 80%;
  max-width: 600px;
  background-color: var(--primary-dark);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  margin-bottom: 30px;
}

.modal-title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.modal-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  padding-bottom: 5px;
}

.nav-link.active {
  color: white;
  border-bottom: 2px solid white;
}

.nav-link:hover {
  color: white;
}

.search-container {
  display: flex;
  justify-content: center;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 15px;
  width: 250px;
}

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  padding: 5px;
  flex: 1;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  margin-left: 10px;
}

/* 카테고리 그리드 */
.category-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.category-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--primary-beige);
  border-radius: 12px;
  padding: 20px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background-color: var(--primary-medium);
  transform: translateY(-2px);
}

.category-item:hover .category-icon {
  color: white;
}

.category-item:hover p {
  color: white;
}

.category-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  color: var(--primary-dark);
  display: flex;
  justify-content: center;
  align-items: center;
}

.emoji-icon {
  font-size: 40px;
  line-height: 1;
}

.category-item p {
  color: var(--primary-dark);
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  transition: color 0.3s ease;
}

/* 반응형 스타일 */
@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
    height: auto;
  }
  
  .wardrobe-area {
    flex-direction: column;
  }
  
  .wardrobe-main {
    flex-direction: column;
  }
  
  .accessories-bottom-area {
    flex-direction: row;
    gap: 20px;
  }
  
  .accessories-container, .bottom-container {
    flex: 1;
  }
  
  .wear-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    top: auto;
    left: auto;
  }
}

@media (max-width: 768px) {
  .temperature-cards {
    flex-direction: column;
  }
  
  .forecast {
    overflow-x: auto;
    padding: 15px 10px;
  }
  
  .forecast-day-card {
    min-width: 80px;
  }
  
  .modal-container {
    width: 90%;
    padding: 20px;
  }
  
  .category-row {
    gap: 10px;
  }
  
  .category-item {
    padding: 15px 10px;
  }
  
  .accessories-bottom-area {
    flex-direction: column;
  }
  
  .wardrobe-item, .accessory-item, .bottom-item {
    height: 150px; /* 모바일에서 고정 높이 */
  }
}
</style>
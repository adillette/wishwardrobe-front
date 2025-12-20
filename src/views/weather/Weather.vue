<template>
  <div class="weather-dashboard">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="logo">NGIJIH</div>
      <nav class="nav-icons">
        <button class="nav-icon active">🏠</button>
        <button class="nav-icon">💬</button>
        <button class="nav-icon">📍</button>
        <button class="nav-icon">📅</button>
      </nav>
      <button class="nav-icon settings-bottom">⚙️</button>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="greeting">
          <div class="avatar">👤</div>
          <div>
            <p class="greeting-text">Hello,</p>
            <h2 class="user-name">Jack Grealish</h2>
          </div>
        </div>
        
        <div class="search-bar">
          <input type="text" placeholder="Search anything ..." />
          <button class="search-btn">🔍</button>
        </div>

        <button class="notification-btn">🔔</button>

        <div class="location-weather">
          <div class="location-info">
            <p class="day">Sun</p>
            <p class="location">Banten, Indonesia</p>
          </div>
          <div class="temp-display">22°C</div>
        </div>
      </header>

      <!-- Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Weather Card -->
        <div class="card weather-card">
          <div class="card-header">
            <span class="icon">🌤️</span>
            <div>
              <h3>Weather</h3>
              <p class="subtitle">What's the weather</p>
            </div>
          </div>
          <div class="weather-main">
            <div class="temperature">
              <h1>22°C</h1>
              <span class="unit">H°C</span>
            </div>
            <div class="weather-icon">☀️</div>
          </div>
          <p class="weather-status">Partly Cloudy</p>
          <div class="weather-details">
            <div class="detail-item">
              <p class="detail-label">Pressure</p>
              <p class="detail-value">800mb</p>
            </div>
            <div class="detail-item">
              <p class="detail-label">Visibility</p>
              <p class="detail-value">4.3 km</p>
            </div>
            <div class="detail-item">
              <p class="detail-label">Humidity</p>
              <p class="detail-value">87%</p>
            </div>
          </div>
        </div>

        <!-- Current Location Map Card -->
        <div class="card location-map-card">
          <div class="card-header">
            <span class="icon">📍</span>
            <div>
              <h3>Current Location</h3>
              <p class="subtitle">{{ locationMessage }}</p>
            </div>
          </div>
          <div id="map" class="kakao-map"></div>
          <p class="location-info-text">{{ currentLocation }}</p>
        </div>

        <!-- Temperature Chart -->
        <div class="card temp-chart-card">
          <h3>How's the temperature today?</h3>
          <div class="temp-controls">
            
          </div>
          <div class="chart">
          
            <div class="chart-labels">
              <div class="label">
                <span class="icon">☁️</span>
                <p class="temp">20°</p>
                <p class="time">Morning</p>
              </div>
              <div class="label">
                <span class="icon">☀️</span>
                <p class="temp">34°</p>
                <p class="time">Afternoon</p>
              </div>
              <div class="label">
                <span class="icon">🌤️</span>
                <p class="temp">28°</p>
                <p class="time">Evening</p>
              </div>
              <div class="label">
                <span class="icon">🌙</span>
                <p class="temp">22°</p>
                <p class="time">Night</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tomorrow Weather Card -->
        <div class="card tomorrow-card">
          <p class="tomorrow-label">Tomorrow</p>
          <h2 class="location-name">Alam Barzah</h2>
          <div class="tomorrow-weather">
            <div class="umbrella-icon">☂️</div>
            <div class="tomorrow-temp">20°C</div>
          </div>
          <p class="weather-condition">Rainy</p>
        </div>
      </div>
    </main>

    <!-- Right Sidebar -->
    <aside class="right-sidebar">
      <!-- Sunset/Sunrise Card -->
      <div class="card sunset-card">
        <div class="sun-chart">
          <svg viewBox="0 0 200 100">
            <path
              d="M 20,80 Q 100,20 180,80"
              fill="none"
              stroke="#DCD0A8"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
            <circle cx="180" cy="80" r="8" fill="#DCD0A8" />
            <text x="100" y="50" text-anchor="middle" font-size="20">☀️</text>
          </svg>
        </div>
        <div class="sun-times">
          <div class="sun-time">
            <p class="label">Sunset</p>
            <p class="time">08:00 am</p>
          </div>
          <div class="sun-time">
            <p class="label">Sunrise</p>
            <p class="time">04:43 am</p>
          </div>
        </div>
      </div>

      <!-- UV Index Card -->
      <div class="card uv-card">
        <div class="uv-content">
          <span class="uv-icon">☀️</span>
          <div class="uv-info">
            <h2>20 UVI</h2>
            <span class="uv-badge">Moderate</span>
          </div>
        </div>
        <p class="uv-description">Moderate risk of from UV rays</p>
      </div>

      <!-- Weather Prediction -->
      <div class="card prediction-card">
        <h3>Weather Prediction</h3>
        <div class="prediction-list">
          <div class="prediction-item">
            <span class="icon">☁️</span>
            <div class="prediction-info">
              <p class="date">November 10</p>
              <p class="condition">Cloudy</p>
            </div>
            <div class="prediction-temp">
              <span class="high">26°</span> / <span class="low">19°</span>
            </div>
          </div>
          <div class="prediction-item">
            <span class="icon">☀️</span>
            <div class="prediction-info">
              <p class="date">November 11</p>
              <p class="condition">Bright</p>
            </div>
            <div class="prediction-temp">
              <span class="high">28°</span> / <span class="low">20°</span>
            </div>
          </div>
        </div>
        <button class="next-days-btn">Next 5 Days</button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { defineOptions } from 'vue'

// 컴포넌트 이름 (선택)
defineOptions({
  name: 'WeatherDashboard'
})

// 날씨 관련 데이터 (추후 확장 가능)
const weatherData = ref({
  temperature: null,
  location: '',
  condition: '',
  humidity: null,
  windSpeed: null
})

// 위치 정보 관련 데이터
const locationMessage = ref('Loading...')
const currentLocation = ref('')
const userLatitude = ref(null)
const userLongitude = ref(null)
let mapClickHandler = null
let mapContainerEl = null

onBeforeUnmount(() => {
  if (mapContainerEl && mapClickHandler) {
    mapContainerEl.removeEventListener('click', mapClickHandler)
  }
})


// 지도 초기화 및 현재 위치 표시
onMounted(() => {
  const boot = () => {
    if (!window.kakao?.maps?.load) return false
    window.kakao.maps.load(() => initMap())
    return true
  }

  if (boot()) return

  let attempts = 0
  const timer = setInterval(() => {
    attempts++
    if (boot()) clearInterval(timer)
    else if (attempts >= 50) {
      clearInterval(timer)
      console.error('Kakao Maps API가 로드되지 않았습니다.')
      locationMessage.value = 'Map API 로드 실패'
      currentLocation.value = 'API 키/도메인/제품 활성화를 확인하세요.'
    }
  }, 100)
})

function initMap() {
   mapContainerEl = document.getElementById('map')
  if (!mapContainerEl) return

  const mapOption = {
    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
    level: 3
  }

  const map = new window.kakao.maps.Map(mapContainerEl, mapOption)

  // 기본 안내 (자동 위치 요청 X)
  locationMessage.value = '지도를 클릭해 현재 위치를 불러오세요.'
  currentLocation.value = '위치 권한이 필요합니다.'

  // 이미 권한이 “허용”인 경우에만 자동 시도(선택)
  tryAutoRequestIfGranted(map)

  // 권한이 아직이면, 클릭(사용자 제스처)으로 요청
  mapClickHandler = () => requestCurrentLocation(map)
  mapContainerEl.addEventListener('click', mapClickHandler)
}
async function tryAutoRequestIfGranted(map) {
  try {
    if (!navigator.permissions?.query) return
    const status = await navigator.permissions.query({ name: 'geolocation' })
    if (status.state === 'granted') requestCurrentLocation(map)
  } catch {
    // permissions API 미지원이면 무시
  }
}

function requestCurrentLocation(map) {
  if (!navigator.geolocation) {
    locationMessage.value = 'Geolocation 미지원'
    currentLocation.value = '브라우저가 위치 서비스를 지원하지 않습니다.'
    return
  }

  locationMessage.value = '위치 확인 중...'
  currentLocation.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude

      userLatitude.value = lat
      userLongitude.value = lon

      const locPosition = new window.kakao.maps.LatLng(lat, lon)
      const message = '<div style="padding:5px;">여기에 계신가요?!</div>'

      locationMessage.value = `위도: ${lat.toFixed(6)}, 경도: ${lon.toFixed(6)}`
      currentLocation.value = '현재 위치를 찾았습니다!'

      displayMarker(map, locPosition, message)
    },
    (error) => {
      console.error('Geolocation error:', error)

      if (error.code === 1) {
        locationMessage.value = '위치 권한이 거부됨'
        currentLocation.value = '사이트 설정에서 위치를 “허용”으로 바꿔주세요.'
      } else if (error.code === 2) {
        locationMessage.value = '위치 정보를 가져올 수 없음'
        currentLocation.value = 'GPS/네트워크 상태를 확인해주세요.'
      } else if (error.code === 3) {
        locationMessage.value = '위치 요청 시간 초과'
        currentLocation.value = '잠시 후 다시 시도해주세요.'
      } else {
        locationMessage.value = 'Geolocation 오류'
        currentLocation.value = '위치 정보를 가져올 수 없습니다.'
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

function displayMarker(map, locPosition, message) {
  // 마커 생성
  const marker = new window.kakao.maps.Marker({
    map: map,
    position: locPosition
  })

  const iwContent = message
  const iwRemoveable = true

  // 인포윈도우 생성
  const infowindow = new window.kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable
  })

  // 인포윈도우를 마커 위에 표시
  infowindow.open(map, marker)

  // 지도 중심좌표를 접속위치로 변경
  map.setCenter(locPosition)
}
</script>

<style scoped>
/* Color Palette Variables */
:root {
  --primary-dark: #004030;
  --primary-medium: #4A9782;
  --primary-light: #DCD0A8;
  --primary-pale: #FFF9E5;
}

.weather-dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--primary-pale);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 70px;
  background: var(--primary-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.logo {
  color: white;
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 40px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.nav-icons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.nav-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-icon.active {
  background: var(--primary-medium);
  color: white;
}

.settings-bottom {
  margin-top: auto;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-top: 30px;
  margin-left: 70px;
  padding: 30px;
  margin-right: 350px;
  background-color: #FFF9E5;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.greeting {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--primary-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.greeting-text {
  font-size: 14px;
  color: var(--primary-dark);
  opacity: 0.7;
  margin: 0;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid var(--primary-light);
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 15px;
  font-size: 14px;
  background: transparent;
  color: var(--primary-dark);
}

.search-bar input::placeholder {
  color: #999;
}

.search-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: var(--primary-medium);
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: var(--primary-dark);
}

.notification-btn {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  border: 1px solid var(--primary-light);
  background: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background: var(--primary-pale);
}

.location-weather {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid var(--primary-light);
}

.location-info .day {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.location-info .location {
  font-size: 12px;
  color: var(--primary-medium);
  margin: 0;
}

.temp-display {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-dark);
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
}

/* Cards */
.card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 64, 48, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 64, 48, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.card-header .icon {
  font-size: 24px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.card-header .subtitle {
  font-size: 12px;
  color: var(--primary-medium);
  margin: 0;
}

/* Weather Card */
.weather-card {

background-color: #999;

}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
}

.temperature h1 {
  font-size: 48px;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
  display: inline;
}

.temperature .unit {
  font-size: 16px;
  color: var(--primary-medium);
  margin-left: 5px;
}

.weather-icon {
  font-size: 90px;
}

.weather-status {
  font-size: 14px;
  color: var(--primary-dark);
  margin: 10px 0 20px 0;
}

.weather-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.detail-item {
  background: var(--primary-pale);
  padding: 12px 16px;
  border-radius: 12px;
  flex: 1;
  min-width: 80px;
}

.detail-label {
  font-size: 11px;
  color: var(--primary-medium);
  margin: 0 0 4px 0;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

/* Location Map Card */
.location-map-card {
  background: white;
}

.kakao-map {
  width: 100%;
  height: 250px;
  border-radius: 12px;
  margin: 15px 0;
  overflow: hidden;
}

.location-info-text {
  font-size: 14px;
  color: var(--primary-dark);
  text-align: center;
  margin: 10px 0 0 0;
  font-weight: 500;
}

/* Temperature Chart Card */
.temp-chart-card {
  grid-column: span 2;
  background-color: #fff;
}

.temp-chart-card h3 {
  color: var(--primary-dark);
  margin: 0 0 20px 0;
}

.temp-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: var(--primary-pale);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: var(--primary-light);
}

.control-btn.active {
  background: var(--primary-medium);
}

.chart {
  position: relative;
}

.temp-line {
  width: 100%;
  height: 120px;
  margin-bottom: 10px;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
}

.label {
  text-align: center;
}

.label .icon {
  font-size: 106px;
  margin-bottom: 50px;
}

.label .temp {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 4px 0;
}

.label .time {
  font-size: 12px;
  color: var(--primary-medium);
  margin: 0;
}

/* Tomorrow Card */
.tomorrow-card {
  background-color:  #fff;

}

.tomorrow-label {
  font-size: 12px;
  color: var(--primary-medium);
  margin: 0 0 10px 0;
}

.location-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 20px 0;
}

.tomorrow-weather {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
}

.umbrella-icon {
  font-size: 105px;
  margin-left: 15px;
}

.tomorrow-temp {
  font-size: 42px;
  font-weight: 700;
  color: var(--primary-dark);
}

.weather-condition {
  font-size: 14px;
  color: var(--primary-medium);
  margin: 10px 0 0 0;
}

/* Right Sidebar */
.right-sidebar {
  width: 350px;
  padding: 30px 20px;
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
  background-color: #FFF9E5;
}

/* Sunset Card */
.sunset-card {
  background: #ffffff;
  margin-top: 20px;
}

.sun-chart svg {
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
}

.sun-times {
  display: flex;
  justify-content: space-between;
}

.sun-time .label {
  font-size:20px;
  font-weight: 700;
  color: var(--primary-medium);
  margin: 0 0 4px 0;
}

.sun-time .time {
  font-size: 25px;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

/* UV Card */
.uv-card {
  background-color: #fff;
  color: #004030;
}

.uv-content {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
 
}

.uv-icon {
  font-size: 32px;
}

.uv-info h2 {
  font-size: 24px;
  margin: 0;
  display: inline;
}

.uv-badge {
  background: var(--primary-medium);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  margin-left: 8px;
}

.uv-description {
  font-size: 12px;
  opacity: 0.8;
  margin: 0;
}

/* Prediction Card */
.prediction-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0 0 20px 0;
}

.prediction-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.prediction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--primary-pale);
  border-radius: 12px;
}

.prediction-item .icon {
  font-size: 28px;
  flex-shrink: 0;
}

.prediction-info {
  flex: 1;
}

.prediction-info .date {
  font-size: 12px;
  color: var(--primary-medium);
  margin: 0 0 4px 0;
}

.prediction-info .condition {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.prediction-temp {
  font-size: 14px;
  color: var(--primary-dark);
  white-space: nowrap;
}

.prediction-temp .high {
  font-weight: 600;
}

.prediction-temp .low {
  opacity: 0.7;
}

.next-days-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: var(--primary-medium);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-days-btn:hover {
  background: var(--primary-dark);
}

/* Responsive */
@media (max-width: 1400px) {
  .main-content {
    margin-right: 0;
  }
  
  .right-sidebar {
    position: static;
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;

  }
  
  .temp-chart-card {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .main-content {
    margin-left: 60px;
    padding: 20px;
  }
  
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    max-width: 100%;
  }
}
</style>
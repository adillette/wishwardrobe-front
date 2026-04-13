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

        <button class="notification-btn" @click="subscribePush">
          {{ isSubscribed ? '🔔✓':'🔔' }}
        </button>

        <div class="location-weather">
          <div class="location-info">
            <p class="day">{{ currentDateDisplay }}</p>
            <p class="location">{{ weatherData.location || '위치 정보 없음' }}</p>
          </div>
          <div class="temp-display">{{ weatherData.temperature ? weatherData.temperature + '°C' : '--°C' }}</div>
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
              <h1>{{ weatherData.temperature ? weatherData.temperature + '°C' : '--°C' }}</h1>
              <span class="unit" v-if="backendWeatherData">
                (최고: {{ backendWeatherData.maxTemperature }}°C / 최저: {{ backendWeatherData.minTemperature }}°C)
              </span>
            </div>
            <div class="weather-icon">☀️</div>
          </div>
          <p class="weather-status">{{ weatherData.condition || '날씨 정보 없음' }}</p>
          <p class="weather-forecast-date" v-if="backendWeatherData">
            예보 날짜: {{ formatDate(backendWeatherData.forecastDate) }} {{ formatTime(backendWeatherData.forecastTime) }}
          </p>
          <div class="weather-details">
            <div class="detail-item" v-if="backendWeatherData?.precipitationProbability">
              <p class="detail-label">강수확률</p>
              <p class="detail-value">{{ backendWeatherData.precipitationProbability }}%</p>
            </div>
            <div class="detail-item" v-if="weatherData.humidity">
              <p class="detail-label">습도</p>
              <p class="detail-value">{{ weatherData.humidity }}%</p>
            </div>
            <div class="detail-item" v-if="backendWeatherData?.windDirection">
              <p class="detail-label">풍향</p>
              <p class="detail-value">{{ backendWeatherData.windDirection }}°</p>
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
          <div class="prediction-item" v-if="backendWeatherData">
            <span class="icon">{{ backendWeatherData.skyCondition === '맑음' ? '☀️' : backendWeatherData.skyCondition === '흐림' ? '☁️' : '🌤️' }}</span>
            <div class="prediction-info">
              <p class="date">{{ formatDate(backendWeatherData.forecastDate) }}</p>
              <p class="condition">{{ backendWeatherData.skyCondition || '정보없음' }}</p>
            </div>
            <div class="prediction-temp">
              <span class="high">{{ backendWeatherData.maxTemperature }}°</span> /
              <span class="low">{{ backendWeatherData.minTemperature }}°</span>
            </div>
          </div>
          <div class="prediction-item" v-else>
            <span class="icon">☁️</span>
            <div class="prediction-info">
              <p class="date">데이터 로딩 중...</p>
              <p class="condition">위치 정보를 선택하세요</p>
            </div>
            <div class="prediction-temp">
              <span class="high">--°</span> / <span class="low">--°</span>
            </div>
          </div>
        </div>
        <button class="next-days-btn">Next 5 Days</button>
      </div>

     
    </aside>




    
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { defineOptions } from 'vue'
import axios from 'axios'
import weatherApiService from '@/apis/weatherApi'

// 컴포넌트 이름 (선택)
defineOptions({
  name: 'WeatherDashboard'
})

// 백엔드에서 가져온 날씨 데이터 (WeatherForecastDTO)
const backendWeatherData = ref(null)

// 미세먼지 데이터
const airQualityData = ref(null)

// 자외선 데이터
const uvIndexData = ref(null)

// 날씨 관련 데이터 (공공API + 백엔드)
const weatherData = ref({
  temperature: null,
  location: '',
  condition: '',
  humidity: null,
  windSpeed: null
})

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[date.getDay()]
  return `${month}월 ${day}일 (${weekday})`
}

// 시간 포맷팅 함수
const formatTime = (timeString) => {
  if (!timeString) return ''
  const hour = parseInt(timeString.substring(0, 2))
  const minute = timeString.substring(3, 5)
  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${period} ${displayHour}:${minute}`
}

// 현재 날짜 표시용 computed
const currentDateDisplay = computed(() => {
  if (backendWeatherData.value?.forecastDate) {
    return formatDate(backendWeatherData.value.forecastDate)
  }
  const now = new Date()
  return formatDate(now.toISOString())
})

// 위치 정보 관련 데이터
const locationMessage = ref('Loading...')
const currentLocation = ref('')
const userLatitude = ref(null)
const userLongitude = ref(null)
let mapClickHandler = null
let mapContainerEl = null

const WEATHER_API_KEY = process.env.VUE_APP_WEATHER_API_KEY

const loading=ref(false);
const error=ref(null);

//webPush 구독 관련
const isSubscribed=ref(false);
const subscribePush=async()=> {
  try{
     // 1. 브라우저 푸시 알림 지원 확인
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('이 브라우저는 푸시 알림을 지원하지 않습니다.')
      return
    }

    // 2. 알림 권한 요청
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      alert('알림 권한이 거부되었습니다.')
      return
    }

    //3. 서비스 워커 등록
    const registration =await navigator.serviceWorker.register('/service-worker.js')
    await navigator.serviceWorker.ready

    //4. 백엔드에서 vapid public key 가져오기
    const res = await axios.get('/api/notification/public-key')
    const vapidPublicKey= res.data
   
    //5. VAPID key
    const convertedKey= urlBase64ToUint8Array(vapidPublicKey)
    
    //6. 브라우저 PushSubscription 생성
    const subscrption= await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    })

    //7. 백엔드에 구독 정보 저장
    await axios.post('/api/notification/subscribe',subscrption.toJSON())
    isSubscribed.value=true
    alert('푸시 알림 구독 완료!')
  
  }catch(e){
      console.error('푸시 구독 실패:',e)
      alert('푸시 구독 실패:'+e.message)
  }

  const urlBase64ToUint8Array=(base64String)=>{
    const padding='='.repeat((4-base64String.length%4)%4)
    const base64 =(base64String+padding).replace(/-/g,'+').replace(/_/g,'/')
    const rawData=window.atob(base64)
    return new Uint8Array([...rawData].map(c => c.charCodeAt(0)))
  }
}


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
     async (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude

      userLatitude.value = lat
      userLongitude.value = lon

      const locPosition = new window.kakao.maps.LatLng(lat, lon)
      const message = '<div style="padding:5px;">여기에 계신가요?!</div>'

      locationMessage.value = `위도: ${lat.toFixed(6)}, 경도: ${lon.toFixed(6)}`
      currentLocation.value = '현재 위치를 찾았습니다!'

      displayMarker(map, locPosition, message)
      await fetchWeather(lat, lon)
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

const getAddressFromCoords = (lat, lon) =>
  new Promise((resolve) => {
    try {
      const geocoder = window.kakao?.maps?.services
        ? new window.kakao.maps.services.Geocoder()
        : null

      if (!geocoder) return resolve('알 수 없는 위치')

      geocoder.coord2Address(lon, lat, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK) return resolve('알 수 없는 위치')

        const addr = result?.[0]?.address
        if (!addr) return resolve('알 수 없는 위치')

        resolve(`${addr.region_1depth_name} ${addr.region_2depth_name}`)
      })
    } catch (e) {
      console.error('Error getting address:', e)
      resolve('위치 확인 실패')
    }
  })


  const convertToGrid = (lat, lon) => {
  const RE = 6371.00877
  const GRID = 5.0
  const SLAT1 = 30.0
  const SLAT2 = 60.0
  const OLON = 126.0
  const OLAT = 38.0
  const XO = 43
  const YO = 136

  const DEGRAD = Math.PI / 180.0
  const re = RE / GRID
  const slat1 = SLAT1 * DEGRAD
  const slat2 = SLAT2 * DEGRAD
  const olon = OLON * DEGRAD
  const olat = OLAT * DEGRAD

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn)

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5)
  ro = re * sf / Math.pow(ro, sn)

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5)
  ra = re * sf / Math.pow(ra, sn)

  let theta = lon * DEGRAD - olon
  if (theta > Math.PI) theta -= 2.0 * Math.PI
  if (theta < -Math.PI) theta += 2.0 * Math.PI
  theta *= sn

  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5)
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)

  return { x, y }
}


const getWeatherDescription = (pty, sky) => {
  if (pty === '0') {
    if (sky === '1') return '맑음'
    if (sky === '3') return '구름 많음'
    if (sky === '4') return '흐림'
  }
  if (pty === '1') return '비'
  if (pty === '2') return '비/눈'
  if (pty === '3') return '눈'
  if (pty === '4') return '소나기'
  return '알 수 없음'
}
const getBaseDateTimeForUltra = (now = new Date()) => {
  // 초단기 실황/예보는 보통 매시 40분 이후 데이터가 안정적이라
  // 0~39분이면 이전 시간으로 보정
  const d = new Date(now)
  if (d.getMinutes() < 40) d.setHours(d.getHours() - 1)

  const baseDate = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const baseTime = `${String(d.getHours()).padStart(2, '0')}00`
  return { baseDate, baseTime }
}

// 백엔드 API로 날씨 정보 조회
const fetchWeatherFromBackend = async (locationName) => {
  try {
    loading.value = true
    error.value = null

    console.log('백엔드 API 호출:', locationName)
    const data = await weatherApiService.getWeatherByLocation(locationName)

    backendWeatherData.value = data
    console.log('백엔드에서 받은 날씨 데이터:', data)

    // 화면에 표시할 데이터 업데이트
    weatherData.value = {
      ...weatherData.value,
      temperature: data.maxTemperature || data.minTemperature,
      humidity: data.humidity,
      location: `${data.province} ${data.county} ${data.district}`,
      condition: data.skyCondition || data.precipitationType
    }

  } catch (e) {
    console.error('백엔드 API 호출 오류:', e)
    error.value = '백엔드에서 날씨 정보를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const fetchWeather = async (latitude, longitude) => {
  try {
    loading.value = true
    error.value = null

    console.log('위경도로 통합 날씨 조회:', latitude, longitude)
    
    // 새 API 호출 (날씨 + 미세먼지 + 자외선 한 번에!)
    const result = await weatherApiService.getIntegratedWeatherByCoordinates(latitude, longitude)
    
    const data = result.data
    console.log('통합 날씨 데이터:', data)

    // 화면에 표시할 데이터 업데이트
    backendWeatherData.value = data.weather  // 날씨 정보
    airQualityData.value = data.airQuality    // 미세먼지 정보 (새로 추가!)
    uvIndexData.value = data.uvIndex          // 자외선 정보 (새로 추가!)

    weatherData.value = {
      temperature: data.weather?.maxTemperature || data.weather?.minTemperature,
      humidity: data.weather?.humidity,
      location: data.location,
      condition: data.weather?.skyCondition || data.weather?.precipitationType || '날씨 정보 없음'
    }

    const address = await getAddressFromCoords(latitude, longitude)
    currentLocation.value = address

  } catch (e) {
    console.error('통합 날씨 조회 실패:', e)
    error.value = '날씨 정보를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

// 백엔드 실패 시 공공API로 폴백
const fetchWeatherFallback = async (latitude, longitude) => {
  try {
    const address = await getAddressFromCoords(latitude, longitude)
    const { x, y } = convertToGrid(latitude, longitude)

    const { baseDate, baseTime } = getBaseDateTimeForUltra(new Date())

    // 공공API로 실시간 날씨 정보 가져오기
    const [ncstResponse, fcstResponse, villageFcstResponse] = await Promise.all([
      axios.get('https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst', {
        params: {
          serviceKey: WEATHER_API_KEY,
          numOfRows: '10',
          pageNo: '1',
          dataType: 'JSON',
          base_date: baseDate,
          base_time: baseTime,
          nx: x,
          ny: y
        }
      }),
      axios.get('https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst', {
        params: {
          serviceKey: WEATHER_API_KEY,
          numOfRows: '60',
          pageNo: '1',
          dataType: 'JSON',
          base_date: baseDate,
          base_time: baseTime,
          nx: x,
          ny: y
        }
      }),
      axios.get('https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', {
        params: {
          serviceKey: WEATHER_API_KEY,
          numOfRows: '1000',
          pageNo: '1',
          dataType: 'JSON',
          base_date: baseDate,
          base_time: '0500',
          nx: x,
          ny: y
        }
      })
    ])

    const ncstItems = ncstResponse.data?.response?.body?.items?.item ?? []
    const fcstItems = fcstResponse.data?.response?.body?.items?.item ?? []
    const villageFcstItems = villageFcstResponse.data?.response?.body?.items?.item ?? []

    const temp = ncstItems.find((i) => i.category === 'T1H')?.obsrValue ?? null
    const humidity = ncstItems.find((i) => i.category === 'REH')?.obsrValue ?? null
    const rainType = ncstItems.find((i) => i.category === 'PTY')?.obsrValue ?? '0'
    const sky = fcstItems.find((i) => i.category === 'SKY')?.fcstValue ?? '1'

    weatherData.value = {
      ...weatherData.value,
      temperature: temp,
      humidity,
      location: address,
      condition: getWeatherDescription(rainType, sky)
    }

    // 백엔드 API도 함께 호출 (동 이름 추출)
    const dongName = address.split(' ').pop()
    if (dongName) {
      await fetchWeatherFromBackend(dongName)
    }

  } catch (e) {
    console.error(e)
    error.value = '날씨 정보를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
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
  margin: 10px 0 10px 0;
}

.weather-forecast-date {
  font-size: 12px;
  color: var(--primary-medium);
  margin: 0 0 20px 0;
  font-style: italic;
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
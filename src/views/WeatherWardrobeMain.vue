<template>
  <div class="weather-wardrobe-container">
    

    <!-- 메인 컨텐츠 -->
    <main class="main-content">
      <div class="background-image"></div>
      
      <div class="content-wrapper">
        <!-- 타이틀 -->
        <h1 class="main-title">
          Today's<br>weather<br>and<br>wardrobe
        </h1>
        <div class="notification-box">
          <button  :class="{ off: !notificationEnabled }" @click="toggleNotification">
            {{ notificationEnabled ? '🔔 알림 켜짐' : '🔕 알림 꺼짐' }}
          </button>
          <button class="sample" :disabled="isSendingSample" @click="sendSample">
            {{ isSendingSample ? '요청 중...' : '📨 샘플 즉시 받기' }}
          </button>
        </div>
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
                  <AuthImage 
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
             
            </div>
            <div class="detail-card">
              <div class="detail-label">low</div>
              <div class="detail-value">{{ lowestTemp }}°C</div>
             
            </div>
            
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AuthImage from '@/components/AuthImage.vue'
import wardrobeApi from '@/apis/wardrobeApi'
import weatherApi from '@/apis/weatherApi'
import locationApi from '@/apis/locationApi'
import { getCurrentUserId, getNotificationChannel } from '@/constants/user'
import { enableNotification } from '@/services/pushSetup'
import { getCurrentPosition as getGeoPosition } from '@/utils/geolocation'

// // 로그인 상태가 바뀌어도 최신값을 읽도록 computed로 둔다
const userId = computed(() => getCurrentUserId())
const notificationEnabled = ref(false)

// 반응형 상태
const currentCoordinates = ref({ lat: 37.5665, lon: 126.9780 }) // 서울 기본 좌표
const currentLocationName = ref('')
const currentTemperature = ref(10)
const highestTemp = ref(12)
const lowestTemp = ref(0)

// 옷차림 히스토리 (카드 3장)
const wardrobeHistory = ref([
  { day: '2 days ago', temperature: 8, clothes: [] },
  { day: 'yesterday', temperature: 10, clothes: [] },
  { day: 'today', temperature: 12, clothes: [] }
])

let weatherTimer = null // // 10분 주기 갱신 타이머. 언마운트 때 정리하려고 기억해 둔다

// 서버에 저장된 알림 위치 동기화
const syncNotificationLocation = async () => {
  try {
    const saved = await locationApi.getLocation()
    // 서버가 켜짐이어도 브라우저 알림 권한이 없으면 실제로는 받을 수 없으므로 꺼짐으로 표시한다
    const permitted = typeof Notification !== 'undefined' && Notification.permission === 'granted'
    notificationEnabled.value = (saved?.enabled ?? false) && permitted
    if (notificationEnabled.value) {
      await locationApi.updateLocation(
        
        currentCoordinates.value.lat,
        currentCoordinates.value.lon,
        true
      )
    }
  } catch (error) {
    console.error('알림 위치 동기화 실패:', error)
  }
}

const toggleNotification = async () => {
  if (userId.value == null) {
    alert('로그인이 필요합니다.')
    return
  }

  try {
    if (!notificationEnabled.value) {
      const { locationSaved } = await enableNotification(
        getNotificationChannel(),
        currentCoordinates.value.lat,
        currentCoordinates.value.lon
      )
      notificationEnabled.value = locationSaved
    } else {
      await locationApi.updateLocation(
       
        currentCoordinates.value.lat,
        currentCoordinates.value.lon,
        false
      )
      notificationEnabled.value = false
    }
  } catch (error) {
    console.error('알림 설정 변경 실패:', error)
    alert('알림 설정 실패: ' + error.message)
  }
}

//샘플 알림 보내기
const isSendingSample = ref(false)

const sendSample = async () => {
  if (userId.value == null) {
    alert('로그인이 필요합니다.')
    return
  }
  if (isSendingSample.value) return
  isSendingSample.value = true

  try {
    // // 꺼져 있으면 먼저 켠다 (권한 요청 + 구독 등록). 실패하면 toggleNotification이 alert를 띄운다
    if (!notificationEnabled.value) {
      await toggleNotification()
      if (!notificationEnabled.value) return
    }
    await locationApi.sendNow(
      
      currentCoordinates.value.lat,
      currentCoordinates.value.lon
    )
    alert('샘플 알림을 요청했습니다. 잠시 후 도착합니다.')
  } catch (error) {
    console.error('샘플 알림 요청 실패:', error)
    alert('샘플 알림 요청 실패: ' + error.message)
  } finally {
    isSendingSample.value = false
  }
}

// 네비게이션 (아직 구현 전)
const navigateTo = (page) => {
  console.log(`Navigating to ${page}`)
}

const goBack = () => {
  console.log('Going back')
}

// 날씨 데이터 조회 (좌표 우선, 없으면 지역명)
const fetchWeatherData = async (location) => {
  try {
    const { lat, lon } = currentCoordinates.value
    const response = lat && lon
      ? await weatherApi.getWeatherByCoordinates(lat, lon)
      : await weatherApi.getWeatherByLocation(location)

    console.log('현재 온도', response)

    if (response) {
      currentTemperature.value = response.maxTemperature || response.minTemperature || 10
      highestTemp.value = response.maxTemperature || 12
      lowestTemp.value = response.minTemperature || 0
    }
  } catch (error) {
    console.error('날씨 데이터 로드 실패:', error)
  }
}

// 사용자의 현재 위치 가져오기 (Geolocation API)
const getCurrentPosition = async () => {
  let latitude, longitude
  try {
    ({ latitude, longitude } = await getGeoPosition())
  } catch (error) {
    console.error('위치 정보 가져오기 실패:', error)
    throw error
  }
  currentCoordinates.value = { lat: latitude, lon: longitude }

  try {
    // 카카오맵 Reverse Geocoding으로 좌표 → 지역명 변환
    const locationName = await reverseGeocode(latitude, longitude)
    currentLocationName.value = locationName
    return locationName
  } catch (error) {
    console.error('Reverse Geocoding 실패:', error)
    currentLocationName.value = '서울'
    return '서울'
  }
}

// 카카오맵 JavaScript SDK로 좌표를 지역명으로 변환
const reverseGeocode = (lat, lon) => {
  return new Promise((resolve, reject) => {
    try {
      if (!window.kakao) {
        console.error('Kakao Maps SDK가 로드되지 않았습니다')
        reject(new Error('Kakao Maps SDK not loaded'))
        return
      }

      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder()

        geocoder.coord2Address(lon, lat, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            if (result && result.length > 0) {
              const address = result[0].address
              const locationName = address.region_3depth_name || address.region_2depth_name
              console.log('지역명 변환 성공:', locationName)
              resolve(locationName)
            } else {
              console.error('주소를 찾을 수 없습니다')
              reject(new Error('주소를 찾을 수 없습니다'))
            }
          } else {
            console.error('Geocoding 실패:', status)
            reject(new Error(`Geocoding failed with status: ${status}`))
          }
        })
      })
    } catch (error) {
      console.error('Reverse Geocoding 에러:', error)
      reject(error)
    }
  })
}

// 옷장 히스토리 데이터 가져오기 (2일전, 어제, 오늘)
// // 매개변수 이름을 uid로 바꿨다. userId(computed)와 이름이 겹쳐 헷갈리는 것을 막기 위함
const fetchWardrobeHistory = async (uid) => {
  try {
    const pastTemperatureHistory = [
      { date: '2 days ago', temperature: currentTemperature.value - 2 },
      { date: 'yesterday', temperature: currentTemperature.value }
    ]

    // 오늘은 현재 위경도 기반으로 Weather Service를 연동한 추천을 바로 받아온다 (MSA 방식)
    const [pastHistoryData, todayClothes] = await Promise.all([
      wardrobeApi.getWardrobeHistory(uid, pastTemperatureHistory),
      wardrobeApi.getRecommendedClothesByCoordinates(
        uid,
        currentCoordinates.value.lat,
        currentCoordinates.value.lon
      )
    ])

    const historyData = [
      ...pastHistoryData,
      { date: 'today', temperature: currentTemperature.value, clothes: todayClothes }
    ]

    wardrobeHistory.value = wardrobeHistory.value.map((item, index) => ({
      ...item,
      temperature: historyData[index]?.temperature ?? item.temperature,
      clothes: historyData[index]?.clothes || []
    }))

    console.log('옷장 히스토리 로드 성공:', historyData)
  } catch (error) {
    console.error('옷장 히스토리 로드 실패:', error)
  }
}

// 컴포넌트 마운트 시 날씨 데이터 로드
onMounted(async () => {
  try {
    // 1. 사용자 현재 위치 (Geolocation API)
    const userLocation = await getCurrentPosition()
    console.log('사용자 위치:', userLocation)

    // 2. 위치 기반 날씨 조회
    await fetchWeatherData(userLocation)

    // 3. 서버에 저장된 알림 설정 동기화
    await syncNotificationLocation()

    // 4. 옷장 히스토리 로드
    await fetchWardrobeHistory(userId.value)
  } catch (error) {
    // 위치 가져오기 실패 시 기본 위치 사용
    console.error('위치 정보 접근 실패, 기본 위치 사용:', error)
    await fetchWeatherData('서울')
    await fetchWardrobeHistory(userId.value)
  }

  // 10분마다 날씨 갱신
  weatherTimer = setInterval(async () => {
    try {
      const userLocation = await getCurrentPosition()
      await fetchWeatherData(userLocation)
    } catch (error) {
      await fetchWeatherData('서울')
    }
  }, 600000)
})

// // 원래 코드에는 없던 정리 코드. 페이지를 떠난 뒤에도 10분마다 요청이 계속 나가는 것을 막는다
onBeforeUnmount(() => {
  if (weatherTimer) clearInterval(weatherTimer)
})
</script>

<style scoped>
.weather-wardrobe-container {
  display: flex;
  height: 100vh;
  height: 100dvh; /* 모바일 주소창 높이 변화 대응 */
  width: 100%; /* 100vw는 세로 스크롤바/모바일에서 가로 넘침 유발 */
  overflow: hidden;

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
  min-width: 0; /* flex 자식이 내용 때문에 화면 밖으로 늘어나는 것 방지 */
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
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
  object-fit: cover;   /* // 추가: img에 직접 걸어야 비율이 유지된다 */
  display: block;      /* // img에는 flex가 의미 없어서 block으로 바꾼다 */
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

.notification-box button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 999px;
  background: #4A90E2;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.notification-box button:hover {
  background: #3a7bc8;
}

.notification-box button:active {
  transform: scale(0.97);
}

/* 꺼짐 상태 */
.notification-box button.off {
  background: #e5e7eb;
  color: #666;
}

.notification-box button.off:hover {
  background: #d5d8dd;
}

.notification-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.notification-box button.sample {
  background: #2e9e6b;
}

.notification-box button.sample:hover:not(:disabled) {
  background: #25805a;
}

.notification-box button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  
  
  .nav-item {
    width: 40px;
    height: 40px;
  }
  
  .content-wrapper {
    padding: 20px 16px;
  }

  .main-title {
    font-size: 32px;
    margin-top: 20px;
    margin-bottom: 24px;
  }

  .notification-box button {
    padding: 8px 14px;
    font-size: 13px;
  }

  .current-weather-card {
    max-width: none;
    min-width: 0;
    padding: 16px 20px;
  }

  .temperature {
    font-size: 40px;
  }

  /* 카드 3장이 한 줄에 찌그러지지 않도록 가로 스크롤 */
  .wardrobe-history {
    overflow-x: auto;
    padding: 8px 4px 12px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .wardrobe-card {
    flex: 0 0 70%;
    min-width: 0;
    padding: 14px;
    scroll-snap-align: start;
  }

  .wardrobe-card:hover {
    transform: none;
  }

  .detail-card {
    padding: 16px;
  }

  .detail-value {
    font-size: 26px;
  }
}
</style>
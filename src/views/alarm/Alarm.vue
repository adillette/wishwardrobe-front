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
          <h1 class="time">9:00 am</h1>
          <p class="weather-condition">Sunny morning</p>
          
          <!-- SVG 태양 아이콘 직접 작성 -->
          <div class="sun-icon">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="25" fill="#FFD700"/>
              <g stroke="#FFD700" stroke-width="3" stroke-linecap="round">
                <line x1="60" y1="15" x2="60" y2="25"/>
                <line x1="60" y1="95" x2="60" y2="105"/>
                <line x1="15" y1="60" x2="25" y2="60"/>
                <line x1="95" y1="60" x2="105" y2="60"/>
                <line x1="25.86" y1="25.86" x2="32.93" y2="32.93"/>
                <line x1="87.07" y1="87.07" x2="94.14" y2="94.14"/>
                <line x1="25.86" y1="94.14" x2="32.93" y2="87.07"/>
                <line x1="87.07" y1="32.93" x2="94.14" y2="25.86"/>
              </g>
            </svg>
          </div>
          
          <h2 class="temperature">15°C</h2>
          
          <div class="temperature-cards">
            <div class="temp-card yesterday">
              <h3>Yesterday</h3>
              <div class="temp-card-content">
                <div class="temp-icon">
                  <!-- SVG 비 아이콘 -->
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M38 18c0-9.4-7.6-17-17-17S4 8.6 4 18c0 4.4 1.7 8.4 4.4 11.4" stroke="#4A9782" stroke-width="2" fill="#4A9782" opacity="0.7"/>
                    <path d="M46 22c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 2.2.9 4.2 2.3 5.7" stroke="#4A9782" stroke-width="2" fill="#4A9782" opacity="0.7"/>
                    <line x1="16" y1="32" x2="14" y2="38" stroke="#4A9782" stroke-width="2"/>
                    <line x1="24" y1="34" x2="22" y2="40" stroke="#4A9782" stroke-width="2"/>
                    <line x1="32" y1="32" x2="30" y2="38" stroke="#4A9782" stroke-width="2"/>
                  </svg>
                </div>
                <div class="temp-details">
                  <p>High 10°c</p>
                  <p>Low 5°c</p>
                </div>
              </div>
            </div>
            
            <div class="temp-card today">
              <h3>Today</h3>
              <div class="temp-card-content">
                <div class="temp-icon">
                  <!-- SVG 번개 아이콘 -->
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 5L12 25h8l-8 20 18-20h-8l8-20z" fill="#FFD700"/>
                  </svg>
                </div>
                <div class="temp-details">
                  <p>High 20°c</p>
                  <p>Low 11°c</p>
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
                  <img src="/images/여성상의3.png" alt="흰색 블라우스" class="clothing-image" />
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
                <img src="/images/bag.png" alt="검은색 가방" class="clothing-image" />
              </div>
            </div>
            
            <div class="bottom-container">
              <h2 class="section-title">Bottom</h2>
              <div class="bottom-item">
                <!-- 실제 하의 이미지 -->
                <img src="/images/pants2.png" alt="청바지" class="clothing-image" />
              </div>
            </div>
          </div>
        </div>

        <!-- 날씨 예보 영역 (하단 1 비율) - 개별 카드 형태로 수정 -->
        <div class="forecast-area">
          <div class="forecast">
            <div v-for="(day, index) in forecast" :key="index" class="forecast-day-card">
              <p class="day-name">{{ day.name }}</p>
              <div class="forecast-icon">
                <!-- 개선된 날씨 아이콘들 -->
                <svg v-if="day.name === 'Sun'" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="12" fill="#FFD700"/>
                  <g stroke="#FFD700" stroke-width="3" stroke-linecap="round">
                    <line x1="25" y1="6" x2="25" y2="12"/>
                    <line x1="25" y1="38" x2="25" y2="44"/>
                    <line x1="6" y1="25" x2="12" y2="25"/>
                    <line x1="38" y1="25" x2="44" y2="25"/>
                    <line x1="10.86" y1="10.86" x2="15.51" y2="15.51"/>
                    <line x1="34.49" y1="34.49" x2="39.14" y2="39.14"/>
                    <line x1="10.86" y1="39.14" x2="15.51" y2="34.49"/>
                    <line x1="34.49" y1="15.51" x2="39.14" y2="10.86"/>
                  </g>
                </svg>
                <svg v-else-if="day.name === 'Mon'" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="18" r="8" fill="#FFD700"/>
                  <g stroke="#FFD700" stroke-width="2" stroke-linecap="round">
                    <line x1="30" y1="4" x2="30" y2="7"/>
                    <line x1="42" y1="18" x2="45" y2="18"/>
                  </g>
                  <path d="M8 25c0-6 5-11 11-11s11 5 11 11c0 2-1 4-2 5H10c-1-1-2-3-2-5z" fill="#6B9BD1" opacity="0.8"/>
                  <path d="M32 28c0-4 3-7 7-7s7 3 7 7c0 1-1 2-1 3H33c0-1-1-2-1-3z" fill="#6B9BD1" opacity="0.6"/>
                  <line x1="15" y1="35" x2="13" y2="40" stroke="#6B9BD1" stroke-width="2"/>
                  <line x1="25" y1="37" x2="23" y2="42" stroke="#6B9BD1" stroke-width="2"/>
                  <line x1="35" y1="35" x2="33" y2="40" stroke="#6B9BD1" stroke-width="2"/>
                </svg>
                <svg v-else-if="day.name === 'Tue'" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 20c0-8 6-14 14-14s14 6 14 14c0 3-1 5-2 7H12c-1-2-2-4-2-7z" fill="#87A8C7" opacity="0.9"/>
                  <path d="M32 25c0-5 4-9 9-9s9 4 9 9c0 2-1 3-1 4H33c0-1-1-2-1-4z" fill="#87A8C7" opacity="0.7"/>
                  <line x1="16" y1="32" x2="14" y2="38" stroke="#87A8C7" stroke-width="2"/>
                  <line x1="24" y1="34" x2="22" y2="40" stroke="#87A8C7" stroke-width="2"/>
                  <line x1="32" y1="32" x2="30" y2="38" stroke="#87A8C7" stroke-width="2"/>
                  <line x1="40" y1="33" x2="38" y2="39" stroke="#87A8C7" stroke-width="2"/>
                </svg>
                <svg v-else width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 20c0-8 6-14 14-14s14 6 14 14c0 3-1 5-2 7H10c-1-2-2-4-2-7z" fill="#87A8C7"/>
                  <path d="M30 25c0-5 4-9 9-9s9 4 9 9c0 2-1 3-1 4H31c0-1-1-2-1-4z" fill="#87A8C7" opacity="0.8"/>
                  <line x1="14" y1="32" x2="12" y2="38" stroke="#87A8C7" stroke-width="3"/>
                  <line x1="22" y1="34" x2="20" y2="40" stroke="#87A8C7" stroke-width="3"/>
                  <line x1="30" y1="32" x2="28" y2="38" stroke="#87A8C7" stroke-width="3"/>
                  <line x1="38" y1="33" x2="36" y2="39" stroke="#87A8C7" stroke-width="3"/>
                  <line x1="18" y1="36" x2="16" y2="42" stroke="#87A8C7" stroke-width="3"/>
                  <line x1="26" y1="38" x2="24" y2="44" stroke="#87A8C7" stroke-width="3"/>
                  <line x1="34" y1="36" x2="32" y2="42" stroke="#87A8C7" stroke-width="3"/>
                </svg>
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
import { ref, onMounted, h } from 'vue'
import { defineOptions } from 'vue'
// 컴포넌트 이름 설정
defineOptions({
  name: 'WhatToWearApp'
})

// 반응형 데이터 정의
const isModalOpen = ref(false) // 모달 열림/닫힘 상태
const searchQuery = ref('') // 검색어
const currentOutfitIndex = ref(0) // 현재 선택된 의상 인덱스

// 의상 목록 데이터
const outfits = ref([
  { name: '베이지 스웨터', type: 'sweater' },
  { name: '블루 셔츠', type: 'shirt' },
  { name: '그레이 후디', type: 'hoodie' }
])

// 현재 선택된 의상 정보 - computed 대신 ref로 관리
const currentOutfit = ref({
  topName: '베이지 스웨터',
  bottomName: '그레이 팬츠',
  accessoryName: '블루 캡'
})

// 날씨 예보 데이터
const forecast = ref([
  { name: 'Sun', high: 15, low: 8 },
  { name: 'Mon', high: 12, low: 7 },
  { name: 'Tue', high: 9, low: 7 },
  { name: 'Wed', high: 8, low: 4 }
])

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
  if (currentOutfitIndex.value > 0) {
    currentOutfitIndex.value--
  } else {
    currentOutfitIndex.value = outfits.value.length - 1
  }
  updateCurrentOutfit()
}

const nextOutfit = () => {
  if (currentOutfitIndex.value < outfits.value.length - 1) {
    currentOutfitIndex.value++
  } else {
    currentOutfitIndex.value = 0
  }
  updateCurrentOutfit()
}

const updateCurrentOutfit = () => {
  const outfit = outfits.value[currentOutfitIndex.value]
  currentOutfit.value.topName = outfit.name
}

const selectCategory = (categoryName) => {
  console.log(`선택된 카테고리: ${categoryName}`) // 카테고리 선택 로직 구현 예정
}

// 컴포넌트 마운트 시 실행
onMounted(() => {
  console.log('옷장 앱이 마운트되었습니다') // 앱 초기화 완료 로그
})
</script>

<style scoped>
/* 업로드된 색상 팔레트 적용 */
:root {
  --primary-dark: #004030;   /* 진한 녹색 */
  --primary-medium: #4A9782; /* 중간 녹색 */
  --primary-beige: #DCD0A8;  /* 베이지 */
  --primary-ivory: #FFF9E5;  /* 아이보리 */
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
<template>
  <div class="wardrobe-container">
    <!-- 왼쪽 큰 이미지 섹션 -->
    <div class="main-image-section">
      <div class="main-image-wrapper">
        <img 
          :src="selectedItem?.image || defaultImage" 
          :alt="selectedItem?.name || 'Wardrobe item'"
          class="main-image"
        />
      </div>
    </div>

    <!-- 오른쪽 컨텐츠 섹션 -->
    <div class="content-section">
      <!-- 헤더 -->
      <div class="header">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          <span>wishwardrobe</span>
        </div>
      </div>

      <!-- 타이틀 -->
      <div class="title-section">
        <div>
          <p class="greeting">Go fresh.</p>
          <h1 class="main-title">The world of<br>your style</h1>
        </div>
        <p class="subtitle">
          Discover everything you need to<br>
          know about your perfect look.<br>
          Trust them to brighten and they will<br>
          never let you down.
        </p>
      </div>

      <!-- 카테고리 아이콘 -->
      <div class="category-icons">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectCategory(category.id)"
          :class="['category-btn', { active: selectedCategory === category.id }]"
          :title="category.name"
        >
          <component :is="category.icon" />
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>

      <!-- 옷 갤러리 (캐러셀) -->
      <div class="gallery-container">
        <button 
          class="nav-btn prev" 
          @click="prevSlide"
          :disabled="currentSlide === 0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        <div class="gallery-wrapper">
          <div 
            class="gallery-track"
            :style="{ transform: `translateX(-${currentSlide * slideWidth}%)` }"
          >
            <div 
              v-for="item in filteredItems" 
              :key="item.id"
              class="gallery-item"
              @click="selectItem(item)"
            >
              <div class="item-image-wrapper">
                <img :src="item.image" :alt="item.name" />
                <div class="item-info">
                  <h3>{{ item.name }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          class="nav-btn next" 
          @click="nextSlide"
          :disabled="currentSlide >= maxSlide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>

      <!-- 하단 타임라인 정보 -->
      <div class="timeline">
        <span class="date">{{ currentDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { defineOptions
  
 } from 'vue'
// 컴포넌트 이름
defineOptions({
  name: 'Wardrobe'
})

// ✅ SVG 아이콘 컴포넌트
const TopIcon = () => h('svg', {
  width: '28',
  height: '28',
  viewBox: '0 0 24 24',
  fill: 'currentColor'
}, [
  h('path', { d: 'M16 20H8V8h8v12zm-1-11H9v10h6V9zm4-5v2H5V4h14z' })
])

const BottomIcon = () => h('svg', {
  width: '28',
  height: '28',
  viewBox: '0 0 24 24',
  fill: 'currentColor'
}, [
  h('path', { d: 'M16 4h2v16h-2v-7h-4v7H8V4h2v7h4V4h2z' })
])

const HatIcon = () => h('svg', {
  width: '28',
  height: '28',
  viewBox: '0 0 24 24',
  fill: 'currentColor'
}, [
  h('path', { d: 'M12 2L4 7v3h16V7l-8-5zm8 18H4v-2h16v2z' })
])

// ✅ 카테고리 목록
const categories = [
  { id: 'top', name: 'Tops', icon: TopIcon },
  { id: 'bottom', name: 'Bottoms', icon: BottomIcon },
  { id: 'hat', name: 'Hats', icon: HatIcon }
]

// ✅ 선택된 카테고리
const selectedCategory = ref('top')

// ✅ 옷장 아이템 전체 데이터
const wardrobeItems = ref([
  { id: 1, name: 'Denim Jacket', category: 'top', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
  { id: 2, name: 'Floral Blouse', category: 'top', image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400' },
  { id: 3, name: 'White Dress Shirt', category: 'top', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400' },
  { id: 4, name: 'Floral Dress', category: 'top', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
  { id: 5, name: 'Blue Jeans', category: 'bottom', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
  { id: 6, name: 'Black Pants', category: 'bottom', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400' },
  { id: 7, name: 'Khaki Pants', category: 'bottom', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400' },
  { id: 8, name: 'Yellow Sun Hat', category: 'hat', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' },
  { id: 9, name: 'Baseball Cap', category: 'hat', image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400' },
  { id: 10, name: 'Beanie', category: 'hat', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400' }
])

// ✅ 기본 이미지
const defaultImage = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'

// ✅ 선택된 아이템
const selectedItem = ref(wardrobeItems.value[0])

// ✅ 캐러셀 상태
const currentSlide = ref(0)
const itemsPerSlide = 3
const slideWidth = 33.333

// ✅ 날짜 계산
const currentDate = computed(() => {
  const now = new Date()
  return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
})

// ✅ 선택된 카테고리의 아이템 필터링
const filteredItems = computed(() => {
  return wardrobeItems.value.filter(
    item => item.category === selectedCategory.value
  )
})

// ✅ 최대 슬라이드
const maxSlide = computed(() => {
  return Math.max(0, Math.ceil(filteredItems.value.length / itemsPerSlide) - 1)
})

// ✅ 카테고리 선택
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentSlide.value = 0

  const filtered = wardrobeItems.value.filter(
    item => item.category === categoryId
  )

  if (filtered.length > 0) {
    selectedItem.value = filtered[0]
  }
}

// ✅ 아이템 선택
const selectItem = (item) => {
  selectedItem.value = item
}

// ✅ 캐러셀 이동
const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--
}

const nextSlide = () => {
  if (currentSlide.value < maxSlide.value) currentSlide.value++
}
</script>


<style scoped>

.wardrobe-container {
  display: flex;
  height: 100vh;
  background: #FFFEF3; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}


.main-image-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
}


.main-image-wrapper {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 3/4;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(5, 69, 54, 0.1); /* 부드러운 그림자 */
  transition: transform 0.3s ease;
}

.main-image-wrapper:hover {
  transform: translateY(-8px); /* 호버 시 살짝 위로 이동 */
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.content-section {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  background: #FFFEF3; /* 아이보리 배경 */
}


.header {
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #054536; /* 진한 녹색 */
}


.title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 50px;
}


.greeting {
  font-size: 18px;
  color: #4A8782; /* 청록색 */
  margin: 0 0 8px 0;
  font-weight: 500;
}


.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #054536; /* 진한 녹색 */
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.5px;
}


.subtitle {
  font-size: 14px;
  color: #7a7a7a;
  line-height: 1.8;
  margin: 0;
  text-align: right;
  max-width: 280px;
}


.category-icons {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.category-btn {
  padding: 16px 24px;
  border: 2px solid #DCD6A8; /* 베이지 테두리 */
  background: white;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  color: #054536; /* 진한 녹색 텍스트 */
  font-weight: 500;
  font-size: 14px;
}

.category-btn:hover {
  border-color: #4A8782; /* 호버 시 청록색 테두리 */
  background: #f8f8f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 69, 54, 0.1);
}


.category-btn.active {
  border-color: #054536; /* 진한 녹색 테두리 */
  background: #054536; /* 진한 녹색 배경 */
  color: white;
  box-shadow: 0 4px 16px rgba(5, 69, 54, 0.2);
}

.category-name {
  font-size: 14px;
}

.gallery-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}


.nav-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: #4A8782; /* 청록색 배경 */
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  z-index: 10;
  color: white;
}

.nav-btn:hover:not(:disabled) {
  background: #054536; /* 호버 시 진한 녹색 */
  transform: scale(1.1);
}

.nav-btn:disabled {
  background: #DCD6A8; /* 비활성 시 베이지 */
  cursor: not-allowed;
  opacity: 0.5;
}


.gallery-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 16px;
}


.gallery-track {
  display: flex;
  gap: 16px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); /* 부드러운 트랜지션 */
}


.gallery-item {
  min-width: calc(33.333% - 11px); /* 3개씩 보이도록 설정 */
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-6px); /* 호버 시 살짝 위로 */
}


.item-image-wrapper {
  width: 100%;
  aspect-ratio: 3/4;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(5, 69, 54, 0.08);
  position: relative;
}

.item-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.item-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(5, 69, 54, 0.9), transparent);
}

.item-info h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: white;
}


.timeline {
  padding-top: 20px;
  border-top: 1px solid #DCD6A8; /* 베이지 구분선 */
}

.date {
  font-size: 32px;
  font-weight: 700;
  color: #054536; /* 진한 녹색 */
  letter-spacing: 2px;
}


@media (max-width: 1200px) {
  .wardrobe-container {
    flex-direction: column;
  }

  .main-image-section {
    min-height: 400px;
    padding: 40px;
  }

  .content-section {
    padding: 40px;
  }

  .main-title {
    font-size: 36px;
  }

  .gallery-item {
    min-width: calc(50% - 8px); /* 2개씩 보이도록 변경 */
  }
}


@media (max-width: 768px) {
  .content-section {
    padding: 30px;
  }

  .main-title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 12px;
  }

  .category-btn {
    padding: 12px 16px;
    font-size: 12px;
  }

  .gallery-item {
    min-width: 100%; /* 1개씩 보이도록 변경 */
  }

  .nav-btn {
    width: 36px;
    height: 36px;
  }

  .date {
    font-size: 24px;
  }
}
</style>
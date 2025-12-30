<template>
  <div class="wardrobe-container">
    <!-- 왼쪽 큰 이미지 섹션 -->
    <div class="main-image-section">
      <div class="main-image-wrapper">
        <img 
          :src="selectedItem?.imageUrl || defaultImage" 
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
              :key="item.clothesId"
              class="gallery-item"
              @click="selectItem(item)"
            >
              <div class="item-image-wrapper">
                <img :src="item.imageUrl || defaultImage" :alt="item.name" />
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

    <!-- 옷 등록 모달 -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>

          <div class="modal-body">
            <!-- 왼쪽: 이미지 프리뷰 -->
            <div class="modal-left">
              <div class="image-preview-section">
                <div v-if="previewImage" class="preview-wrapper">
                  <img :src="previewImage" alt="Preview" />
                </div>
                <div v-else class="preview-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <p>이미지를 선택해주세요</p>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="file-input"
                />
                <button @click="triggerFileInput" class="upload-btn">
                  이미지 선택
                </button>
              </div>
            </div>

            <!-- 오른쪽: 폼 -->
            <div class="modal-right">
              <h2 class="modal-title">옷 등록하기</h2>
              <p class="modal-subtitle">새로운 옷을 옷장에 추가하세요</p>

              <form @submit.prevent="handleSubmit" class="add-form">
                <!-- 옷 이름 -->
                <div class="form-group">
                  <label for="clothingName">옷 이름</label>
                  <input
                    id="clothingName"
                    v-model="formData.name"
                    type="text"
                    placeholder="예: 데님 재킷"
                    required
                  />
                </div>

                <!-- 카테고리 -->
                <div class="form-group">
                  <label for="category">카테고리</label>
                  <select id="category" v-model="formData.category" required>
                    <option value="" disabled>선택해주세요</option>
                    <option value="TOP">상의 (Tops)</option>
                    <option value="BOTTOM">하의 (Bottoms)</option>
                    <option value="OUTER">겉옷 (Outer)</option>
                    <option value="ACCESSORY">액세서리 (Accessory)</option>
                  </select>
                </div>

                <!-- 온도 범위 -->
                <div class="form-group">
                  <label for="tempRange">착용 온도</label>
                  <select id="tempRange" v-model="formData.tempRange" required>
                    <option value="" disabled>선택해주세요</option>
                    <option value="VERY_COLD">매우 추움 (-30°C ~ 4°C)</option>
                    <option value="COLD">추움 (5°C ~ 8°C)</option>
                    <option value="COOL">쌀쌀함 (9°C ~ 11°C)</option>
                    <option value="MILD">선선함 (12°C ~ 16°C)</option>
                    <option value="WARM">따뜻함 (17°C ~ 19°C)</option>
                    <option value="HOT">더움 (20°C ~ 22°C)</option>
                    <option value="VERY_HOT">매우 더움 (23°C ~ 27°C)</option>
                    <option value="EXTREME_HOT">극심하게 더움 (28°C ~ 39°C)</option>
                  </select>
                </div>

                <!-- 에러 메시지 -->
                <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </div>

                <!-- 버튼 -->
                <div class="form-actions">
                  <button type="button" @click="closeModal" class="btn-cancel">
                    취소
                  </button>
                  <button type="submit" class="btn-submit" :disabled="isSubmitting">
                    {{ isSubmitting ? '저장 중...' : '저장하기' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 플로팅 추가 버튼 -->
    <button class="fab" @click="openAddModal" title="옷 추가하기">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted } from 'vue'
import { defineOptions } from 'vue'
import wardrobeApi from '@/apis/wardrobeApi'

// 컴포넌트 이름
defineOptions({
  name: 'Wardrobe'
})

// 사용자 ID (localStorage에서 가져오기, 없으면 1)
const userId = ref(parseInt(localStorage.getItem('userId') || '1'))

// SVG 아이콘 컴포넌트
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

// 카테고리 목록 (백엔드 enum 값과 일치)
const categories = [
  { id: 'TOP', name: 'Tops', icon: TopIcon },
  { id: 'BOTTOM', name: 'Bottoms', icon: BottomIcon },
  { id: 'ACCESSORY', name: 'Accessories', icon: HatIcon }
]

// 선택된 카테고리
const selectedCategory = ref('TOP')

// 옷장 아이템 전체 데이터 (백엔드에서 로드)
const wardrobeItems = ref([])
const isLoading = ref(false)

// 기본 이미지
const defaultImage = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'

// 선택된 아이템
const selectedItem = ref(null)

// 캐러셀 상태
const currentSlide = ref(0)
const itemsPerSlide = 3
const slideWidth = 33.333

// 날짜 계산
const currentDate = computed(() => {
  const now = new Date()
  return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
})

// 선택된 카테고리의 아이템 필터링
const filteredItems = computed(() => {
  return wardrobeItems.value.filter(
    item => item.category === selectedCategory.value
  )
})

// 최대 슬라이드
const maxSlide = computed(() => {
  return Math.max(0, Math.ceil(filteredItems.value.length / itemsPerSlide) - 1)
})

// 카테고리 선택
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

// 아이템 선택
const selectItem = (item) => {
  selectedItem.value = item
}

// 캐러셀 이동
const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--
}

const nextSlide = () => {
  if (currentSlide.value < maxSlide.value) currentSlide.value++
}

// 백엔드에서 옷 목록 가져오기
const fetchClothes = async () => {
  isLoading.value = true
  try {
    const clothes = await wardrobeApi.getClothesByUserId(userId.value)
    wardrobeItems.value = clothes
    
    // 첫 번째 아이템을 선택된 아이템으로 설정
    if (clothes.length > 0) {
      const firstInCategory = clothes.find(c => c.category === selectedCategory.value)
      selectedItem.value = firstInCategory || clothes[0]
    }
  } catch (error) {
    console.error('옷 목록 로드 실패:', error)
    alert('옷 목록을 불러오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

// 모달 상태
const showAddModal = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const previewImage = ref(null)
const fileInput = ref(null)

// 폼 데이터
const formData = ref({
  name: '',
  category: '',
  tempRange: '',
  imageFile: null
})

// 모달 열기/닫기
const openAddModal = () => {
  showAddModal.value = true
  resetForm()
}

const closeModal = () => {
  showAddModal.value = false
  resetForm()
}

// 폼 리셋
const resetForm = () => {
  formData.value = {
    name: '',
    category: '',
    tempRange: '',
    imageFile: null
  }
  previewImage.value = null
  errorMessage.value = ''
  isSubmitting.value = false
}

// 이미지 업로드 트리거
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 이미지 선택 처리
const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // 이미지 파일 검증
  if (!file.type.startsWith('image/')) {
    errorMessage.value = '이미지 파일만 업로드 가능합니다'
    return
  }

  // 파일 크기 검증 (5MB 제한)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = '이미지 크기는 5MB 이하여야 합니다'
    return
  }

  formData.value.imageFile = file
  errorMessage.value = ''

  // 프리뷰 생성
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result
  }
  reader.readAsDataURL(file)
}

// 폼 제출 (백엔드 API 호출)
const handleSubmit = async () => {
  // 이미지 필수 체크
  if (!formData.value.imageFile) {
    errorMessage.value = '이미지를 선택해주세요'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // 백엔드로 전송할 데이터 (base64 이미지 URL 사용)
    const clothesData = {
      userId: userId.value,
      name: formData.value.name,
      category: formData.value.category,
      tempRange: formData.value.tempRange,
      imageUrl: previewImage.value // base64 DataURL
    }

    // 백엔드 API 호출
    await wardrobeApi.addClothes(clothesData)
    
    // 성공 후 처리
    alert('옷이 성공적으로 등록되었습니다!')
    
    // 목록 다시 로드
    await fetchClothes()
    
    closeModal()

  } catch (error) {
    console.error('옷 등록 실패:', error)
    errorMessage.value = error.response?.data?.message || '등록 중 오류가 발생했습니다'
  } finally {
    isSubmitting.value = false
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchClothes()
})
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

/* ============================================ */
/* 플로팅 액션 버튼 (FAB) */
/* ============================================ */
.fab {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #054536;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(5, 69, 54, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;
}

.fab:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 30px rgba(5, 69, 54, 0.4);
  background: #043529;
}

/* ============================================ */
/* 모달 오버레이 */
/* ============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ============================================ */
/* 모달 컨텐츠 */
/* ============================================ */
.modal-content {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ============================================ */
/* 닫기 버튼 */
/* ============================================ */
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  color: #666;
}

.modal-close:hover {
  background: #e0e0e0;
  transform: rotate(90deg);
}

/* ============================================ */
/* 모달 바디 (좌우 분할) */
/* ============================================ */
.modal-body {
  display: flex;
  height: 600px;
}

/* ============================================ */
/* 왼쪽: 이미지 프리뷰 섹션 */
/* ============================================ */
.modal-left {
  flex: 1;
  background: #f8f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.image-preview-section {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-wrapper {
  width: 100%;
  aspect-ratio: 3/4;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(5, 69, 54, 0.1);
}

.preview-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  width: 100%;
  aspect-ratio: 3/4;
  background: white;
  border: 2px dashed #DCD6A8;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.preview-placeholder svg {
  color: #DCD6A8;
  margin-bottom: 12px;
}

.preview-placeholder p {
  margin: 0;
  font-size: 14px;
}

.file-input {
  display: none;
}

.upload-btn {
  width: 100%;
  padding: 14px;
  background: white;
  border: 2px solid #4A8782;
  border-radius: 12px;
  color: #4A8782;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #4A8782;
  color: white;
}

/* ============================================ */
/* 오른쪽: 폼 섹션 */
/* ============================================ */
.modal-right {
  flex: 1;
  padding: 50px;
  overflow-y: auto;
}

.modal-title {
  font-size: 32px;
  font-weight: 700;
  color: #054536;
  margin: 0 0 8px 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #7a7a7a;
  margin: 0 0 40px 0;
}

/* ============================================ */
/* 폼 스타일 */
/* ============================================ */
.add-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #054536;
}

.form-group input,
.form-group select {
  padding: 14px 16px;
  border: 2px solid #DCD6A8;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
  color: #333;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4A8782;
  box-shadow: 0 0 0 3px rgba(74, 135, 130, 0.1);
}

.form-group select {
  cursor: pointer;
}

/* ============================================ */
/* 에러 메시지 */
/* ============================================ */
.error-message {
  padding: 12px 16px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 14px;
}

/* ============================================ */
/* 버튼 영역 */
/* ============================================ */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: #054536;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #043529;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 69, 54, 0.2);
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* ============================================ */
/* 모달 반응형 */
/* ============================================ */
@media (max-width: 968px) {
  .modal-body {
    flex-direction: column;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-left,
  .modal-right {
    padding: 30px;
  }

  .fab {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
}
</style>
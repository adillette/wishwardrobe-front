<template>
  <header class="app-header" v-if="!hideHeader">
    <div class="header-container">
      <!-- 로고/브랜드 (선택사항) -->
      <div class="header-brand">
        <router-link to="/main" class="brand-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          <span class="brand-text">WishWardrobe</span>
        </router-link>
      </div>

      <!-- 네비게이션 메뉴 -->
      <nav class="header-nav">
        <router-link 
          to="/main" 
          class="nav-link"
          active-class="active"
        >
          main
        </router-link>
        
        <span class="nav-separator">|</span>
        
        <router-link 
          to="/weather" 
          class="nav-link"
          active-class="active"
        >
          weather
        </router-link>
        
        <span class="nav-separator">|</span>
        
        <router-link 
          to="/wardrobe" 
          class="nav-link"
          active-class="active"
        >
          wardrobe
        </router-link>
        
        <span class="nav-separator">|</span>

        <router-link 
          to="/alarm" 
          class="nav-link"
          active-class="active"
        >
          alarm
        </router-link>
        
        <span class="nav-separator">|</span>

        <router-link 
          v-if="!isLoggedIn"
          to="/login" 
          class="nav-link"
          active-class="active"
        >
          login
        </router-link>

        <!-- 로그인 상태일 때 -->
        <div v-else class="user-menu">
          <button @click="toggleUserDropdown" class="user-button">
            <span>{{ username }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>

          <!-- 드롭다운 메뉴 -->
          <div v-if="showUserDropdown" class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
              </svg>
              Profile
            </router-link>
            <router-link to="/settings" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
              </svg>
              Settings
            </router-link>
            <div class="dropdown-divider"></div>
            <button @click="handleLogout" class="dropdown-item logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'AppHeader',
  setup() {
    const route = useRoute();
    const router = useRouter();

    //** 헤더 표시 여부
    const hideHeader = computed(() => route.meta.hideHeader || false);

    //** 로그인 상태
    const isLoggedIn = ref(false);
    const username = ref('');
    
    //** 사용자 드롭다운 메뉴 표시 여부
    const showUserDropdown = ref(false);

    //** 로그인 상태 체크
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem('authToken');
      const storedUsername = localStorage.getItem('username');
      
      if (authToken) {
        isLoggedIn.value = true;
        username.value = storedUsername || 'User';
      } else {
        isLoggedIn.value = false;
        username.value = '';
      }
    };

    //** 사용자 드롭다운 토글
    const toggleUserDropdown = () => {
      showUserDropdown.value = !showUserDropdown.value;
    };

    //** 드롭다운 외부 클릭 시 닫기
    const closeDropdown = (event) => {
      if (!event.target.closest('.user-menu')) {
        showUserDropdown.value = false;
      }
    };

    //** 로그아웃 처리
    const handleLogout = () => {
      //** 로컬 스토리지에서 인증 정보 제거
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      
      //** 상태 업데이트
      isLoggedIn.value = false;
      username.value = '';
      showUserDropdown.value = false;
      
      //** 로그인 페이지로 이동
      router.push('/login');
      
      console.log('로그아웃 완료');
    };

    //** 컴포넌트 마운트 시
    onMounted(() => {
      checkAuthStatus();
      document.addEventListener('click', closeDropdown);
      
      //** 로그인 상태 변경 감지 (다른 탭에서 로그인/로그아웃 시)
      window.addEventListener('storage', checkAuthStatus);
    });

    //** 컴포넌트 언마운트 시
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
      window.removeEventListener('storage', checkAuthStatus);
    });

    return {
      hideHeader,
      isLoggedIn,
      username,
      showUserDropdown,
      toggleUserDropdown,
      handleLogout
    };
  }
};
</script>

<style scoped>

.app-header {
  position: fixed;
  top: 0;
  left: 80px;  
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 999;
  display: flex;
  align-items: center;
}

.header-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 18px;
  transition: color 0.3s ease;
}

.brand-link:hover {
  color: #4A90E2;
}

.brand-text {
  display: none; 
}

@media (min-width: 768px) {
  .brand-text {
    display: inline;
  }
}


.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #333;
  background: rgba(0, 0, 0, 0.05);
}

.nav-link.active {
  color: #4A90E2;
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #4A90E2;
}

.nav-separator {
  color: #ddd;
  font-size: 14px;
}


.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 8px 0;
}

.logout-btn {
  color: #e74c3c;
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 0.1);
}


@media (max-width: 768px) {
  .app-header {
    left: 60px; 
    height: 50px;
  }

  .header-container {
    padding: 0 20px;
  }

  .header-brand {
    display: none;  
  }

  .nav-link {
    font-size: 13px;
    padding: 6px 8px;
  }

  .nav-separator {
    font-size: 12px;
  }

  .user-button {
    font-size: 13px;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .nav-link {
    font-size: 12px;
    padding: 4px 6px;
  }

  .nav-separator {
    margin: 0 2px;
  }
}
</style>
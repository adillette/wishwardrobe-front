<template>
  <aside class="sidebar">
    <nav class="nav-menu">
      // 프로필 -->
      <router-link 
        to="/profile" 
        class="nav-item"
        active-class="active"
        title="Profile"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
        </svg>
      </router-link>

      // 메인 (그리드) -->
      <router-link 
        to="/main" 
        class="nav-item"
        active-class="active"
        title="Main"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="8" height="8"/>
          <rect x="13" y="3" width="8" height="8"/>
          <rect x="3" y="13" width="8" height="8"/>
          <rect x="13" y="13" width="8" height="8"/>
        </svg>
      </router-link>

      // 통계 (차트) -->
      <router-link 
        to="/statistics" 
        class="nav-item"
        active-class="active"
        title="Statistics"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h2v7H3zm4-6h2v13H7zm4-2h2v15h-2zm4 4h2v11h-2zm4-5h2v16h-2z"/>
        </svg>
      </router-link>

      // 카드 -->
      <router-link 
        to="/wardrobe" 
        class="nav-item"
        active-class="active"
        title="Wardrobe"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
        </svg>
      </router-link>

      // 날씨 (글로브) -->
      <router-link 
        to="/weather" 
        class="nav-item"
        active-class="active"
        title="Weather"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
      </router-link>

      // 설정 -->
      <router-link 
        to="/settings" 
        class="nav-item"
        active-class="active"
        title="Settings"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
        </svg>
      </router-link>

      // 뒤로가기 -->
      <button 
        @click="goBack" 
        class="nav-item"
        title="Go Back"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
    </nav>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'Sidebar',
  setup() {
    const router = useRouter();

    //뒤로가기 함수
    const goBack = () => {
      // 히스토리가 있으면 뒤로, 없으면 메인으로
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push('/main');
      }
    };

    return {
      goBack
    };
  }
};
</script>

<style scoped>

.sidebar {
  width: 80px;
  background: rgba(52, 73, 94, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
}


.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  align-items: center;
}


.nav-item {
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
}


.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateX(4px);
}


.nav-item.active {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}


.nav-item.active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: white;
  border-radius: 0 4px 4px 0;
}


button.nav-item {
  margin-top: auto;  
}


@media (max-width: 768px) {
  .sidebar {
    width: 60px;
    padding: 15px 0;
  }

  .nav-item {
    width: 40px;
    height: 40px;
  }

  .nav-menu {
    gap: 15px;
  }
}


@media (max-width: 1024px) {
  .sidebar {
    width: 70px;
  }
}
</style>
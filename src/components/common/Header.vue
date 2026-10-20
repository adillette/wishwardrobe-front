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
        <template v-else>
          <router-link
            to="/profile/edit"
            class="nav-link"
            active-class="active"
          >
            내 정보 수정
          </router-link>
          <span class="welcome">{{ userInfo?.userName || userInfo?.loginId }}님</span>
          <button class="logout-btn" @click="logout">로그아웃</button>
        </template>
      </nav>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import alarmApi from '@/apis/alarmApi';


export default {
  name: 'AppHeader',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    //** 헤더 표시 여부
    const hideHeader = computed(() => route.meta.hideHeader || false);

    //** 로그인 여부 / 유저 정보
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn']);
    const userInfo = computed(() => store.getters['user/userInfo']);

    //** 로그아웃 실행
    const logout =async() => {
      const endpoint = localStorage.getItem('pushEndpoint');
      const token = localStorage.getItem('fcmToken');
      try {
        if (endpoint) await alarmApi.unsubscribe({ endpoint });
        if (token) await alarmApi.unregisterFcmToken({ token });
      } catch (e) {
        // 해제에 실패해도 로그아웃은 진행한다
        console.error('푸시 해제 실패:', e);
      } finally {
        localStorage.removeItem('pushEndpoint');
        localStorage.removeItem('fcmToken');
        await store.dispatch('user/logout');
        router.push('/login');
      }
    };

    return {
      hideHeader,
      isLoggedIn,
      userInfo,
      logout
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


.welcome {
  color: #333;
  font-size: 15px;
  font-weight: 500;
}

.logout-btn {
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  color: #e74c3c;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
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

  .welcome,
  .logout-btn {
    font-size: 13px;
    padding: 6px 8px;
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
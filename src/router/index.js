import { createRouter, createWebHistory } from 'vue-router'

import weatherRouting from '@/router/weatherRouting'
import wardrobeRouting from '@/router/wardrobeRouting'
import alarmRouting from '@/router/alarmRouting'
import { tokenStorage } from '@/apis/axiosConfig'

const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/WeatherWardrobeMain.vue'),
    meta: { 
      title: '날씨',
      requiresAuth: true 
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { 
      title: '로그인',
      requiresAuth: false 
    }
  },
  {
    path: "/signup",
    name: "signup",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "signup" */ "../views/SignupView.vue"),
  },
  {
    path: '/profile/edit',
    name: 'profileEdit',
    component: () => import('../views/ProfileEditView.vue'),
    meta: {
      title: '내 정보 수정',
      requiresAuth: true
    }
  },
  ...weatherRouting,
  ...wardrobeRouting,
  ...alarmRouting
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const loggedIn = !!tokenStorage.get()

  // 로그인이 필요한 페이지인데 토큰이 없으면 로그인 화면으로
  if (to.meta.requiresAuth && !loggedIn) {
    return { name: 'login' }
  }
  // 이미 로그인했는데 로그인 페이지로 가려 하면 메인으로
  if (to.name === 'login' && loggedIn) {
    return { name: 'main' }
  }
})


export default router

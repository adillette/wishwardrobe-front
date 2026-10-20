import { createRouter, createWebHistory } from 'vue-router'

import weatherRouting from '@/router/weatherRouting'
import wardrobeRouting from '@/router/wardrobeRouting'
import alarmRouting from '@/router/alarmRouting'

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

export default router

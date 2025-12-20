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
    component: () => import('../views/WeatherWardrobeMain.vue'),
    meta: { 
      title: '로그인',
      requiresAuth: false 
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

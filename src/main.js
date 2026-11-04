import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/font.css'
import { listenForegroundMessages } from '@/utils/fcm'

createApp(App).use(router).use(store).mount('#app')

// 앱 마운트 이후
listenForegroundMessages()
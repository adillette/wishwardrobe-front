import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/font.css'

createApp(App).use(router).use(store).mount('#app')

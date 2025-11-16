
const weatherRouting = [

    {
    path: '/weather',
    name: 'weather-dashboard',
    component: () => import('../views/weather/Weather.vue'),
    meta: { 
      title: '날씨',
      requiresAuth: true 
    }
  },
 
  
]

export default weatherRouting

const alarmRouting = [
   {
    path: '/alarm',
    name: 'alarm',
    component: () => import('../views/alarm/Alarm.vue'),
    meta: { 
      title: '알람',
      requiresAuth: true 
    }
  }
  
]

export default alarmRouting
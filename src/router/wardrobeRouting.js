
const wardrobeRouting = [
  {
    path: '/wardrobe',
    name: 'wardrobe-list',
    component: () => import('../views/wardrobe/Wardrobe.vue'),
    meta: { 
      title: '옷장',
      requiresAuth: true 
    }
  },
 
  
]

export default wardrobeRouting
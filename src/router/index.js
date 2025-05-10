import { createRouter, createWebHistory } from 'vue-router'
import MapData from '@/views/home/index.vue'
import Navigate from '@/views/navigate/index.vue'
import Profile from '@/views/profile/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      
      children:[
        {
          path:'',
          component: MapData
        },
        {
          path:'navigate',
          component: Navigate
        },
        {
          path:'profile',
          component: Profile
        }
      ]
    }
  ],
})

export default router

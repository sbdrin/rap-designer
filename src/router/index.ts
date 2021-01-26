import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
 {
      path: '/perview',
      name: 'perview',
      component: () => import('@/views/preview/perview.view.vue')
    }
]

const router = new VueRouter({
  routes
})

export default router

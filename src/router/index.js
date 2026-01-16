import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import StockDetail from '../views/StockDetail.vue'
import Admin from '../views/Admin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/stock/:symbol',
    name: 'StockDetail',
    component: StockDetail,
    props: true
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


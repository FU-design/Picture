import Layout from '@/layout/index.vue'
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Layout,
  },
] as RouteRecordRaw[]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router

import Layout from '@/layout/index.vue'
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/view/home.vue'),
      },
    ],
  },
] as RouteRecordRaw[]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router

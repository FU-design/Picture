import Layout from '@/layout/index.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'HOME',
        component: () => import('@/view/home.vue'),
      },
      {
        path: 'notes',
        name: 'NOTES',
        component: () => import('@/view/notes.vue'),
      },
      {
        path: 'source',
        name: 'SOURCES',
        component: () => import('@/view/sources.vue'),
      },
    ],
  },
] as RouteRecordRaw[]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

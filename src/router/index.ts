import Layout from '@/layout/index.vue'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/view/home.vue'),
        meta: {
          menu: true,
          name: 'HOME',
        },
      },
      {
        path: 'notes',
        redirect: '/notes/all',
        children: [
          {
            path: 'all',
            name: 'NoteList',
            component: () => import('@/view/notes.vue'),
          },
          {
            path: ':tag/:title',
            name: 'NoteDetail',
            component: () => import('@/components/hoc/noteDetail'),
          },
        ],
        meta: {
          name: 'NOTES',
          menu: true,
        },
      },
      {
        path: 'components',
        redirect: '/components/all',
        children: [
          {
            path: 'all',
            name: 'componentList',
            component: () => import('@/view/components.vue'),
          },
        ],
        meta: {
          name: 'COMPONENTS',
          menu: true,
        },
      },
      {
        path: 'source',
        component: () => import('@/view/sources.vue'),
        meta: {
          name: 'SOURCES',
          menu: true,
        },
      },
    ],
  },
] as RouteRecordRaw[]

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
})

export default router

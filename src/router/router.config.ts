import Layout from '@/layout/index.vue'

const commonRoutes = [
  {
    path: '/not-found/:pathMatch(.*)*', // 通配符匹配所有路径
    name: 'NotFound',
    component: () => import('@/router/NotFound.vue'),
  },
]

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/components',
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
        name: 'Notes',
        redirect: '/notes/all',
        children: [
          {
            path: 'all',
            name: 'NoteList',
            component: () => import('@/view/notes.vue'),
          },
          // 动态路由占位页面（解决动态路由无法在router初始化之前加载完，导致路由无法匹配到路由页面）
          {
            path: '/notes/:tag/:filename',
            name: 'NoteFallback',
            component: () => import('@/router/NoteLoading.vue'),
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
  ...commonRoutes,
]

export default routes

import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './router.config'

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
})

export default router

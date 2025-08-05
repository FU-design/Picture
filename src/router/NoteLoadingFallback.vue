<script setup lang="ts">
import { useDynamicRoutes } from '@/stores/dynamic-routes'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const dynamicRoutesStore = useDynamicRoutes()

onMounted(() => {
  // 判断是否已加载了动态路由，若未加载，则重新加载，并通过路由参数匹配当前动态路由页面。
  if (!dynamicRoutesStore.hasLoadedDynamicRoutes) {
    dynamicRoutesStore.setupNotes(router)
    const params = route.params
    router.replace({ path: `/notes/${params.tag}/${params.filename}` })
  }
})
</script>

<template>
  <div>
    loading....
  </div>
</template>

<style scoped>

</style>

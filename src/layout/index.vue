<script setup lang="ts">
import LayoutHeader from '@/layout/header/index.vue'
import LayoutMain from '@/layout/main/index.vue'
</script>

<template>
  <div>
    <LayoutHeader />
    <LayoutMain>
      <RouterView :key="$route.fullPath" />
    </LayoutMain>
  </div>
</template>

<style scoped>
</style>

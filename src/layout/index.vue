<script setup lang="ts">
import LayoutHeader from '@/layout/layout-header/index.vue'
import LayoutMain from '@/layout/layout-main/index.vue'
</script>

<template>
  <div class="layout">
    <LayoutHeader />
    <LayoutMain>
      <RouterView />
    </LayoutMain>
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import PicTheme from '@/components/pic-theme/pic-theme.vue'
import LayoutHeader from '@/layout/layout-header/index.vue'
import LayoutMain from '@/layout/layout-main/index.vue'
</script>

<template>
  <div>
    <PicTheme />
    <LayoutHeader />
    <LayoutMain>
      <RouterView />
    </LayoutMain>
  </div>
</template>

<style scoped>
</style>

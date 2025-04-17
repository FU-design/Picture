<script setup lang="ts">
import BlogLogo from '@/components/hoc/blogLogo'
import PicButton from '@/components/PicButton/pic-button.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = computed(() => router.getRoutes().filter(v => v.meta.menu))
</script>

<template>
  <header>
    <BlogLogo />
    <nav>
      <div v-for="(route, index) in routes" :key="index" @click="() => $router.push({ path: (route.redirect || route.path) as string })">
        <PicButton> {{ route.meta.name }}</PicButton>
      </div>
    </nav>
  </header>
</template>

<style lang="scss"  scoped>
header{
  height: 60px;
  padding-inline: 24px;
  display: flex;
  justify-content: center;
  background-color: #f7f6f8;
  nav{
    flex: 1;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    line-height: 60px;
  }
}
</style>

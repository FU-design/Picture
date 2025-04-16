<script setup lang="ts">
import PicButton from '@/components/pic-button/pic-button.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = computed(() => router.getRoutes().filter(v => v.meta.menu))
</script>

<template>
  <header>
    <!-- <div class="blog-logo">
      <img src="../../assets/logo.png" alt="">
    </div> -->
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
  .blog-logo{
    height: 100%;
    img{
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>

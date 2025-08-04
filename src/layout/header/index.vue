<script setup lang="ts">
import PicButton from '@/components/PicButton/index.vue'
import { computed } from 'vue'
import { type RouteRecordRaw, useRouter } from 'vue-router'

const router = useRouter()
const routes = computed(() => router.getRoutes().filter(v => v.meta.menu))

function goPage(route: RouteRecordRaw) {
  router.push({ path: (route.redirect || route.path) as string })
}
</script>

<template>
  <header>
    <ul>
      <li v-for="(route, index) in routes" :key="index" @click="goPage(route)">
        <PicButton> {{ route.meta.name }}</PicButton>
      </li>
    </ul>
  </header>
</template>

<style lang="scss"  scoped>
header{
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding-inline: 24px;

  z-index: 99999;

  display: flex;
  justify-content: center;
  border-radius: 9999px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  ul{
    flex: 1;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    line-height: 60px;
  }
}

.menu__active{

}
</style>

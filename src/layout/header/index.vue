<script setup lang="ts">
import component from '@/assets/svg/component.svg'
import home from '@/assets/svg/home.svg'
import write from '@/assets/svg/write.svg'

import { computed } from 'vue'
import { type RouteRecordRaw, useRouter } from 'vue-router'

const iconMap = {
  COMPONENT: component,
  HOME: home,
  NOTE: write,
} as Record<string, string>

const router = useRouter()
const routes = computed(() => router.getRoutes().filter(v => v.meta.menu))
const currRouteName = computed(() => router.currentRoute.value.meta.name)

function goPage(route: RouteRecordRaw) {
  router.push({ path: (route.redirect || route.path) as string })
}
</script>

<template>
  <header>
    <ul>
      <li v-for="(route, index) in routes" :key="index" :class="{ selected: currRouteName === route.meta.name }" @click="goPage(route)">
        <img :src="iconMap[route.meta.name as string]">
      </li>
    </ul>
  </header>
</template>

<style lang="scss"  scoped>
header{
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 99999;
  transform: translateX(-50%);

  box-shadow: rgba(0, 0, 0, 0.16) 0px 4px 12px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 9999px;

  ul{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0 16px;

    li{
      position: relative;
      padding: 16px;
      transition: border-color 0.15s, box-shadow 0.15s;
      cursor: pointer;
      img{
        width: 24px;
        height: 24px;
        transition: transform 0.15s;
        &:hover{
          transform: scale(1.3);
        }
        &:active{
          transform: scale(0.9);
        }
      }
    }
  }
}

.selected{
  &::after{
    content: '';
    position: absolute;
    height: 4px;
    width: 4px;
    border-radius: 9999px;
    background-color: #0000005f;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: rgba(0, 0, 0, 0.06) 0px 4px 12px;
    transition: all 0.15s;
  }
  img{
    transform: scale(1.3);
  }
}
</style>

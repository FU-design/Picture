<script setup lang="ts">
import { computed } from 'vue'
import { type RouteRecordRaw, useRouter } from 'vue-router'

interface MenuItem {
  name: string
  type: 'page' | 'link'
  action: (route?: RouteRecordRaw) => void
}

const router = useRouter()
const routes = computed(() => router.getRoutes().filter(v => v.meta.menu))
const currRouteName = computed(() => router.currentRoute.value.meta.name)

const menus = computed(() => [...(routes.value.map(v => ({
  name: v.meta.name as string,
  type: 'page',
  action: () => goPage(v),
}))), { name: 'github', type: 'link', action: () => openGithub() }]) as unknown as MenuItem[]

function goPage(route: RouteRecordRaw) {
  router.push({ path: (route.redirect || route.path) as string })
}

function openGithub() {
  window.open('https://github.com/FU-design/Picture', '_blank')
}
</script>

<template>
  <header>
    <ul>
      <template v-for="(item, index) in menus" :key="index">
        <li v-if="item.type === 'page'" :class="{ selected: currRouteName === item.name }" @click="() => item.action()">
          <PicSvgIcon :name="(item.name as string).toLowerCase()" :color="currRouteName === item.name ? '#000' : 'rgba(0,0,0,.5)'" />
        </li>
      </template>
      <li class="divider" />
      <template v-for="(item, index) in menus" :key="index">
        <li v-if="item.type === 'link'" @click="() => item.action()">
          <PicSvgIcon :name="(item.name as string).toLowerCase()" :color="currRouteName === item.name ? '#000' : 'rgba(0,0,0,.5)'" />
        </li>
      </template>
    </ul>
  </header>
</template>

<style lang="scss"  scoped>
header{
  position: fixed;
  left: 50%;
  bottom: 5%;
  z-index: 99999;
  transform: translateX(-50%);
  padding: 4px 16px;
  border-radius: 9999px;

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.1);

  ul{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;

    li{
      flex-shrink: 0;
      padding: 8px;
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;

      cursor: pointer;
      border-radius: 9999px;

      &:not(.selected,.divider):hover{
        transform: scale(1.5);
      }
      &:is(.divider){
        padding: 0;
        width: 1px;
        height: 20px;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}

.selected{
  span{
    transform: scale(1.5);
    transition: transform 0.2s, color 0.2s;
    color: rgba(255, 255, 255, 0.3);
  }
}
</style>

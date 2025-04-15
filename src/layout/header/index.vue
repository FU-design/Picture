<script setup lang="ts">
import PicButton from '@/components/pic-button/pic-button.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = computed(() => router.getRoutes().filter(v => v.name))
</script>

<template>
  <header>
    <div v-for="{ name } in routes" :key="name" @click="() => $router.push({ name })">
      <PicButton> {{ name }}</PicButton>
    </div>
  </header>
</template>

<style lang="scss"  scoped>
header{
  height: 46px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  line-height: 46px;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { type RouteRecordNameGeneric, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const routes = computed(() => router.getRoutes())

function onClick(name: RouteRecordNameGeneric) {
  router.push({ name })
}
</script>

<template>
  <header class="sticky top-0 w-full max-h-20 backdrop-blur-sm bg-black/20 z-10">
    <section class="w-auto h-full flex gap-16 justify-center p-2">
      <div v-for="{ name } in routes" :key="name" :class="{ 'text-black bg-white/60': route.name === name }" class="rounded-lg font-semibold cursor-pointer p-1" @click="onClick(name)">
        <div class="rounded-lg">
          {{ name }}
        </div>
      </div>
    </section>
  </header>
</template>

<style lang="scss"  scoped>
</style>

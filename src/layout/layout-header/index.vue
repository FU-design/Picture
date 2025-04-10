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
  <header class="bg-black/5 backdrop-blur backdrop-filter sticky top-0 z-10 lg:py-0 border-b border-white/15">
    <section class="w-auto h-full flex gap-16 justify-center p-2">
      <div v-for="{ name } in routes" :key="name" :class="[route.name === name ? 'text-black' : 'text-gray-400']" class="rounded-lg cursor-pointer p-1" @click="onClick(name)">
        <div class="inline-flex flex-1 justify-center transition-all">
          {{ name }}
        </div>
      </div>
    </section>
  </header>
</template>

<style lang="scss"  scoped>
</style>

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
  <header class=" sticky top-0 w-fullh-10 backdrop-blur-sm bg-slate-200/10">
    <section class="w-auto h-full flex  gap-16 justify-center p-2">
      <div v-for="{ name } in routes" :key="name" :class="{ 'text-black bg-yellow-400': route.name === name }" class="rounded-lg font-semibold cursor-pointer leading-10" @click="onClick(name)">
        <span class="p-2 rounded-lg">
          {{ name }}
        </span>
      </div>
    </section>
  </header>
</template>

<style scoped>
</style>

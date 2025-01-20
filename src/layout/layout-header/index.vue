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
  <header class="pic-header">
    <section class="pic-header-item-wrp">
      <div v-for="{ name } in routes" :key="name" :class="{ 'text-black bg-yellow-400': route.name === name }" class="pic-header-item" @click="onClick(name)">
        <span class="p-2 rounded-lg">
          {{ name }}
        </span>
      </div>
    </section>
  </header>
</template>

<style lang="scss"  scoped>
.pic-header{
  @apply sticky top-0 w-full h-10 backdrop-blur-sm bg-slate-200/10
}

.pic-header-item-wrp{
  @apply w-auto h-full flex  gap-16 justify-center p-2
}

.pic-header-item{
  @apply rounded-lg font-semibold cursor-pointer leading-10
}
</style>

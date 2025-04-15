<script setup lang="ts">
import { computed } from 'vue'
import { type RouteRecordNameGeneric, useRouter } from 'vue-router'

const router = useRouter()
const routes = computed(() => router.getRoutes())

function onClick(name: RouteRecordNameGeneric) {
  router.push({ name })
}
</script>

<template>
  <header>
    <section>
      <div v-for="{ name } in routes" :key="name" @click="onClick(name)">
        <span> {{ name }}</span>
      </div>
    </section>
  </header>
</template>

<style lang="scss"  scoped>
header{
  background-color: rgb(0 0 0 / 0.05);
}
</style>

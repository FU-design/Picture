<script setup lang="ts">
const navList = [
  'HOME',
  'NOTES',
  'SOURCES',
]
</script>

<template>
  <header class="w-fullh-10 backdrop-blur-sm bg-slate-200/10">
    <section class="h-full flex  gap-16 justify-center">
      <div v-for="nav in navList" :key="nav" class="hover:text-blue-400 font-semibold cursor-pointer leading-10">
        {{ nav }}
      </div>
    </section>
  </header>
</template>

<style scoped>
header{
  position: -webkit-sticky;
  position: sticky;
  top:0;
}
</style>

<script setup lang="ts">
</script>

<template>
  <main>
    <slot />
  </main>
</template>

<style scoped>
main{
  width: 100vw;
  height: calc(100vh - 60px);
  overflow: auto;
  background-color: rgba(0,0,0,0.04);
  background-image: url('@/assets/grid.svg');
}
</style>

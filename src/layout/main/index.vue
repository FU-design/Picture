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
  height: calc(100vh - 46px);
  overflow: auto;
  background-image: url('@/assets/grid.svg');
}
</style>

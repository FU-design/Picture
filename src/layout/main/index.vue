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
  height: 100vh;
  overflow: auto;
  background-color: hsl(0 0% 99.0%);
  background-image: url('@/assets/grid.svg');
}
</style>

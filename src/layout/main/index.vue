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
  padding-block: 24px;
  background-color: var(--bg-body);
}
</style>

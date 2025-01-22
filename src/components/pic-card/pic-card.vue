<script setup lang="ts">

</script>

<template>
  <div class="min-w-40 border-black/10 rounded-lg mb-4">
    <slot name="header" />
    <div class="p-4">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<style scoped>

</style>

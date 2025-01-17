<script setup lang="ts">

</script>

<template>
  <div class="min-w-40 border border-white/50 rounded-2xl">
    <slot name="header" />
    <div class="p-4">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<style scoped>

</style>

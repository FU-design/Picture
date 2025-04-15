<script setup lang="ts">

</script>

<template>
  <div class="pic-card">
    <slot name="header" />
    <div>
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<style scoped>

</style>

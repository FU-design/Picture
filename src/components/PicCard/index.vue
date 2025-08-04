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
.pic-card{
  height: fit-content;
  padding: 16px;
  border-radius: 6px;
  background-color: var(--bg-surface);
}
</style>

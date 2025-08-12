<script setup lang="ts">
withDefaults(defineProps<{
  border?: boolean
}>(), {
  showHeader: true,
  title: '',
  border: false,
})
</script>

<template>
  <div class="pic-card" :style="{ border: border ? '1px solid var(--color-primary-500)' : 'none' }">
    <slot name="header" />
    <div class="pic-card__body">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<style scoped>
.pic-card{
  border-radius: 6px;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.pic-card__body{
  padding: 16px;
}
</style>

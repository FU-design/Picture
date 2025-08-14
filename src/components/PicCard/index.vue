<script setup lang="ts">
withDefaults(defineProps<{
  border?: boolean
}>(), {
  showHeader: true,
  title: '',
  border: true,
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
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
}

.pic-card__body{
  padding: 16px;
}
</style>

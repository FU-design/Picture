<script setup lang="ts">
withDefaults(defineProps<{
  border?: boolean
}>(), {
  border: true,
})
</script>

<template>
  <div class="pic-card" :style="{ border: border ? '1px solid var(--color-primary-500)' : 'none' }">
    <slot name="header" />
    <div>
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<style scoped>
.pic-card{
  padding: 16px;
  border-radius: 6px;
  background-color: #fff;
  overflow: auto;
}
</style>

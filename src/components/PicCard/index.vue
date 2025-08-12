<script setup lang="ts">
withDefaults(defineProps<{
  showHeader?: boolean
  title?: string
  border?: boolean
}>(), {
  showHeader: true,
  title: '',
  border: false,
})
</script>

<template>
  <div class="pic-card" :style="{ border: border ? '1px solid var(--color-primary-500)' : 'none' }">
    <slot name="header">
      <div v-if="showHeader" class="pic-card__header">
        <span class="pic-card__header-text">{{ $props.title }}</span>
      </div>
    </slot>
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
  overflow: auto;
}
.pic-card__header{
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
}

.pic-card__header::after{
  content: '';
  display: block;
  width: 100%;
  margin: 2px;
  height: 1px;
}

.pic-card__header-text{
  display: block;
  padding: 8px;
}

.pic-card__body{
  padding: 16px;
}
</style>

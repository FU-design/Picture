<script setup lang="ts">
import PicTagTextEditor_test from '@/example/PicTagTextEditor_test.vue'
</script>

<template>
  <div class="components">
    <component :is="PicTagTextEditor_test" />
  </div>
</template>

<style lang="scss" scoped>
.components{
  width: 100%;
  height: 100%;
  display: flex;
  padding: 16px;
}
</style>

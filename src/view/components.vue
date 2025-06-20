<script setup lang="ts">
import PicStep_test from '@/example/PicStep_test.vue'
import PicTagTextEditor_test from '@/example/PicTagTextEditor_test.vue'

const components = [
  PicTagTextEditor_test,
  PicStep_test,
]
</script>

<template>
  <div class="components">
    <template v-for="(comp, i) in components" :key="i">
      <component :is="comp" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.components{
  width: 100%;
  height: 100%;
  display: flex;
  padding: 16px;
  gap: 5%;
}
</style>

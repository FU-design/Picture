<script lang="ts" setup>
import PicStep_test from '@/example/PicStep_test.vue'
import PicTagTextEditor_test from '@/example/PicTagTextEditor_test.vue'

const components = [
  PicTagTextEditor_test,
  PicStep_test,
]
</script>

<template>
  <div class="components">
    <component :is="comp" v-for="(comp, index) in components" :key="index" />
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

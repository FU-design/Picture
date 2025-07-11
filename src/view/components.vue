<script lang="ts" setup>
import PicStep_test from '@/example/PicStep_test.vue'
import PicTagTextEditor_test from '@/example/PicTagTextEditor_test.vue'
import VForm_test from '@/example/VForm_test.vue'
import { useGlobalStore } from '@/stores/global.ts'

const global = useGlobalStore()

function showMessage() {
  global.success('successfull !')
  global.error('error !')
}

const components = [
  PicTagTextEditor_test,
  PicStep_test,
  VForm_test,
]
</script>

<template>
  <div class="components">
    <template v-for="(comp, _i) in components" :key="_i">
      <component :is="comp" />
    </template>

    <a-button type="primary" @click="showMessage">
      click
    </a-button>
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

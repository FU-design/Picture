<script lang="ts" setup>
import type { StepItem } from '@/components/PicStep/type'
import PicStep from '@/components/PicStep/index.vue'
import { shallowRef } from 'vue'

const steps = shallowRef<StepItem[]>([
  {
    key: '1',
    title: 'title',
  },
  {
    key: '2',
    title: 'title',
  },
  {
    key: '3',
    title: 'title',
  },
  {
    key: '4',
    title: 'title',
  },
])
</script>

<template>
  <div class="test">
    <PicStep :steps="steps" />
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import type { StepItem } from '@/components/PicStep/type'
import PicCard from '@/components/PicCard/index.vue'
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
  <PicCard class="test">
    <PicStep :steps="steps" />
  </PicCard>
</template>

<style scoped>
.test{
  box-sizing: border-box;
  padding: 16px;
  height: 100%;
  flex-direction: column;
  overflow: auto;
  box-sizing: border-box;
}
</style>

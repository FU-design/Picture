<script setup lang="ts">
import type { StepItem } from './type'
import { computed, ref } from 'vue'

interface StepProps {
  steps: StepItem[]
  current?: string
}

const props = defineProps<StepProps>()

const passSteps = ref<StepItem[]>([])
const passStepKeys = computed(() => passSteps.value.map(v => v.key))
</script>

<template>
  <div class="pic-step">
    <template v-for="(step, i) in props.steps" :key="step.key">
      <section class="pic-step-item__wrapper">
        <slot name="icon" :step="step">
          <div class="pic-step-item__icon" :class="{ 'pic-disabled': !passStepKeys.includes(step.key) }">
            {{ i }}
          </div>
        </slot>
        <slot name="title" :step="step">
          <div class="pic-step-title">
            <span>{{ step.title }}</span>
          </div>
        </slot>
      </section>
      <section v-if="i < props.steps.length - 1">
        <slot name="line">
          <div class="pic-step-line">
            <div class="pic-step-line-inner" :class="{ 'pic-disabled': !passStepKeys.includes(step.key) }" />
          </div>
        </slot>
      </section>
    </template>
  </div>
</template>

<style scoped>
.pic-step{
  display: grid;
  gap: 16px;
  grid: repeat(1, 60px) / auto-flow 60px;
}

.pic-disabled{
  border-color: gainsboro !important;
  background-color: gainsboro !important;
}

.pic-step-item__wrapper{
 display: flex;
 flex-direction: column;
 align-items: center;
}

.pic-step-item__icon{
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  border-width: 1px;
  border-color: black;
  position: relative;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
}

.pic-step-line{
  width:100%;
  height:100%;
  display: flex;
  align-items: center;
}

.pic-step-line::after{
  content: '';
  border-width: 4px;
  border-color: black;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.pic-step-line-inner{
  width: 100%;
  height: 2px;
  background-color: black;
}
</style>

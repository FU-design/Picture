<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

interface Props {
  name: string
  color?: string
}

const props = defineProps<Props>()

const svgContent = ref('')

async function loadSvg(name: string) {
  try {
    const svgModule = await import(`@/assets/svg/${name}.svg?raw`)
    svgContent.value = svgModule.default
  }
  catch (e) {
    console.error(`SVG "${name}" 加载失败:`, e)
  }
}

watch(() => props.name, (newName) => {
  loadSvg(newName)
})

onMounted(() => {
  loadSvg(props.name)
})
</script>

<template>
  <span
    class="svg-icon"
    :style="{ color }"
    aria-hidden="true"
    v-html="svgContent"
  />
</template>

<style scoped>
.svg-icon svg {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>

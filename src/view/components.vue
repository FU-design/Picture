<script lang="ts" setup>
import PicTagTextEditor_test from '@/example/PicTagTextEditor_test.vue'
import VForm_test from '@/example/VForm_test.vue'

const components = [
  PicTagTextEditor_test,
  VForm_test,
]

function initLayout() {
  const componentsContainer = document.querySelector('.components') as HTMLElement
  const componentItems = document.querySelectorAll('.component-item') as NodeListOf<HTMLElement>

  const containerWidth = componentsContainer?.getBoundingClientRect().width || 0
  const colNum = 3
  const gap = 24
  const colWidth = (containerWidth - gap * (colNum - 1) - gap * 2) / colNum
  const items = Array.from(componentItems) as HTMLElement[]

  const colHeights = Array.from({ length: colNum }).fill(0) as number[]

  items.forEach((item) => {
    const minColIndex = colHeights.indexOf(Math.min(...colHeights))

    const left = minColIndex * (colWidth + gap)
    const top = colHeights[minColIndex]

    // 设置元素位置
    item.style.margin = `${gap}px`
    item.style.position = 'absolute'
    item.style.left = `${left}px`
    item.style.top = `${top}px`
    item.style.width = `${colWidth}px`

    // 更新高度
    colHeights[minColIndex] += item.clientHeight + gap
  })
}

onMounted(() => {
  initLayout()
})
</script>

<template>
  <div class="components">
    <div v-for="(comp, _i) in components" :key="_i" class="component-item">
      <PicCard>
        <component :is="comp" />
      </PicCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.components{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  overflow: auto;
  position: relative;
}

.component-item{
  overflow: auto;
}
</style>

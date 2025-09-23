<script lang="ts" setup>
import PicPdfView_test from '@/example/PicPdfView_test.vue'
import PicTagTextEditor_test from '@/example/PicTagTextEditor_test.vue'
import VForm_test from '@/example/VForm_test.vue'

const components = [
  PicTagTextEditor_test,
  VForm_test,
  PicPdfView_test,
]

function initLayout() {
  const container = document.querySelector('.components') as HTMLElement
  const items = Array.from(document.querySelectorAll('.component-item')) as HTMLElement[]

  if (!container || items.length === 0)
    return

  const containerWidth = container.getBoundingClientRect().width
  const gap = 24
  const baseItemWidth = 500

  const colNum = Math.max(1, Math.floor((containerWidth + gap) / (baseItemWidth + gap)))
  const colWidth = (containerWidth - gap * (colNum - 1) - gap * 2) / colNum
  const colHeights = Array.from({ length: colNum }).fill(0) as number[]

  items.forEach((item) => {
    const minColIndex = colHeights.indexOf(Math.min(...colHeights))
    const x = gap + minColIndex * (colWidth + gap)
    const y = colHeights[minColIndex] + gap

    item.style.width = `${colWidth}px`
    item.style.transform = `translate(${x}px, ${y}px)`

    colHeights[minColIndex] += item.offsetHeight + gap
  })

  container.style.position = 'relative'
  // container.style.height = `${Math.max(...colHeights) + gap}px`
}

onMounted(() => {
  initLayout()
  window.addEventListener('resize', () => {
    initLayout()
  })
})
</script>

<template>
  <div class="components">
    <div v-for="(comp, _i) in components" :key="_i" class="component-item">
      <PicCard>
        <component :is="comp" />
        <template #header>
          <div class="card__header">
            <span class="card__header-text">{{ comp.__name }}</span>
            <div class="card__actions">
              <!-- <PicSvgIcon name="code" />/ -->
            </div>
          </div>
        </template>
      </PicCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.components {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  overflow: auto;
}

.component-item {
  position: absolute;
  transition: transform 0.2s ease;
  will-change: transform;
}

.card__header {
  display: flex;
  justify-content: space-between;
  position: relative;
  box-sizing: border-box;
  box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;

  span {
    display: block;
    padding-block: 8px;
    padding-inline: 8px;
  }
}

.card__actions {
  display: flex;
  flex-direction: row-reverse;
}
</style>

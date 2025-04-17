<script setup lang="ts">
import type { ContentItem } from '@/components/PicTagTextEditor/type'
import PicCard from '@/components/PicCard/index.vue'
import PicTagTextEditor from '@/components/PicTagTextEditor/index.vue'
import { reactive, ref, type Ref, type VNodeRef, watch } from 'vue'

type PicTagTextEditorType = InstanceType<typeof PicTagTextEditor>

const data = reactive<{ id: number, testContents: ContentItem[] }[]>([
  {
    id: 0,
    testContents: [
      {
        type: 'tag',
        text: 'welcome world !',
      },
      {
        type: 'tag',
        text: 'hello',
      },
      {
        type: 'tag',
        text: 'who are you !',
      },
    ],
  },
  {
    id: 1,
    testContents: [],
  },
  {
    id: 2,
    testContents: [],
  },
])
const picTagTextEditorRef = ref<PicTagTextEditorType>()

watch(() => data, (val) => {
  console.warn('val :>> ', val)
})

function onfocus($ref: VNodeRef | undefined) {
  picTagTextEditorRef.value = ($ref as Ref<PicTagTextEditorType>).value
}

function onblur() {
}
</script>

<template>
  <div class="components">
    <PicCard v-for="(item, index) in data" :key="index" style="width: 300px;">
      <template #header>
        <div style="margin-bottom: 8px;">
          {{ `Editor ${index}` }}
        </div>
      </template>
      <PicTagTextEditor v-model:contents="item.testContents" type="select" @focus="onfocus" @blur="onblur" />
    </PicCard>
  </div>
</template>

<style lang="scss" scoped>
.components{
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  gap: 10px;
  background-color: black;
}
</style>

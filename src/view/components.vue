<script setup lang="ts">
import PicCard from '@/components/PicCard/index.vue'
import PicTagTextEditor from '@/components/PicTagTextEditor/index.vue'
import { type ComponentPublicInstance, reactive, shallowRef, type VNodeRef, watch } from 'vue'

type PicTagTextEditorType = InstanceType<typeof PicTagTextEditor>

const data = reactive([
  {
    id: 0,
    testContents: [],
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
const picTagTextEditorRef = shallowRef<PicTagTextEditorType>()

function editorRefCollection(ref: ComponentPublicInstance): VNodeRef | undefined {
  picTagTextEditorRefs.value.push(ref as ComponentPublicInstance<PicTagTextEditorType>)
  return undefined
}

watch(() => data, (val) => {
  console.warn('val :>> ', val)
})

function onfocus(e, currentInstance) {
  picTagTextEditorRef.value = currentInstance
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
      <PicTagTextEditor :ref="editorRefCollection" v-model:contents="item.testContents" @focus="onfocus" />
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

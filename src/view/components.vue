<script setup lang="ts">
import type { ContentItem } from '@/components/PicTagTextEditor/type'
import PicButton from '@/components/PicButton/index.vue'
import PicCard from '@/components/PicCard/index.vue'
import PicTagTextEditor from '@/components/PicTagTextEditor/index.vue'
import { reactive, ref } from 'vue'

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
        type: 'text',
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
const insertContent = ref('')
const currPicTagTextEditorRef = ref<PicTagTextEditorType>()
const picTagTextEditorRefs = ref<PicTagTextEditorType[]>([])

function onInput(e: Event) {
  insertContent.value = (e?.target as any).value ?? ''
}

function onInsert() {
  if (insertContent.value === '') {
    console.warn('插入内容不能为空！ :>> ')
    return
  }
  currPicTagTextEditorRef.value && currPicTagTextEditorRef.value.insertTag({ type: 'tag', text: insertContent.value })
}

// ------ editor -----------

function onfocus(editorKey: string) {
  for (const editor of picTagTextEditorRefs.value) {
    editor.$props.uid === editorKey && (currPicTagTextEditorRef.value = editor)
  }
}

function handleRef(el: unknown, index: number) {
  el != null && (picTagTextEditorRefs.value[index] = el as PicTagTextEditorType)
}

function removeEditor(index: number, editorKey: string) {
  data.splice(index, 1)
  picTagTextEditorRefs.value.splice(index, 1)
  resetCurrPicTagTextEditorRef(editorKey)
}

function resetCurrPicTagTextEditorRef(editorKey: string) {
  const pos = picTagTextEditorRefs.value.findIndex(editor => editor.$props.uid === editorKey)
  if (pos === -1) {
    currPicTagTextEditorRef.value = undefined
  }
}
</script>

<template>
  <div class="components">
    <div>
      <input @input="onInput">
      <PicButton :border="true" @click="onInsert">
        insert
      </PicButton>
    </div>
    <template v-for="(item, index) in data" :key="index">
      <PicCard style="width: 300px;">
        <template #header>
          <div style="margin-bottom: 8px;">
            {{ `Editor ${index}` }}
          </div>
        </template>
        <PicTagTextEditor
          :key="item.id"
          :ref="(el) => handleRef(el, index)"
          v-model:contents="item.testContents"
          :uid="`${item.id}`"
          @focus="() => onfocus(`${item.id}`)"
        />
      </PicCard>
      <PicButton :border="true" shape="circle" @click="removeEditor(index, `${item.id}`)">
        <span> — </span>
      </PicButton>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.components{
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>

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
        text: 'welcome world!',
      },
      {
        type: 'text',
        text: 'hello',
      },
      {
        type: 'tag',
        text: 'I’am fine, thank you!',
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

// ------------------------------------ editor -----------------------------------------

function onfocus(editorKey: string) {
  for (const editor of picTagTextEditorRefs.value) {
    editor.$props.uid === editorKey && (currPicTagTextEditorRef.value = editor)
  }
}

function onchange(commad: string, val: ContentItem) {
  console.warn('editor commad :>> ', commad)
  console.warn('editor change :>> ', val)
}

function handleRef(el: unknown, index: number) {
  el != null && (picTagTextEditorRefs.value[index] = el as PicTagTextEditorType)
}
function addEditor() {
  data.push({
    id: data.length,
    testContents: [],
  })
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
  <PicCard class="test">
    <div>
      <input placeholder="请输入插入到编辑器的内容" @input="onInput">
      <PicButton :border="true" @click="onInsert">
        insert
      </PicButton>
      <PicButton :border="true" shape="circle" @click="addEditor">
        <span> + </span>
      </PicButton>
    </div>
    <template v-for="(item, index) in data" :key="index">
      <PicCard style="width: 300px;">
        <template #header>
          <div style="margin-bottom: 8px;">
            {{ `Editor ${index}` }}
          </div>
        </template>
        <div class="data-item">
          <PicTagTextEditor
            :key="item.id"
            :ref="(el) => handleRef(el, index)"
            v-model:contents="item.testContents"
            :uid="`${item.id}`"
            @focus="onfocus(`${item.id}`)"
            @change="onchange"
          />
          <PicButton :border="true" shape="circle" @click="removeEditor(index, `${item.id}`)">
            <span>-</span>
          </PicButton>
        </div>
      </PicCard>
    </template>
  </PicCard>
</template>

<style lang="scss" scoped>
.test{
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  height:100%;
  gap: 10px;
  flex-direction: column;
  overflow: auto;
  input{
    &:focus-visible{
      outline:0;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
  }
  .data-item{
    display: grid;
    align-items: center;
    gap: 8px;
    grid-template-columns: 80% 20%;
  }
}
</style>

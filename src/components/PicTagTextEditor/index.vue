<script setup lang="ts">
import type { ContentItem, CreateType, TagTextEditorEmits, TagTextEditorProps } from './type'
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<TagTextEditorProps>(), {
  type: 'textarea',
  disabled: false,
  placeholder: 'Please input ....',
  contents: () => { return [] },
})

const emits = defineEmits<TagTextEditorEmits>()
const range = ref<Range | null>(null)
const tagTextEditorRef = ref<HTMLElement>()
const allowedKeys = shallowRef(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Home', 'End', 'PageUp', 'PageDown'])

function onFocus(e: Event) {
  const selection = window.getSelection()
  if (!['I'].includes(selection?.focusNode?.parentNode?.nodeName || '')) {
    restSelection(selection)
  }
  emits('focus', tagTextEditorRef, e)
}

function onBlur(e: Event) {
  range.value = getSelection()?.getRangeAt(0) || null
  emits('blur', e)
}

function preventInput(e: KeyboardEvent) {
  if (!allowedKeys.value.includes(e.key)) {
    e.preventDefault()
  }
}

function preventPaste(e: ClipboardEvent) {
  e.preventDefault()
}

function setupContents() {
  if (props.contents.length <= 0) {
    return
  }
  const fragment = document.createDocumentFragment()
  for (const content of props.contents) {
    fragment.appendChild(createContent(content))
  }
  tagTextEditorRef.value?.appendChild(fragment)
}

// ----------- Operate dom by selection -------------

function restSelection(selection: Selection | null) {
  if (!selection) {
    return
  }
  if (!range.value) {
    range.value = document.createRange()
  }
  range.value.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range.value)
}

function insertTag(item: ContentItem) {
  if (!range.value) {
    return
  }
  const { startContainer: start, endContainer: end } = range.value
  if (start.parentElement?.tagName === 'I' || end.parentElement?.tagName === 'I') {
    return
  }
  const tag = createContent(item)
  range.value.deleteContents()
  range.value.insertNode(tag)
  tagTextEditorRef.value?.focus()
}

// --------------- Create content -----------------

const contentTypeMap = shallowRef<Record<CreateType, (contentItem: ContentItem) => Node>>({
  tag: (contentItem: ContentItem) => createTag(contentItem),
  text: (contentItem: ContentItem) => createText(contentItem),
})

function createTag(contentItem: ContentItem) {
  const tag = document.createElement('i')
  tag.setAttribute('contenteditable', 'false')
  tag.classList.add('tag')
  tag.innerHTML = contentItem.text
  return tag
}

function createText(contentItem: ContentItem): Node {
  return document.createTextNode(contentItem.text || '')
}

function createContent(contentItem: ContentItem): Node {
  return contentTypeMap.value[contentItem.type](contentItem)
}

// -------------- Init/Remove event -------------------

function setupEvent() {
  tagTextEditorRef.value?.addEventListener('focus', onFocus)
  tagTextEditorRef.value?.addEventListener('blur', onBlur)
  tagTextEditorRef.value?.addEventListener('paste', preventPaste)
  props.type === 'select' && tagTextEditorRef.value?.addEventListener('keydown', preventInput)
}

function removeAllEvent() {
  tagTextEditorRef.value?.removeEventListener('focus', onFocus)
  tagTextEditorRef.value?.removeEventListener('blur', onBlur)
  tagTextEditorRef.value?.removeEventListener('paste', preventPaste)
  props.type === 'select' && tagTextEditorRef.value?.removeEventListener('keydown', preventInput)
}

onMounted(() => {
  setupEvent()
  setupContents()
})

onUnmounted(() => {
  removeAllEvent()
})

defineExpose({
  insertTag,
  removeAllEvent,
})
</script>

<template>
  <div
    ref="tagTextEditorRef"
    class="tag-text-editor"
    :data-placeholder="placeholder"
    :contenteditable="true && !props.disabled"
    :class="{ 'tag-text-editor--deactive': props.disabled }"
  />
</template>

<style>
:root {
  --input-bg: #ddd;
  --input-bg-focus: #fff;
  --input-border-hover: #bbb;
  --input-border-focus: rgba(0,123,255,1);
  --input-bg-disabled: #e9ecef;
  --input-border-error: #dc3545;
  --input-text: #212529;
  --input-placeholder: #6c757d;
  --tag-text: #000;
  --tag-border: #000;
}

.tag-text-editor--deactive {
  background-color: var(--input-bg-disabled);
  cursor: not-allowed;
  opacity: 0.7;
}

.tag-text-editor::before{
  content: attr(data-placeholder);
  color: var(--input-placeholder);
  display: block;
  overflow: hidden;
  white-space: nowrap;
  cursor: text;
  text-overflow: ellipsis;
}

.tag-text-editor:not(:empty)::before{
  content: '';
}

.tag-text-editor:focus {
  outline: none;
  box-shadow: 0 0 0 1px var(--input-border-focus);
  background-color: var(--input-bg-focus);
}

.tag-text-editor .is-error {
  border-color: var(--input-border-error);
}

.tag {
  padding-inline: 4px;
  margin-inline: 2px;
  display: inline-block;
  border-radius: 4px;
  color: var(--tag-text);
  box-shadow: 0 0 0 1px var(--tag-border);
  box-sizing: border-box;
  border-color: transparent;
  line-height: normal;

 /* 核心：启用边框断裂效果 */
 -webkit-box-decoration-break: slice; /* 默认值，可省略 */
  box-decoration-break: slice;
}

.tag-text-editor {
  min-width: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 6px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  overflow: auto;
  background-color: var(--input-bg);
  color: var(--input-text);
  transition: border-color 0.15s, box-shadow 0.15s;
  line-height: 1.5;

  /* key of resolve content wrap */
  white-space: normal;
  word-break: break-all;   /* 强制所有单词在任意字符间断行 */
  overflow-wrap: break-word; /* 优先在单词内部换行（兼容性更好） */
}
</style>

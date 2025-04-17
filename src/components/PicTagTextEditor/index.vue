<script setup lang="ts">
import { type ComponentPublicInstance, onMounted, onUnmounted, ref, shallowRef, type VNodeRef } from 'vue'

type CreateType = 'tag' | 'text'

export interface ContentItem {
  type: CreateType
  text: string
  [propKey: string]: unknown
}

export interface TagTextEditorProps {
  contents: ContentItem[]
  disabled?: boolean
  placeholder?: string
}

export interface TagTextEditorEmits {
  (event: 'focus', e?: Event, currentInstance?: Element, ...args: any[]): void
  (event: 'blur', ...args: any[]): void
  (event: 'update:contents', ...args: any[]): void
}

export interface ListItem {
  inputContent: ContentItem[]
  [propKey: string]: unknown
}

const props = withDefaults(defineProps<TagTextEditorProps>(), {
  disabled: false,
  placeholder: 'Please input ....',
  contents: () => { return [] },
})

const emits = defineEmits<TagTextEditorEmits>()
const range = ref<Range | null>(null)
const tagTextEditorRef = ref<Element>()

function onFocus(e: Event) {
  const selection = window.getSelection()
  if (!['I'].includes(selection?.focusNode?.parentNode?.nodeName || '')) {
    restSelection(selection)
  }
  emits('focus', e, tagTextEditorRef.value)
}

function onBlur(e: Event) {
  range.value = getSelection()?.getRangeAt(0) || null
  emits('blur', e)
}

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

function setupContents() {
  const len = props.contents.length
  if (len <= 0) {
    return
  }
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < len; i++) {
    fragment.appendChild(createContent(props.contents[i]))
  }
  tagTextEditorRef.value?.appendChild(fragment)
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
}

function removeAllEvent() {
  tagTextEditorRef.value?.removeEventListener('focus', onFocus)
  tagTextEditorRef.value?.removeEventListener('blur', onBlur)
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
  --input-border-focus: #80bdff;
  --input-bg-disabled: #e9ecef;
  --input-border-error: #dc3545;
  --input-text: #212529;
  --input-placeholder: #6c757d;
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
  text-overflow: ellipsis;
}

.tag-text-editor:not(:empty)::before{
  content: '';
}

.tag-text-editor:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(0,123,255,1);
  background-color: var(--input-bg-focus);
}

.tag-text-editor .is-error {
  border-color: var(--input-border-error);
}

.tag {
  padding: 1px 4px;
  margin: 2px;
  display: inline-block;
  line-height: 1.5;
  border-radius: 4px;
  color: #000;
  border: 1px solid #000;
}

.tag-text-editor {
  min-width: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 8px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4;
  transition: all 0.2s;
  overflow: auto;
  white-space: normal;
  background-color: var(--input-bg);
  color: var(--input-text);
  transition: border-color 0.15s, box-shadow 0.15s;
}
</style>

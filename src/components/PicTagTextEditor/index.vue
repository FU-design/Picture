<script setup lang="ts">
import type { ContentItem, TagTextEditorEmits, TagTextEditorProps } from './type'
import { onMounted, onUnmounted, ref } from 'vue'
import { useCompatForBrowserMismatch } from './useCompatForBrowserMismatch'
import { usePicTagTextEditor } from './usePicTagTextEditor'

const props = withDefaults(defineProps<TagTextEditorProps>(), {
  type: 'textarea',
  disabled: false,
  placeholder: 'Please input ....',
  contents: (): ContentItem[] => { return [] },
})
const emits = defineEmits<TagTextEditorEmits>()
const tagTextEditorRef = ref<HTMLElement>()
const { checkNavigatorUserAgent, controlCursorToBypassDefaultInput } = useCompatForBrowserMismatch(tagTextEditorRef)
const { allowedKeys, range, setupObserver, createText, createContent, insertTag, checkAncestorContainer } = usePicTagTextEditor(tagTextEditorRef)

function onFocus(e: Event) {
  setupObserver()
  emits('focus', e)
}

function onBlur(e: Event) {
  checkAncestorContainer() && emits('blur', e)
}

function onClick(e: Event) {
  checkNavigatorUserAgent('firefox') && controlCursorToBypassDefaultInput(range) // 确保点击不可编辑元素时调整光标（兼容FireFox）
  emits('clickTag', e)
}

function preventInput(e: KeyboardEvent) {
  if (!allowedKeys.value.includes(e.key)) {
    e.preventDefault()
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
}

function setupContents() {
  if (props.contents.length <= 0) {
    return
  }
  const fragment = document.createDocumentFragment()
  checkNavigatorUserAgent('firefox') && fragment.append(createText()) // 确保容器的第一个子元素为文本 (兼容 FireFox)
  for (const content of props.contents) {
    fragment.appendChild(createContent(content))
  }
  tagTextEditorRef.value?.appendChild(fragment)
}

// -------------- Init/Remove event -------------------

function setupEvent() {
  tagTextEditorRef.value?.addEventListener('focus', onFocus)
  tagTextEditorRef.value?.addEventListener('blur', onBlur)
  tagTextEditorRef.value?.addEventListener('paste', onPaste)
  tagTextEditorRef.value?.addEventListener('click', onClick)
  props.type === 'select' && tagTextEditorRef.value?.addEventListener('keydown', preventInput)
}

function removeAllEvent() {
  tagTextEditorRef.value?.removeEventListener('focus', onFocus)
  tagTextEditorRef.value?.removeEventListener('blur', onBlur)
  tagTextEditorRef.value?.removeEventListener('paste', onPaste)
  tagTextEditorRef.value?.removeEventListener('click', onClick)
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
  getSign: () => props.uid,
})
</script>

<template>
  <div class="tag-text-editor-wrp">
    <div
      ref="tagTextEditorRef"
      class="tag-text-editor"
      :data-placeholder="placeholder"
      :contenteditable="true && !props.disabled"
      :class="{ 'tag-text-editor--deactive': props.disabled }"
    />
  </div>
  <!-- <div class="select-option" /> -->
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
  position: absolute;
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
  /* display: inline-block; */
  border-radius: 4px;
  color: var(--tag-text);
  box-shadow: 0 0 0 1px var(--tag-border);
  box-sizing: border-box;
  border-color: transparent;
  line-height: normal;

 /* 核心：启用边框断裂效果 */
 box-decoration-break: slice;
 -webkit-box-decoration-break: slice;
}

.tag-text-editor-wrp{
  position: relative;
}

.select-option{
  width: 100%;
  height: 400px;
  background-color: #e9ecef;
  position: absolute;
}

.tag-text-editor {
  position: relative;
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
  word-break: break-all;
  overflow-wrap: break-word;

  -webkit-user-modify: read-write-plaintext-only;
}
</style>

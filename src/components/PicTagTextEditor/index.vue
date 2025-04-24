<script setup lang="ts">
import type { ContentItem, TagTextEditorEmits, TagTextEditorProps } from './type'
import { onMounted, onUnmounted } from 'vue'
import { checkNavigatorUserAgent, clearUnableDomForTagTextEditor, controlCursorToBypassDefaultInput, insertInputPlaceholder } from './tool'
import { useMutationObserver } from './useMutationObserver'
import { usePicTagTextEditor } from './usePicTagTextEditor'

const props = withDefaults(defineProps<TagTextEditorProps>(), {
  type: 'textarea',
  disabled: false,
  placeholder: 'Please input xxx',
  contents: (): ContentItem[] => { return [] },
})
const emits = defineEmits<TagTextEditorEmits>()

const { allowedKeys, range, tagTextEditorRef, createText, createContent, insertTag, checkAncestorContainerAndCacheRange } = usePicTagTextEditor()
const { setupObserver } = useMutationObserver(tagTextEditorRef, {
  childList: handleChildListChange,
  characterData: handleCharacterDataChange,
})

// -------------------------------------------- Event CallBack --------------------------------------------

function onFocus(e: Event) {
  setupObserver()
  emits('focus', e)
}

function onBlur(e: Event) {
  checkAncestorContainerAndCacheRange()
  emits('blur', e)
}

function onClick() {
  // 确保点击不可编辑元素时调整光标（兼容FireFox）
  if (checkNavigatorUserAgent('firefox')) {
    range.value = controlCursorToBypassDefaultInput()
  }
}

function preventInput(e: KeyboardEvent) {
  if (!allowedKeys.value.includes(e.key)) {
    e.preventDefault()
  }
}

function handleChildListChange(mutation: MutationRecord) {
  // 确保占位元素的存在 （兼容 FireFox）
  if (checkNavigatorUserAgent('firefox')) {
    insertInputPlaceholder(tagTextEditorRef.value!)
  }
  clearUnableDomForTagTextEditor(tagTextEditorRef.value!)

  const { removedNodes, addedNodes } = mutation
  const tagChangeCommad = (removedNodes.length > 0 ? 'remove' : 'add')
  const tag = removedNodes.length > 0 ? removedNodes[0] : addedNodes[0]
  if (tag.textContent !== '') {
    const tagContent: ContentItem = { type: 'tag', text: tag.textContent! }
    emits('change', tagChangeCommad, tagContent)
    emits('update:contents', getEditorContent())
  }
}

function handleCharacterDataChange() {
  // 可使用防抖（FireFox 只会触发一次，可不使用防抖）
  emits('update:contents', getEditorContent())
}

// function onPaste(e: ClipboardEvent) {
//   e.preventDefault()
//   const clipboardData = e.clipboardData
//   const text = clipboardData?.getData('text/plain') || ''
//   const selection = window.getSelection()
//   const range = selection?.getRangeAt(0) || document.createRange()
//   range.deleteContents()
//   range.insertNode(document.createTextNode(text))
// }

// -------------------------------------------- Set/Get editor content --------------------------------------------

function setupContents() {
  if (props.contents.length <= 0) {
    return
  }
  const fragment = document.createDocumentFragment()
  // 确保容器的第一个子元素为文本 => 占位元素 (兼容 FireFox)
  checkNavigatorUserAgent('firefox') && fragment.append(createText())
  for (const content of props.contents) {
    fragment.appendChild(createContent(content))
  }
  tagTextEditorRef.value?.appendChild(fragment)
}

function getEditorContent() {
  const editorContent = [] as ContentItem[]
  const nodeItems = Array.from(tagTextEditorRef.value?.childNodes || [])
  for (const item of nodeItems) {
    if (!item.textContent) {
      continue
    }
    if (item.nodeType === Node.TEXT_NODE) {
      editorContent.push({ type: 'text', text: item.textContent })
    }
    else {
      editorContent.push({ type: 'tag', text: item.textContent })
    }
  }
  return editorContent
}

// -------------------------------------------- Init/Remove event -------------------------------------------------

function addEvents() {
  tagTextEditorRef.value?.addEventListener('focus', onFocus)
  tagTextEditorRef.value?.addEventListener('blur', onBlur)
  // tagTextEditorRef.value?.addEventListener('paste', onPaste)
  tagTextEditorRef.value?.addEventListener('click', onClick)
  props.type === 'select' && tagTextEditorRef.value?.addEventListener('keydown', preventInput)
}

function removeEvents() {
  tagTextEditorRef.value?.removeEventListener('focus', onFocus)
  tagTextEditorRef.value?.removeEventListener('blur', onBlur)
  // tagTextEditorRef.value?.removeEventListener('paste', onPaste)
  tagTextEditorRef.value?.removeEventListener('click', onClick)
  props.type === 'select' && tagTextEditorRef.value?.removeEventListener('keydown', preventInput)
}

onMounted(() => {
  addEvents()
  setupContents()
})

onUnmounted(() => {
  removeEvents()
})

defineExpose({
  addEvents,
  setupContents,
  insertTag,
  removeEvents,
  getSign: () => props.uid,
})
</script>

<template>
  <div class="tag-text-editor-wrp">
    <div
      ref="tagTextEditorRef"
      class="tag-text-editor"
      :data-placeholder="$props.placeholder"
      :contenteditable="true && !$props.disabled"
      :class="{ 'tag-text-editor--deactive': $props.disabled }"
    />
    <slot name="suffix" />
  </div>
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
}

.tag-text-editor-wrp:focus-within {
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
}

.tag-text-editor-wrp {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--input-bg);
  border-radius: 4px;
  transition: border-color 0.15s, box-shadow 0.15s;
  border-width: 1px;
  border-style: solid;
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
  padding: 6px;
  overflow: auto;
  color: var(--input-text);
  line-height: 1.5;

  /* key of resolve content wrap */
  white-space: normal;
  word-break: break-all;
  overflow-wrap: break-word;

  -webkit-user-modify: read-write-plaintext-only;
}
</style>

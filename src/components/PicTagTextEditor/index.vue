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

const nodeInfo = {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true, // 修改字符是否发生改变(默认false)
} as const

const range = ref<Range | null>(null)
const tagTextEditorRef = ref<HTMLElement>()
const observer = ref<MutationObserver | null>()
const allowedKeys = shallowRef(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Home', 'End', 'PageUp', 'PageDown'])
const contentTypeMap = shallowRef<Record<CreateType, (contentItem: ContentItem) => Node>>({
  tag: (contentItem: ContentItem) => createTag(contentItem),
  text: (contentItem: ContentItem) => createText(contentItem),
})

function onFocus(e: Event) {
  if (!observer.value) {
    observer.value = new MutationObserver(handleObserver)
  }
  observer.value?.observe(tagTextEditorRef.value!, nodeInfo)
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

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
}

// 确保点击不可编辑元素附近时调整光标（兼容FireFox）
function onClick() {
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
  if (!isFirefox) {
    return
  }
  const selection = window.getSelection()
  range.value = selection?.getRangeAt(0) || document.createRange()
  const parentElement = range.value?.endContainer.parentElement
  if (parentElement && [...parentElement.classList || []].includes('tag')) {
    parentElement?.after(createPlaceholder())
    selection?.removeAllRanges()
    range.value = document.createRange()
    range.value?.setStart(parentElement.nextSibling!, 0)
    range.value.collapse()
    selection?.addRange(range.value)
  }
}

function handleObserver(mutations: MutationRecord[], _observer: MutationObserver) {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.warn('childList :>> ')
      // 兼容 FireFox
      const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
      if (!isFirefox) {
        return
      }
      const childNodes = tagTextEditorRef.value!.childNodes
      if (childNodes.length > 0) {
        const firstChild = tagTextEditorRef.value?.firstChild
        if (firstChild?.nodeType !== Node.TEXT_NODE) {
          tagTextEditorRef.value?.insertBefore(createPlaceholder(), firstChild as Node)
        }
      }
      // 彻底清空输入框无用内容
      if (tagTextEditorRef.value?.lastChild?.nodeName === 'BR') {
        tagTextEditorRef.value.innerHTML = ''
      }
    }
    if (mutation.type === 'attributes') {
      console.warn('attributes :>> ')
    }
    if (mutation.type === 'characterData') {
      console.warn('characterData :>> ')
    }
  })
}

function setupContents() {
  if (props.contents.length <= 0) {
    return
  }
  const fragment = document.createDocumentFragment()
  // 兼容 FireFox
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
  isFirefox && fragment.append(createPlaceholder())
  for (const content of props.contents) {
    fragment.appendChild(createContent(content))
  }
  tagTextEditorRef.value?.appendChild(fragment)
}

// ----------- Operate dom by selection -------------

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

function createTag(contentItem: ContentItem) {
  const fragment = document.createDocumentFragment()
  const tag = document.createElement('i')
  tag.setAttribute('contenteditable', 'false')
  tag.classList.add('tag')
  tag.textContent = contentItem.text
  fragment.appendChild(tag)
  return fragment
}

function createPlaceholder() {
  return document.createTextNode('')
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

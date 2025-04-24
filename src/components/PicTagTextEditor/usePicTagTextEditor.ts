import type { ContentItem, CreateType } from './type'
import { ref, shallowRef } from 'vue'

export function usePicTagTextEditor() {
  const tagTextEditorRef = ref<HTMLElement>()
  const range = shallowRef<Range>()
  const allowedKeys = shallowRef(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Home', 'End', 'PageUp', 'PageDown'])
  const contentTypeMap = shallowRef<Record<CreateType, (contentItem: ContentItem) => Node>>({
    tag: (contentItem: ContentItem) => createTag(contentItem),
    text: (contentItem: ContentItem) => createText(contentItem),
  })

  function createText(contentItem?: ContentItem) {
    return document.createTextNode(contentItem ? contentItem.text ?? '' : '')
  }

  function createContent(contentItem: ContentItem) {
    return contentTypeMap.value[contentItem.type](contentItem)
  }

  function createTag(contentItem: ContentItem) {
    const fragment = document.createDocumentFragment()
    const tag = document.createElement('i')
    tag.setAttribute('contenteditable', 'false')
    tag.classList.add('tag')
    tag.textContent = contentItem.text
    fragment.appendChild(tag)
    return fragment
  }

  function insertTag(item: ContentItem) {
    if (!range.value) {
      return
    }
    const el = range.value.commonAncestorContainer as Element
    if (el?.closest && el?.closest('tag')) {
      return
    }
    if (!el?.closest && el.parentElement?.closest('.tag')) {
      return
    }
    const tag = createContent(item)
    range.value.insertNode(tag)
    range.value.collapse(false)
    resetSelectionCollapse(range.value)
  }

  // 重置光标位置
  function resetSelectionCollapse(range: Range) {
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    tagTextEditorRef.value?.focus()
  }

  // 在当前编辑器失去焦点的时候，缓存最后一次操作光标时的范围信息
  function checkAncestorContainerAndCacheRange() {
    const tempRange = window.getSelection()?.getRangeAt(0)
    if (tempRange) {
      const isChildForContainer = tagTextEditorRef.value?.contains(tempRange.commonAncestorContainer) ?? false
      isChildForContainer && (range.value = getSelection()?.getRangeAt(0))
    }
  }

  return {
    range,
    allowedKeys,
    tagTextEditorRef,
    createText,
    createTag,
    insertTag,
    createContent,
    resetSelectionCollapse,
    checkAncestorContainerAndCacheRange,
  }
}

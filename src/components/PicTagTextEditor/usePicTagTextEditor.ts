import type { ContentItem, CreateType } from './type'
import { type Ref, shallowRef } from 'vue'

export function usePicTagTextEditor(tagTextEditorRef: Ref<HTMLElement | undefined>) {
  const range = shallowRef<Range>()
  const allowedKeys = shallowRef(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Home', 'End', 'PageUp', 'PageDown'])
  const contentTypeMap = shallowRef<Record<CreateType, (contentItem: ContentItem) => Node>>({
    tag: (contentItem: ContentItem) => createTag(contentItem),
    text: (contentItem: ContentItem) => createText(contentItem),
  })

  function createText(contentItem?: ContentItem): Node {
    return document.createTextNode(contentItem ? contentItem.text ?? '' : '')
  }

  function createContent(contentItem: ContentItem): Node {
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
    const { startContainer: start, endContainer: end } = range.value
    if (start.parentElement?.tagName === 'I' || end.parentElement?.tagName === 'I') {
      return
    }
    const tag = createContent(item)
    range.value.insertNode(tag)
    range.value.collapse(false)
    resetSelectionCollapse(range.value)
  }

  // 重新定义焦点位置
  function resetSelectionCollapse(range: Range) {
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    tagTextEditorRef.value?.focus()
  }

  function checkAncestorContainer() {
    let isChildForContainer = false
    const tempRange = window.getSelection()?.getRangeAt(0)
    if (tempRange) {
      isChildForContainer = tagTextEditorRef.value?.contains(tempRange.commonAncestorContainer) ?? false
      isChildForContainer && (range.value = getSelection()?.getRangeAt(0))
    }
    return isChildForContainer
  }

  return {
    range,
    allowedKeys,
    createText,
    createTag,
    insertTag,
    createContent,
    resetSelectionCollapse,
    checkAncestorContainer,
  }
}

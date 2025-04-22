import type { ContentItem, CreateType } from './type'
import { type Ref, shallowRef } from 'vue'
import { useCompatForBrowserMismatch } from './useCompatForBrowserMismatch'

export function usePicTagTextEditor(tagTextEditorRef: Ref<HTMLElement | undefined>) {
  const range = shallowRef<Range>()
  const observer = shallowRef<MutationObserver | null>()
  const allowedKeys = shallowRef(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Home', 'End', 'PageUp', 'PageDown'])
  const contentTypeMap = shallowRef<Record<CreateType, (contentItem: ContentItem) => Node>>({
    tag: (contentItem: ContentItem) => createTag(contentItem),
    text: (contentItem: ContentItem) => createText(contentItem),
  })
  const observerSettings = shallowRef({
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true, // 修改字符是否发生改变(默认false)
  })

  const { checkNavigatorUserAgent, insertInputPlaceholder } = useCompatForBrowserMismatch(tagTextEditorRef)

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

  function clearUnableDomForTagTextEditor() {
    if (tagTextEditorRef.value?.lastChild?.nodeName === 'BR') {
      tagTextEditorRef.value.innerHTML = ''
    }
  }

  function setupObserver() {
    if (!observer.value) {
      observer.value = new MutationObserver(handleObserver)
    }
    observer.value?.observe(tagTextEditorRef.value!, observerSettings.value)
  }

  function handleObserver(mutations: MutationRecord[], _observer: MutationObserver) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // 兼容 FireFox
        if (checkNavigatorUserAgent('firefox')) {
          insertInputPlaceholder()
        }
        clearUnableDomForTagTextEditor() // 彻底清空输入框无用内容 ( 让模拟表单元素中的placeholder能够正常显示 )
        console.warn('removedNodes :>> ', mutation.removedNodes)
        console.warn('addedNodes :>> ', mutation.addedNodes)
        console.warn('object :>> ', mutation)
      }
      if (mutation.type === 'attributes') {
        console.warn('attributes :>> ', mutation)
      }
      if (mutation.type === 'characterData') {
        console.warn('characterData :>> ', mutation)
      }
    })
  }

  function resetSelectionCollapse(range: Range) {
    const selection = window.getSelection()
    selection?.removeAllRanges() // 重新定义焦点位置
    selection?.addRange(range)
    tagTextEditorRef.value?.focus()
  }

  function checkAncestorContainer() {
    const tempRange = window.getSelection()?.getRangeAt(0)
    const isChildForContainer = tempRange?.commonAncestorContainer && tagTextEditorRef.value?.contains(tempRange.commonAncestorContainer)
    isChildForContainer && (range.value = getSelection()?.getRangeAt(0))
    return isChildForContainer
  }

  return {
    range,
    allowedKeys,
    setupObserver,
    createText,
    createTag,
    insertTag,
    createContent,
    resetSelectionCollapse,
    checkAncestorContainer,
  }
}

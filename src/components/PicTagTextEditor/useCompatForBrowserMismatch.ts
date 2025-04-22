import type { Ref } from 'vue'

export function useCompatForBrowserMismatch(tagTextEditorRef: Ref<HTMLElement | undefined>) {
  function checkNavigatorUserAgent(userAgent: string) {
    return navigator.userAgent.toLowerCase().includes(userAgent.toLowerCase())
  }

  function createPlaceholder() {
    return document.createTextNode('')
  }

  function insertInputPlaceholder() {
    const childNodes = tagTextEditorRef.value!.childNodes
    if (childNodes.length > 0) {
      const firstChild = tagTextEditorRef.value?.firstChild
      if (firstChild?.nodeType !== Node.TEXT_NODE) {
        tagTextEditorRef.value?.insertBefore(createPlaceholder(), firstChild as Node)
      }
    }
  }

  function controlCursorToBypassDefaultInput(range: Ref<Range | undefined>) {
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

  return {
    createPlaceholder,
    checkNavigatorUserAgent,
    insertInputPlaceholder,
    controlCursorToBypassDefaultInput,
  }
}

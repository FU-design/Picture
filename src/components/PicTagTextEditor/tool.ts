export function checkNavigatorUserAgent(userAgent: string) {
  return navigator.userAgent.toLowerCase().includes(userAgent.toLowerCase())
}

// Ensure that the editor’s first child is an empty TextNode.
export function insertInputPlaceholder(container: HTMLElement) {
  const childNodes = container!.childNodes
  if (childNodes.length > 0) {
    const firstChild = container?.firstChild
    if (firstChild?.nodeType !== Node.TEXT_NODE) {
      container?.insertBefore(createPlaceholder(), firstChild as Node)
    }
  }
}

export function controlCursorToBypassDefaultInput() {
  const selection = window.getSelection()
  let range = selection?.getRangeAt(0) || document.createRange()
  const parentElement = range?.endContainer.parentElement
  if (parentElement && [...parentElement.classList || []].includes('tag')) {
    parentElement?.after(createPlaceholder())
    selection?.removeAllRanges()
    range = document.createRange()
    range?.setStart(parentElement.nextSibling!, 0)
    range.collapse()
    selection?.addRange(range)
  }
  return range
}

// 彻底清空输入框无用内容 ( 让模拟表单元素中的placeholder能够正常显示 )
export function clearUnableDomForTagTextEditor(container: HTMLElement) {
  const { firstChild, lastChild } = container
  const childCount = container.childNodes.length
  const isClear = lastChild?.nodeName === 'BR' && (firstChild?.nodeType === Node.TEXT_NODE && firstChild.textContent === '')
  if (isClear && childCount <= 2)
    container.innerHTML = ''
}

function createPlaceholder() {
  return document.createTextNode('')
}

---
Created At: 8/1/2025, 4:22:48 PM
Updated At: 8/1/2025, 4:22:48 PM
File Name: PicTagTextEditor组件的封装
---

# PicTagTextEditor组件的封装

This is the content of PicTagTextEditor组件的封装.

# [PicTagTextEditor 组件封装 (vue3 版本)](https://github.com/FU-design/Picture/tree/main/src/components/PicTagTextEditor)

#### 功能点
- 类似于表单控件中的输入框，**可输入文本内容**
- 可在输入框中 **添加 tag** (不是文本的 dom 元素内容)
- 可通过获取焦点时，通过 **光标控制** 添加 tag 时在输入框中 **添加的位置**

## 实现前的准备工作

> 实现该组件还需要了解如下  **DOM属性** 和 **Web API** 以及 **CSS** 相关特性

### DOM 属性
  - [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): 使用 `contenteditable` 属性让普通元素拥有类似输入框的特性
  - [data-\*（全局属性）](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): **自定义数据属性**的属性，可以通过脚本在 HTML 与 DOM 表示之间进行专有**数据的交换**

### CSS 属性
  - [attr 函数](https://developer.mozilla.org/zh-CN/docs/Web/CSS/attr)
  - [:focus-within 伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within)
  - [white-space](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)
  - [word-break](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break)
  - [overflow-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow-wrap)

### Web API

#### [Selection](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)

表示用户选择的文本及其范围。

```js
const selection = window.getSelection()
```

`Selection` 对象的部分方法：
  - `getRangeAt`: 返回一个包含当前选区内容的区域对象。
  - `addRange(range)`: 将一个 `Range` 对象添加到选定范围中。
  - `removeAllRanges()`: 移除所有选定范围。

#### [Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)

表示一个包含节点与文本节点的一部分的文档片段。

获取 `Range` 对象的主要方法：

  ```js
  const range0 = document.createRange()

  // Selection 对象的 getRangeAt() 方法
  const range1 = window.getSelection()?.getRangeAt(0)

  // 通过构造函数获取
  const range2 = new Range()
  ```

`Range` 对象的部分方法：

- `collapse(toStart)`: 折叠选区，`toStart` 为 `true` 时折叠到起始位置，为 `false`时折叠到结束位置。
- `insertNode(node)`: 在 `Range` 的起始位置插入一个节点。
- `setStartAfter(node)`: 用于将 `Range` 的起始位置设置在指定 node 之后。即，范围从所指定节点的下一个位置开始。

#### [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)

接口提供了监视对 DOM 树所做更改的能力,是 DOM3 Events 规范的一部分。（可前往官网查看使用方式）

## 开始实现

### 创建编辑器的主体

为作为 **可编辑容器** 的 DOM 添加属性 `contenteditable`，让其拥有表单元素的部分特性。
```html
 <div class="tag-text-editor-wrp">
    <div :contenteditable="true"/>
  </div>
```
### 实现编辑器的 placeholder 属性

当我为其添加 `placeholder` 这个属性的时候，会发现是 **无效** 的，原来这一点是 contenteditable 属性没有从表单元素中继承到的，因此需要来手动实现。这就需要用到 `data-*` 全局属性配合 `attr` 函数以及 `::before` 伪元素来模拟实现。具体代码如下：
```html
 <div class="tag-text-editor-wrp">
    <div
      class="tag-text-editor"
      data-placeholder="Please input ...."
      :contenteditable="true"
    />
  </div>
```
```css
.tag-text-editor::before{
  content: attr(data-placeholder);
  color: var(--input-placeholder); /* 自定义css变量 */
  cursor: text; /* 统一鼠标的 hover 外形是对文本操作的  */

  /* placeholder 文本超出容器时做省略处理 */
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```
效果如下：

![01](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXkwZ3pubmhwaTJsZHg1czcyOHVxOGU4NnZxejY3N3oxZ3RmMWducSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aylLhEhnRP8QEFLfV6/giphy.gif)

### 实现 tag 元素的创建

在实现之前，先定义编辑器内容的数据结构，方便数据转化时的对外统一。
```ts
export type CreateType = 'tag' | 'text'

export interface ContentItem {
  type: CreateType
  text: string
  [propName: string]: unknown
}

export interface TagTextEditorProps {
  uid: string
  contents: ContentItem[]
  disabled?: boolean
  placeholder?: string
}
```
创建 **usePicTagTextEditor.ts** 组合式函数, 直接上代码

```ts
import type { ContentItem, CreateType } from './type'
import { ref, shallowRef } from 'vue'

export function usePicTagTextEditor() {
  const tagTextEditorRef = ref<HTMLElement>()
  const contentTypeMap = shallowRef<Record<CreateType, (contentItem: ContentItem) => Node>>({
    tag: (contentItem: ContentItem) => createTag(contentItem),
    text: (contentItem: ContentItem) => createText(contentItem),
  })

  // 创建文本元素
  function createText(contentItem?: ContentItem) {
    return document.createTextNode(contentItem ? contentItem.text ?? '' : '')
  }

  // 我这里使用的是 I 标签作为 tag 的载体
  function createTag(contentItem: ContentItem) {
    const fragment = document.createDocumentFragment()
    const tag = document.createElement('i')

    // 子元素会继承父元素的 contenteditable，所以这里要重置一下
    tag.setAttribute('contenteditable', 'false')
    tag.classList.add('tag')
    tag.textContent = contentItem.text
    fragment.appendChild(tag)
    return fragment
  }

  function createContent(contentItem: ContentItem) {
    return contentTypeMap.value[contentItem.type](contentItem)
  }

  return {
    tagTextEditorRef,
    createText,
    createTag,
    insertTag,
    createContent,
  }
}
```
在 **PicTagTextEditor.vue** 组件中使用
```ts
// PicTagTextEditor.vue

import type { ContentItem, TagTextEditorEmits, TagTextEditorProps } from './type'
import { usePicTagTextEditor } from './usePicTagTextEditor'
const { tagTextEditorRef, createText, createContent, } = usePicTagTextEditor()

// 初始化编辑器内容
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
```
```html
 <div class="tag-text-editor-wrp">
    <div
      ref="tagTextEditorRef"
      class="tag-text-editor"
      :data-placeholder="$props.placeholder"
      :contenteditable="!$props.disabled""
    />
  </div>
```
使用模拟数据在组件 `PicTagTextEditor` 的生命周期函数 `onMounted` 进行初始化
```ts
// PicTagTextEditor_test.vue

import type { ContentItem } from '@/components/PicTagTextEditor/type'
import PicTagTextEditor from '@/components/PicTagTextEditor/index.vue'
import { reactive, ref } from 'vue'

const picTagTextEditorRef = ref<InstanceType<typeof PicTagTextEditor>>()
const data = reactive<ContentItem[]>([ // 模拟数据
  {
    type: 'tag',
    text: 'welcome world!',
  },
  {
    type: 'text',
    text: 'hello',
  },
  {
    type: 'tag',
    text: 'I’am fine, thank you!',
  },
])
```
```html
 <div class="picTag-text-editor_test">
   <PicTagTextEditor
    ref="picTagTextEditorRef"
    v-model:contents="data"
  />
 </div>
```

渲染结果如下：

![02](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWlkMnBtYjF3ajg2eDRycGF5ZnB0ZnA0ZnB4NWIyZGZjdmwxcTI5dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7ikKbijW40BY6VWWSd/giphy.gif)

到这里组件的 **基本结构** 就实现完成了，下面就是主要的插入 **tag** 操作。

### 实现如何将 tag 插入到编辑器中光标所在位置

在 **usePicTagTextEditor.ts** 文件中定义 **insertTag** 方法以及 `Range` 实例

```ts
// usePicTagTextEditor.ts

// .... else .....
const range = shallowRef<Range>()

function insertTag(item: ContentItem) {
  if (!range.value) {
    return
  }
  // 判断缓存的 range 信息中光标的最后落点元素是否为 tag 或其子孙元素
  const el = range.value.commonAncestorContainer as Element
  if (el?.closest && el?.closest('tag')) {
    return
  }
  if (!el?.closest && el.parentElement?.closest('.tag')) {
    return
  }
  const tag = createContent(item)
  range.value.insertNode(tag) // 在当前光标的前面插入 tag 元素
  range.value.collapse(false) // 合并光标的选取范围
  resetSelectionCollapse(range.value)
}

// 重置光标位置
function resetSelectionCollapse(range: Range) {
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
  tagTextEditorRef.value?.focus()
}

return {
  // .... else .....
  range,
  insertTag,
  resetSelectionCollapse
}
```
在 **PicTagTextEditor.vue** 文件中补充后，将 **insertTag** 方法直接 **暴露** 出去，供父组件调用。

```ts
// PicTagTextEditor.vue

defineExpose({
  insertTag,
})
```

在 **PicTagTextEditor_test.vue** 文件中使用 **insertTag** 方法

```ts
// .... else ......
const insertContent = ref('')

function onInput(e: Event) {
  insertContent.value = (e?.target as any).value ?? ''
}

function onInsert() {
  if (insertContent.value === '') {
    console.warn('插入内容不能为空！ :>> ')
    return
  }
  picTagTextEditorRef.value.insertTag({ type: 'tag', text: insertContent.value })
}
```

```html
<div class="picTag-text-editor_test">
   <div>
      <input placeholder="请输入插入到编辑器的内容" @input="onInput">
      <button :border="true" @click="onInsert">
        insert
      </button>
    </div>
   <PicTagTextEditor
    ref="picTagTextEditorRef"
    v-model:contents="data"
  />
</div>
```
效果如下：

![03](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHc3bmV1b3oweGJmYjZta251ZHlpOGE0bGRsaWJkd2JwNjZqdDhyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wMj1L2de6hnwarK2MI/giphy.gif)

### 定义关于编辑器内容和数据绑定的变动同步

对于绑定 `contenteditable` 属性为 **true** 的元素，会继承表单控件的一些 **事件**，这里用到了几个常用的事件对编辑器进行了绑定。

```ts
// PicTagTextEditor_test.vue

export type TagChangeCommad = 'add' | 'remove'
export interface TagTextEditorEmits {
  (event: 'focus', e?: Event,): void
  (event: 'blur', e?: Event,): void
  (event: 'change', commad: TagChangeCommad, tag: ContentItem): void
  (event: 'update:contents', contents: ContentItem[]): void
}
```
其中主要的还是 **change** 和 **focus** 事件,两者配合 `MutationObserver` 实现未继承到的表单控件的 **change** 事件。（单纯的通过监听 **input** 事件，无法监听到从外部插入 **tag** 时编辑器的变动。 ）

这里先对 `mutationObserver` 封装了一下（可不封装）：
```ts
// useMutationObserver.ts

import { reactive, type Ref, shallowRef } from 'vue'

type RequireAtLeastOne<
  T,
  Keys extends keyof T = keyof T,
> = Partial<T> & {
  [K in Keys]: Required<Pick<T, K>>
}[Keys]

export type Callback = (mutations: MutationRecord, observer?: MutationObserver) => void
export type MutationCallbackMap = RequireAtLeastOne<Record<MutationRecordType, Callback>>

export function useMutationObserver(observerElementRef: Ref<HTMLElement | undefined>, mutationCallbackMap: MutationCallbackMap, options?: MutationObserverInit) {
  const observer = shallowRef<MutationObserver>()
  const observerOptions = reactive<MutationObserverInit>({
    childList: false, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效
    characterData: false, // 监听声明的 target 节点上所有字符的变化
    subtree: true, // 监听以 target 为根节点的整个子树
  })

  const handleObserver = (mutations: MutationRecord[], observer: MutationObserver) => {
    mutations.forEach((mutation) => {
      mutationCallbackMap[mutation.type]?.(mutation, observer)
    })
  }

  // 初始化监听元素变动
  const setupObserver = () => {
    // merge options
    for (const key of Object.keys(mutationCallbackMap) as MutationRecordType[]) {
      observerOptions[key] = !!mutationCallbackMap[key]
    }
    // merge options
    if (options) {
      Object.assign(observerOptions, options)
    }
    observer.value = observer.value ?? new MutationObserver(handleObserver)
    observer.value?.observe(observerElementRef.value!, observerOptions)
  }

  return {
    observer,
    setupObserver,
  }
}
```

在 **PicTagTextEditor.vue** 中使用

```ts
// PicTagTextEditor.vue

const { checkAncestorContainerAndCacheRange } = usePicTagTextEditor()
const { setupObserver } = useMutationObserver(tagTextEditorRef, {
  childList: handleChildListChange,
  characterData: handleCharacterDataChange,
})

function onFocus(e: Event) {
  setupObserver()
  emits('focus', e)
}

function onBlur(e: Event) {
  checkAncestorContainerAndCacheRange()
  emits('blur', e)
}

// 判断变动操作的类型（针对 tag 的变动）
function handleChildListChange(mutation: MutationRecord) {
  const { removedNodes, addedNodes } = mutation
  const tagChangeCommad = (removedNodes.length > 0 ? 'remove' : 'add')
  const tag = removedNodes.length > 0 ? removedNodes[0] : addedNodes[0]

  // 过滤空字符串值
  if (tag.textContent !== '') {
    const tagContent: ContentItem = { type: 'tag', text: tag.textContent! }
    emits('change', tagChangeCommad, tagContent)
    emits('update:contents', getEditorContent())
  }
}

// 文本字符的变动
function handleCharacterDataChange() {
  emits('update:contents', getEditorContent())
}
```

在 **usePicTagTextEditor.ts** 中添加 **checkAncestorContainerAndCacheRange** 方法,用于在当前编辑器失去焦点的时候，缓存最后一次操作光标时的范围信息。以便在插入时直接使用该 **range** 信息,决定插入到编辑器内容中的位置。
```ts
// usePicTagTextEditor.ts

function checkAncestorContainerAndCacheRange() {
  const tempRange = window.getSelection()?.getRangeAt(0)
  if (tempRange) {
    const isChildForContainer = tagTextEditorRef.value?.contains(tempRange.commonAncestorContainer) ?? false
    isChildForContainer && (range.value = getSelection()?.getRangeAt(0))
  }
}
```

### 编辑器内容获取和数据类型转化

获取容器元素的子元素，然后遍历获取 `textContent` 的值，在组合先前定义的统一数据结构。
```ts
// PicTagTextEditor.vue

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
```
## 浏览器兼容性问题

对于通用组件来说，解决浏览器的兼容性问题是无法避免的。首次实现该组件是在 **Chrome 浏览器** 下实现的，不存在问题；但在 **FireFox 浏览器** 中出现了很多兼容性问题。

经过查阅资料总结了遇到的如下问题：

- [❌] 编辑器光标的位置向下偏移
- [❌] 无法在前后没有文本内容的 tag 前后插入光标
- [❌] 当点击 tag 内部时，光标会在其内部的文本内容中显示

#### **Firefox** 的文本框架（Text Frame）与光标定位 (Chat GPT 给我的回答)
>
> - Firefox 仅在有“文本框架”时绘制并定位插入点。当一个 inline 元素内 无任何文本且无尺寸 时，它不会生成框架，插入点也就“无处可落”[Bugzilla Main Page](https://bugzilla.mozilla.org/show_bug.cgi?id=389321&utm_source=chatgpt.com)。
>
> - 一旦该元素内部 存在文本节点，即使元素本身被设为 contenteditable="false"，其子文本节点也会产生独立的文本框架，浏览器会允许将光标移动到这些框架之间（显示为可见的插入点），但输入仍不会改变它们的内容。[Bugzilla Main Page](https://bugzilla.mozilla.org/show_bug.cgi?id=1612076&utm_source=chatgpt.com)。

### 解决这些问题：

#### 编辑器光标的位置向下偏移

![04](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExenVlZHJsMzNkeXpqeGJkYjhtOWl3aGVzcWg1MmFrd2toczU3amxuMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/354XzcOnivzza4mZqr/giphy.gif)

这个比较好解决，我通过改变 CSS 即可实现

```css
.tag-text-editor {
  position: relative;
}

.tag-text-editor::before{
  position: absolute;
}
```

#### 无法在前后没有文本内容的 tag 前后插入光标 & 当点击 tag 内部时，光标会在其内部的文本内容中显示

```ts
// tool.ts

// 在该 tag 的后面插入占位元素，并重置光标的落点到占位元素中
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

function createPlaceholder() {
  return document.createTextNode('')
}

// 判断当前所用的是什么浏览器
export function checkNavigatorUserAgent(userAgent: string) {
  return navigator.userAgent.toLowerCase().includes(userAgent.toLowerCase())
}

// 在容器的首节点且不是文本节点的前面插入占位符（空格）
export function insertInputPlaceholder(container: HTMLElement) {
  const childNodes = container!.childNodes
  if (childNodes.length > 0) {
    const firstChild = container?.firstChild
    if (firstChild?.nodeType !== Node.TEXT_NODE) {
      container?.insertBefore(createPlaceholder(), firstChild as Node)
    }
  }
}
```
```ts
// PicTagTextEditor.vue

function onClick() {
  // 确保点击不可编辑元素时调整光标并插入占位元素，从而绕过浏览器的渲染机制（兼容FireFox）
  if (checkNavigatorUserAgent('firefox')) {
    range.value = controlCursorToBypassDefaultInput()
  }
}

function setupContents() {
  // ... else ...
  const fragment = document.createDocumentFragment()
  // 确保容器的第一个子元素为文本 => 占位元素 (兼容 FireFox)
  checkNavigatorUserAgent('firefox') && fragment.append(createText())
  for (const content of props.contents) {
    fragment.appendChild(createContent(content))
  }
  // ... else ...
}

function handleChildListChange(mutation: MutationRecord) {
  // 确保占位元素的存在 （兼容 FireFox）
  if (checkNavigatorUserAgent('firefox')) {
    insertInputPlaceholder(tagTextEditorRef.value!)
  }
  //  ... else ...
}
```
在实现完上述的解决方案后，又会引申另一个问题，即删除所有元素后，模拟的 **placeholder** 并没有按照预期出现，这说明容器中尚且存在占位元素。**（这个问题在 Chrome 浏览器 中也存在）**

![05](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWZyYzM1Y2RmdTV6YnNodjZ5MWUwM3FjZ2JvNnQzYWJ5ZXVpY2RmYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QruqDFj8VhNn9gHzdH/giphy.gif)

打印一下此时编辑器的子元素：

![06](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWRwaXh2bGozeHh5Nm9ueTgwMXNxcWZjaThrYWV6YmNkaW91MWk5aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZaMqejQuAxPVhXM4oZ/giphy.gif)

可见还存在占位元素，这时就需要手动清除，让编辑器内容完全为空。

```ts
// tool.ts

// 彻底清空输入框无用内容 ( 让模拟表单元素中的placeholder能够正常显示 )
export function clearUnableDomForTagTextEditor(container: HTMLElement) {
  const { firstChild, lastChild } = container
  const childCount = container.childNodes.length
  const isClear = lastChild?.nodeName === 'BR' && (firstChild?.nodeType === Node.TEXT_NODE && firstChild.textContent === '')
  if (isClear && childCount <= 2)
    container.innerHTML = ''
}

// PicTagTextEditor.vue

function handleChildListChange(mutation: MutationRecord) {
  if (checkNavigatorUserAgent('firefox')) {
    insertInputPlaceholder(tagTextEditorRef.value!)
  }

  // 判断可用内容是否为空，若为空，则清空容器
  clearUnableDomForTagTextEditor(tagTextEditorRef.value!)
  //  ... else ...
}
```

至此一个基础的 **文本** 和 **tag (非文本)** 混合输入框就实现了。

#### 可扩展性还是很强的，比如

- **tag** 的外形和内部的元素组成，可以在 **creatTag** 中自行修改；
- 编辑器的的后缀内容（可通过插槽进行预设，可能会用到 `:focus-within 伪类`）
- **tag** 数据内容的负载，负载一些在删除时需要的核心字段等等（可将 `data-*` 作为数据携带的载体）
- 结合当下UI组件库的组件，进一步封装为 **下拉框** 等等。

<font color=red>[注意]：目前只兼容 **Chrome** 、**Microsoft Edge**、 **FireFox** 浏览器</font>

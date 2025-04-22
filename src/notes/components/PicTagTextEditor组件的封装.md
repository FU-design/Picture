# PicTagTextEditor 组件封装 (vue3 版本)

#### 功能点
- 类似于表单控件中的输入框，**可输入文本内容**
- 可在输入框中 **添加 tag** (不是文本的 dom 元素内容)
- 可通过获取焦点时，通过 **光标控制** 添加 tag 时在输入框中 **添加的位置**

## 具体实现

> 实现该组件还需要了解如下  **属性** 和 **Web API**

### 属性
  - [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): 使用 `contenteditable` 属性让普通元素拥有类似输入框的特性
  - [data-\*（全局属性）](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): **自定义数据属性**的属性，可以通过脚本在 HTML 与 DOM 表示之间进行专有**数据的交换**

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

### 开始实现

#### 1、创建输入框的主体及(主要的)样式（详细样式可前往 GitHub 仓库查看）
```html
 <div class="tag-text-editor-wrp">
    <div
      ref="tagTextEditorRef"
      class="tag-text-editor"
      :data-placeholder="placeholder"
      :contenteditable="true && !props.disabled"
      :class="{ 'tag-text-editor--deactive': props.disabled }"
    />
  </div>
```
```css
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

.tag {
  padding-inline: 4px;
  margin-inline: 2px;
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
```
可以看到这里就使用到了 `data-*` 全局属性，主要是用来模拟同表单控件的 `placeholder` 属性的，在组件中定义了 `data-placeholder` 自定义属性,并将其的取值加入到了该组件的 `props` 中，方便外部进行 **动态修改**。（这里存在一个小坑，下文会说道）

#### 2、定义组件接收回显到页面的数据结构及组件的 `props` 和 `emits` 类型
```ts
export type CreateType = 'tag' | 'text'

export interface ContentItem {
  type: CreateType
  text: string
  [propKey: string]: unknown
}

export interface TagTextEditorProps {
  uid: string
  contents: ContentItem[]
  type?: 'textarea' | 'select'
  disabled?: boolean
  placeholder?: string
}

export interface TagTextEditorEmits {
  (event: 'focus', e?: Event,): void
  (event: 'blur', e?: Event,): void
  (event: 'clickTag', e?: Event,): void
  (event: 'update:contents', contents: ContentItem): void
}
```

#### 3、定义创建 tag 元素和文本元素的方法
```ts
// 我这里选用的是 i 元素作为 tag 的载体
function createTag(contentItem: ContentItem) {
  const fragment = document.createDocumentFragment()
  const tag = document.createElement('i')
  tag.setAttribute('contenteditable', 'false')
  tag.classList.add('tag')
  tag.textContent = contentItem.text
  fragment.appendChild(tag)
  return fragment
}

// 创建文本元素
function createText(contentItem?: ContentItem): Node {
  return document.createTextNode(contentItem ? contentItem.text ?? '' : '')
}
```

#### 4. 定义回显输入内容时控制 `tag` 插入位置的方法
```ts
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

function resetSelectionCollapse(range: Range) {
  const selection = window.getSelection()
  selection?.removeAllRanges() // 重新定义焦点位置
  selection?.addRange(range)
  tagTextEditorRef.value?.focus()
}
```

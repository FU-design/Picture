---
Created At: 8/1/2025, 4:22:47 PM
Updated At: 8/4/2025, 9:32:20 AM
File Name: Set
---

### 概述：

`Set` 是一种集合数据结构，它类似于数组，但成员的值都是唯一的，没有重复的值。

### 特性：

- 唯一性: 值不重复
- 无序性: 没有索引值
- 可迭代性: 可用 `for...of` 和 `forEach` 遍历

### 常用方法：

- `add(value)`：添加一个值，返回 Set 本身。
- `delete(value)`：删除某个值，返回布尔值表示是否删除成功。
- `has(value)`：判断是否存在某个值，返回布尔值。
- `clear()`：清空所有值。
- `size`：返回 Set 中值的数量。

### 应用场景：

1. 数组去重（普通数组去重）
2. 避免重复操作（表单提交操作等）
3. 关系型数据管理（高效查找）

    ```js
    // 社交网络好友关系
    const userRelations = new Map()

    function addFriend(userId, friendId) {
      const friends = userRelations.get(userId) || new Set()
      friends.add(friendId)
      userRelations.set(userId, friends)
    }

    // 检查是否是好友：O(1)
    function isFriend(userId, friendId) {
      return userRelations.get(userId)?.has(friendId) ?? false
    }
    ```
4. WeakSet 特殊场景 (弱引用特性避免内存泄漏)
    ```js
    // DOM 元素追踪
    const trackedElements = new WeakSet()

    function trackElement(element) {
      trackedElements.add(element)
    }

    // 检查是否被追踪过
    function isTracked(element) {
      return trackedElements.has(element)
    }

    // 当元素被移除DOM后，WeakSet自动释放引用
    ```

---

### 选择 Set 的决策树
1. 需要快速判断元素是否存在？ → ✅
2. 需要自动保证元素唯一性？ → ✅
3. 需要处理集合数学运算？ → ✅
4. 需要有序存储或索引访问？ → ❌（选择 Array）
5. 需要存储重复元素？ → ❌（选择 Array）
6. 需要存储原始值和对象引用？ → ✅

---

**性能对比**（V8 引擎基准测试）：
| 操作     | Array | Set  |
| -------- | ----- | ---- |
| 查找元素 | O(n)  | O(1) |
| 添加元素 | O(1)  | O(1) |
| 删除元素 | O(n)  | O(1) |
| 遍历速度 | 更快  | 稍慢 |

掌握这些场景后，可以更精准地在以下场景选择 Set：
- 高频存在性检查
- 需要数学集合操作
- 需要自动去重
- 处理唯一标识管理
- 需要弱引用管理的特殊场景（WeakSet）

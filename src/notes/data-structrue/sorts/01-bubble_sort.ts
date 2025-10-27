/**
 * 冒泡排序：相邻元素不断进行大小对比和互换位置（每一轮（外层 i 的一次循环）都会把 最大的元素 冒泡到“当前未排序部分”的末尾）
 * 时间复杂度：平均-O(n^2) 最优-O(n) 最坏-O(n^2)
 * 空间复杂度: O(n)（复制版） / O(1)（原地版）
 */
function bubbleSort(arr: number[]) {
  // 这里需要 -1: 既可以减少外层一次循环，还避免了内层 j=5 时会出现数组下标越界的问题（arr[6]的情况）
  const n = arr.length - 1
  for (let i = 0; i < n; i++) {
    let swapped = false // 对每次循环开始添加一个是否交换顺序的标识，若当前的数组一开始就是有序的则无需在进入循环
    for (let j = 0; j < n - i; j++) { // - i 是为了 每轮减少比较范围; 因为每完成一轮，末尾已有一个元素处在最终位置，不需要再参与比较。
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]] // 解构赋值
        swapped = true
      }
    }
    if (!swapped) {
      break
    }
  }
  return arr
}

// Driver Code
const arr2 = [10, 7, 8, 9, 1, 5]

// call BubbleSort on the entire array
console.warn(bubbleSort(arr2))

const arr = [5, 3, 8, 4, 2]
const profile = [
  { name: 'A', group: 'A', score: 90 },
  { name: 'B', group: 'B', score: 85 },
  { name: 'C', group: 'A', score: 95 },
]

// ======================================== 拓展 ========================================

/**
 * 多关键字排序
 * @param arr
 * @param compare
 * @returns 返回排序后的新数组
 */
function bubble<T>(
  arr: T[],
  compare: (a: T, b: T) => number,
): T[] {
  const result = [...arr]
  let len = result.length
  let swapped = true

  while (swapped) {
    swapped = false
    for (let i = 0; i < len - 1; i++) {
      if (compare(result[i], result[i + 1]) > 0) {
        [result[i], result[i + 1]] = [result[i + 1], result[i]]
        swapped = true
      }
    }
    len--
  }

  return result
}

console.warn(bubble(arr, (a, b) => a - b))
console.warn(bubble(bubble(profile, (a, b) => a.group.localeCompare(b.group)), (a, b) => b.score - a.score))

const sorted = bubble(profile, (a, b) => {
  // 先比较 group
  const groupOrder = a.group.localeCompare(b.group)
  if (groupOrder !== 0)
    return groupOrder

  // 再比较 score（降序）
  return b.score - a.score
})

console.warn(sorted)

/**
 * 鸡尾酒排序（双向冒泡排序）
 * @param arr
 * @returns 返回排序后的数组
 */
function TwoWayBubbleSort(arr: number[]) {
  let left = 0
  let right = arr.length - 1

  while (left < right) {
    for (let j = left; j < right; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
    right--

    for (let j = right; j > left; j--) {
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
      }
    }
    left++
  }

  return arr
}

console.warn(TwoWayBubbleSort([5, 3, 8, 4, 2])) // [2, 3, 4, 5, 8]

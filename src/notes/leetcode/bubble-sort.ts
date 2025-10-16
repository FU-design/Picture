/**
 * 冒泡排序（Bubble Sort）是“不断交换相邻元素”
 */

const arr = [5, 3, 8, 4, 2]
const profile = [
  { name: 'A', group: 'A', score: 90 },
  { name: 'B', group: 'B', score: 85 },
  { name: 'C', group: 'A', score: 95 },
]

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
 * 冒泡排序
 * @param arr
 * @returns 返回排序后的数组
 */
function bubbleSort(arr: number[]) {
  const n = arr.length - 1
  for (let i = 0; i < n; i++) {
    let swapped = false
    for (let j = 0; j < n - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
      }
    }
    if (!swapped)
      break
  }
  return arr
}

console.warn(bubbleSort([5, 3, 8, 4, 2])) // [2, 3, 4, 5, 8]

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

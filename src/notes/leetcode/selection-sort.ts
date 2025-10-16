/**
 * 选择排序（Selection Sort）是“每轮选择最值然后放到正确位置”
 * 1. 在未排序序列中找到最小（或最大）元素，放到已排序序列的末尾
 * 2. 每轮只做一次“确定性放置
 *
 * 选择排序无论是否有序，都要扫描剩余元素 最优和最坏都是 O(n^2)
 */

const arr = [5, 3, 8, 4, 2]

function selectionSort(arr: number[]) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j] - arr[minIdx] < 0) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
    }
  }
}

console.warn(selectionSort(arr))

/**
 * 快速排序 - 不稳定排序
 * 通过分治（Divide and Conquer）思想，把大问题拆成小问题来解决。
 *
 * 1. 选择一个基准值（pivot）
 * 2. 分区（partition）：把数组分成两部分：左边所有元素 < pivot；右边所有元素 ≥ pivot
 * 3. 递归地对左右两部分重复以上过程
 * 4. 最终左右子数组都变成有序的，整个数组自然也就有序
 *
 * 使用场景： 大量随机数据排序、性能敏感的场景
 *
 * 时间复杂度：最优 O(nlogn) 平均 O(nlogn) 最坏 O(n^2)
 *
 */

const temp_data = [6, 3, 8, 5, 2, 7, 4, 1]

/**
 * 经典写法（非原地）
 * @param arr
 * @returns 排序后的数组
 */
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1)
    return arr

  const pivot = arr[Math.floor(arr.length / 2)]

  const left: number[] = []
  const right: number[] = []

  for (let i = 0; i < arr.length; i++) {
    if (i === Math.floor(arr.length / 2))
      continue
    if (arr[i] < pivot)
      left.push(arr[i])
    else right.push(arr[i])
  }

  return [...quickSort(left), pivot, ...quickSort(right)]
}

console.warn(quickSort(temp_data))

function newQuickSort(arr: number[], lowIndex: number, highIndex: number, isTowPointer = false): number[] {
  if (lowIndex >= highIndex)
    return arr

  const pivotIndex = (isTowPointer ? partition_TowPointer : partition)(lowIndex, highIndex, arr) // 当前 枢轴 的索引位置，用于界定左右分区

  // 递归左右区间
  newQuickSort(arr, lowIndex, pivotIndex - 1) // 左区间
  newQuickSort(arr, pivotIndex + 1, highIndex) // 右区间

  return arr
}

/**
 * i/j 指针法
 * 原地排序-空间复杂度同样 O(log n)
 * 交换次数多；数组有序或几乎有序，最坏情况 O(n²)
 *
 * @param left
 * @param right
 * @param arr
 * @returns 排序后的数组
 */
function partition(left: number, right: number, arr: number[]): number {
  const pivot = arr[right] // 选最右作为基准
  let i = left - 1

  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  // 最后把 pivot 放到正确位置
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]

  return i + 1
}

/**
 * 双指针(左右指针相向)
 * 原地排序-空间复杂度同样 O(log n)
 * 交换次数少；数组有序或几乎有序，最坏情况 O(n²)；直观符合“左右夹逼”的直觉，容易理解分区过程。
 *
 * @param lowIndex 低索引
 * @param highIndex 高索引
 * @param arr
 * @returns 当前左指针的位置
 */
function partition_TowPointer(lowIndex: number, highIndex: number, arr: number[]): number {
  const pivot = arr[highIndex]

  let leftPointer = lowIndex
  let rightPointer = highIndex

  // 让左右指针不断的靠近，并在符合条件的时候进行元素的位置交换，直到两者相遇
  while (leftPointer < rightPointer) {
    while (arr[leftPointer] <= pivot && leftPointer < rightPointer) {
      leftPointer++
    }

    while (arr[rightPointer] >= pivot && leftPointer < rightPointer) {
      rightPointer--
    }

    swap(arr, leftPointer, rightPointer)
  }

  // 当左右指针相遇时，需要将 pivot 的索引和 左指针指向 的索引位置进行互换
  swap(arr, leftPointer, highIndex)

  return leftPointer
}

/**
 * 元素位置交换
 * @param arr
 * @param i
 * @param j
 */
function swap(arr: number[], i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

console.warn(newQuickSort(temp_data, 0, temp_data.length - 1))

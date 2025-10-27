/**
 * 插入排序：每次从未排序部分拿出一个元素，放到已排序部分的合适位置。（外层循环遍历未排序元素，内层循环处理已排序区间）
 * 时间复杂度：平均-O(n^2) 最优-O(n) 最坏-O(n^2)
 * 空间复杂度: O(1) 原地排序（in-place），不需要额外的存储空间
 */
function insertSort(arr: number[]) {
  const n = arr.length
  for (let i = 1; i < n; i++) { // 这里的 i 之所以从 1 开始；因为数组的第一个元素是天然的已排好序的
    const key = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
  }
  return arr
}

// Driver Code
const arr = [10, 7, 8, 9, 1, 5]

// call InsertSort on the entire array
console.warn(insertSort(arr))

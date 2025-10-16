// 插入排序就像整理手牌：
// 每次从未排序部分拿出一个元素，放到已排序部分的合适位置。

// 已排序部分保持有序

// 每次从未排序部分取元素，插入到合适位置

const arr = [5, 3, 8, 4, 2]

function insertSort(arr: number[]) {
  const n = arr.length

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1
    for (j; j >= 0; j--) {
      if (arr[j] > key) {
        arr[j + 1] = arr[j]
      }
      else {
        break
      }
    }
    arr[j + 1] = key
  }
  return arr
}

console.warn(insertSort(arr))

function insertSort2(arr: number[]) {
  const n = arr.length

  for (let i = 1; i < n; i++) {
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

console.warn(insertSort2(arr))

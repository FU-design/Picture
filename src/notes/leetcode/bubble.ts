const arr = [5, 3, 8, 4, 2]
const profile = [
  { name: 'A', group: 'A', score: 90 },
  { name: 'B', group: 'B', score: 85 },
  { name: 'C', group: 'A', score: 95 },
]

function bubble<T>(
  arr: T[],
  compare: (a: T, b: T) => number,
): T[] {
  const result = [...arr]
  let len = result.length
  let swapped = true

  while (swapped) {
    console.warn([...result])
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

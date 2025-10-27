/*
 * @Author: fuliqiang 1348994179@qq.com
 * @Date: 2025-10-17 10:38:36
 * @LastEditors: fuliqiang 1348994179@qq.com
 * @LastEditTime: 2025-10-27 13:52:14
 * @FilePath: /Picture/src/notes/leetcode/3. 无重复字符的最长子串.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @description 这里利用了 “滑动窗口” + “哈希集合（Set）”
 *
 * 滑动窗口：就是一个可扩展，可收缩的区间，因为在是不是的变换，很类似一个滑动的窗口
 *         这里的 left 就是窗口的左边界； right 就是窗口的右边界。
 *
 * @param s
 * @returns
 */

function lengthOfLongestSubstring(s: string): number {
  const set = new Set<string>([])
  let left = 0
  let maxLen = 0

  let start = 0 // 记录最长子串的起点

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left])
      left++
    }

    set.add(s[right])

    // 当前窗口的长度
    const currentLen = right - left + 1

    if (currentLen > maxLen) {
      maxLen = currentLen
      start = left
    }
  }

  // 提取最长子串
  const substring = s.slice(start, start + maxLen)
  console.warn(substring)

  return maxLen
};

console.warn(lengthOfLongestSubstring('abcabcbb')) // 3 'abc'

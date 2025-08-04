---
Created At: 8/1/2025, 4:22:24 PM
Updated At: 8/4/2025, 9:34:25 AM
File Name: js精度问题
---

# toFixed 方法无法处理的精度问题（四舍五入）

解决方法：
```js
function roundFixedForES5(num, decimals) {
  decimals = typeof decimals === 'number' ? decimals : 2
  const EPSILON = 2.220446049250313e-16
  const factor = 10 ** decimals
  return Math.round((num + EPSILON) * factor) / factor
}

function roundFixed(num, decimals = 2) {
  const factor = 10 ** decimals // 比如 2 位小数就是 100
  return Math.round((num + Number.EPSILON) * factor) / factor
}
```

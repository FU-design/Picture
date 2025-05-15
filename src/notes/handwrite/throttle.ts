/**
 * 事件，按照一定的时间间隔进行触发，即时多次触发该事件，也只有等到当前时间间隔大于触发阈值。
 * 场景：拖拽（DOM元素的拖拽），缩放（浏览器的resize），滚动（滚动加载），动画等等
 */

// // 时间戳方式实现
// export function throttleByDate(func, delay) {
//   let last = 0
//   const throttled = function (...args) {
//     const now = +new Date()
//     if (now - last > delay) {
//       last = now
//       func.apply(this, args)
//     }
//   }
//   return throttled
// }

// // 计时器方式实现
// export function throttleBySetTimeout(func, delay) {
//   let timer = null
//   const throttled = function (...args) {
//     if (!timer) {
//       timer = setTimeout(() => {
//         func.apply(this, args)
//         timer = null
//       }, delay)
//     }
//   }
//   return throttled
// }

interface ThrottleOptions {
  leading?: boolean // 是否在开始时立即执行一次
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: ThrottleOptions = {},
): (..._args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastTime = 0
  let context: any
  let args: any[] | null = null

  const throttled = function (this: ThisParameterType<T>, ..._args: Parameters<T>) {
    const now = Date.now()
    if (!lastTime && options.leading === false) {
      lastTime = now
    }

    const remaining = delay - (now - lastTime)
    context = this
    args = _args

    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastTime = now
      func.apply(context, args)
      args = context = null
    }
  }

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    lastTime = 0
    args = context = null
  }

  return throttled
}

setInterval(
  throttle(() => {
    console.warn(1)
  }, 3000, { leading: true }),
  2000,
)

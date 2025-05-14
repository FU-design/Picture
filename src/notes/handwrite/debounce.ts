/**
 * 防抖 多次同一个操作，只在最后一次执行一次该操作。
 */

// 简单版本
export function debounce(func: any, delay: number) {
  let timer: NodeJS.Timeout
  return (...args: any) => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      func(args)
    }, delay)
  }
}

// 可选择是否在第一次触发时，立即执行操作
export function debounceImmediate(func: any, delay: number, immediate: boolean = false) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let result: any
  let _this: any = null
  let _args: any[] | null = null

  const debounced = function (this: any, ...args: any) {
    _this = this!
    _args = args

    const callNow = immediate && timer == null
    clearTimeout(timer!)
    timer = setTimeout(() => {
      timer = null
      if (!immediate && _args) {
        result = func.apply(_this, _args)
      }
    }, delay)

    if (callNow) {
      result = func.apply(_this, _args)
    }

    return result
  }

  return debounced
}

// 可在防抖过程中取消后续操作
export function debounceCancel(func: any, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let result: any
  let _this: any = null
  let _args: any[] | null = null

  const debounced = function (this: any, ...args: any) {
    _this = this!
    _args = args

    clearTimeout(timer!)
    timer = setTimeout(() => {
      timer = null
      if (_args) {
        result = func.apply(_this, _args)
      }
    }, delay)
    return result
  }

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
      _this = null
      _args = null
      return result
    }
  }

  return debounced
}

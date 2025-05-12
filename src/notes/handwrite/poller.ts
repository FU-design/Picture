/**
 * 使用 setTimeout 实现轮询方法
 * 1. 相对于使用 SetInterval，SetTimeout可避免出现请求任务堆积的性能问题
 * 2. 首次立即执行
 * 3. 中途取消
 * 4. 强制执行
 */
type PollFn<T, A extends any[]> = (...args: A) => Promise<T>
type ErrorHandler = (error: any) => void

interface Poller<T, A extends any[]> {
  start: (...args: A) => void
  cancel: () => void
  flush: () => Promise<T> | null
}

export function creatPoller<T, A extends any[]>(func: PollFn<T, A>, wait: number, immediate: boolean, onError: ErrorHandler): Poller<T, A> {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastPromise: Promise<T> | null = null
  let lastArgs: A

  const run = async () => {
    try {
      lastPromise = func(...lastArgs)
      await lastPromise
    }
    catch (error) {
      if (onError) {
        onError(error)
      }
      else {
        console.error('轮询函数执行出错:', error)
      }
    }
    timer = setTimeout(run, wait)
  }

  return {
    start(...args: A) {
      lastArgs = args
      if (timer)
        return
      if (immediate) {
        run()
      }
      else {
        timer = setTimeout(run, wait)
      }
    },
    cancel() {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    },
    flush() {
      if (timer) {
        clearTimeout(timer)
        timer = null
        run()
        return lastPromise
      }
      return null
    },
  }
}

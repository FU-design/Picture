/**
 * 角度转弧度
 * @param deg 角度
 */
export function degTrigger(deg: string): number {
  return Number.parseInt(deg.replace('deg', '')) * (Math.PI / 180)
}

/**
 * 弧度转角度
 * @param rad 弧度
 */
export function radTrigger(rad: string): number {
  return Number.parseInt(rad.replace('rad', '')) * (180 / Math.PI)
}

/**
 * 复制文本到剪贴板
 * @param {string} text 复制的字符串
 */
export function copyText(text: string): Promise<any> {
  // 默认使用浏览器自带api
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  // 浏览器不支持 clipboard Api 时使用 ClipboardJS
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const { default: ClipboardJS } = await import('clipboard')
      // 判断浏览器是否支持
      if (!ClipboardJS.isSupported()) {
        reject(new Error('ClipboardJS not support!'))
        return
      }
      const btn = document.createElement('button')
      btn.textContent = text
      const clipboard = new ClipboardJS(btn, {
        text: () => text,
      })
      clipboard.on('success', () => {
        resolve(true)
        clipboard.destroy()
      })
      clipboard.on('error', (err: Error) => {
        reject(err)
        clipboard.destroy()
      })
      btn.click()
    }
    catch (error) {
      console.error('copytext :>> ', error)
    }
  })
}

/**
 * 获取图片地址 jpg
 * @param name
 */
export function getImageUrl(name?: string, txt = 'png') {
  return new URL(`../assets/images/${name}.${txt}`, import.meta.url).href
}

/**
 * 获取图片地址 svg
 * @param name
 * @param fileName
 */
export function getSvgUrl(name: string, fileName?: string) {
  const path = fileName ? `../assets/svg/${fileName}/${name}.svg` : `../assets/svg/${name}.svg`
  return new URL(path, import.meta.url).href
}

/**
 * 节流
 * @param func
 * @param delay
 */
export function throttle(func: (...args: any[]) => void, delay: number) {
  let lastCall = 0
  return function (...args: any[]) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return func(...args)
  }
}

/**
 * 从给定的文件路径中提取不带扩展名的文件名。
 * @param filePath 文件的完整路径。
 * @returns 提取到的不带扩展名的文件名。
 */
export function extractFileNameWithoutExtension(filePath: string): string {
  // 正则表达式用于匹配文件名（不含扩展名）
  const fileNameRegex = /\/([^/.]+)\.[^/]+$/
  const match = filePath.match(fileNameRegex)
  if (match) {
    // 返回匹配到的文件名（不含扩展名）
    return match[1]
  }
  // 如果没有匹配到，则返回空字符串
  return ''
}

/**
 * 比较两个数组是否相等
 * @param arr1
 * @param arr2
 */
export function isArraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!isObjectEqual(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
}

/**
 * 递归数组中每个对象中的元素及元素值是否相等
 * @param obj1
 * @param obj2
 */
export function isObjectEqual(obj1: any, obj2: any): boolean {
  if (!obj1 && !obj2) {
    return true
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }
  for (const key of Object.keys(obj1)) {
    const val1 = obj1[key]
    const val2 = obj2[key]

    if (typeof val1 === 'object' && typeof val2 === 'object') {
      // 递归比较对象的属性值
      if (!isObjectEqual(val1, val2)) {
        return false
      }
    }
    else {
      // 直接比较基本类型的属性值
      if (val1 !== val2) {
        return false
      }
    }
  }
  return true
}

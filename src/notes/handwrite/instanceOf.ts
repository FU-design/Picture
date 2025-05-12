export function myInstanceOf(instance: any, constructor: any) {
  // 1. 对 null/undefined 和基本类型直接返回 false
  if (instance == null || (typeof instance !== 'object' && typeof instance !== 'function')) {
    return false
  }

  // 2. 支持自定义 Symbol.hasInstance
  if (typeof constructor[Symbol.hasInstance] === 'function') {
    return !!constructor[Symbol.hasInstance](instance)
  }

  // 3. 沿原型链查找
  let proto = Object.getPrototypeOf(instance)
  const prototype = constructor.prototype

  while (proto) {
    if (proto === prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

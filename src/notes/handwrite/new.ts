// 只对函数类型生效
export function oldMineNew<T extends object>(
  constructor: new (...args: any[]) => T,
  ...args: any[]
): T {
  if (typeof constructor !== 'function') {
    throw new TypeError('constructor is not a function')
  }
  const obj = Object.create(constructor.prototype)
  const result = constructor.apply(obj, args)
  return (typeof result === 'object' && result !== null) ? result as T : obj
}

// 对函数和ES6中的类构造函数均可生效
/**
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct
 * 当使用Object.create()和Function.prototype.apply()时，如果不使用new操作符调用构造函数，构造函数内部的new.target值会指向undefined。
 * 当调用Reflect.construct()来创建对象，new.target值会自动指定到target（或者 newTarget，前提是 newTarget 指定了）。
 */
export function mineNew<T extends new (...args: any[]) => any>(
  constructor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  if (typeof constructor !== 'function') {
    throw new TypeError('constructor is not a function')
  }
  const instance = Reflect.construct(constructor, args)
  return instance
}

let activatedEffect = null

export function effect(fn) {
  activatedEffect = fn
  fn()
  activatedEffect = null
}

export function reactive(obj) {
  const effectMap = {}
  return new Proxy(obj, {
    get(target, key) {
      if (activatedEffect) {
        if (!effectMap[key]) {
          effectMap[key] = []
        }
        effectMap[key].push(activatedEffect)
      }
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      effectMap[key].forEach(fn => fn())
      return true
    },
  })
}

export function ref(value) {
  return reactive({ value })
}

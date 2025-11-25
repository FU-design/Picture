- watchEffect使用时的注意点
```html
<button @click=onClick>+</button>
```
```ts
const clicked = ref(false)
const obj = ref(0)

watchEffect(() => {
  if (clicked.value) {
    console.log(obj.value) // 此代码不会执行到: 在第一次收集依赖时，是没有收集到的
  }
})

watchEffect(async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve([1, 2, 3])
    }, 1000)
  })
})

console.log(obj.value) // 此代码不会执行到: 在初始执行时，会讲该任务放到微任务队列中，在effect函数中处于挂起的状态，此时 effect 中的作为临时存储回调函数的变量会被清空；此时放在头部的话是可以的

function onClick() {
  clicked = true
}
```

- 大屏自适应解决方法

```md
v-scale-screen
```

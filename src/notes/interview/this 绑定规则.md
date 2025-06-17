# this 四大绑定规则（和优先级）

### 1. 默认绑定（最低优先级）

规则：<font color=yellow>函数独立调用时，this 指向全局对象</font>

环境差异：

```js
// 浏览器
function test1() {
  console.log(this === window) // true
}

// Node.js
function test2() {
  console.log(this === globalThis) // true
}

// 严格模式：
'use strict'
function strictShow() {
  console.log(this) // undefined
}
```

### 2. 隐式绑定（方法调用）

规则：<font color=yellow>函数作为方法调用时，this 指向调用对象</font>

```js
const car = {
  brand: 'Tesla',
  start() {
    console.log(`${this.brand} starting...`)
  }
}

car.start() // "Tesla starting..." (this = car)
```

易错点：方法赋值给变量时绑定丢失

```js
const startFn = car.start

startFn() // "undefined starting..." (this = window/global)
```

### 3. 显式绑定（强制绑定）

方法：call()、apply()、bind()

区别：
```js
function introduce(lang) {
  console.log(`${this.name} codes in ${lang}`)
}

const dev = { name: 'Alice' }

// 立即执行
introduce.call(dev, 'JavaScript') // Alice codes in JavaScript
introduce.apply(dev, ['Python']) // Alice codes in Python

// 创建新函数（延迟执行）
const boundFn = introduce.bind(dev)
boundFn('Java') // Alice codes in Java
```

### 4. new 绑定（构造函数）

规则：<font color=yellow>使用 new 调用时，this 指向新创建的对象</font>

底层原理：
```js
function Person(name) {
  // new 操作符自动完成：
  // 1. this = {}
  // 2. 执行构造函数逻辑
  this.name = name
  // 3. return this (隐式)
}

const p = new Person('Bob')
console.log(p.name) // "Bob"
```

## 两种特殊规则

### 箭头函数（Lexical this）

规则：继承外层作用域的 this（定义时绑定）

对比普通函数：
```js
const obj = {
  value: 42,
  normal() {
    setTimeout(function () {
      console.log(this.value) // undefined (默认绑定)
    }, 100)
  },
  arrow() {
    setTimeout(() => {
      console.log(this.value) // 42 (继承 arrow 的 this)
    }, 100)
  }
}

obj.normal()
obj.arrow()
```

### DOM 事件处理

规则：事件处理函数中 this 指向触发事件的元素

```html
<button onclick="console.log(this)">Click</button>
<!-- 输出 <button> 元素 -->
```

# 优先级总结（从高到低）
- new 绑定：new Foo()
- 显式绑定：foo.call(obj)
- 隐式绑定：obj.foo()
- 默认绑定：foo()

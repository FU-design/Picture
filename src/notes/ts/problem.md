```js

// 以下是 js 存在的类型运算时的特点，但在 ts 中是会报错的


[] + [] // ''
{} + [] // 0
[] + {} // '[object Object]'
"hello" - 1 // NaN
{} + {} // NaN


console.log(5 == "5"); // true   
console.log(5 === "5"); // false 


console.log("" == "0"); // false
console.log(0 == ""); // true

console.log("" === "0"); // false
console.log(0 === ""); // false



// Both null and undefined are only `==` to themselves and each other:
console.log(null == null); // true 
console.log(undefined == undefined); // true 
console.log(null == undefined); // true


// You don't have to worry about falsy values making through this check
console.log(0 == undefined); // false
console.log('' == undefined); // false
console.log(false == undefined); // false
```
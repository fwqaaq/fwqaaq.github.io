---
title: js中的this
date: 2022-01-04 21:01:21
author: Jack-zhang
categories: JS
tags:
   - JS
summary: js中this的情况
---

## this指向问题

1. 在全局作用域下,this指向的window
2. 在函数中调用,指的是函数创建的执行上下文的信息

```js
function bar(){
  console.log(this)
}

//1.直接调用
bar()//window

//2.在对象中调用
const obj = {
  name:"zhangsan",
  bar:bar
}
obj.bar()//{name: 'zhangsan', bar: ƒ}

//3.绑定对象
bar.call("abc")//String {'abc'}
```

## 隐式绑定和显示绑定

### 隐式绑定

>它的调用位置中,是通过某个对象发起的函数调用

1. 通过对象调用函数
   * obj2又引用了obj1对象,再通过obj1对象调用foo函数
   * 最后实际调用的是obj1对象

   ```js
   function foo() {
     console.log(this)
   }
   let obj1 = {
     name: "obj1",
     foo: foo
   }
   let obj2 = {
     name: "obj2",
     obj1: obj1
   }
   obj2.obj1.foo()
   ```

2. 隐式丢失
   * 将以上调用赋值给一个变量,结果最终会是window
   * 在a被调用的位置没有进行过任何绑定,形成隐式绑定

   ```js
   let a=obj2.obj1.foo
   a()
   ```

3. 注意点
   * 必须在调用的**对象内部**有一个对函数的引用(比如一个属性)
   * 如果没有这样的引用,在进行调用时,会报找不到该函数的错误
   * 正是通过这个引用,间接的将this绑定到了这个对象上

### 显示绑定(call,apply,bind)

>bind是返回对应函数,便于稍后调用.apply,call 则是立即调用

```js
function getName() {
  console.log("此人" + this.name)
}
let person = {
  name: "zhangsan"
}
getName.call(person)//此人zhangsan
getName.apply(person)//此人zhangsan
```

* 可以借助`call`或`apply`将函数的作用域绑定到对象中

### apply和call

>apply,call除了接收参数不同,作用完全一样.
>>apply接收的第二个参数是一个数组
>>call需要把参数按顺序传进去

* 稍微改造一下上面的例子,就很容易理解:

```js
function getName(a1, a2) {
  console.log("此人" + this.name, "岁数" + (a1 + a2))
}
let person = {
  name: "zhangsan"
}
getName.call(person, 11, 12)
//此人zhangsan 岁数23
getName.apply(person, [11, 12])
//此人zhangsan 岁数23
```

>`arguments`对象是所有函数中(除箭头函数)都可用的局部变量.你可以使用`arguments`对象在函数中引用函数的参数.此对象包含传递给函数的每个参数,第一个参数在索引0处

```js
function func1() {
console.log(arguments[0])//1
console.log(arguments[1])//2
console.log(arguments[2])//3
}

func1(1, 2, 3)
```

* `arguments`是一个传递给函数参数的**类数组对象**(不是数组).函数本身没有形参也可以取到传入的实参
* `...`:k扩展运算符的使用,也是ES6中为了取代`arguments`中新增的
* 使用log代理console.log:第一个参数主要是绑定this,所以可以写成null

```js
//利用arguments
function log() {
  console.log.apply(null, arguments)
}
//利用...
function log(...args) {
  console.log(...args)
}
log(1, 3, 5)
```

> 将**arguments伪数组**转换为数组

```js
Array.prototype.splice.call(arguments, 0)
Array.prototype.slice.call(arguments)
Array.prototype.concat.apply([], arguments)
Array.from(arguments)
```

### bind

>`bind()`会返回一个新函数，使这个函数不论怎么调用都有同样的this值

* bind的第二个参数和call一样,需要把参数按顺序传进去

```js
function bar(a1, a2) {
  console.log(this, a1 + a2)
}
const obj = {
  name: "zhangsan",
  bar: bar
}
bar.bind(obj, 1, 2)()
//{name: 'zhangsan', bar: ƒ} 3
```

>bind的特性:返回一个新函数,柯里化.这两个是最重要的

* 柯里化就是将多个参数的函数转换成每次只传一个参数的函数

```js
function test(a, b, c, d) {
  return a + b + c + d
}
let outTest = test.bind(null, 1).bind(null, 2).bind(null, 3).bind(null, 4)
console.log(outTest())
console.log(outTest.length)
```

* 并且bind每次绑定一个实参,`Function.length`(函数期望的参数数量)就会减少一个

## 内置函数中的this

### 数组的方法

>例如map,forEach等等

```js
const obj = {
  name: "zhangsan"
}
const array = [1, 2, 3];
array.map(function(value){
  console.log(this.name)
}, obj)//三次zhangsan
```

* <span style="color:red">不能使用箭头函数,因为箭头函数自身没有this</span>

### setTimeout

>此方法是bom对象内置的,回调函数的this也是指向window的

```js
setTimeout(function(){
  console.log(this)//window
},1000)
```

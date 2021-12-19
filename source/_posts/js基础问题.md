---
title: js基础问题
date: 2021-10-29 22:59:50
author: Jack-zhang
categories: JS
tags:
   - JS
summary: js的基本语法
---

## **变量**

> var,let,const三种变量

### [**var关键字**](#var关键字)

* var的声明提升
  * 所谓的声明提升,就是把所有的变量声明到函数作用域的最顶部.可以反复多次用var声明同一个变量

* 使用var声明的变量会变成window对象的属性

```js
function(){
  console.log(age)//undefined
  var age = 16
}
```

> 这个等同于以下这种的状况

```js
function(){
  var age
  console.log(age)//undefined
  age = 16
}
```

### [**let关键字**](#let关键字)

> 使用let会产生<span style="color:red">暂时性死区</span>

* let声明变量时,如果在let之前引用此变量,let声明之前的执行瞬间被称为"<span style="color:red">暂时性死区</span>"

```js
console.log(age)//ReferenceError:age没用定义
let age = 1
```

* 全局声明:使用let在全局作用域中声明的变量不会成为window对象的属性

### [**const关键字**](#const关键字)

>与let基本相同,如果尝试修改const声明的变量会导致运行时错误

* 如果const变量引用的时一个对象,那么修改这个对象的内部属性并不违反const限制
  * 即不能修改该该变量引用的地址值,而通过地址值可以修改对象内部的属性

### 声明风格

> 不使用var,const优先,let次之

* 使用const可以让浏览器运行时强制保持变量的不变,也可以让静态的代码分析工具提前发现不合法的操作

## [数据类型](#数据类型)

> [基本数据类型](#引用数据类型)和[引用数据类型](#引用数据类型)

* **typeof**操作符
  * 使用typeof操作符确定任意变量的数据类型

### [基本数据类型](#基本数据类型)

>undefined,null,boolean,number,string,symbol,object

* **`null`**:表示一个空对象
* **`undefined`**:由null派生而来
  * 如果使用var或者let声明了变量而为初始化时,就是`undefined`
  * 未初始化的变量会被自动赋予`undefined`,建议在声明变量的时候初始化.
* **`Boolean`**:

| 数据类型  | 转换为true         | 转换为false |
| --------- | ------------------ | ----------- |
| String    | 空字符串           | 非空字符串  |
| Number    | 非零数值(包括无穷) | 0           |
| Object    | 任意对象           | null        |
| Undefined | 不存在             | undefinfed  |

#### **`Number`**

> 值的范围:`-Infinity` ~ `Infinity`

* **NaN**:意思是`不是数值`

> 转换为数值类型

* `Number()`是转型函数,可以用于任何类型的转换
* `paresInt()`用于字符串转换为number类型,可以解析任何进制的
  * 传入一个浮点数字符,只会返回一个整数字符
  * 第二个参数用于指定进制数

```js
let num1 = parseInt("10",2)//二进制
let num2 = parseInt("10",8)//八进制
let num3 = parseInt("10",10)//十进制
let num4 = parseInt("10",16)//十六进制
```

* `parseFloat()`只用于转换十进制字符,可以转换浮点数字符

```js
let num1 = parseFloat("22.3")//22.3
```

#### String类型

* length属性返回字符数(包括空字符串)

> 转化为字符串

* 使用`toString()`方法可见于数值,布尔类型,对象和字符串值.
  * <span style="color:red">null和undefined没有toString()方法</span>
  * 如果是数值类型可以传一个进制
  
```js
let num = 10
console.log(num.toString(2))//"1010"
console.log(num.toString(8))//"12"
```

#### Symbol类型

> 略

#### Object类型

>略

### [引用数据类型](#引用数据类型)

>* 引用数据类型,变量在栈内存中存储的是堆内存中的地址值(函数名和引用型变量以及全局变量)
>* 值得注意的是:局部的基本数据类型变量在栈内存初始化

```js
const obj1 = new Object()
const obj2 = obj1
obj1.name = "jack"
console.log(obj2.name)//"jack"
```

* ![引用类型](https://www.zyjcould.ltd/img/markdown%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B.png)

* obj1保存的是这个实例对象的地址,obj2也是引用的实例的地址值(即浅拷贝)
  * 在给obj1增加属性name的时候,obj2同时也能访问到(深拷贝)
  * 因为他们同时指向同一个对象

## 函数

> 函数是`javasceipt`中的一等公民,会在其作用域提升,率先执行

```js
var a
function a(){}
console.log(a)
//ƒ a(){}
```

1. 箭头函数中没有this
2. js函数中没有重载

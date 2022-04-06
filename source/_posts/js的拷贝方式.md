---
title: js的拷贝方式
date: 2021-10-20 21:00:51
author: Jack-zhang
categories: JS
tags:
   - JS
summary: js的拷贝方式
---

## 浅拷贝与深拷贝

![浅拷贝与深拷贝](拷贝.png)

### 浅拷贝

> 浅拷贝复制的是<span style="color:red">对象的引用(地址值)</span>,指向的是堆内存

```js
const a = {x:1,y:2}
const b = a 
```

* a拿到的是对象的地址值,b是引用类型变量,拿到的是同属于对象的地址值

#### 浅拷贝的实现

1. 通过手动直接赋值

2. **Object.assign()**

> 将所有可枚举的 自身属性从一个或多个 源对象复制到目标对象.它返回修改后的目标对象.

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

* 当Object只有一层的时候是深拷贝
* 当Object有多层包裹的时候,被包裹的多层是浅拷贝

```js
const target = { name: "zhangsan" }
const source = { father: "zhanger", mother: "wangwu",friends: { name: "lisi" } }
const returnedTarget = Object.assign(target, source)
  
returnedTarget.friends.name = "zhaoliu"
returnedTarget.mother = "wangba"
console.log(target)
//{name: 'zhangsan', father: 'zhanger', mother: 'wangba', friends: {name: 'zhaoliu'}}
console.log(source)
//{father: 'zhanger', mother: 'wangwu', friends: {name: 'zhaoliu'}}
console.log(returnedTarget)
//{name: 'zhangsan', father: 'zhanger', mother: 'wangba', friends: {name: 'zhaoliu'}}
```

* 返回的对象就是目标对象

3. 使用扩展运算符(...)

> 扩展运算符与**Object.assign()**功能相同

```js
const obj1 = { name: "zhangsan", friends: { name: "lisi", age: 12 } }
const obj2 = { ...obj1 }
obj1.name = "wangba"
obj1.friends.name = "liuneng"
console.log(obj2)
//{name: 'zhangsan', friends: {name: 'liuneng', age: 12}}
```

### 深拷贝

> 深拷贝是彻底复制一个对象,而不是复制对象的引用.在对立面对应的不是同一个对象,是复制过的新对象.深拷贝会创造一个一模一样的都西昂

```js
const a = {x:1,y:2}
const b = {x:a.x,y:a.y}
```

* 如果修改对象b中的值,对象a中的值并不会改变

#### 深拷贝的实现

1. 手动赋值

2. 当对象只有一层:使用**Object.assign()**或者**扩展运算符**

3. 使用**JSON**转换

>用`JSON.stringify`把对象转成字符串,再用`JSON.parse`把字符串转成新的对象

```js
const obj1 = { father: "zhanger", mother: "wangwu", friends: { name: "lisi" } }
const obj2 = JSON.parse(JSON.stringify(obj1))
obj2.friends.name = "zhaoliu"
console.log(obj1)
//{ father: "zhanger", mother: "wangwu", friends: { name: "lisi" } }
console.log(obj2)
//{ father: "zhanger", mother: "wangwu", friends: { name: "zhaoliu" } }
```

### 关于lodash库的使用

* 浅拷贝**lodash的_.clone**

```js
const _ = require('lodash');
const obj1 = {
    a: 1,
    b: 2,
    c: { d: { e: 1 } }
};
var obj2 = _.clone(obj1);
console.log(obj1.c.d === obj2.c.d);// true
```

* 深拷贝**lodash的_.cloneDeep**

```js
const _ = require('lodash');
const obj1 = {
    a: 1,
    b: 2,
    c: { d: { e: 1 } }
};
var obj2 = _.cloneDeep(obj1);
console.log(obj1.c.d === obj2.c.d);//false
```

### structuredClone

>浏览器原生支持的深拷贝方式:`structuredClone(value, { transfer })`

* `value`:要克隆的对象.这可以是任何结构化可克隆类型
* `transfer`:可选.可转移的对象,为一个数组,其中的值将被移动到新的对象,而不是克隆至新的对象
  * 可转移对象:<https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects>
* **返回值**:返回的值是原始的深层副本value

```js
let s = { name: 'zhangsan', friends: { name: 'lisi', age: 18 } };
let clone = structuredClone(s);
console.log(clone === s)//false
```

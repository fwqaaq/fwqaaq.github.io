---
title: Map和Set的使用
date: 2021-10-04 23:21:40
author: Jack-zhang
categories: TS
tags:
   - JS
   - TS
summary: Map和Set
---

## [Map对象](#map对象)

> 一个问题:在js中`Object`无法使用除`string`类型作为非字符串
> 使用`Map`可以以任何类型作为键(包括函数、对象或任意基本类型)

* 本质是一组包含键值对的集合
* Map中的键是顺序的。因此，当迭代的，一个Map对象以插入时的顺序返回键值
* Map的键值对个数可以通过size属性获取
* Map是`iterable`的，所以可以直接被迭代

### [初始化Map对象](#初始化map对象)

> 使用new初始化Map对象,初始化时传入一个二维数组
> 键值的映射

```ts
let a: Map<string, number> = new Map([
  ["a", 1],
  ["b", 2],
])
console.log(a)
//输出:Map(2) { 'a' => 1, 'b' => 2 }

```

### [原型属性和方法(Map.prototype)](#原型属性和方法mapprototype)

#### 使用`size`,而不是`length`获取长度

```ts
console.log(a.size)//2
```

#### keys

> 使用keys拿到所有的键

```ts
console.log(a.keys())
//[Map Iterator] { 'a', 'b' }
```

#### values

>使用values拿到所有的值

```ts
console.log(a.values())
//[Map Iterator] { 1, 2 } 
```

#### get

> 返回`key`对应的`value`，如果不存在，则返回undefined

```ts
console.log(a.get("a"))//1
```

#### set

> 存储一个键值的映射

```ts
a.set("c",3)
console.log(a)
//Map(3) { 'a' => 1, 'b' => 2, 'c' => 3 }
```

#### delete

> 删除map中指定key对应的一组key-value元素

```ts
a.delete("c")
console.log(a)
//Map(2) { 'a' => 1, 'b' => 2 }
```

#### has

>检查Map是否有指定key对应的value。

```ts
console.log(a.has("a"))//true
console.log(a.has("c"))//false
```

#### clear

> 清空所有键值

```ts
a.clear()
```

### [Map遍历方式](#map遍历方式)

#### 遍历value

```ts
for (let value of a.values()) {
  console.log(value)
  //1
  //2
}
```

#### 遍历keys

```ts
for (let key of a.keys()) {
  console.log(key)
  //a
  //b
}
```

#### 使用for...of遍历

> `for...of`遍历得到一组组数组

```ts
for (let item of a) {
  console.log(item)
  //[ 'a', 1 ]
  //[ 'b', 2 ]
}
```

#### 使用foreach遍历

> `foreach`遍历拿到的值和键

```ts
a.forEach((value, key) => {
  console.log(value, key)
  //1 a
  //2 b
})
```

#### 使用entries遍历

> 迭代器 函数默认就是`entries()`函数
> 该方法返回Map集合中每个 `[key，value]`元素的对象

```ts
console.log(a.entries())
//[Map Entries] { [ 'a', 1 ], [ 'b', 2 ] }

for (let item of a.entries()) {
  console.log(item)
  //[ 'a', 1 ]
  //[ 'b', 2 ]
}
```

#### 使用spread扩展运算符

```ts
console.log(...a.keys())//a b
console.log(...a.values())//1 2
```

### [Map的注意](#map的注意)

#### Map和数组的关系

>* Map构造函数可以将一个二维键值对数组转换成一个Map对象
>* 使用扩展运算符将Map对象换成一个二维键值对数组
>* 可以使用`Array.from()`将一个Map对象转换成一个二维键值对数组

```ts
let b=[["a",1],["b",2]]
let a: Map<string, number> = new Map(b)

//使用Array.from()函数
console.log(Array.from(a))
//使用展开运算符
console.log([...myMap])
```

#### 复制或合并Maps

* [参考]<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map>

>* 复制

```ts
let c=new Map(a)
console.log(a===c)//false
```

* 浅比较,比较的是地址,不为同一个对象的引用

> 对象和对象可以进行合并,对象和数组可以进行合并
>> 合并之后如果有重复的键值，则后面的会覆盖前面的
>> 本质是用展开运算符先将对象转换成数组

## [Set对象](#set对象)

>* Set 对象允许你存储任何类型的<span style="color:red">唯一值</span>，无论是原始值或者是对象引用
>* 传入对象比较的是地址,不同地址也是唯一值

### [初始化Set对象](#初始化set对象)

> 传入一个一维数组

```ts
let a = new Set([1, "a", { a: "name" }, { a: "name" }])
console.log(a)
//Set(4) { 1, 'a', { a: 'name' }, { a: 'name' } }
```

### [原型属性和方法(Set.prototype)](#原型属性和方法setprototype)

#### size

```ts
console.log(a.size)//4
```

#### add()

> 在对象中添加一个元素set

```ts
let o = { a: "name" }
a.add(o)
```

#### has()

> 返回一个布尔值,表示在Set中是否存在该值

* 注意:如果直接传入一个对象属性,地址值不同,返回false
  * 所以最好将引用传入

```ts
console.log(a.has(o))//true
```

#### delete()

* 注意:如果直接传入一个对象属性,地址值不同,并不会删除,
  * 所以最好将引用传入,删除时传入引用
  * 且返回值是一个boolean

```ts
console.log(a.delete({ a: "name" }))//false
console.log(a.delete(o))//true
```

#### values()和keys()

>`keys()`和`values()`方法相同，返回一个新的对象的对象对象，Set应该包含的插入顺序的所有元素的值

* 且同样可以使用展开运算符

```ts
console.log(a.keys())
//[Set Iterator] { 1, 'a', { a: 'name' }, { a: 'name' } }
console.log(...a.values())
//1 a { a: 'name' } { a: 'name' }
```

#### clear()

> 删除Set对象中的所有元素

```ts
a.clear()
```

### [遍历](#遍历)

> 对于Set来讲`value`和`key`是相同的,不管是使用`forEach`,`for...of`迭代出的键和值都是相同的(这里就不演示了)

### [Set的注意](#set的注意)

* [参考]<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set>

#### Set和Array的关系

>* Set构造函数可以将一个一维数组转换成一个Map对象
>* 使用扩展运算符将Map对象换成一个一维数组
>* 可以使用`Array.from()`将一个Set对象转换成一个一维数组

```ts
let myArray = ["value1", "value2", "value3"]
let mySet = new Set(myArray)
console.log(Array.from(mySet))
//["value1", "value2", "value3"]
console.log([...mySet])
//["value1", "value2", "value3"]
```

#### 数组去重

> 利用Set对象中只有唯一值的特性,可以做到数组去重

```ts
const numbers = [2,3,4,4,2,3,3,4,4,5,5,6,6,7,5,32,3,4,5]
console.log([...new Set(numbers)])
// [2, 3, 4, 5, 6, 7, 32]
```

#### String

> 在js中string也是一个一维数组,利用Set可以将string变成一个一维数组

```ts
console.log([...new Set("index")])
//[ 'i', 'n', 'd', 'e', 'x' ]
```

> 并且Set可以区分大小写

```ts
console.log(new Set("Firefox"))  
// Set(7) [ "F", "i", "r", "e", "f", "o", "x" ]
console.log(new Set("firefox"))
// Set(6) [ "f", "i", "r", "e", "o", "x" ]
```

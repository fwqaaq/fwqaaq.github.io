---
title: TS的基本语法
date: 2021-9-13 01:00:00
author: Jack-zhang
categories: TS
tags:
   - JS
   - TS
summary: TS基本语法
---
## 运行编译TS

* 全局下载typescript,```npm i typescript -g```
  * 编译ts->js,```tsc hello.ts```
  * 简化编译,全局下载ts-node,```npm i ts-node -g```
  * 编译ts文件,```ts-node hello.ts```,cjs,esm通用

* 由`esbuild`提供支持的`TypeScript`可替代`ts-node`的编译工具
  * 全局下载`npm i esno -g`
  * 编译ts文件,`esno index.ts`
  * `esno-` CJS 模式下的命令
  * `esmo-` ESM 模式下的命令

* 问题:
  * 解决方案一: ```Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'```:使用:```ts-node -T hello.ts```
  * 解决方案二: ```npm install @types/node --save-dev```

## [debug调试工具](#debug调试工具)

1. 安装```typescript,ts-node```开发依赖,```npm i typescript ts-node -D```
2. 配置```launch.json```文件

>参考:<https://zyjcould.ltd/2021/11/17/diao-shi/>

## 基本语法

### 注解类型

* 注解类型```string,number,boolean,any,unknown,undefined,null,never```

### 数据类型

* tips:
  * 尽量不要使用```any```,它可以赋值给任意变量,尽量不要使用
  * ```unknow```是一个类型安全any
  * ```unknow```类型的变量,只会赋值给unknown和any类型,不会赋值给其他变量
  * <span style="color:red">给变量赋值`null`和`undefined`不要使用类型推论</span>
  * `never`类型表示不存在的:
    * 例如:函数中是一个死循环或者抛出一个异常

  ```ts
  let d:any=true
  let s:string="hh"
  s=d
  ```

#### 联合类型 :```let x:string|number```

#### 元组

* 数组中通常建议存放相同类型的元素，不同类型的元素是不推荐放在数组中
* 元组中每个元素都有自己特性的类型，根据索引值获取到的值可以确定对应的类型
* 作为返回值使用:

  ```ts
  function useState<T>(state: T) {
  let currentState = state
  const changeState = (newState: T) => {
    currentState = newState
  }
  const info: [string, number] = ["abc", 18]
  const tuple: [T, (newState: T) => void] = [currentState, changeState]
  return tuple
  }
  ```

#### TS类型推论:初始化变量且赋值时

* ```let age=18```:可以省略掉类型注解
  
  ```ts
  let age
  age=13  //这是错误的,不会有类型推论

  function getsunm(a:number,b:number){
  return a+b//可以省略类型注解,类型推论为number
  }
  ```

#### 类型断言和非空类型断言

> 类型断言语法:
  
* 变量 as 类型
  * 常量断言和默认类型参数:**获得更精确和不可变的类型**
  * 例如:`const 断言`

```ts
let a = { prop: "hello" }
let b = { prop: "hello" } as const
```

* <类型> 变量

* 非空类型断言:`!`
  * 传入的message有可能是为`undefined`的，这个时候是不能执行方法的
  * 如果确定传入的参数一定是有值的,可以使用`!`

```js
function elementLength(message?: string) {
  console.log(message!.length)
}
```

```ts
let s:string | number="hh"
let e="ll"
s=e as string
s=<string>e
let img=document.querySelector("#image") as HTMLImageElement
//使用console.dir()打印当前方法的dom值
console.log(img)//HTMLImageElement
```

### 类型充补

> ES6即以上中的一些规范

#### 可选类型和可选链

```ts
type Person = {
  name: string
  friend?: {
    name: string
    age?: number,
    girlFriend?: {
      name: string
    }
  }
}
const info: Person = {
  name: "why",
  friend: {
    name: "kobe",
    girlFriend: {
      name: "lily"
    }
  }
}
//其它文件
console.log(info.friend?.girlFriend?.name)
```

#### ??和!!的使用

* `!!`操作符:
  * 将一个其他类型转换成boolean类型
* `??`操作符:
  * 逻辑操作符
  * **当操作符的左侧是 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数**

```ts
let message: string|null = "Hello World"
const flag = !!message
const content = message ?? "你好啊, 李银河"
```

#### 类型别名和字面量类型

>在类型注解中编写 `对象类型` 和 `联合类型`,想要多次在其他地方使用时,可以起别名`type`

```ts
type PointType = {
  x: string
  y: number
  z?: number
}
```

> 字面量类型的意义, 就是必须结合联合类型

* 注意:字面量类型和值是必须相同的

```ts
// 字面量类型的意义, 就是必须结合联合类型
type Alignment = 'left' | 'right' | 'center'
let align: Alignment = 'left'
```

> 字面量推理

```TS
type Method = 'GET' | 'POST'
function request(url: string, method: Method) {}

type Request = {
  url: string,
  method: Method
}

const options:Request  = {
  url: "https://www.coderwhy.org/abc",
  method: "POST"
} //as const(这样也可以)

request(options.url, options.method)
```

* 如果不给options添加类型别名的时候,options其实是一个`{url: string, method: string}`

> 如果是导入类型而不是模块,需要标记为类型,处理单个文件的编译器无法知到导入的是值还是类型

```ts
//错误
import {BaseType} from "./some-module.js"
//正确
import { someFunc , type BaseType } from "./some-module.js"
```

#### 类型缩小

* `typeof`的类型缩小
  * typeof是一种类型保护:`TypeScript` 对如何`typeof`操作不同的值进行编码

```ts
type IDType = number | string
function printID(id: IDType) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase())
  } else {
    console.log(id)
  }
}
```

* 使用Switch或者相等的一些运算符来表达相等性(比如===, !==)

* `intanceof`:检查一个值是否是另一个值的"实例"

```ts
function printTime(time: string | Date) {
  if (time instanceof Date) {
    console.log(time.toUTCString())
  } else {
    console.log(time)
  }
}
```

* **in**

```ts
type Fish = {
  swimming: () => void
}
type Dog = {
  running: () => void
}
function walk(animal: Fish | Dog) {
  if ('swimming' in animal) {
    animal.swimming()
  } else {
    animal.running()
  }
}
```

### 函数语法

* 有返回值
  * ```function name(num:number):number{return 返回值}```
* 默认没有返回值:void可以省略
  * ```function name(num:number):void{}```
* 注解函数
  
  ```ts
  let ageSum:(a:number,b:number)=>number
  let ageSum=function(a:number,b:number){
    return a+b
  }
  ```

#### 默认参数

>在定义形参的数据类型的同时可以传入一个默认值

#### 剩余参数

>剩余参数语法允许我们将一个不定数量的参数放到一个数组中

```ts
function sum(initalNum: number, ...nums: number[]) {
  let total = initalNum
  for (const num of nums) {
    total += num
  }
  return total
}
console.log(sum(20, 30))//30
console.log(sum(20, 30, 40))//70
console.log(sum(20, 30, 40, 50))//120
```

* 注意:剩余参数只能位于形参最后

#### 匿名函数参数

> 上下文中的函数可以不加类型注解

```ts
const names = ["abc", "cba", "nba"]
names.forEach(function(item) {
  console.log(item.split(""))
})
```

* TypeScript会根据forEach函数的类型以及数组的类型推断出item的类型
* 函数执行的上下文可以帮助确定参数和返回值的类型

#### 函数的重载

* 函数重载中,实现函数不能直接调用
  * `add({name: "why"}, {age: 18})`

```ts
function add(num1: number, num2: number): number; // 没函数体
function add(num1: string, num2: string): string;
function add(num1: any, num2: any): any {
  if (typeof num1 === 'string' && typeof num2 === 'string') {
    return num1.length + num2.length
  }
  return num1 + num2
}
const result = add(20, 30)
const result2 = add("abc", "cba")
```

* 注意:在开发中尽量使用联合类型

```ts
//联合类型
function getLength(args: string | any[]) {
  return args.length
}

//实现方式二: 函数的重载
function getLength(args: string): number;
function getLength(args: any[]): number;
function getLength(args: any): number {
  return args.length
}
```

#### 函数中不确定的this类型

* 参考:<https://mp.weixin.qq.com/s/hYm0JgBI25grNG_2sCRlTA>

### 数组语法

* 定义一:
  * ```let names:string[]=["李四","张三","王五"]```
* 定义二(不推荐,易与React中的jsp混淆):
  * ```let names:Array<string>=["李四","张三","王五"]```
* 第义三(不推荐):
  * ```let names:string[]=new Array("李四","张三","王五")```

### 对象

* 创建对象(和js一样)```let person={}```
* 对象的类型注解(对对象的一种约束)

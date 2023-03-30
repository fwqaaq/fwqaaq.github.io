---
title: ts类型和泛型的思考
date: 2021-11-25 12:22:52
author: Jack-zhang
categories: TS
tags:
   - JS
   - TS
summary: TS中的类型和泛型的思考
---

## 联合类型(|)和交叉类型(&)

> 在基本数据类型中和对象中用`或和且`表示出的集合类型不同

### 基本数据类型

> 我的理解:

* 在基本数据类型中,联合类型(|)表示<span style="color:red">或</span>
* 交叉类型(&)表示<span style="color:red">且</span>(**其实就是never**)

```ts
type unionType = number | string //可以是number或者string类型的值
type crossType = number & string //不能赋任何值
```

### 对象类型

>对象是相对于属性来思考的
>> 交叉类型(&)是是各个对象属性的**且**
>> 联合类型(|)是各个对象属性的**或**

* 首先定义两个接口:

```ts
interface A {
  x: number;
  y: number;
}
interface B {
  y: number;
  z: number;
}
```

* 交叉类型(&):是A且B产生的新类型`crosstype`,实现了A,B中的所有属性

```ts
type crossType = A & B
//交叉类型必须实现所有属性
const obj:crossType={
  x: 1,
  y: 2,
  z: 3
}
```

* 联合类型(|):
  * 可以理解为定义的类型是A类型或者B类型
  * 联合类型可以是两个对象属性的交集(要实现所有属性,且只能访问公共属性)
    * 这种实现交集的方式我觉得没有意义
  * 也可以是单独一个对象(子集)

```ts
type unionType = A | B

const obj1: Union = {
  x: 1,
  y: 2,
  z: 3,
}
//交集:只能访问y.访问其它属性报错
obj1.y
const obj2: Union = {
  x: 1,
  y: 2,
}
//可以访问所有属性
obj2.x
obj2.y
const obj3: Union = {
  y: 2,
  z: 3,
}
//同上
```

### 类型系统

> 在ts中,相同类型结构的可以称为父子类型

```ts
//父类型
interface Father {
  name: string
}

//子类型
interface Son {
  name: string
  age: number
}

type isEqual = Son extends Father ? true : false //true
```

* 在ts类型系统中,只要类型结构相似,就可以称为父子类型
  * 对于子类型相对于父类型考虑:子类型会更加具体,父类型是更加松散的
  * 例如联合类型产生的新类型,他的类型可能会变多,它产生的类型就是父类型
  * 例如交叉类型产生的新类型,他的类型会更加具体,它产生的类型就是子类型
* 在使用`&`产生的新类型(交叉类型),会让新类型更具体

```ts
type Fn = ((name: string) => string) & ((name: number) => number)
type s<T> = Fn extends T ? T : never
type x = s<(name: string) => string>
//(name: string) => string
```

* 在使用`|`产生的新类型(联合类型),会让新类型更松散

```ts
interface Father {
  name: string
  x: number
}

interface Son {
  name: string
  age: number
}

type FatherOrSon = Father extends Father | Son ? true : false
//true
```

### 分布式条件类型

>当类型参数为联合类型,并且在条件类型左边直接引用该类型参数的时候,TypeScript 会把每一个元素单独传入来做类型运算,最后再合并成联合类型

```ts
type Union = 'a' | 'b' | 'c';
type UppercaseA<Item extends string> = 
    Item extends 'a' ?  Uppercase<Item> : Item;
type res = UppercaseA<Union>// 'b' | 'c' | 'A'
```

## extends关键字

> `A extends B`可以理解为A是B的子集(一直都对)

### 作为约束泛型使用

> 首先理解一点:**是属性之间的比较**.前者是后者的子集
>> 泛型T中的`length`的值必须是`string`的一个子集,`string`是所有字符串的集合

```ts
interface point {
  length: string;
}
function a<T extends point>(args: T) {
  console.log(args.length);
}
//可以使用多个不同的属性(相对于属性)
//但是必须实现所有约束的属性
a({length:"abc",joint:8})
```

* `point`是一个对象,使用`extends`就是约束泛型的类型

### extends 用作条件泛型

```ts
interface Point {
  x: number
  y: number
}
type IsPointSubset<T> = T extends Point ? Point : never
type Result1 = IsPointSubset<{ x: 1; y: 2 }> //Point
type Result2 = IsPointSubset<{ x: 1; z: 2 }> //never
```

>像三元运算符一样,有这样的属性就返回前一个,没有返回后一个

* 参考:<https://juejin.cn/post/6997266181082054664>
  
## 泛型中的工具类

>是 TypeScript 内置的工具类型

```ts
interface IPerson{
  name:string,
  age:number
}
```

> 关于**keyof**:对象里面的键值对里的键**key**给罗列取出来,并把它们联合起来形成一种联合类型

```ts
type personkeys=keyof IPerson
//"name" | "age"
```

### Partial

> `Partial`**通过泛型让目标类型中的所有属性变为可选**

```ts
interface IWhitePeople{
  face: "white"|"black"|"yellow"
}

type People = Partial<IWhitePeople>&IPerson

const people:People={
  name:"zhagnsan",
  age:12
}
```

> `Partial`的具体实现

```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

1. 使用`keyof`拿到`T`所有的键组成联合类型
2. 使用in遍历所有的联合类型拿到键`P`,赋一个可选符

>衍生:也可以将可选类型转换为必选类型**Required**,只读类型也是如此

```ts
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

>映射修饰符,`-`删除,+添加,如果没有前缀,相当于使用了`+`

* 关于这种映射类型,一个是`readonly`,一个是`?`,就可以使用`-`又或者`+`来删除或者添加银蛇类型

### Pick

>`Pick`**通过泛型选择指定属性形成新的类型**

```ts
type whitPeople = IPerson&Pick<IWhitePeople,"face">

const wPeople:whitPeople={
  name:"jack",
  age:19,
  face:"white"
}
```

>Pick的具体实现

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```

1. `keyof T`:将T所有的键值联合成一个新的类型,用于检查K是否是T的键
2. `K`是对`T`的一个约束:用`in`遍历`K`,遍历的结果P就是要保留的键,形成新的字面量

### Omit

>`Omit`:**通过泛型删除指定属性**

```ts
type chinese= Omit<IWhitePeople,"face">&IPerson
const person1:chinese={
  name:"zhangsan",
  age:18,
  language:"Chinese"
}
```

> Omit的具体实现

* 首先理解`Exclude`:如果`U`是`T`的一个约束,则返回`never`,否则返回本身
  
```ts
type Exclude<T, U> = T extends U ? never : T;
```

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

1. `Exclude<keyof T, K>`只有本身为`K`才会返回never,其它元素都返回本身
2. `Pick<T, Exclude<keyof T, K>>`使用`Pick`将所有的键值联合成一个新的字面量

### ReturnType

>构造一个由 function 的返回类型组成的类型Type

* 可以对解释函数进行返回值的推导
  * test获取的类型是`<T>(...args: T[]) => Function`

```ts
type test = ReturnType<() => <T>(...args: T[]) => Function>

let useTest:test = function <T>(...args: T[]) {
  return ()=>{}
}
```

* 亦可以使用`typeof`获得一个函数的返回值类型

```ts
function test<T>(a: T, b: T, c: T) {
  return "" + a + b + c
}

type getType = ReturnType<typeof test>
```

### Record

> 实现，K 只能是 number、string、symbol 三个类型之一，T 可以是任意的类型

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

> 通过指定的键组合成一个新的对象类型

```ts
type foo = {
  name: string
  age: number
  heigh: string
}

type x = Record<keyof foo, string>
// type x = {
//   name: string
//   age: string
//   heigh: string
// }
```

### NonNullable

> 排除 null 和 undefined 类型

```ts
type u = NonNullable<null> // never
```

> 实现

```ts
type NonNullable<T> = T & {};
```

## typeof 和 infer

> ts中的`typeof`和js中的`typeof`是有区别的

1. 写运行代码的地方:**返回出一个变量的类型字符串**
2. 类型的判断:**返回的是TS里的类型**

> 例如,我们可以这样写一个类型判断

```ts
const people: People = {
  name: "zhagnsan",
  age: 12,
};

type tpeople = Pick<typeof people,"age">
```

> **infer**:推导作用的关键字,指待推导泛型

* 把`V`给标记了,等下你们给我推出这个`V`的类型然后让我用

```ts
interface IPerson {
  name: string;
  age: number;
}

type person<T> = T extends infer v ? v : never

const Person:person<IPerson>={
  name:"string",
  age:12
}
```

* 这里看`T`和待推导泛型`v`是否是类型符合,如果符合,就返回v,否则`never`
* 简单来说就是,泛型 T 和待推导 v 元素是不是都是相同的类型写法
* 这里将T和v进行对比,T 符合v的位置,返回待推导 v 即 T
* 再举一个例子:`<T[]>` 和 `(infer v)[]` 类型也是符合

* 在 4.8 版本之后，可以直接使用 extends 关键字对 infer 推导的结果进行约束

```ts
type SomeNum = "100" extends `${infer U extends number}` ? U : never;
// 100

type SomeBigInt = "100" extends `${infer U extends bigint}` ? U : never;
// 100n
```

> 参考:<https://zhuanlan.zhihu.com/p/361968852>

## 类型递归

>像大多数编程语言中一样,类型也是可以递归的

```ts
type FillArray<
  Item,
  N extends number,
  Arr extends Item[] = []
> = Arr["length"] extends N ? Arr : FillArray<Item, N, [...Arr, Item]>

type Foos = FillArray<number, 3>//[number,number,number]
```

1. 对于特定number类型的约束,例如,`N extends 3`,N必须是3才能成功的约束(true)
2. `[number] extends number[]`这样返回的是true,<span style="color:red">数组的约束,只要实现数组类型的约束,和长度无关</span>
   * `Arr extends Item[] = []`,Arr这个数组受到Item[]的约束.每次只能返回特定的(这里是Item类型的)元组
3. 递归边界:`Arr["length"] extends N`,只有数组的长度达到N,才可以结束

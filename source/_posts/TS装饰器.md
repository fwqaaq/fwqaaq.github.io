---
title: TS装饰器
date: 2022-03-05 12:00:53
author: Jack-zhang
categories: TS
tags:
   - JS
   - TS
summary: 装饰器的使用
---

## 装饰器

>装饰器是一种特殊的类型声明,他能被附加到类声明,方法,访问符,属性或者参数上,可以修改类的行为.装饰器使用`@experssion`的形式(更像是`defineProperty`的语法糖)<span style="color:red">他会在运行时被调用,被装饰器的声明信息做为参数传入</span>

```ts
function test(target: any) {
  console.log("hello world")
}

@test
class A {}//hello world
```

1. 类(Class)
2. 类属性(Class Property)
3. 类方法(Class Method)
4. 类访问器(Class Accessor)
5. 类方法参数(Class Method Parameter)

* 因此，应用装饰器很像组成一系列函数，非常像高阶函数或类。使用装饰器，我们可以轻松实现代理模式来减少代码
* 对于这几种装饰器,都可以使用工厂模式来达到传入想要修改属性的目的(或者其它)

### [代理模式](proxy.md)

> 代理模式是在访问真正对象时,提供额外的逻辑,检查对真实对象的操作.例如在对真实对象操作占用大量资源时,进行缓存,或者在调用对真实对象的操作之前检查前提条件

* 例如javascript中的proxy就是一个典型的代理模式

```js
const target = {
  name: 'zhangsan'
}
const handler = {
  get (target, key) {
    console.log(`${key} 被读取`)
    return target[key]
  },
  set (target, key, value) {
    console.log(`${key} 被设置为 ${value}`)
    target[key] = value
  }
}
const proxy = new Proxy(target, handler)
proxy.name
//name 被读取
proxy.name = 'lisi'
//name 被设置为 lisi
console.log(target.name)
//lisi
```

### 定义装饰器

> 由于TypeScript中的装饰器还在实验性语法,需要在`tsconfig.json`编译选项中开启

```json
{
  "compilerOptions": {
      "experimentalDecorators": true
  }
}
```

* 装饰器的执行时机:装饰器对类的行为的改变,是**代码编译时发生的**(不是TypeScript编译,而是js在执行机中的编译阶段),并不是在运行是.<span style="color:red">本质就是装饰器是编译时执行的函数</span>

#### 类装饰器

* 类装饰器在类声明之前绑定,可以用来监视,或者修改或者替换类定义
* 在执行类装饰器函数的时候,会把绑定的类作为器唯一的参数传递给装饰器
* 如果装饰器返回一个新的类,他会用新的类替换原有的类的定义

```ts
function target(person:any) {
  person.prototype.name = "jack"
  person.prototype.say = function () {
    console.log(this.name)
  }
}

@target
class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }

  say() {
    console.log("lisi")
  }
}

new Person("fw").say()//fw
console.log(new Person("fw").name)//fw
```

* name属性并不会像想象中的那样变为:**jack**.那首先我们得明白他的初始化机制
  1. 在Person类初始化之后,会先执行装饰器,而不是直接使用new关键字
  2. name首先被初始化为`jack`,然后使用new产生对象,传入的`fw`会覆盖`jack`属性

#### 方法装饰器

* 方法装饰器写在一个方法的声明之前
* 方法装饰器可以用来监视,修改或者替换方法定义
* 方法装饰器表达式会在运行时当作函数被调用,传入一下三个参数
  1. 对于静态成员来说是类的构造函数，对于实例成员是类的**原型对象**
  2. 被绑定方法的名字
  3. 被绑定方法的属性描述符

* 方法装饰器更像是`defineProperty`的一个语法糖

| 属性         | 描述                             | 默认值    |
| ------------ | -------------------------------- | --------- |
| value        | 当试图获取属性时所返回的值       | undefined |
| writable     | 该属性是否可写                   | false     |
| enumerable   | 该属性在for in循环中是否会被枚举 | false     |
| configurable | 该属性是否可被删除               | false     |
| set()        | 属性的更新操作所调用的函数       | false     |
| get()        | 获取属性值时所调用的函数         | false     |

1. 数据描述符:enumerable,configurable,value,writable
2. 存取描述符:enumerable,configurable,set(),get()
3. 如果定义了set(),get()之后,再定义value,writable会<span style="color:red">报错</span>

```ts
function test(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log(target)
  //{  }
  console.log(key)//say
  console.log(descriptor)
  //{
  //value: [Function (anonymous)],
  //writable: true,
  //enumerable: false,
  //configurable: true
  //}
  descriptor.value = function () {
    console.log("test")
  }//输出test,而不是`我是fw`
}

class Person {
  @test
  say() {
    console.log("我是fw")
  }
  sayName() {
    console.log("我是zhangsan")
  }
}
```

* 当然使用工厂函数会是更好的选择

```ts
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}

@configurable(false)
...
```

#### 访问器装饰器

* 访问器装饰器声明在一个访问器的声明之前。
* 访问器装饰器应用于访问器的属性描述符并且可以用来监视，修改或替换一个访问器的定义
* 访问器装饰器表达式会在运行时当作函数被调用，传入下列3个参数:
  * 对于静态成员来说是类的构造函数，对于实例成员是类的**原型对象**。
  * 成员的名字。
  * 成员的属性描述符。

```ts
function test(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log(target)//{},原型对象上并没有任何属性
  console.log(key)//name.构造器的名称
  console.log(descriptor)
  //{
  //get: [Function: get name],
  //set: [Function: set name],
  //enumerable: false,
  //configurable: true
  //}
  descriptor.set = function (value) {
    value = value + "fw"
    target.myName = value
  }
  descriptor.get = function () {
    return target.myName
  }
}

class Person {
  private _name: string
  myName!: string
  constructor(name: string) {
    this._name = name
  }

  @test
  get name() {
    return this._name
  }
  set name(value) {
    this._name = value
  }
}

const p = new Person("zhangsan")
p.name = "lisi"
console.log(p.name)//"lisifw"
console.log(p)// { _name: 'zhangsan' }
```

* 注意:<span style="color:red">TypeScript不允许同时装饰一个成员的get和set访问器</span>

#### 参数装饰器

* 参数装饰器写在一个参数声明之前。
* 参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
  * 对于静态成员来说是类的构造函数，对于实例成员是类的**原型对象**。
  * 参数所在的方法名称。
  * 参数在参数列表中的索引。

>注意:属性装饰器,参数装饰器最常见的应用场景就是配合元数据(reflect-metadata),在不改变原有结构的同时添加一些额外的信息

* 但是元数据目前也是在提案中, 也还没有纳入正式的标准.所以对于装饰器而言, 我们只需要了解即可,因为提案中的所有内容将来都是有可能被修改的(可能会被修改)

```ts
function test() {
  return function (target: any, proptyName: string, index: number) {
    console.log(target)//{}
    console.log(proptyName)//say
    console.log(index)//1
  }
}
class Person {
  say(age: number, @test() name: string): void {
    console.log(age + name)
  }
}
```

#### 属性装饰器

* 属性装饰器写在一个属性声明之前
* 属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
  * 对于静态成员来说是类的构造函数，对于实例成员是类的**原型对象**
  * 成员的名字

```ts
function test(flag:string){
  console.log(flag);//hello
  return (target: any, propertyKey: string) =>{
      console.log(target);//class[person]
      console.log(propertyKey);//age
  }
}

class Person{
  name:string;
  @test('hello')
  static age:number;
}
```

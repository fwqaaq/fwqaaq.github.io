---
title: TS中面向对象
date: 2021-10-01 13:53:31
author: Jack-zhang
categories: TS
tags:
   - JS
   - TS
summary: TS中的类,枚举和接口
---
## 类(class)

1. 静态属性(类属性),使用`static`关键字,可以直接通过`类名.`调用
  
   例如:`static gender:string="男"`

2. ```readonly```表示只读属性,无法修改

   例如: `readonly height:number=123`

### 构造函数

1. `constructor`被称为构造函数,构造函数会在对象创建时调用
2. TIPS:
   * 在实例方法,this表示当前的实例
   * 在构造函数中当前对象就是当前新建的那个对象
   * 通过this向新建的对象中添加属性

```TS
class Dog{
  name: string
  age:number
  constructor(name:string,age:number){
    this.name=name
    this.age=age
  }
  bark(){
    //在方法中可以通过this表示当前调用的对象
    console.log(this)
  }
}
const dog=new Dog("伞兵",3)
console.log(dog)
```

### 继承和多态

> 继承是多态使用的前提,(子类不同的行为)

```ts
  class Animal{
    name: string
    age:number
    constructor(name:string,age:number){
      this.name=name
      this.age=age
    }
    sayhello(){
      console.log(this.name+"动物")
    }
  }
  class Dog extends Animal{
    sayhello(){
      console.log("狗叫")
    }//方法重写
  }

  class Cat extends Animal{
    sayhello(){
      console.log(`${this.name}叫`)
    }
  }
  const dog=new Dog("狗",2)
  const cat=new Cat("猫",3)
  dog.sayhello()
  cat.sayhello()
```

### super

> 在类的方法中,super就指的是当前类的父类

```ts
class Animal{
    name: string
    age:number
    constructor(name:string,age:number){
      this.name=name
      this.age=age
    }
    sayhello(){
      console.log(this.name+"动物")
    }
  }
  class Dog extends Animal{
    gender:string
    //如果在子类写了构造函数会覆盖父类的构造函数
    constructor(name:string,age:number,gender:string){
      super(name,age)
      this.gender=gender
    }
    sayhello(){
      super.sayhello()//直接引用父类的方法
    }
  }
```

### 属性的封装

1. ```public```:可以在任意位置修改
2. ```private```:私有属性,只能在类内部进行访问
   * 通过`get,set`方法进行访问
3. ```protected```:只能在当前类和当前类的子类中访问

```ts
class Person{
   private _name:string
   private _age:number
    constructor(_name:string,_age:number){
      this._name=_name
      this._age=_age
    }
    get name(){
      return this._name
    }
    set name(value:string){
      this._name=value
    }
    get age(){
      return this._age
    }
    set age(value:number){
      if(value>=0){
        this._age=value
      }
    }
  }
  const person=new Person("张三",12)
  person.name="lisi"
  console.log(person.name)
```

### 抽象类

* 继承是多态使用的前提
  * 定义很多通用的调用接口时, 通常会子类继承父类,通过多态来实现更加灵活的调用方式
  * 父类本身可能并不需要对某些方法进行具体的实现,所以父类中定义的方法,可以定义为抽象方法
* 在TypeScript中没有具体实现的方法(没有方法体)
  * 抽象方法,必须存在于抽象类中
  * 抽象类是使用abstract声明的类
* 抽象类的特点
  * 抽象类是不能被实例的话也就是**不能通过new创建**
  * 抽象方法必须被子类实现,否则该类必须是一个抽象类

```ts
abstract class Shape {
  abstract getArea(): number
}
class Circle extends Shape {
  private r: number

  constructor(r: number) {
    super()
    this.r = r
  }

  getArea() {
    return this.r * this.r * 3.14
  }
}
```

>在派生类中的构造函数必须调用`super()`方法

### 类的类型

>类本身也是可以作为一种数据类型的

```ts
class Person {
  name: string = "123"
  eating() {}
}
const p = new Person()
const p1: Person = {
  name: "why",
  eating() {}
}

```

## 枚举(```enum```)

* 枚举其实就是将一组可能出现的值,一个个列举出来,定义在一个类型中,这个类型就是枚举类型
* 枚举允许开发者定义一组命名常量,常量可以是数字、字符串类型
* 枚举的默认值是从0开始的索引

```ts
enum Gender{
  Male=0,
  Female=1
}
let i:{name:string,gender:Gender}
i={
  name:"老孙",
  gender:Gender.Male
}
```

## 接口(interface)

### 接口的声明

>对象的另外一种声明方式就是通过接口来声明

* 可以定义可选类型
* 可以定义只读属性

```ts
interface IInfoType {
  readonly name: string
  age: number
  friend?: {
    name: string
  }
}
```

### 索引类型

> 使用`interface`来定义对象类型,这个时候其中的`属性名,类型,方法`都是确定的,但是有时候我们会遇到类似映射关系的情况

```ts
interface ILanguageYear {
  [name: string]: number
}
const languageYear: ILanguageYear = {
  "C": 1972,
  "Java": 1995,
  "JavaScript": 1996,
  "TypeScript": 2014
}
```

### 函数类型

> 建议还是用别名来定义函数

```ts
interface Isum{
  (num1:number,num2:number):number
}
```

### 接口的继承和实现

> 接口是支持多继承的（类不支持多继承）,子类拥有父类的所有属性

* 类可以实现多个接口

```ts
interface ISwim {
  swimming: () => void
}
interface IFly {
  flying: () => void
}
interface IAction extends ISwim, IFly {

}

class Dog implements ISwim,IFly{
  swimming(){
    console.log("我可以游泳")
  },
  flying(){
    console.log("我可以飞")
  }
}
```

### 交叉类型

> 联合类型表示多个类型中一个即可
>>`type Direct="left|"right"|"center"`

* 交叉类型
  * 交叉类似表示需要满足多个类型的条件
  * 交叉类型使用 & 符号

```ts
interface ISwim {
  swimming: () => void
}
interface IFly {
  flying: () => void
}
type MyType = ISwim & IFly
const obj: MyType = {
  swimming() {},
  flying() {}
}
```

### interface和type的区别

* `interface`和`type`都可以用来定义对象类型
  * 如果是定义非对象类型,通常推荐使用type,比如`Direction`,`Alignment`,一些`Function`
* 如果是定义对象类型,那么他们是有区别的
  * `interface` 可以重复的对某个接口来定义属性和方法.
  * 多个重复名的`interface`,所有的属性在实现时都要实现.可以利用这个特性在原有接口中添加属性
  * `type`定义的是别名,别名是不能重复的

```ts
interface IFoo {
  name: string
}
interface IFoo {
  age: number
}
const foo: IFoo = {
  name: "why",
  age: 18
}

type IBar = {
  name: string
  age: number
}
//不能定义一个别名两次
// type IBar = {
// } 
```

### 字面量赋值

* `TypeScript`在字面量直接赋值的过程中,为了进行类型推导会进行严格的类型限制.
* 但是之后如果我们是先将将一个 <span style="color:red">变量标识符赋值给其他的变量时</span>,会进行freshness擦除操作.

```ts
interface IPerson {
  name: string
  age: number
  height: number
}

const info = {
  name: "why",
  age: 18,
  height: 1.88,
  address: "广州市"
}
// freshness擦除
const p: IPerson = info
```

## 泛型

> 定义函数或者是类时,如果类型不明确时,就可以使用泛型

* 使用any时,已经丢失了类型信息
  * 比如我们传入的是一个number，那么我们希望返回的可不是any类型，而是number类型
* 所以，我们需要在函数中可以捕获到参数的类型是number，并且同时使用它来作为返回值的类型

```ts
function sum<Type>(num: Type): Type {
  return num
}
// 1.调用方式一: 明确的传入类型
sum<number>(20)
sum<{name: string}>({name: "why"})
// 2.调用方式二: 类型推导
sum(50)
sum("abc")
```

* 方式一:通过 <类型> 的方式将类型传递给函数
* 方式二:通过类型推导，自动推导出我们传入变量的类型
  * 在这里会推导出它们是 字面量类型的，因为字面量类型对于我们的函数也是适用的

### 泛型的基本补充

* T:Type的缩写，类型
* K,V:key和value的缩写，键值对
* E:Element的缩写，元素
* O:Object的缩写，对象

### 泛型接口的使用

>可以传入默认值,如果不传默认值,在接口调用的时候使用泛型

```ts
interface IPerson<T1 = string, T2 = number> {
  name: T1
  age: T2
}
const p: IPerson = {
  name: "why",
  age: 18
}
//不使用默认值
const p: IPerson<string,number> = {...}
```

### 泛型类的使用

* 可以直接使用类型推导,不使用泛型注解

```ts
class Point<T> {
  x: T
  y: T
  z: T
  constructor(x: T, y: T, z: T) {
    this.x = x
    this.y = y
    this.z = y
  }
}
//方式一(类型推导)
const p1 = new Point("1.33.2", "2.22.3", "4.22.1")
//方式二
const p2 = new Point<string>("1.33.2", "2.22.3", "4.22.1")
//方式三
const p3: Point<string> = new Point("1.33.2", "2.22.3", "4.22.1")
```

### 泛型约束

* 当我们希望传入的类型有某些共性，但是这些共性可能不是在同一种类型中
  * 比如string和array都是有length属性的，或者某些对象也是会有length属性的
  * 给泛型继承某些属性,来约束

```ts
interface ILength {
  length: number
}
function getLength<T extends ILength>(arg: T) {
  return arg.length
}
getLength("abc")
getLength(["abc", "cba"])
getLength({length: 100})
```

## TS模块化开发

* TypeScript的两种支持
  * 模块化:每个文件可以是一个独立的模块,支持ES Module,也支持CommonJS
  * 命名空间:通过`nampspace`来声明一个命名空间

### 命名空间

>在TypeScript早期时,称之为内部模块,主要是将一个模块内部再惊醒作用域的划分,防止命名冲突

* 命名空间是在 Web 应用程序中构建代码的好方法，所有依赖项都作为\<script>标签包含在 HTML 页面中

```ts
export namespace price {
  export function format(price: number) {
    return "99.99"
  }
}
```

### 类型查找

* 另外的一种`typescript`文件：`.d.ts`文件
  * 通常的`TypeScript`文件都是以`.ts`文件输出
  * 另外一种`.d.ts`文件按,是用来做类型的声明`declare`.(仅仅是用来做类型监测,告知typescript有哪些类型)
* 三种类型声明
  * 内置类型声明
  * 外部定义类型声明
  * 自己定义类型声明

#### 内置类型声明

* 内置类型声明是`typescript`自带的,帮助我们内置了`JavaScript`运行时的一些标准化API的声明文件
  * 包括比如`Math,Date`等内置类型，也包括`DOM API`，比如`Window`,`Document`等
* 内置类型声明通常在我们安装typescript的环境中会带有的:
  * <https://github.com/microsoft/TypeScript/tree/main/lib>

#### 外部定义类型声明

* 外部类型声明通常是我们使用一些库(比如第三方库)时，需要的一些类型声明
  * 在自己库中进行类型声明(编写`.d.ts`文件)，比如`axios`
  * 通过社区的一个公有库`DefinitelyTyped`存放类型声明文件
    * 该库的GitHub地址:<https://github.com/DefinitelyTyped/DefinitelyTyped/>
    * 该库查找声明安装方式的地址:<https://www.typescriptlang.org/dt/search?search>=
    * 比如我们安装react的类型声明: `npm i @types/react --save-dev`

#### 自定义声明

> 何时使用自定义声明

1. 我们使用的第三方库是一个纯的JavaScript库，没有对应的声明文件:比如lodash
2. 我们给自己的代码中声明一些类型，方便在其他地方直接进行使用

> 变量-函数-类的声明

```ts
declare let whyHeight: number
declare function whyFoo(): void
declare class Person {
  name: string
  age: number
  constructor(name: string, age: number)
}
```

> 声明模块

* 我们也可以声明模块，比如lodash模块默认不能使用的情况
* 声明模块的语法: `declare module '模块名' {}`
  * 在声明模块的内部，我们可以通过 `export` 导出对应库的类、函数等

```ts
declare module 'lodash' {
  export function join(arr: any[]): void
}
```

> 声明文件

* 在开发中我们使用了 jpg 这类图片文件，默认`typescript`也是不支持的，也需要对其进行声明

```ts
declare module "*.jpg"{
  const src:string
  export default src
}
```

> 在我们构建vue项目时,vue会自己初始化一个`shimes-vue.d.ts`文件

* 其中vue的`.d.ts`文件并没有构建其他的全局属性(或者自己添加的),所以如果要使用,最好加上去 

```ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.json'
//暴露两个全局属性
declare const $store: any
declare const $filters: any
```

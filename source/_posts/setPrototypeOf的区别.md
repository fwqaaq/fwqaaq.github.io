---
layout: create
title: setPrototypeOf的区别
date: 2021-12-10 13:34:06
categories: JS
tags:
   - JS
summary: 关于create和setProtypeOf的区别
---

> 初始化两个函数对象

```js
function Animal(name) {
  this.name = name
  this.sound = null
}
Animal.prototype.shout = function () {
  console.log(this.name + this.sound)
}
function Cat(name, sound) {
  this.name = name
  this.sound = sound
}
Cat.prototype.shout = function () {
  console.log(this.name + this.sound + '我会喵喵')
}
Cat.prototype.behavior = function () {
  console.log(this.name + '我会跑')
}
```

## 理解原型链

>* 当我们创建一个函数就会有一个`prototype`属性指向原型对象.通过该函数创建的实例对象会共享原型对象上的属性和方法
>* 默认情况下原型对象会自动获得一个`constructor`属性.这个属性指向构造函数本身
>* 使用函数创建一个实例后,该实例包含一个**隐式原型**(`__proto__`),指向构造函数的原型对象.
>* 对象原型之间的嵌套组成了原型链，原型链的作用是维护访问对象属性的查询，确定访问权限

```js
//true
console.log(Cat.prototype.constructor === Cat)
//见图
console.log(Cat.prototype)

const cat = new Cat()
//true
console.log(Cat.prototype === cat.__proto__)
```

![原型对象](原型对象.png)

* 从图中可以看出实例的`隐式原型`和函数的显示原型指向同一个对象

### 关于继承的问题

>使用猫类继承动物类,`使用猫的原型指向动物的实例`

1. 关于`Cat.prototype.constructor`的指向问题
2. 关于`Cat.prototype`的指向问题

```js
const a = new Animal()
Cat.prototype = a
//Animal
console.log(Cat.prototype.constructor)
//将指向改成Cat
Cat.prototype.constructor = Cat
//创建Cat实例
const cat = new Cat('mimi', 'miao~miao~')
console.log("shout" in cat)//true
cat.shout()//mimimiao~miao~
console.log("behavior" in cat)//false
console.log(Cat.prototype === a)//true
```

1. `Cat.prototype.constructor`的指向会指向`Animal`构造函数,此时最好手动更改
2. `Cat`的原型对象会被更改为`Animal`的实例对象,旧原型上的任何属性都会被更改(指向变换了)
3. `Cat.prototype`的指向为`Animal`的一个实例对象a
4. 那么同时可以在继承后的原型加方法

```js
Cat.prototype.behavior = function () {
  console.log(this.name + '我会跑')
}
```

![Cat.prototype的原型指向](Cat.prototype.png)

## Object.setPrototypeOf()

```js
Object.setPrototypeOf(Cat.prototype, Animal.prototype)
console.log(Cat.prototype)
const cat = new Cat('mimi', 'miao~miao~')
cat.shout()
cat.behavior()
```

1. ![使用setPrototypeOf](setPrototypeOf.png)
2. 给`Cat`的原型设置了一个名为`Animal`的原型,所以Cat的**原有的原型**的原型就是Animal的原型`Cat.prototype.__proto__ === Animal.prototype`
3. 所以`setPrototypeOf`会优先访问`Cat`原有的原型然后再访问原型的原型

## Object.create()

```js
Cat.prototype = Object.create(Animal.prototype)
console.log(Cat.prototype)
```

1. ![create](create.png)
2. 使用`Object.create()`会将`Cat.prototype`先将此原型清成空的原型,这个空的原型会指向Animal的原型`Cat.prototype.__proto__ === Animal.prototype`
3. 所以`Object.create()`会将`Cat.prototype`清空为干净的原型,然后去继承

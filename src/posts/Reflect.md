---
title: Reflect
date: 2021-12-04 11:41:29
categories: JavaScript
tags:
   - JavaScript
   - TypeScript
summary: reflect 反射
---

## Reflect

1. Reflect并非一个构造函数,不能通过new运算符对其进行调用,或者将Reflect对象作为一个函数来调用(将原本Object命令式改为函数行为)
   - `'assign' in Object`
   - `Reflect.has(Object, 'assign')`
2. Reflect的所有属性和方法都是静态的
3. Reflect提供了以下静态方法与proxy handler methods(en-US)的命名相同
4. 其中的一些方法Object相同,
   尽管二者之间存在某些细微上的差别.即Reflect对象上可以拿到语言内部的方法

### Reflect.apply()

> 过指定的参数列表发起对目标(target)函数的调用

- 注意:如果 target 对象不可调用,抛出 TypeError
- 调用完带着指定参数和 this 值的给定的函数后返回的结果

1. `target`:目标函数
2. `thisArgument`:target函数调用时绑定的this对象
3. `argumentsList`:target函数调用时传入的实参列表l,该参数应该是一个类数组的对象

```js
Reflect.apply(RegExp.prototype.test, /ab/, ["confabulation"]);
//true
```

### Reflect.construct()

> 类似于new操作符构造函数,相当于运行`new target(...args)`

- 如果target不是构造函数,抛出TypeError
- 以target(如果newTarget存在,则为newTarget)函数为构造函数,argumentList为其初始化参数的对象实例

1. `target`:被运行的目标**构造函数**
2. `argumentsList`:类数组,目标构造函数调用时的参数
3. `newTarget`(可选):作为新创建对象的原型对象的constructor属性,参考`new.target`操作符,默认值为target

```js
function OneClass() {
  this.name = "one";
}

function OtherClass() {
  this.name = "other";
}

// 创建一个对象:
var obj1 = Reflect.construct(OneClass, args, OtherClass);

// 与上述方法等效:
var obj2 = Object.create(OtherClass.prototype);
OneClass.apply(obj2, args);
```

1. 当使用`Object.create()`和`Function.prototype.apply()`时,如果不使用new操作符调用构造函数,构造函数内部的new.target值会指向undefined

2. 当调用`Reflect.construct()`来创建对象,new.target值会自动指定到target(或者newTarget,前提是newTarget指定了)

### Reflect.defineProperty()

> 基本等同于`Object.defineProperty()`方法唯一不同是返回Boolean值

- 注意:如果target不是 Object,抛出一个 TypeError
- Boolean 值指示了属性是否被成功定义

1. `target`:目标对象
2. `propertyKey`:要定义或修改的属性的名称
3. `attributes`:要定义或修改的属性的描述

```js
let obj = { "x": 2 };
Reflect.defineProperty(obj, "y", { value: 7 }); // true
console.log(obj); //{x: 2, y: 7}
```

### Reflect.deleteProperty()

> 用于删除属性.类似`delete operator`但它是一个函数

- 如果target不是Object,抛出一个 TypeError
- 返回`Boolean`值表明该属性是否被成功删除

1. `target`:删除属性的目标对象
2. `propertyKey`:需要删除的属性的名称

```js
var obj = { x: 1, y: 2 };
Reflect.deleteProperty(obj, "x"); // true
obj; // { y: 2 }
```

1. 如果是数组:数组对象和下标
2. 如果是一个空对象,删除属性,返回`true`
3. 如果属性不可配置`Object.freeze({foo: 1})`,则返回false

### Reflect.has()

> `Reflect.has(target, propertyKey)`作用与in操作符相同

- 注意:如果目标对象不是Object类型,则抛出TypeError
- 返回一个boolean类型

1. `target`:目标对象
2. `propertyKey`:属性名,需要检查目标对象是否存在此属

```js
//如果该属性存在于原型链中,返回true
Reflect.has({ x: 0 }, "toString");

// Proxy 对象的 .has() 句柄方法
const obj = new Proxy({}, {
  has(t, k) {
    return k.startsWith("door");
  },
});
Reflect.has(obj, "doorbell"); // true
```

### Reflect.get()

> 该方法与从对象`(target[propertyKey])`中读取属性类似,但它是通过一个函数执行来操作的

- 注意:如果目标对象不是Object类型,则抛出TypeError
- 返回属性的值

1. `target`:需要取值的目标对象
2. `propertyKey`:需要获取的值的键值
3. `receiver`:如果target对象中指定了getter,receiver则为getter调用时的this值

```js
const x = { p: 1 };
const obj = new Proxy(x, {
  get(t, k, r) {
    return k + "bar";
  },
});
Reflect.get(obj, "foo"); // "foobar"
```

### Reflect.set()

> 在一个对象上设置一个属性

- 注意:如果目标对象不是Object类型,则抛出TypeError
- 返回一个布尔值表示是否设置成功

1. `target`:设置属性的目标对象
2. `propertyKey`:设置的属性的名称
3. `value`:设置的值
4. `receiver`:如果遇到setter,receiver则为setter调用时的this值

```js
var obj = {};
Reflect.set(obj, "prop", "value"); // true
obj.prop; // "value"
```

### Reflect.getOwnPropertyDescriptor()

> 如果属性在对象中存在,则返回给定的属性的属性描述符.否则返回`undefined`

- 注意:如果目标不是`Object`,抛出一个
  TypeError而`Object.getOwnPropertyDescriptor`会将非对象强制转换成对象
- 如果在给定的目标对象中,则返回属性.如果存在,则返回 undefined

1. target:需要寻找属性的目标对象
2. propertyKey:获取自己的属性描述符的属性的名称

```js
Reflect.getOwnPropertyDescriptor({ x: "hello" }, "x");
// {value: "hello", writable: true, enumerable: true, configurable: true}
```

### Reflect.getPrototypeOf()

> 返回指定对象的原型

- 注意:如果目标对象不是Object类型,则抛出TypeError
- 如果属性存在于给定的目标对象中，则返回属性描述符；否则，返回 undefined

1. target:需要寻找属性的目标对象

```js
Reflect.getPrototypeOf({});
// Object.prototype
```

### Reflect.setPrototypeOf()

> 它可设置对象的原型(即内部的`[[Prototype]]`属性)为另一个对象或
> null,如果操作成功返回true,否则返回 false

- 注意:如果目标对象不是Object类型,则抛出TypeError
- 返回一个Boolean值证明已经初步成功设置

1. `target`:设置目的的目标对象。
2. `prototype`:对象的新原型(一个对象或null)

```js
Reflect.setPrototypeOf({}, Object.prototype);
// true
```

### Reflect.isExtensible()

> 判断一个对象是否可扩展(即是否能够添加新的属性)

- 注意:如果目标对象不是Object类型,则抛出TypeError
- 返回一个 Boolean 值表明该对象是否可扩展

1. `target`:检查是否可扩展的目标对象

```js
const frozen = Object.freeze({});
Reflect.isExtensible(frozen); //false
```

### Reflect.ownKeys()

> 返回一个由目标对象自身的属性键组成的数组

- 注意:如果目标对象不是Object类型,则抛出TypeError
- 由目标对象的自身属性键组成的 Array

1. `target`:检查是否可扩展的目标对象

```js
Reflect.ownKeys({ z: 3, y: 2, x: 1 });
// [ "z", "y", "x" ]
```

### Reflect.preventExtensions()

> 阻止新属性添加到对象(例如:防止将来对对象的扩展被添加到对象中)

- 注意:如果目标对象不是Object类型,则抛出TypeError
- 返回一个价值保证Boolean目标对象是否成功被设置为不可扩展

1. `target`:阻止扩展的目标对象

```js
var empty = {};
Reflect.isExtensible(empty); //true
Reflect.preventExtensions(empty);
Reflect.isExtensible(empty); //false
```

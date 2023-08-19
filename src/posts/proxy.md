---
title: Proxy
date: 2021-12-03 22:44:07
categories: JavaScript
tags:
   - JavaScript
summary: Proxy 代理
---

## Proxy

> - Proxy
  > 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义 (如属性查找，赋值，枚举，函数调用等)
> - 目标对象既可以直接被操作，也可以通过代理来操作，但直接操作会绕过代理实施的行为
> - proxy 在目标对象的外层搭建了一层拦截，**外界对目标对象的某些操作，必须通过这层拦截**

```js
const p = new Proxy(target, handler);
```

- 参数：
  1. `target`:要使用 Proxy 包装的目标对象 (可以是任何类型的对象，包括原生数组，函数，甚至另一个代理)
  2. `handler`:一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为

### traps(捕获器)

> 提供属性访问的方法：每个捕获器都对应一种基本操作，可以直接或者间接在代理对象上使用
>
> 每次代理对象上调用这些基本操作是，代理可以在这些操作传播到目标对象之前**先调用捕获器函数，从而拦截并修改相应的行为**

```js
const target = {
  name: "zhangsan",
};
const handler = {
  get(target, key) {
    console.log(`${key} 被读取`);
    return target[key];
  },
  set(target, key, value) {
    console.log(`${key} 被设置为 ${value}`);
    target[key] = value;
  },
};
const proxy = new Proxy(target, handler);
proxy.name;
//name 被读取
proxy.name = "lisi";
//name 被设置为 lisi
console.log(target.name);
//lisi
```

1. `proxy`读取属性的值时，实际执行的是`handler.get`:读取被代理对象的`target`属性
2. `proxy`设置属性值时，实际上执行的是`handler.set`:读取被代理对象`target`属性
3. 目标对象也会改变

### Proxy.revocable()

> `Proxy.revocable()`方法可以用来创建一个可撤销的代理对象

- 返回值：
  1. 返回一个包含了代理对象本身和它的撤销方法的可撤销`Proxy`对象
  2. 返回值是一个对象，其结构为`{"proxy":proxy, "revoke":revoke}`
     1. `proxy`:表示新生成的代理对象本身
     2. `revole`:撤销方法，调用的时候不需要加任何参数

```js
const revocable = Proxy.revocable({}, {
  get(target, name) {
    return "[[" + name + "]]";
  },
});
const proxy = revocable.proxy;
proxy.foo; // "[[foo]]"
revocable.revoke();
console.log(proxy.foo); // 抛出 TypeError
```

### handler 的代理范围

#### **handler.has()**

- 在判断代理对象是否拥有某个属性时触发该操作

> 返回一个布尔值

- 拦截：
  1. 属性查询：`"foo" in proxy`
  2. 继承属性查询：`foo in Object.create(proxy)`
  3. `Reflect.has()`

- TypeError
  1. 如果目标对象的**某一属性本身不可被配置**
  2. 如果目标对象为**不可扩展对象**

```js
const handler1 = {
  has(target, key) {
    if (key[0] === "_") {
      return false;
    }
    return key in target;
  },
};
const monster1 = {
  _secret: "easily scared",
  eyeCount: 4,
};
const proxy1 = new Proxy(monster1, handler1);
console.log("eyeCount" in proxy1); // true
console.log("_secret" in proxy1); // false
console.log("_secret" in monster1); //true
```

1. `target`:目标对象
2. `prop`:需要检查是否存在的属性

#### **handler.get()**

- 在读取代理对象的某个属性时触发该操作

> 可以返回任意值

- 拦截：
  1. 访问属性：`proxy.bar`
  2. 访问原型链上的属性：`Object.create(proxy)[foo]`
  3. `Reflect.get()`

- TypeError
  1. 如果目标对象的**某一属性本身不可被配置**
  2. 如果要访问的目标属性没有配置访问方法，即 get 方法是 undefined 的，则返回值必须为 undefined

```js
const p = new Proxy(target, {
  get(target, property, receiver) {
    return ...
  }
})
```

1. `target`:目标对象
2. `property`:被获取的属性名
3. `receiver`:Proxy 或者继承 Proxy 的对象

#### **handler.set()**

- 在给代理对象的某个属性赋值时触发该操作

> 默认返回 true

- 拦截
  - 指定属性值：`proxy.foo = bar`
  - 指定继承者的属性值：`Object.create(proxy)[foo] = bar`
  - `Reflect.set()`

- TypeError
  1. 如果目标对象的**某一属性本身不可被配置**
  2. 如果目标属性没有配置存储方法，即 set 方法是 undefined 的，则不能设置他的值
  3. 严格模式下，如果 set() 方法返回 false，那么也会抛出一个 TypeError 异常

1. `target`目标对象
2. `property`将被设置的属性名或 Symbol
3. `value`新属性值
4. `receiver`最初被调用的对象。通常是 proxy 本身，但 handler 的 set 方法也有可能在原型链上，或以其他方式被间接地调用 (因此不一定是 proxy 本身)

#### **handler.getPrototypeOf()**

- 在读取代理对象的原型时触发该操作

> 返回值必须是一个对象或者 null

- 拦截
  - `Object.getPrototypeOf()`
  - `Reflect.getPrototypeOf()`
  - `\_\_proto\_\_`
  - `Object.prototype.isPrototypeOf()`
  - `instanceof`

- TypeError:
  - `getPrototypeOf()`方法返回的不是对象也不是 null
  - 目标对象是不可扩展的，且`getPrototypeOf()`方法返回的原型不是目标对象的原型

```js
const obj = {};
const proto = {};
const handler = {
  getPrototypeOf(target) {
    console.log(target === obj); // true
    console.log(this === handler); // true
    return proto;
  },
};

const p = new Proxy(obj, handler);
console.log(Object.getPrototypeOf(p) === proto);
```

1. `target`:被代理的目标对象

#### **handler.setPrototypeOf()**

- 在设置代理对象的原型时触发该操作

> 成功修改了`[[Prototype]]`,`setPrototypeOf`方法返回 true，否则返回
false 或者抛出异常

- 拦截
  - `Object.setPrototypeOf()`
  - `Reflect.setPrototypeOf()`

- TypeError
  - 如果 target 不可扩展，原型参数必须与`Object.getPrototypeOf(target)`的值相同

1. `target`目标对象
2. `prototype`对象新原型或为 null

#### **handler.isExtensible()**

- 在判断一个代理对象是否是可扩展时触发该操作

> 必须返回一个 Boolean 值或可转换成 Boolean 的值

- 拦截
  - `Object.isExtensible()`
  - `Reflect.isExtensible()`

- TypeError:
  - 必须返回 true 或者为 true 的值，返回 false 和为 false 的值都会报错

```js
const p = new Proxy({}, {
  isExtensible(target) {
    console.log("called");
    return true; //也可以 return 1;等表示为 true 的值
  },
});

console.log(Object.isExtensible(p));
```

#### **handler.preventExtensions()**

- 在让一个代理对象不可扩展时触发该操作

> 返回一个布尔值

- 拦截
  - `Object.preventExtensions()`:将一个对象变为不可扩展，返回一个不可扩展的对象
  - `Reflect.preventExtensions()`

- TypeError
  - 如果目标对象是可扩展的，那么只能返回 false

```js
const p = new Proxy({}, {
  preventExtensions(target) {
    console.log("called");
    Object.preventExtensions(target);
    return true;
  },
});

console.log(Object.preventExtensions(p));
```

1. `target`:所要拦截的目标对象

#### **handler.getOwnPropertyDescriptor()**

- 在获取代理对象某个属性的属性描述时触发该操作

> 必须返回一个对象或 undefined

- 拦截
  - `Object.getOwnPropertyDescriptor()`
  - `Reflect.getOwnPropertyDescriptor()`

- TypeError
  1. 必须返回一个 object 或 undefined，否则 TypeError
  2. 如果属性作为目标对象的不可配置的属性存在
  3. 如果**属性不存在**或者**作为目标对象的属性存在**,并且目标对象不可扩展

```js
const p = new Proxy({ a: 20 }, {
  getOwnPropertyDescriptor(target, prop) {
    console.log("called: " + prop);
    return { configurable: true, enumerable: true, value: 10 };
  },
});

console.log(Object.getOwnPropertyDescriptor(p, "a").value);
// "called: a"
//10
```

1. `target`目标对象
2. `prop`返回属性名称的描述

#### **handler.defineProperty()**

- 在定义代理对象某个属性时的属性描述时触发该操作

> 必须以一个 Boolean 返回，表示定义该属性的操作成功与否

- 拦截
  - `Object.defineProperty()`
  - `Reflect.defineProperty()`
  - `proxy.property='value'`

- TypeError
  1. 目标对象不可扩展
  2. 不能添加或者修改一个属性为不可配置的
  3. 严格模式下，false 作为 handler.defineProperty 方法的返回值的话将会抛出
     TypeError 异常

```js
const p = new Proxy({}, {
  defineProperty: function (target, prop, descriptor) {
    console.log("called: " + prop);
    return true;
  },
});

const desc = { configurable: true, enumerable: true, value: 10 };
Object.defineProperty(p, "a", desc); // "called: a"
```

1. `target`:目标对象
2. `property`待检索其描述的属性名。
3. `descriptor`定义或修改的属性的可能性

#### **handler.deleteProperty()**

- 在删除代理对象的某个属性时触发该操作

> 必须返回一个 Boolean 类型的值，表示该属性是否被成功删除

- 拦截：
  - 删除属性：`delete proxy.foo`
  - `Reflect.deleteProperty()`

- TypeError
  - 如果目标对象的属性是不可配置的，那么该属性不能被删除

```js
const p = new Proxy({}, {
  deleteProperty: function (target, prop) {
    console.log("called: " + prop);
    return true;
  },
});
delete p.a;
```

1. `target`目标对象
2. `property`待删除的属性名

#### **handler.ownKeys()**

- 在获取代理对象的所有属性键时触发该操作

> ownKeys 方法必须返回一个可枚举对象

- 拦截
  - `Object.getOwnPropertyNames()`
  - `Object.getOwnPropertySymbols()`
  - `Object.keys()`
  - `Reflect.ownKeys()`

- TypeError
  1. ownKeys 的结果必须是一个数组
  2. 数组的元素类型要么是一个 String，要么是一个 Symbol
  3. 结果列表必须包含目标对象的所有不可配置 (non-configurable),自有 (own) 属性的 key
  4. 如果目标对象不可扩展，那么结果列表必须包含目标对象的所有自有 (own) 属性的 key，不能有其它值

```js
const p = new Proxy({}, {
  ownKeys: function (target) {
    return ["a", "b", "c"];
  },
});
console.log(Object.getOwnPropertyNames(p));
// [ 'a', 'b', 'c' ]
```

1. `target`:目标对象

#### **handler.apply()**

- 在调用一个目标对象为函数的代理对象时触发该操作

> 可以返回任何值

- 拦截
  - `proxy(...args)`
  - `Function.prototype.apply()` 和 `Function.prototype.call()`
  - `Reflect.apply()`

- TypeError
  - 必须是一个函数

```js
const p = new Proxy(target, {
  apply(target, thisArg, argumentsList) {
  },
});
```

1. `thisArg`被调用时的上下文对象
2. `argumentsList`被调用时的参数数组

#### **handler.construct()**

- 在给一个目标对象为构造函数的代理对象构造实例时触发该操作，用于初始化代理的目标对象自身必须具有[[构造]]内部方法

> construct 方法必须返回一个对象

- 拦截以下操作
  - **new proxy(...args)**
  - **Reflect.construct()**

```js
const p = new Proxy(target, {
  construct(target, argumentsList, newTarget) {
    return {};
  },
});
```

1. `target`:目标对象
2. `argumentsList`:constructor 的参数列表
3. `newTarget`:最初被调用的构造函数，就上面的例子而言是 p

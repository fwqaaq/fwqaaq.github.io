---
title: vue中的工具函数
date: 2021-11-26 22:07:52
author: Jack-zhang
categories: vue
tags:
   - JS
   - TS
   - vue
summary: vue3工具函数的理解
---

## vue中的工具函数

### EMPTY_OBJ

```ts
export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}
```

* `Object.freeze({})`冻结最外面的对象,不能修改,**被包裹的对象可以被修改**
* `EMPTY_OBJ`对象如果在开发环境会返回一个不可修改的空对象,如果修改就会报错

### EMPTY_ARR

```ts
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : []
```

> 同上(有一个问题就是,使用`push`等方法时不能修改,所以`[]`用的还是多一点)

### NOOP

```ts
export const NOOP = () => {}
```

1. 方便压缩代码
2. 可以方便判断(`component.ts`例子)

### NO

```ts
export const NO = () => false
```

> 永远返回一个`false`,方便压缩代码

### isOn

```ts
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)
```

1. `onRE`:匹配一个开头是`on`第三个位置不是小写字母的字符
2. `isOn`检查是否匹配

* 例如:`onClick`匹配,`onclick`不匹配

### isModelListener

```ts
export const isModelListener = (key: string) => key.startsWith('onUpdate:')
```

* **startsWith**:匹配开头字符串是否与传入的字符串相同,第二个传一个从哪里开始的索引.

```ts
startsWith(searchString: string, position?: number): boolean;
```

>用于检查是不是以**onUpdate:**开头

### extend

```ts
export const extend = Object.assign
```

>用于合并对象,可以参考一下我之前写的<http://mail.zyjcould.ltd/2021/10/20/js-de-kao-bei-fang-shi/>

### remove

```ts
export const remove = <T>(arr: T[], el: T) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}
```

>删除指定的元素

* **indexOf**:只会返回第一个匹配到的元素索引
* **splice**:第一个参数为删除元素下标,第二个为删除个数

### hasOwnProperty

```ts
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)
```

> hasOwnProperty用来检测一个对象是否有特定的自身属性
>>hasOwn是类型守卫函数,类型守卫函数是指在函数返回值类型中使用类型谓词的函数
>>该函数返回一个布尔类型

1. is是类型谓词相当于**boolean**类型,表示一种类型判定,例如`x is T`即判定x类型是否为T(此时就能明白只有x类型是T的时候才返回true)
2. 使用`keyof typeof val`,拿到所有对象的键的联合类型
3. 使用`call`显示绑定第一个参数

### 对象转字符串

>使用`toTypeString`,返回一个`[object object]`第二个`object`是动态的

```ts
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)
```

>截取字符,例如`[object RawType]`,会截取到`RawType`

```ts
export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}
```

### 判断函数

> **isArray**使用数组自带的判断函数

```ts
export const isArray = Array.isArray
```

>**isMap**,**isSet**重写了`toString`方法

```ts
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'

export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'
```

>**isDate**,**isFunction**对象类型使用`instanceof`,function也可以使用`val instanceof Function`

```ts
export const isDate = (val: unknown): val is Date => val instanceof Date

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
```

>**isString**,**isSymbol**基本数据类型使用`typeof`

```ts
export const isString = (val: unknown): val is string => typeof val === 'string'

export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
```

>**isObject**对象类型,排除`null`,null也是object类型

```ts
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

//用一组 T 类型的属性 K 构造一个类型
type Record<K extends keyof any, T> = {
  [P in K]: T;
};  
```

>**isPromise**判断是不是一个promise类型

```ts
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
```

> **isPlainObject**判断是不是一个纯碎的对象

```ts
export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'
```

* 因为`isObject([])`返回的也是true,但是`isPlainObject([])`是false
* 只有参数为对象`{}`时才会返回`true`

>**isIntegerKey**:判断是不是数字型的字符串key值

```ts
export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key
```

* 必须是字符串,不能是`NaN`第一个字符不能是`-`,`parseInt(key, 10)`返回该值的十进制数

### makeMap&&isReservedProp

```ts
export function makeMap(
  str: string,
  expectsLowerCase?: boolean
): (key: string) => boolean {
  //创建一个没有值的空对象
  const map: Record<string, boolean> = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}
```

> `makeMap`将一组值保存在map对象中,根据`expectsLowerCase`返回一个函数

* 具体实现

```ts
export const isReservedProp = /*#__PURE__*/ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ',key,ref,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted'
)
```

### cacheStringFunction

>将字符串计算结果保存在闭包中的函数,为了避免相同值的重复计算

```ts
const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as any
}
```

* 使用`cacheStringFunction`的示例(可以使用debugger打断点)

```ts
let count = 0
const reverse = (str: string) => {
  console.log(++count) // reverse 只计算一次
  return str.split('').reverse().join('')
}

const stringReverse = cacheStringFunction(reverse)
stringReverse('abc')
stringReverse('abc')
```

* 第一次调用`fn(str)`时会将键值保存到`cache[str]`中,由于是一个闭包,执行之后内存并不会自己释放,如果下次处理相同的**字符串**,会直接调用缓存,而不是**fn(str)**

> 参考:<https://zhuanlan.zhihu.com/p/422499151>

### 字符串转换

* 如果理解了**cacheStringFunction**就会很容易理解

> **camelize**连字符命名转换成驼峰命名

```ts
const camelizeRE = /-(\w)/g
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})
```

* 使用`()`分组捕获,`-`对应的捕获就是`_`,`(\w)`对应的捕获就是`c`

> **hyphenate**驼峰命名转换成连字符命名

```ts
const hyphenateRE = /\B([A-Z])/g

export const hyphenate = cacheStringFunction((str: string) =>
  str.replace(hyphenateRE, '-$1').toLowerCase()
)
```

* `\B`是非单词边界,不匹配开头

> **capitalize**:首字母转大写

```ts
export const capitalize = cacheStringFunction(
  (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
)
```

> **toHandlerKey**,小写字母转驼峰

```ts
export const toHandlerKey = cacheStringFunction((str: string) =>
  str ? `on${capitalize(str)}` : ``
)
```

### hasChanged

> 检验两个值是否发生变化

```ts
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)
```

* 和`===`的区别,除了以下,别的都一样

| 比较值  | ===   | Object.is |
| ------- | ----- | --------- |
| +0,-0   | true  | false     |
| NaN,NaN | false | true      |

### invokeArrayFns

>依次调用数组中的函数,方便统一执行

```ts
export const invokeArrayFns = (fns: Function[], arg?: any) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg)
  }
}
```

### def

> 定义对象属性

```ts
export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}
```

* 属性描述符

| 属性                            | 描述                             | 默认值    |
| ------------------------------- | -------------------------------- | --------- |
| value                           | 当试图获取属性时所返回的值       | undefined |
| writable                        | 该属性是否可写                   | false     |
| enumerable                      | 该属性在for in循环中是否会被枚举 | false     |
| configurable 该属性是否可被删除 | false                            |
| set()                           | 属性的更新操作所调用的函数       | false     |
| get()                           | 获取属性值时所调用的函数         | false     |

1. 数据描述符:enumerable,configurable,value,writable
2. 存取描述符:enumerable,configurable,set(),get()
3. 如果定义了set(),get()之后,再定义value,writable会<span style="color:red">报错</span>

### toNumber

>将字符串型数字转换成`number`类型

```ts
export const toNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
```

### getGlobalThis

> 获取全局`this`指向

```ts
let _globalThis: any
export const getGlobalThis = (): any => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  )
}
```

1. 第一次一定是`undefined`
2. 如果存在`gloablThis`,`self`,`window`,`global`中任意一个,就返回对应的this指向,没有则返回空对象(微信小程序)
3. 第二次不需要再使用this判断

## 总结与感悟

1. 参考:以上都是参考若川大佬以及自己的理解:<https://juejin.cn/post/6994976281053888519#heading-7>
2. 关于开发环境和生产环境的区别
3. 关于使用闭包达到缓存的目的让我觉得很神奇.(我太菜了)
4. 关于ts中is谓词的使用,我的理解是布尔类型的加强

---
title: 函数柯里化、偏函数以及惰性函数
date: 2022-02-24 22:34:17
categories: TypeScript
tags:
   - JavaScript
   - TypeScript
summary: JavaScript 中的函数柯里化、偏函数以及惰性函数
---

## 柯里化

> [!NOTE]
> 什么是函数柯里化？
>
> 在计算机中，柯里化是将使用多个参数的一个函数转换成一些列使用一个参数的函数

- 例如：

```ts
function add(a: number, b: number) {
  return a + b;
}
//执行 add 函数，依次传入两个参数
add(1, 2);

//如果有一个 carry 函数，可以做到柯里化
let addCurry = curry(add);
addCurry(1)(2);
```

> 柯里化的用途可以理解为参数复用，本质上是降低通用性，提高适用性

- 例如有一段这样的数据

```ts
const person = [{ name: "zhangsan" }, { name: "lisi" }];
```

1. 使用 map 函数

   ```ts
   let names = person.map(function (item) {
     return item.name;
   });
   ```

2. 如果对象中有多个属性，那就要写多个 map 才行

   ```ts
   let prop = curry((key, obj) => {
     obj[key];
   });
   let name = person.map(prop("name"));
   ```

- 这样就体现出柯里化的重要性

```ts
function curry<T>(fn: Function): Function {
  return function (...args: T[]) {
    if (args.length < fn.length) {
      return curry(fn.bind(this, ...args));
    } else {
      return fn(...args);
    }
  };
}

function add(a: number, b: number, c: number) {
  return a + b + c;
}

let curryAdd = curry(add);
console.log(curryAdd(1, 3)(3));
```

- `fn.length`就是被柯里化函数的
- `...args`是被柯里化函数的返回值 (curryAdd) 传入的个数。理想状态是只传一个
- `curryAdd`本质上来讲就是 curry 函数的返回值，只有 curryAdd 有实参，args 才会有值

1. 执行`let curryAdd = curry(add)`,返回一个闭包

   ```ts
   function (...args: T[]) {
       if (args.length < fn.length) {
         return curry(fn.bind(null, ...args))
       } else {
         return fn(...args)
       }
     }
   ```

2. 执行`curryAdd(1,3)`当前的`fn.length`就是 add 形参的数量 3 大于实参的数量 2
   - 同样返回了和 1 一样的一个闭包，但是 fn 发生了改变，传入的是`fn.bind(null, ...args)`
   - 执行一个递归，由于 bind 函数是柯里化的，这里的`fn.length`在结束的时候就变成了 1
3. 执行`[curryAdd(1,3)](3)`当前的`fn.length`由于是会执行 else 的内容
   - `add.bind(this, 1 , 3)(3)`:这样就利用 bind 完成了一个柯里化的过程

```ts
type IPerson = {
  name: string;
  age: number;
};

const person: IPerson[] = [
  { name: "zhangsan", age: 12 },
  { name: "lisi", age: 100 },
];

let prop = curry((key: keyof IPerson, obj: IPerson) => {
  return obj[key];
});

console.log(person.map(prop("name")));
```

## 偏函数 (Partial Function)

> 在计算机科学中，偏函数是指固定一个函数的一些参数，然后产生另一个更小元的函数。
>
> 什么是元？元是指函数参数的个数，比如一个带有两个参数的函数被称为二元函数。

```ts
function add(a, b) {
  return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2); // 3

// 假设有一个 partial 函数可以做到局部应用
const addOne = partial(add, 1);

addOne(2); // 3
```

> 和函数柯里化的区别

1. 柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数
2. 偏函数则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n-x 元函数

- 柯里化和偏函数的关系：**柯里化通过偏函数来实现**

> 当然也可以使用`bind`函数来实现偏函数

```ts
function test(a: number, b: number, c: number) {
  return a + b + c;
}

let bindOne = test.bind(null, 1);
console.log(bindOne(2, 3));
```

- 但是这会直接改变 this 的指向

> 手动实现

```ts
function partical(fn: Function, ...args: any[]): Function {
  return function (...moreArgs: any[]) {
    return fn(...args, ...moreArgs);
  };
}
```

## 惰性函数

> 惰性函数就是说函数执行一次后，之后调用函数都是相同的作用，直接返回第一次执行函数。很多时候只需要执行一次，因为之后每次调用函数执行的结果都一样。所以如果函数语句不必每次执行，我们可以使用称之为惰性函数的技巧来进行优化。

- 如果我们现在需要写一个 foo 函数，这个函数返回首次调用时的 Date
  对象，注意是首次

1. 闭包的写法

   ```ts
   let foo: () => Function = function () {
     let time: Date = new Date();
     return function () {
       if (time) time;
       return time;
     };
   };
   ```

2. 惰性函数：惰性函数就是解决每次都要进行判断的这个问题，解决原理很简单，重写函数

   ```ts
   let foo: () => Function | Date = function () {
     let time: Date = new Date();
     foo = function () {
       return time;
     };
     return foo();
   };
   ```

### 惰性求值 (Lazy evaluation)

> 按需求值机制，只有当需要计算所得值时才会计算

- 利用生成器机制可以很容易写出

```ts
const rand = function* () {
  while (true) {
    yield Math.random();
  }
};

const randIter = rand();
randIter.next();
```

## 纯函数 (Purity)

1. 应始终返回相同的值。不管调用该函数多少次，或者什么时候调用都是一样的
2. 自包含 (不包含全局变量)
3. 不应修改程序的状态或引起副作用 (修改全局变量)

```ts
//纯函数
const greet = (name: string) => `hello, ${name}`;
greet("world");

//不是纯函数，修改了外部的状态
let greeting: string;
const greet = (name: string) => {
  greeting = `hello, ${name}`;
};
greet("world");
```

> 副作用 (Side effects):如果函数与外部可变状态进行交互，则它就是具有副作用的

```ts
//Date 对象就是一个很常见的具有副作用的函数
const differentEveryTime = new Date();
```

## 幂等性

> 幂等性和纯函数还是有很大区别的，甚至说可以说是毫无无关系

1. 幂等性函数可以具有副作用
2. 函数执行多次返回相同的结果 (`f(f(x))=f(x)`),则此函数具有幂等性

```ts
Math.abs(Math.abs(-10));
```

## 函数组合 (Function Composing)

> 接收多个函数作为参数，从右到左，一个函数的输入为以一个函数的输出

```ts
const compose =
  (f: Function, g: Function): Function => (a: Function): Function => f(g(a));
```

- 做一个反转函数，并且获取第一个索引的例子

```ts
//不能确定返回索引的类型，可以使用泛型，这里就用 any 了
function first<T>(arr: T[]): any {
  return arr[0];
}
function reverse<T>(arr: T[]): T[] {
  return arr.reverse();
}
let last = compose(first, reverse);
console.log(last([1, 2, 3, 4, 5]));
```

> 当然 redux 给出了一个更好的实现 (将函数的个数情况也考虑周全了)

- 其实还有一个问题就是在闭包中写泛型其实是没有检查的效果

```ts
function compose(...fns: Function[]) {
  if (fns.length === 0) {
    return (arg: Function) => arg;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return fns.reduce(
    (a, b) =>
    //Writing a type here won't do any good
    <T>(...args: T[]): Function => a(b(...args)),
  );
}
```

### 生成器的方式

> 实现 `map`
> 映射函数，由于生成器的`yield`接受的是上一次的结果，所以第一次的迭代效果是无效的

```ts
function* genMap(iteratee: Function): Generator<string | null, any> {
  let input = yield null;
  while (true) {
    input = yield iteratee(input);
  }
}

const gen = genMap((x: string) => x.toUpperCase());
const arr = ["a", "b", "c"];
console.log(gen.next());
for (let i of arr) {
  console.log(gen.next(i));
}
```

- 这种效率是比较低的，并且第一次是浪费的

```ts
function* genMap(
  iterable: Iterable<any>,
  iteratee: Function,
): Generator<string | null, any> {
  for (let i of iterable) {
    yield iteratee(i);
  }
}
const gen = genMap(["a", "b", "c"], (x: string) => x.toUpperCase());
```

> 使用 `yield*` 来调用另一个生成器的方式来进行函数组合，
> `iterable`会不停的叠加作用域

```ts
function* genCompose(
  iterable: Iterable<any>,
  ...fns: Function[]
): Generator<any, any, any> {
  for (let fn of fns) {
    iterable = genMap(iterable, fn);
  }
  yield* iterable;
}

const composed = genCompose(
  [1, 2, 3],
  (x: number) => x + 1,
  (x: number) => x * x,
  (x: number) => x - 2,
);
```

### [Pointfree](https://www.ruanyifeng.com/blog/2017/03/pointfree.html)

> 这是函数式编程的答案，利用函数组合和柯里化可以达到一个很好的函数式效果

- [ramda](https://ramdajs.com/)中所有的函数都支持柯里化
- 阮老师的教程:<https://www.ruanyifeng.com/blog/2017/03/ramda.html>

```js
//ramda
fn = R.pipe(f1, f2, f3);
```

- 定义`f1`,`f2`,`f3`可以推算出`fn`.整个过程中。根本不需要知到其中的参数变化
- 换一种当时可以理解为，只需要将一些简单的步骤合成到一起，定义成一种参数无关的合成运算
- 这种风格就是`Pointfree`.例如上面的例子就是一个`Pointfree`

> `Pointfree`的本质就是使用一些通用的函数，组合除各种复杂的运算.shang 层运算不直接操作数据

```ts
interface Iperson {
  name: string;
  role: string;
}

const data: Iperson[] = [
  { name: "张三", role: "worker" },
  { name: "李四", role: "worker" },
  { name: "王五", role: "manager" },
];

type Iper = keyof Iperson;

const isWorker = (s: string) => s === "worker";
//定义查找角色的函数，在这里嵌套会增加耦合
const prop = (p: Iper, obj: Iperson) => isWorker(obj[p]);
//指定读取 role 的值
const propRole = curry(prop)("role");

data.filter(propRole);
```

- 如果不适用`compose Function`会大大增加函数的耦合度。这就可以使用函数组合的思想降低耦合，避免洋葱模型

```ts
const prop = (p: Iper, obj: Iperson) => obj[p];
console.log(
  data.filter((_, index) => compose(isWorker, propRole)(data[index])),
);
```

## 函数记忆

> 只要把参数和对应的结果数据存到一个对象中，调用时，判断参数对应的数据是否存在，存在就返回对应的值

- 如果需要大量重复的计算又依赖于之前的计算，可以考虑函数记忆
- 利用 Map,Set 或者是数组做字典都是一种函数记忆
- 谨慎使用，消耗性很大

```ts
const memoize = function (fn: Function, hasher?: Function) {
  let cache: any = {};
  const menoize = function (...args: any[]) {
    const address = "" + (hasher ? hasher.apply(null, args) : args);
    if (!cache[address]) {
      cache[address] = fn.apply(null, args);
    }
    return cache[address];
  };
  return menoize;
};
```

> 当然，抄袭`underscore`的使用 ts 重够了一下很快

- 当没有 hansher(作为键的函数时),会让 args 作为键

```ts
let add = function (a: number, b: number, c: number) {
  return a + b + c;
};
let memoizedAdd = memoize(add);
console.log(memoizedAdd(1, 2, 3));
```

> 测试一下是，没有问题的。但是我们如果想要使用一个生成键的函数`hasher`

- 如果并不想要数组的全部内容，可以使用 slice 截取数组中的第一个作为键
- 当然也可以使用别的函数作为键

```ts
const memoizedAdd = memoize(add, function () {
  const args = Array.prototype.slice.call(arguments, 0, 1);
  return JSON.stringify(args);
});
```

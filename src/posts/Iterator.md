---
date: 2024-04-16 03:00:35
title: Iterator
categories: Other
tags:
  - Rust
  - JavaScript
  - TypeScript
summary: 迭代器、生成器以及协程之间的关系
---

## JavaScript

关于 JavaScript 中的[**可迭代协议**（Iterable protocol）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)，在 MDN 文档中是说明实现了 `[Symbol.iterator]` 的对象，其可以被 `for...of` 循环遍历。

```ts
interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
```

只要实现了以上的接口，那么就是一个可迭代的对象。实现**可迭代协议**并不意味着该对象可以被迭代，还需要实现[**迭代器协议**（Iterator protocol）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol)。**可迭代协议**返回了一个**迭代器**对象，实现了**可迭代协议**的对象都期待可以被迭代。

```ts
interface Iterator<T, TReturn = any, TNext = undefined> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return?(value?: TReturn): IteratorResult<T, TReturn>;
    throw?(e?: any): IteratorResult<T, TReturn>;
}
```

实现 `Iterator` 接口的对象，才可以被迭代。并且只有 `next` 方法是必须实现的，按照规范，`next` 方法必须返回一个 `IteratorResult` 对象，该对象的 `done` 值如果为 `true` 表示迭代结束，`value` 则为 `undefined`。因此我们可以很容易地实现一个可迭代的迭代器：

```js
const myIterator = {
  count: 0,
  next() {
    if (this.count < 3) {
      this.count++;
      return { value : this.count, done: false };
    }
    return { value : undefined, done: true };
  },
  [Symbol.iterator] () {
    return this
  }
};
```

因此几乎所有的语法和 API 都期望是可迭代的，而不是迭代器。**可迭代的迭代器**接口如下：

```ts
interface IterableIterator<T> extends Iterator<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
```

正如上面的示例，我们完全可以使用扩展运算符（`...`）、`for ... of` 等来迭代一个可迭代的对象。

### [生成器（Generator）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#generator_functions)

在 MDN 文档中很清晰地说明了**生成器**是一种特殊类型的**迭代器**，它返回一个 `Generator` 接口的对象。而之前的 `myIterator` 示例正是使用了手动管理状态的**迭代器**，这也就是为什么要使用**生成器**的原因，它不需要显示地管理内部状态，而是通过 `yield` 关键字来暂停和恢复函数的执行。它的语法如下：

```ts
interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: any): IteratorResult<T, TReturn>;
    [Symbol.iterator](): Generator<T, TReturn, TNext>;
}
```

> [!NOTE]
> 异步迭代器（`AsyncIterator`）和异步生成器（`AsyncGenerator`）的接口和语法与同步的迭代器和生成器类似，只是返回值是 `Promise` 对象。

### 协程（Coroutine）

> [!NOTE]
> 协程是一种比线程更轻量化的并发处理方式，它只存在于用户态，并不需要内核态的支持。协程可以**暂停**、**恢复**和**终止**，并且可以从挂起点恢复执行，保留之前的状态。

所以，在 JavaScript 中，有状态的迭代器以及生成器都可以看作是协程的一种实现。**协程**是由编程语言自己实现的，它会让函数不断地暂停和恢复，而**线程**是由操作系统控制的，单核 CPU 只能同时执行一个线程，所以会使用**时间片轮转**的方式来切换线程，这样就会导致**上下文切换**的开销。

但是在 JavaScript 中更常见的是使用 `async` 和 `await` 关键字来实现异步的协程。异步的关键就是将阻塞的函数挂起，将执行权移交给其他函数，等待异步操作执行完成后再恢复执行。利用 `yield` 挂起阻塞函数可以很容易的解决这个问题。

但是什么时候该执行这个挂起的函数呢？这个时候就需要一个状态机来管理这个函数的执行状态，而 `Promise` 就是一个状态机，它提供了 `pending`、`fulfilled` 和 `rejected` 三种状态，最终会兑现为后面两种状态的一种。在 `yield` 之后，我们可以通过 `Promise` 来查看这个函数的执行状态。

```js
// 模拟异步
function asyncFunc() {
  return new Promise((resolve) => {
    setTimeout(() => { resolve('fulfilled') }, 1000)
  })
}

function* coroutine() { 
  yield asyncFunc()
  // 挂起恢复之后的代码
}

const it = coroutine()
it.next().value.then((value) => { console.log('value: ', value) })

// 阻塞
for (let i = 0; i < 100; i++) { console.log(i) }
```

`yield` 挂起之后会阻塞后面的代码，但是后面的 `for` 循环是阻塞的，所以即使 `Promise` 兑现了，也要等待 `for` 循环结束之后才会执行。

> [!TIP]
> 很多人觉得 `coroutine` 并不需要，直接 `.then` 就可以了，但是当多个异步操作依赖于上一个异步操作的结结果的时候，就会出现可怕的 `then` 嵌套。这就是为什么 `async`/`await` 语法会出现的原因。

## Rust

在这篇[文章](https://blog.rust-lang.org/inside-rust/2023/10/23/coroutines.html)中，Rust 将 `Generator` trait 全部改为 `Coroutine`。Rust 中在该 [PR](https://github.com/rust-lang/compiler-team/issues/682) 阐述了为什么要将 `Generator` 改为 `Coroutine`，由于 Generator 本身就是一种特殊类型的迭代器，被用于产生迭代器，而 Rust 的实现已经是一种协程了，类似于 JavaScript，将其改为 `Coroutine` 更加合适。

现在采用了更简单的（类似于异步/等待的）语法来创建迭代器：<https://github.com/rust-lang/rfcs/pull/3513>

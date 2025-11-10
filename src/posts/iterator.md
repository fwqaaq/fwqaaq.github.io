---
date: 2024-04-16 03:00:35
title: Iterator
categories: Other
tags:
  - Rust
  - JavaScript
  - TypeScript
summary: 迭代器、生成器以及协程之间的关系
updateAt: 2025-11-09 23:00:55
---

[TOC]

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

### Rust 中的迭代器

在 Rust 中，由于 Rust 的所有权概念以及借用检查，迭代器的设计更加负载。Rust 中的迭代器是一个**迭代器适配器**，它可以对迭代器进行转换、过滤、映射等操作。Rust 中的迭代器是**惰性**的，只有在需要的时候才会执行，这样可以减少内存的使用。

为 Vec 实现的迭代器，实现了 IntoIterator trait（类似于可迭代的类型）会自动实现 `into_iter` 等一系列方法：

```rust
impl<T, A: Allocator> IntoIterator for Vec<T, A> {};
impl<'a, T, A: Allocator> IntoIterator for &'a Vec<T, A>{};
impl<'a, T, A: Allocator> IntoIterator for &'a mut Vec<T, A>{};
```

实现了 `Iterator` trait 的对象，也会自动实现 `IntoIterator` trait：

```rust
impl<I: Iterator> IntoIterator for I {
    type Item = I::Item;
    type IntoIter = I;

    fn into_iter(self) -> I {
        self
    }
}
```

总的来说，如果作为参数，使用 `IntoIterator`，它会接受所有迭代器类型。如果是返回值，使用 `Iterator`，调用者不用立即调用 `into_iter`。

```rust
use rand::Rng;

struct Passwords {
    length: usize,
}

impl Passwords {
    fn new() -> Self {
        Self::with_length(10)
    }

    fn with_length(length: usize) -> Self {
        Self { length }
    }
}

impl IntoIterator for Passwords {
    type Item = String;
    type IntoIter = PasswordsIterator;

    fn into_iter(self) -> Self::IntoIter {
        PasswordsIterator {
            length: self.length,
        }
    }
}

struct PasswordsIterator {
    length: usize,
}

impl Iterator for PasswordsIterator {
    type Item = String;
    fn next(&mut self) -> Option<Self::Item> {
        let mut result = String::with_capacity(self.length);
        for _ in 0..self.length {
            result.push((b'a' + (rand::thread_rng().gen_range(0..=(b'z' - b'a')))) as char);
        }
        Some(result)
    }
}

fn main() {
    for password in Passwords::new().into_iter().take(3) {
        println!("The next password is {}", password);
    }
}
```

## Go

Go 语言中的 channel 就是迭代器（暴论），事实是 Go 中并没有提供迭代器的概念，但是 channel 何尝不是一种迭代器。

### Go Channel

> 在 Go 语言中，Channel 也分为带缓冲区和不带缓冲区的。

创建一个不带缓冲区的 Channel。同样，通过 channel 发送一个数据给接收者，如果接收者没有接受到这个数据，那么发送端则会阻塞。有两种方式创建该缓冲区：

```go
var c chan interface{}
c = make(chan interface{})
```

或者

```go
c := make(chan interface{})
```

带有缓冲区的 Channel。当 Channel 的缓冲区满了或者空的时候，channel 的发送和接收会被阻塞。

```go
var c chan interface{}
c = make(chan interface{}, 1)
```

或者

```go
c := make(chan interface{}, 1)
```

#### Goroutine

> goroutine 是 Go 语言实现的一个有栈协程，它是基于多对多模型实现的。

Go 语言中 channel 和 `goroutine` 一般是成对出现的。在接收 channel 值的时候，ok 有两种值，如果 channel 关闭，则是 false；反之则为 true。而接收值的时候，如果 channel 关闭，那么会根据类型给出 v 的值，例如 int 是 0，string 是 `''` 等等，而不是 `nil`。

```go
func main() {
        c := make(chan int)
        go func() {
                c <- 1
        }()
        v, ok := <-c
        println(v)
}
```

带有缓冲区的 Channel，在这里一定要及时使用 `close` 关闭 channel，避免造成死锁。

```go
func main() {
      c := make(chan string, 3)
      s := []string{"a", "b", "c", "d"}
      go func() {
              defer close(c)
              for _, v := range s {
                      c <- v
                      time.Sleep(1 * time.Second)
              }
      }()

      time.Sleep(5 * time.Second)
      for v := range c {
              println(v)
      }
}
```

#### 单向 Channel

> 单向发送

```go
var c chan <- interface{}
c = make(chan <- interface{})
// 另一种方式
c := make(chan <- interface{})
```

> 单向接收

```go
var c <- chan interface{}
c = make(<- chan interface{})
// 另一种方式
c := make(<- chan interface{})
```

但是一般会将双向的 channel 将其隐式的转换为单向的

```go
func main() {
        c := make(chan string)
        go func(c chan<- string) {
                // 这里仅能发送，而不可以接收，下面是错误示例
                <-c
        }(c)
}
```

> [!WARNING]
> 对于一个已经阻塞的 channel 来说，如果继续发送，或接收会出现死锁的运行时错误。

例如，一个无缓冲区 channel，在没有发送方的情况下，就开始接收；后者只有发送方或者没有接收方。

```go
func main(){
        c := make(chan int)
        <- c
        // 或者
        // c <- 1
}
```

同理，对于带有缓冲区的 channel，在没有发送发的情况下，就开始接收也会出现死锁；在缓冲区满了之后，只有发送没有接收也会出现死锁。

对于 channel，我们除了可以循环 channel 来获取发送的值，也可以通过如下方式：

```go
package main

func main() {
        c := make(chan string)
        s := []string{"a", "b", "c"}
        go func() {
                defer close(c)
                for _, v := range s {
                        c <- v
                }
        }()

           // 对于不知道的情况，可以根据 ok 来判断
        for {
                v, ok := <-c
                if !ok {
                        break
                }
                println(v)
        }

        // 如果知道已知的 channel 发送的值，直接循环
        // for i := 0; i < len(s); i++ {
        //  v := <-c
        //  println(v)
        // }
}
```

---
date: 2024-04-20 13:50:59
title: I/O Stream
categories: Linux
tags:
  - Unix
  - Linux
  - Go
  - Rust
  - JavaScript
  - TypeScript
summary: 理解 I/O 流以及缓冲区
---

## 为什么要写这篇文章？

原因是在为 grammy 提 [PR](https://github.com/grammyjs/grammY/pull/560#discussion_r1571818711) 的时候，Deno 1.42.0 在使用 `using` 去释放文件描述符时有 bug（1.42.4 修复了）：

```ts
async function getStream() {
  using fd = await Deno.open("README.md")
  return fd.readable
}
```

文件描述符被释放了，这时候返回是不可能有资源的，返回的 stream 也是没有写到缓冲区的，所以这段代码本身就是有问题的，然而直接返回 stream，并没有关闭文件描述符会造成资源泄漏（🤡）。

当然在 Deno 中完全可以使用 `const` 然后返回一个异步迭代器的方式，异步迭代器在 `done: true` 的时候会主动释放文件描述符，具体参考：<https://github.com/denoland/deno/issues/23481>。

## I/O 流的分类

1. 按照类型分：分为**文件 I/O**和**网络 I/O**
2. 按照缓冲分：分为**带缓冲**和**不带缓冲**，其中分为**全缓冲**（fully buffering）、行缓冲（line buffering）以及无缓冲（non Buffering）
3. ......

### 缓冲

> 提供**缓冲**（Buffer）是为了提高内存和 I/O 设备之间的交换速度设计的，例如每次需要对硬盘进行 100 次读写，而有缓冲区之后可能就是每秒 10 次；缓存是 CPU 和内存之间的数据交换，弥补内存的频率过低问题

1. 全缓冲：当数据填满整个缓冲区之后才进行实际的 I/O 操作（驻留在磁盘上的文件的读写通常是使用全缓冲），当缓冲区满了，或者手动刷新时，才会将缓冲区的数据写出。
2. 行缓冲：每当输入输出遇到**换行**或者**缓冲区**满了的情况下才会进行实际的 I/O 操作（当涉及到终端输入输出的时候通常使用行缓冲），读取到一个换行符时，才会将缓冲区中的数据写出。
3. 无缓冲：要求 I/O 立即进行，如标准错误流，若果出现错误，会立马输出

Rust 中使用 I/O 缓冲和不使用缓冲的示例：<https://nnethercote.github.io/perf-book/io.html#buffering>。Rust 中缓冲区的默认大小是 `0x2000`

```rust
fn main() -> Result<(), Box<dyn Error>> {
    let mut writer = BufWriter::new(File::create("README.md")?);
    let content = b"# Hello, world!";
    for c in content.iter() {
        write!(writer, "{}", *c as char)?;
    }

    Ok(())
}
```

Go 中使用 `bufio` 中的 `NewWriter` 和 `NewReader` 来缓冲 `io.Writer` 和 `io.Reader`，它的默认大小是 4096 个字节

```go
func main() {
        writer := bufio.NewWriter(os.Stdout)
        fd, err := os.Open("go.mod")
        defer fd.Close()
        if err != nil {
                fmt.Printf("打开文件失败")
        }
        writer.ReadFrom(fd)
        writer.Flush()
}
```

Go 中的 I/O 流甚至更简单，只要实现 Writer interface 就是可读流，实现 Reader interface 就是可写流。

`bytes` 库提供了一个既可读也可写的 `Buffer` 类型

```go
func main() {
        producer := []string{
                "Channels orchestrate mutexes serialize",
                "Cgo is not go",
                "Errors are values",
                "Don't panic",
        }

        var buffer bytes.Buffer
        for _, p := range producer {
                n, err := buffer.Write([]byte(p))
                if err != nil {
                        fmt.Println(err)
                        os.Exit(1)
                }

                if n != len(p) {
                         fmt.Println("failure")
                         os.Exit(1)
                }
        }

        fs, err := os.Create("data.txt")
        if err != nil {
                fmt.Println(err)
                os.Exit(1)
        }

        buffer.WriteTo(fs)
}
```

C 中提供了**低级 I/O**、**标准 I/O**（fopen、fwrite 等带有 I/O）以及**高级 I/O**。

```c
int main(){
    for (int i = 0; i < 10000; i++)
        fputs("hello world", stdout);
    return 0;
}
```

我们可以使用以下命令来查看缓冲之后会执行多少次 write（Linux），如果没有缓冲，将是执行 10000 次。

```shell
strace ./main 2>err
grep "write(" err | wc -l
```

在 C 中很容易就可以写一个带缓冲的 I/O 流

```c
#include <stdio.h>

int main() {
    // 文件指针
    FILE *fp;
    // 用于存储读取的字符
    char ch;

    // 打开文件用于读取
    fp = fopen("main.go", "r");
    if (fp == NULL) {
        perror("Error opening file");
        return 1;
    }

    // 读取文件内容并打印
    while ((ch = fgetc(fp)) != EOF) {
        putchar(ch);
    }

    // 关闭文件
    fclose(fp);
    return 0;
}
```

关于 JavaScript 中的 `ReadableStream` 和 `WriteableStream` 也是同样的，它们本身就是可缓冲的。

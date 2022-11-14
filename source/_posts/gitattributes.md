---
title: .gitattributes
date: 2022-11-14 18:13:19
author: Jack-zhang
categories: git
tags:
   - git
summary: 如何编写 .gitattributes 文件
---

## [.gitattributes](https://git-scm.com/docs/gitattributes)

> `.gitattributes` 用于你指定 `git commit` 等时，需要执行的 git 属性

* `text`: 此属性启用并控制行末规范化。当文本文件正常化时，其行尾在存储库中转换为 LF(<span style="color:red">默认行为</span>)。

### eol

>使用 eol 属性可以控制行结尾的转换方式。一般在 linux 或者 mac 系统中使用 LF 格式进行换行，在 win 中使用 CRLF 来换行

* 一般我们会根据各自系统的情况来控制结尾换行，跨平台的时候，在需要的情况下会转换 crlf

   ```txt
   *    text=auto
   ```

* 我们也可以控制文件的细粒度，但是这一般是没有必要的
  * `*.txt text` 指示如果未检测到 txt 文本，这将手动开启检测
  * `-text` 指示不需要检测，保持原样。
  * `binary` 把文件当作二进制文件对待

   ```txt
   *               text=auto
   *.txt           text
   *.vcproj        text eol=crlf
   *.sh            text eol=lf
   *.jpg           -text
   *.pbxproj       binary
   ```

### diff

> 将特定的文件不当做文本比较，而是使用该规范化的语言形式

* 不同的语言格式可以在它的官网找到

```rust
*.rs     diff=rust
```

参考: <https://www.cnblogs.com/kidsitcn/p/4769344.html>

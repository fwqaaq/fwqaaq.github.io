---
title: Git 对象原理
date: 2022-07-02 03:38:49
categories: Git
tags:
   - Git
summary: Git 对象原理剖析
---

## 初始化 git

- git init:初始化本地 git 仓库

```bash
#四个文件
config  description  FETCH_HEAD  HEAD  
#四个文件夹
hooks  info  objects  refs
#展开的文件
├─hooks
├─info
│     exclude
├─objects
│  ├─info
│  └─pack
└─refs
    ├─heads
    └─tags
```

## 工作区与暂存区

1. 创建文件的时候，`.git` 文件并不会发生任何变化，因为它是存储在工作区中的

   ```bash
   `echo "hello" > hello.txt`
   ```

2. 使用 `git add hello.txt` 去将其提交到暂存区
   - 这时候会多出一个文件 `index`，和一个文件夹 `2a`

   ```bash
   │  config
   │  description
   │  FETCH_HEAD
   │  HEAD
   │  index
   │
   ├─hooks
   │
   ├─info
   │      exclude
   │
   ├─objects
   │  ├─2a
   │  │      93d00994fbd8c484f38b0423b7c42e87a55d48
   │  │
   │  ├─info
   │  └─pack
   └─refs
       ├─heads
       └─tags
   ```

   - 查看文件的类型：**文件的目录名称+SHA1 前面的四位**
     - `-t`:查看对象的类型
     - `-p`:查看对象的内容
     - `-s`:查看大小

   ```bash
   git cat-file -t 2a93d0
   # blob
   git cat-file -p 2a93d0
   # ÿþhello
   git cat-file -s 2a93d0
   ```

   - `git add` 存储文件：文件类型（这里是 blob） + 文件内容，然后进行 `SHA1` 加密
   - 在 `objects` 中文件的内容会被压缩后存储到加密之后的文件中
3. 查看 `index` 文件，使用 `git ls-files` 可以查看暂存区（index）的文件情况

   ```bash
   git ls-files -s
   # 权限      blob 对象                                        文件名
   # 100644 2a93d00994fbd8c484f38b0423b7c42e87a55d48 0       hello.txt
   # 100644 190b00d560cb8ac4e17678e8fccc7a2af8057bdd 0       temp.txt
   ```

## git commit

- 没有提交前暂存的情况

```bash
├─info
│      exclude
│
├─objects
│  ├─19
│  │      0b00d560cb8ac4e17678e8fccc7a2af8057bdd
│  │
│  ├─2a
│  │      93d00994fbd8c484f38b0423b7c42e87a55d48
│  │
│  ├─info
│  └─pack
└─refs
    ├─heads
    └─tags
```

- 提交之后

```bash
├─info
│      exclude
│
├─logs
│  │  HEAD
│  │
│  └─refs
│      └─heads
│              master
│
├─objects
│  ├─19
│  │      0b00d560cb8ac4e17678e8fccc7a2af8057bdd
│  │
│  ├─2a
│  │      93d00994fbd8c484f38b0423b7c42e87a55d48
│  │
│  ├─a0
│  │      197cf5327fec251ae14d063fb50d6d3e570674
│  │
│  ├─a3
│  │      d91d125103f57b7b60d7ebd6502aa0987828ab
│  │
│  ├─info
│  └─pack
└─refs
    ├─heads
    │      master
    │
    └─tags
```

> 查看 `commit` 对象内容和类型

```bash
git cat-file -t a3d91d12
# commit
git cat-file -p a3d91d12
# tree a0197cf5327fec251ae14d063fb50d6d3e570674
#                                                   时间戳      时区
# author Jack-Zhang-1314 <fwqaaq@gmail.com> 1656707371 +0800
# committer Jack-Zhang-1314 <fwqaaq@gmail.com> 1656707371 +0800
# 
# 1st commit
```

> 查看 `tree` 对象的内容和类型

```bash
git cat-file -t a0197c
#tree
git cat-file -p a0197c
# 100644 blob 2a93d00994fbd8c484f38b0423b7c42e87a55d48    hello.txt
# 100644 blob 190b00d560cb8ac4e17678e8fccc7a2af8057bdd    temp.txt
```

> 查看 commit 对象和指针`HEAD`

```bash
cat .\.git\refs\heads\master
# a3d91d125103f57b7b60d7ebd6502aa0987828ab
cat .git/HEAD
# ref: refs/heads/master
```

```bash
                          ----------> hello.txt
                          |
commit(tree中的内容) ---> tree(包含blob对象文件)
                          |
                          ----------> temp.txt
```

### 修改 commit

```bash
│
├─objects
│  ├─19
│  │      0b00d560cb8ac4e17678e8fccc7a2af8057bdd
│  │
│  ├─2a
│  │      93d00994fbd8c484f38b0423b7c42e87a55d48
│  │
│  ├─65
│  │      4580c8026cf5b0ab07c5572f353409e3c83792
│  │
│  ├─80
│  │      993781b54ed1b81e47a31e6427940c1a9deafb
│  │
│  ├─a0
│  │      197cf5327fec251ae14d063fb50d6d3e570674
│  │
│  ├─a3
│  │      d91d125103f57b7b60d7ebd6502aa0987828ab
│  │
│  ├─b2
│  │      7787b75a99a614f3b26fe482f0cd47bc3c186b
│  │
│  ├─info
│  └─pack
```

> 查看最新提交的 commit

```bash
git cat-file -p b27787      
# tree 654580c8026cf5b0ab07c5572f353409e3c83792
# parent a3d91d125103f57b7b60d7ebd6502aa0987828ab  (上一次提交)
# author Jack-Zhang-1314 <fwqaaq@gmail.com> 1656708529 +0800
# committer Jack-Zhang-1314 <fwqaaq@gmail.com> 1656708529 +0800
# 
# 2st commit

# tree中的内容依然会指向这两个文件
git cat-file -p 654580
# 100644 blob 80993781b54ed1b81e47a31e6427940c1a9deafb    hello.txt
# 100644 blob 190b00d560cb8ac4e17678e8fccc7a2af8057bdd    temp.txt
```

> 修改暂存区的文件

```bash
git cat-file -p 8099378
# hello world 
git cat-file -t 8099378
# blob
```

## git 的文件状态

1. `Untrack`:工作区新创建的文件。使用 `git add` 将文件变为 `Staged`
2. `Modified`:文件已经在 index（Staged 状态），然后在工作区修改，也可以使用 `git add` 变为 `Staged`
3. `Staged`:使用 `git commit` 将文件变为 `Unmodified`
4. `Unmodified`

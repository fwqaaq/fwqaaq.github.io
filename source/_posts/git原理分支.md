---
title: git原理分支.md
date: 2022-07-02 05:05:03
author: Jack-zhang
categories: git
tags:
   - git
summary: git原理(分支)
---

## 分支

>通过`HEAD`文件可以知道当前在哪个分支工作,并且**HEAD指向的分支**总是指向最新的`commit`

```bash
                            HEAD
                              |
                            master
                              |
                       ├─---a219fd
1e735a  <--- 8532d9 <--|     
                       ├─---e78125
                              |
                             dev
```

* 通过切换`HEAD`的指向可以切换分支

> 产看当前分支内容

```bash
cat .git/HEAD
# ref: refs/heads/master
cat .git/refs/heads/master
# b27787b75a99a614f3b26fe482f0cd47bc3c186b (当前分支指向最新的 commit)
git cat-file -t b27787b
# commit
```

> 创建分支

* `git branch dev`:创建一个`dev`的分支

```bash
git log
# master dev分支刚好指向同一条线上   
# commit b27787b75a99a614f3b26fe482f0cd47bc3c186b (HEAD -> master, dev)
```

* `git checkout dev`:切换到`dev`分支

```bash
git checkout dev
cat .git/HEAD
# ref: refs/heads/dev
```

* 如果在dev上做完一次`commit`之后,分支之间会分叉

```bash
git log
# commit 609f9e53903da9cc53127619044bb8a02f36519a (HEAD -> dev)
# Author: Jack-Zhang-1314 <zyj17715640603@gmail.com>
# Date:   Sat Jul 2 05:25:37 2022 +0800
# 
#     dev 1st
# 
# commit b27787b75a99a614f3b26fe482f0cd47bc3c186b (master)
```

* 删除分支,只是删除分支的指针,分支上的对象不会被删除

```bash
# D-->强制删除
git branch -d dev
git branch -D dev

# 查看dev删除后的commit内容
git cat-file -p 609f9e5
# tree fd59d47bd5ca961d23037b22377a89bc4debdce0
# parent b27787b75a99a614f3b26fe482f0cd47bc3c186b
# author Jack-Zhang-1314 <zyj17715640603@gmail.com> 1656710737 +0800
# committer Jack-Zhang-1314 <zyj17715640603@gmail.com> 1656710737 +0800
# 
# dev 1st
```

## git checkout

>使用`git checkout`叉出某一次`commit`

```bash
git checkout a3d91d1
git branch
# 指向(HEAD detached at a3d91d1)
git checkout -b tem
#将当前的提交叉到新的分支
git log 
# commit a3d91d125103f57b7b60d7ebd6502aa0987828ab (HEAD -> tem)
```

>将删除的分支找回

```bash
git reflog
# a3d91d1 (HEAD -> tem) HEAD@{0}: checkout: moving from a3d91d125103f57b7b60d7ebd6502aa0987828ab to tem
# a3d91d1 (HEAD -> tem) HEAD@{1}: checkout: moving from master to a3d91d12
# b27787b (master) HEAD@{2}: checkout: moving from dev to master
# 609f9e5 HEAD@{3}: commit: dev 1st
# b27787b (master) HEAD@{4}: checkout: moving from master to dev
# b27787b (master) HEAD@{5}: commit: 2st commit
# a3d91d1 (HEAD -> tem) HEAD@{6}: commit (initial): 1st commit
git checkout 609f9e5
git switch -c dev
```

## 远程分支

>添加远程分支

```bash
git remote add origin ssh...
```

>查看添加的内容`cat .git/config`

```bash
[remote "origin"]
        url = https://github.com/Jack-Zhang-1314/hexoPage.git
        fetch = +refs/heads/*:refs/remotes/origin/*
```

```bash
├─logs
│  │  HEAD
│  │
│  ├─refs
│  │    ├─heads
│  │    │      dev
│  │    │      master
│  │    │
│  │    └─remotes
│  │        └─origin
│  │            │  HEAD
│  │            └─ master
├─origin
│  │     HEAD
│  └---  master              
```

* 当提交远程之后,本地分支和远程分支是同步的

```bash
# commit 4a71286c54dc6629322f13cfded0dfcdb417a1aa (HEAD -> master, origin/master, origin/HEAD)
```

## 对象压缩

1. 查看git对象文件的大小

    ```bash
    du -h .git/objects
    # ...
    # 1.1M    .git/objects/fa
    # 944K    .git/objects/fd
    # 0       .git/objects/info
    # 22M     .git/objects/pack
    # 42M     .git/objects
   ```

2. 使用`git gc`来压缩文件

   ```bash
   git gc
   du -h .git/objects
   # 9.0K    .git/objects/info
   # 23M     .git/objects/pack
   # 23M     .git/objects
   ```

3. 查看`pack`文件下文件的大小.文件被压缩到`.pack`文件中

   ```bash
   ls -l .git/objects/pack
   # total 23092
   # -r--r--r-- 1 15531 197609   122816  7月  2 06:21 pack-04c2ed0bfb1961df8ecdaf3a6a602936173ffc88.idx
   # -r--r--r-- 1 15531 197609 23521212  7月  2 06:21 pack-04c2ed0bfb1961df8ecdaf3a6a602936173ffc88.pack
   ```

>解压缩`git unpack-objects`

* 首先`.pack`文件不能再`objects`文件下,将它移到`.git`下后,使用解压缩的命令

```bash
git unpack-objects < .git/pack-04c2ed0bfb1961df8ecdaf3a6a602936173ffc88.pack
```

## 垃圾对象清理

> 在大部分时候每次使用`git add`会产生不必要的垃圾对象,这时候就需要使用`git prune`去清理这些不必要的对象

* 不过一般情况下在使用`git gc`完全足够,他会去调用`git prune`清理不必要的对象

```bash
git prune -n
# 查看将会删除的不必要的垃圾对象
git fsck
#查看仓库的垃圾对象
```

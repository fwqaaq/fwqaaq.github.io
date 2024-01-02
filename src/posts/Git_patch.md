---
title: Git_Patch
date: 2023-10-22 18:05:39
categories: Git
tags:
  - Git
summary: 使用 Git patch 对代码进行打补丁
---

## 生成补丁

> 在 Git 中，补丁是一种特殊的文件，它包含了两个提交之间的差异。补丁文件可以用来在两个不同的代码库之间传递更改，或者用来在两个不同的分支之间传递更改。

使用 `git diff` 生成补丁文件，此补丁文件没有详细的提交信息，只有内容更改

```bash
git diff > patch.diff
```

使用 `git format-patch` 生成补丁文件，此补丁文件包含详细的提交信息

```bash
# 生成最后一次提交的补丁
git format-patch HEAD^

# 生成最后两次提交的补丁（以此类推）
git format-patch HEAD^^
# or
git format-patch -2

# 生成两个提交之间的补丁 -> (]
git format-patch da71ea0..02c520e
```

## 应用补丁

> 在打入补丁前，确保你的工作区是干净的，没有任何未提交的更改。

检查是否可以打入补丁

```bash
git apply --check patch.diff
```

打入补丁

```bash
git apply patch.diff
```

如果打入 patch 有冲突，可以使用 `git apply --reject` 命令，它会将冲突的文件保存为 `.rej` 文件

参考：<https://git-scm.com/docs/git-apply#Documentation/git-apply.txt---reject>

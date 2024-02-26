---
title: GitLFS
date: 2023-6-30 18:13:19
categories: Git
tags:
   - Git
summary: 使用 GIT LFS 进行大文件的版本控制
---

## [GIT LEF](https://git-lfs.com)

> Git LFS 是对例如音频、视频、图形等大文件的一种扩展，它可以将大文件存储在 Git 仓库之外，从而加快 Git 的速度，同时也可以避免 Git 仓库过大。

首先需要下载安装 `git-lfs` 插件：<https://git-lfs.com>

1. 初始化 git lfs

   ```bash
   git lfs install
   ```

2. 选择需要进行版本控制的文件（不能使用 `,` 隔开）

   ```bash
   git lfs track "*.png"
   ```

3. 暂存以及提交代码
4. 如果你想要使用 git lfs 对之前的文件进行版本控制，需要使用
   `git lfs migrate import --include="*.png"` 命令将之前的文件进行迁移

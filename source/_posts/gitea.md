---
title: gitea
date: 2022-08-11 12:48:23
categories: git
tags:
   - git
summary: 使用docker 构建 gitea
---

1. 首先下载`gitea`镜像: `docker pull gitea`
2. 启动 gitea 容器: `22`-->ssh, `3000` --> web

   ```bash
   docker run -d --privileged=true --restart=always --name=gitea -p 3451:22 -p 3450:3000 -v /var/lib/gitea:/data gitea/gitea:latest
   ```

* 根据以上端口配置 gitea
* ![ ](gitea.jpg)
  * Gitea HTTP Listen Port: 映射的源(3000)不能更改, 只能更改目标端口
  * Gitea Base Url: 向外暴露的 git 仓库地址

---
title: githubPages
date: 2021-12-15 18:46:13
author: Jack-zhang
categories: git
tags:
   - git
summary: 使用github部署网站
---

## 使用github部署网站

>可以直接通过master分支直接来馈送网站.而不需要另行创建分支(容易导致冲突)

1. 创建一个`docs`文件夹
2. 需要含有`index.html`入口文件
3. 需要先把项目推到仓库中,然后在设置中进行设置

![创建](createPages.png)

## 使用webhook自动化部署

>强烈建议使用ssh,而不是https

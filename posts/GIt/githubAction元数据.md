---
title: githubAction元数据
date: 2022-05-21 13:53:20
author: Jack-zhang
categories: git
tags:
   - git
summary: 使用javascript来操作githubAction
---

> 创建action和使用workflows是两个不同的操作

1. 使用[workflows](https://docs.github.com/cn/actions/using-workflows/about-workflows)是一个自动化的过程
   * 由`.github/workflows`下的`yaml`文件定义,可以是事件,事件或者手动触发
2. 创建[action](https://docs.github.com/cn/actions/creating-actions/about-custom-actions)可以创建自己的操作或者使用和自定义github社区分享的操作
   * 在操作主要元数据文件按来定义操作的输入,输出和主要进入点.元数据的文件名必须要`action.yml`

## [javascript操作](https://docs.github.com/cn/actions/creating-actions/creating-a-javascript-action)

* 这里尝试演示一个使用actions元数据去编写一个issue自动提交

> [GitHub Actions的元数据语法](https://docs.github.com/cn/actions/creating-actions/metadata-syntax-for-github-actions)

* 在根目录下创建一个`action.yml`文件,并且文件名称只能是这个

```js
name: "test one create issues"
description: "test create issues"
inputs:
  token:
    description: "ACTION_ACCESS"
    required: true
runs:
  using: "node16"
  main: "index.mjs"
```

* `inputs`是指定从工作流(workflows)中获取对应的输入字段,`token`是工作流(workflows)中的名称
* `runs`:指定的操作,这里必须指定是JavaScript操作,复合操作还是Docker容器操作以及操作的执行方式
  * `using`:**必要**.指定`main`中代码的执行环境
  * `main`:**必要**.包含操作的文件
  * `pre`:允许您在`main:`操作开始之前，在作业开始时运行脚本
  * `pre-if`:允许定义`pre`操作执行的条件.pre操作只会在满足`pre-if`中的条件运行.如果未设置,则`pre-if`默认使用`always()`

     ```yml
     pre: 'cleanup.js'
     pre-if: runner.os == 'linux'
     ```
  
  * `post`:允许您在`main:`操作完成后,在作业结束时运行脚本
    * 例如,您可以使用`post:`终止某些进程或删除不需要的文件
  * `post-if`:允许定义的`post`操作执行的条件.和`pre-if`类似

     ```yml
     runs:
       using: 'node16'
       main: 'index.js'
       post: 'cleanup.js'
       post: 'cleanup.js'
       post-if: runner.os == 'linux'
     ```
  
  * `steps`:操作中的步骤.这里是符合操作,using必须指定-->`using:"composite"`
    * `shell`: <span style="color:red">如果有run操作,必须指定`shell`</span>

     ```js
     runs:
       using: "composite"
       steps:
         - run: ${{ github.action_path }}/test/script.sh
           shell: bash
     ```
  
    ...

>编写index.js文件

* 下载octokit:`pnpm add octokit`,这里需要使用这个包对github暴露的接口进行操作
* 下载`@actions/core`:`pnpm add @actions/core`,该包提供一个接口,用于工作流程命令,输入和输出变量,退出状态以及调试

   ```js
   import { Octokit } from "octokit"
   import { getInput } from "@actions/core"
   import dayjs from "dayjs";
   const token = getInput("token")
   const octokit = new Octokit({
     auth: token
   });
   await octokit.rest.issues.create({
     owner: "Jack-Zhang-1314",
     repo: "demo",
     title: getTitle(),
     body: getBody()
   });
   
   function getTitle() {
     return dayjs().format("YYYY-MM-DD")
   }
   
   function getBody() {
     return "* test a new task"
   }
   ```

* 这里的`auth:token`,是获取的`workflows`中`with`关键字设置的输入参数

>编写工作流`workflows`

```js
on: [push]

jobs:
  test_one_issues:
    runs-on: ubuntu-latest
    name: create issues action
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: node
        uses: actions/setup-node@v3.0.0
        with:
          node-version: "16.x"
      - name: install
        run: npm install
      - name: create issues
        uses: ./
        with:
          token: ${{secrets.ACTION_ACCESS}}
```

* 最后一个`create issues`中的`uses:./`就是指定根路径下自己的action元数据`action.yml`
* `with`就是传给`action.yml`的键值对.并且在index.js中使用了`@action/core`中的`getInput`获取

> 如果只想打包dist文件到仓库,可以使用`@vercel/ncc`这个包.这个包只会把引用的模块加载到dist包中

* 下载ncc包:`pnpm add @vercel/ncc`
* 然后添加脚本:`"build": "ncc build index.mjs --license licenses.txt"`
* 运行之后就可以使用dist包每天更新issue了

---
title: gitAction
date: 2022-02-09 13:38:28
author: Jack-zhang
categories: git
tags:
   - git
summary: 使用gitAction达到CI/CD
---

>github Action是github提供的持续集成的操作,可以抓取代码,运行测试,登录远程服务器,发布到第三方服务器等等

## 创建一个工作流程

> 基本概念

1. `workflow`(工作流程):持续集成一次运行的过程,就是一个workflow
2. `job`(任务):一个workflow由一个后者多个jobs构成,即一次CI/CD可以完成多个任务
3. `step`(步骤):每个job由多个step构成,一步步完成
4. `action`(动作):每个step可以依次执行一个或者多个命令(action)

### [workflow](https://docs.github.com/en/actions/using-workflows)

>一个库里可以有多个`workflow`文件.github只要发现`.github/workflows`目录里有`.yml`文件,就会自动运行该文件

1. 创建`.github/workflows`目录
2. 在`.github/workflows`目录中,创建一个名为`github-actions-demo.yml`的文件
3. 然后就可以编辑yaml文件了

> `name`字段:是workflow的名称.如果省略该字段,默认为当前workflow的文件名

```yml
name: GitHub Actions Demo
```

> `on`:指定触发`workflow`的条件,通常是某些事件

1. 指定单个事件:`on: push`
2. 指定多个事件:`on:[push,pull_request]`
3. 指定事件流程

```yml
on:
  push:
    branches:    
      - master
```

> 使用[活动类型]<https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows>:更好地控制工作流的运行时间

```yml
on:
  label:
    types: [created, edited]
```

#### push/pull_request

> 分支`branches`(包括分支),`branches-ignore`(排除分支)<span style="color:red">push ,pull_request</span>可用

```yml
on:
  pull_request:
    branches:    
      - main
      - 'mona/octocat'
      - 'releases/**'
```

- `main`:只有运行main分支才会触发
- `'mona/octocat'`:只有运行`mona/octocat`分支才会触发
- `'releases/**'`:运行以`releases`开头的分支就会触发

>标记`tags`(包括标记),`tags-ignore`(排除标记)<span style="color:red">push</span>可用

<hr></hr>

>路径`paths`(包括路径)`paths-ignore`(忽略路径)<span style="color:red">push ,pull_request</span>可用

- 只要推送带有js的文件,就会触发

```yml
on:
  push:
    paths:
      - '**.js'
```

- 如果推送的所有文件路径都和`paths-ignore`中的正则匹配,则不会触发

```yml
on:
  push:
    paths-ignore:
      - 'docs/**'
```

#### schedule

>定义工作流的时间表。可以使用 [`POSIX cron`](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07) 语法将工作流安排在特定 UTC 时间运行。计划的工作流在默认分支或基本分支上的最新提交上运行。可以运行计划工作流的最短间隔为每 5 分钟一次

1. 分钟 [0,59]
2. 小时 [0,23]
3. 本月的一天 [1,31]
4. 一年中的月份 [1,12]
5. 星期几([0,6] 与 0 =星期日)

```yml
on:
  schedule:
    # 每天的5.30和17.30触发
    - cron:  '30 5,17 * * *'
```

#### workflow_call

...

### env

>`workflow`中所有作业的步骤的环境变量.也可以设置仅可用于单个作业的步骤或单个步骤的环境变量`jobs.<job_id>.env`和`jobs.<job_id>.steps[*].env`

```yml
# env
env:
  SERVER: production
# steps
steps:
  - name: My first action
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      FIRST_NAME: Mona
      LAST_NAME: Octocat
```

### jobs

>`jobs`是`workflow`中的主体字段,表示要执行一项或多项任务
>
>每个任务都需要一项任务的`job_id`

#### jobs.<job_id>.name

>name字段是对任务的说明

```yml
jobs:
  my_first_job:
    name: My first job
  my_second_job:
    name: My second job
```

#### jobs.<job_id>.needs

>needs:指定当前任务的依赖关系,即运行顺序

```yml
jobs:
  job1:
  job2:
    needs: job1
  job3:
    needs: [job1, job2]
```

- `job1`必须先于`job2`完成,而`job3`等待`job1和job2`的完成才能运行

#### jobs.<job_id>.runs-on

>用于定义要在其上运行作业的计算机的类型

```yml
runs-on: ubuntu-latest
```

#### jobs.<job_id>.steps

- `jobs.<job_id>.steps.name`:步骤名称
- `jobs.<job_id>.steps.run`:该步骤运行的命令或者 action
- `jobs.<job_id>.steps.env`:该步骤所需的环境变量

>`uses`:选择一个别人写好的`action`,可以理解为若干 `steps.run`,有利于代码复用

- 例如下面的use就是`actions`用户(github官方的账号)的checkout仓库.`@v1`就是版本号,也可以接分支`@master`

- 当前操作系统中安装 `node:16` 的 action 示例

```yml
- name: use Node.js 16.x
  uses: actions/setup-node@v1
  with:
    node-version: 16.x
```

- 使用docker镜像
  - 镜像中心:`docker://{image}:{tag}`,在当前的系统中运行了一个docker镜像.而不是在容器中运行
    - `container`是指定在容器中运行
    - 以下就是将node指定在docker中运行

```yml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:16
    steps: 
     - uses: action/checkout@v1
     - run: | 
         node -v
```
  
- 自己发布的镜像:`docker://{host}/{image}:{tag}`

```yml
jobs:
  build:
    steps:
      - name: Install
        uses: docker://node:alpine
        with:
          args: npm install
```

>`with`:有的 Action可能会需要我们传入一些特定的值：比如上面的 node 版本啊之类的,这些需要我们传入的参数由 with 关键字来引入

```yml
  with:
    node-version: 16.x
```

> `run`:可以运行操作系统中原有的shell命令

- 单行命令:

```yml
- name: Install Dependencies
  run: npm install
```

- 多行命令

```yml
- name: Clean install dependencies and build
  run: |
    npm ci
    npm run build
```

- 指定运行的工作目录

```yml
run: npm install
working-directory: ./temp
```

> `shell`:指定终端运行脚本命令(run)

- 可以是`bash`,`cmd`,`python`等看具体需求和操作系统

## 实战

> 部署hexo到服务器

```yml
name: CI

on:
  push:
    branches: [master]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: install nodejs
        uses: actions/setup-node@v3.0.0
        with:
          node-version: "16.x"
      - name: install pkg
        run: |
          npm install
          npm install hexo-cli -g
      - name: build app
        run: npm run build
      - name: scp action
        uses: betanzos/scp-upload@v1
        with:
          source: "public/"
          host: ${{ secrets.HOST }}
          port: 22
          username: root
          key: ${{ secrets.SSH_KEY }}
          remote_dir: "/www"
          recursive: true
```

- 其中最要注意的点是ssh密钥的问题
   1. 在本地生成密钥后,将公钥放入远程服务器的root下的`.ssh`文件夹自己生成的`authorized_keys`文件中
   2. 需要将私钥上传到secrets中,然后使用环境变量取得

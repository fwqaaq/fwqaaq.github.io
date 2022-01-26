---
title: install-pkg
date: 2022-01-20 10:24:13
author: Jack-zhang
categories: sourceCode
tags:
   - sourceCode
   - vue
summary: install-pkg的源码学习
---

## install-pkg

>编程式的方式安装包,并且自动检测包管理器

```js
import { installPackage } from '@antfu/install-pkg'
await installPackage('vite', { silent: true })
```

### install

> `execa`:在子进程中生成shell命令,并执行.`child_process`的加强版
>
> 参考<https://github.com/sindresorhus/execa>

1. 首先是一个下载包的选项
2. [有关进程的选项](http://nodejs.cn/api/child_process/options_stdio.html)

```js
export interface InstallPackageOptions {
  // 指定包管理的下载目录
  cwd?: string
  // 是否是开发环境依赖,默认为生产环境依赖
  dev?: boolean
  // 配置父进程和子进程之间建立的管道
  silent?: boolean
  // 指定包管理器
  packageManager?: string
  // 是否启用从缓存中加载
  preferOffline?: boolean
  // 指定增加的shell命令
  additionalArgs?: string[]
}
```

>`installPackage`中也并不是很难

```js
// 1.传入包管理器,则使用包管理器
// 2.没有传入包管理器,则使用detectPackageManager查找锁文件,根据锁文件下载
// 3.如果上面两个都没有,则默认使用npm
const agent = options.packageManager || await detectPackageManager(options.cwd) || 'npm'
// 需要下载的包名,如果只有一个包名转换成数组
if (!Array.isArray(names))
  names = [names]
const args = options.additionalArgs || []
if (options.preferOffline)
  // 预先检查缓存,如果缓存中没有,则连接互联网下载
  args.unshift('--prefer-offline')
```

### detectPackageManager

> 根据当前目录的锁文件探测包管理器
>
> findUp:查找文件所在的路径
>
> 参考<https://github.com/sindresorhus/find-up#readme>

```js
import path from 'path'
import findUp from 'find-up'

export type PackageManager = 'pnpm' | 'yarn' | 'npm'

const LOCKS: Record<string, PackageManager> = {
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
}

// 如果没有指定下载的目录,则在当前的目录.`process.cwd()`指当前进程
export async function detectPackageManager(cwd = process.cwd()) {
  // 返回包含锁文件的绝对路径
  const result = await findUp(Object.keys(LOCKS), { cwd })
  // 如果有锁文件,就返回锁文件对应的包管理器
  const agent = (result ? LOCKS[path.basename(result)] : null)
  return agent
}
```

## unknown

>`package.json`包里的脚本

### ni

>npm,yarn,pnpm的包管理器
>
>参考:<https://github.com/antfu/ni>

| 命令     | 替代                  |
| -------- | --------------------- |
| ni       | npm install           |
| ni axios | npm i axios           |
| nx       | npx/yarn dlx/pnpm dlx |
| nr       | npm run               |
...

### eslint

>配置eslint检查:<https://eslint.org/docs/user-guide/command-line-interface>

```json
"lint": "eslint \"{src,test}/**/*.ts\"",
"lint:fix": "nr lint -- --fix"
```

1. 第一个是检查文件
   * `"eslint": "eslint src --ext .ts"`:代表src下的所有文件都要检查
2. 是检查并且修复问题

## 总结与感受

> 看到英文注释一概懵逼.
>
> 关于常用的工具还是不是很熟悉了

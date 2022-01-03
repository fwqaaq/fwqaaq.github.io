---
title: remoteGitTags
date: 2021-12-31 14:05:03
author: Jack-zhang
categories: git
tags:
   - git
summary: 获取远程仓库的标签
---

## unknown

### .gitattributes

* 文本换行的方式:
  1. `CRLF`:对应`\r\n`两个字符(Windows 系统)
  2. `LF`:对应`\n`,Uninx(Linux,MacOS)

> `.gitattributes`文件:文件中的一行定义一个路径的若干个属性,主要用于定义每种文件的属性,以方便`git`帮我们统一管理

1. **text**控制行尾的规范性,其行尾将在存储库中转换为`LF`
2. **eol**设定行末规范
   * `eol=lf`,检入时将行尾规范为`LF`,检出时将行尾转换为`LF`
   * `eol=crlf`,检入时将行尾规范为`LF`,检出时将行尾转换为`CRLF`
3. 关于`eol=lf`和`text`的区别<https://stackoverflow.com/questions/32854978/what-is-the-difference-between-eol-lf-and-text-in-a-gitattributes-file>
4. **diff**:<https://cloud.tencent.com/developer/section/1138630>

| 案例                    | 描述                                                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| \*  text=auto           | 文件自动换行.如果是文件,则在文件入Git库时,行尾自动转换为LF如果已经在入Git库中的文件的行尾为CRLF,则该文件在入Git库时,不再转换为LF |
| *.txt  text             | 只有`txt`文件会进行行尾规范化                                                                                                    |
| *.jpg  -text            | `jpg`文件不会进行任何行尾规范化.                                                                                                 |
| *.vcproj  text eol=crlf | 只有`vcproj`文件见如是行尾为`LF`,检出是自动转换为`CRLF`                                                                          |
| *.sh  text eol=lf       | 只有sh文件检入时行尾为`LF`,检出时行尾不会转换为`CRLF`                                                                            |
| *.py  eol=lf            | 只针对工作目录中的文件                                                                                                           |

### .npmrc

>npm 从命令行、环境变量和npmrc文件中获取其配置设置该npm config命令可用于更新和编辑用户和全局`npmrc`文件的内容

1. 每个项目的配置文件(/path/to/my/project/.npmrc)
2. 每个用户的配置文件(~/.npmrc)
3. 全局配置文件($PREFIX/etc/npmrc)
4. npm 内置配置文件(/path/to/npm/npmrc)

## remote-git-tags

>关于`node:`前缀
>>核心模块也可以使用 node: 前缀来标识,在这种情况下,它会绕过 require 缓存例如, `require('node:http')` 将始终返回内置的 HTTP 模块,即使该名称存在 `require.cache` 条目

* 本质:`git ls-remote --tags repoUrl`,获取远程仓库的标签

### promisify

* 将回调函数转换成`promise`的形式

```js
const { execFile } = require("node:child_process")
function promisify(original) {
  function fn(...args) {
    return new Promise((resolve, reject) => {
      args.push((err, ...values) => {
        if (err) {
          return reject(err);
        }
        resolve(values);
      });
      Reflect.apply(original, this, args);
    });
  }
  return fn;
}

const execFile1 = promisify(execFile)
execFile1("git", ['ls-remote', '--tags', "git@github.com:vuejs/create-vue.git"]).then(
  value => {
    console.log(value)
  },
  error => {
    console.log(error)
  }
)
```

* 难点:
  1. `Reflect.apply`:this是没有必要的,可以改成null
  2. 关于使用`apply`绑定`execFile`执行此函数
  3. 还需将`execFile`所需的回调函数push进入args

### execFile

* 在子进程中生成shell命令,并执行
* 参考:<https://www.nodeapp.cn/child_process.html>

>* `execFile`:在`child_process`模块中,可以直接衍生命令,而无需像`exec`一样先生成shell(**解码输出为UTF-8,并将字符串传给回调**)
>* `child_process.execFile(file[, args][, options][, callback])`
>* 返回一个`childProcess`

* 参考:<https://juejin.cn/post/7028731182216904740>

## 总结与感受

1. 对于源码里很多文件不够了解,接触的太少
2. 实现`promisify`发现自己对promise的操作还是不熟
3. 对于node很多模块也不是很熟,还需要多练习
4. 基础还不是很扎实,还需要加强练习

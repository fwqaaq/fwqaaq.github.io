---
title: validateNPN
date: 2022-01-02 21:04:36
author: Jack-zhang
categories: sourceCode
tags:
   - JS
   - config
   - sourceCode
summary: 检测npm包是否符合标准
---

## unknown

### 关于部分检测工具

>[关于测试工具的一点了解](https://juejin.cn/post/6977183707148845070#refetch)

1. `ava`:开源的Node.js测试运行器
2. `xo`:强大的刷新工具.通过简单的命令xo --fix ，自动修复了许多问题
3. `node-tap`:[nodejs一款测试工具](https://node-tap.org/docs/getting-started/)

### TravisCI

>`Travis CI`可以设置github托管的项目在push或者pull等时机触发构建与测试，进行持续集成

* 可以自动进行构建,自动运行测试,部署,随时发现问题,随时修复.
* 例如`hexo-deployer-git`也是一种持续集成的工具
* 参考:<https://www.liaoxuefeng.com/article/1083103562955136>

### Dependabot

>`Dependabot`会自动创建拉取请求以响应安全建议.每天它都会下载你的依赖文件,解析它们并检查任何过时或不安全的依赖关系
>>并且提供了有关执行特定更新的所有项目的持续集成 (CI)

* 参考:<https://docs.github.com/en/code-security/supply-chain-security/managing-vulnerabilities-in-your-projects-dependencies/configuring-dependabot-security-updates>

## validate-npm-package-name

>检验该字符串是否是一个有效的包命名

```js
var validate = require("validate-npm-package-name")
console.log(validate(" leading-space:and:weirdchars"))
//{
//  validForNewPackages: false,
//  validForOldPackages: false,
//  errors: [
//    'name cannot contain leading or trailing spaces',
//    'name can only contain URL-friendly characters'
//  ]
//}
```

> `builtins`:列出了 node 所有的内置模块

### 检测

1. 不能是`null`或者`undefined`这种关键字
2. 必须是字符串
3. 不能是空的包
4. 不能以`.`,`_`开头
5. 包名两头不能有空格
6. 不能大于214个字母
7. 必须全是小写
8. 不能包含`[~'!()*]`

```js
name===null
name===undefined
typeof name !== 'string'
!name.length
name.match(/^\./)
name.match(/^_/)
name.trim() !== name
name.length > 214
name.toLowerCase() !== name
/[~'!()*]/.test(name.split('/').slice(-1)[0])
```

1. `(?:...)`:匹配括号中的内容,但是不捕获
2. 参考:<https://regex101.com/>

```js
var scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
  if (encodeURIComponent(name) !== name) {
    // Maybe it's a scoped package name, like @user/package
    var nameMatch = name.match(scopedPackagePattern)
    if (nameMatch) {
      var user = nameMatch[1]
      var pkg = nameMatch[2]
      if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return done(warnings, errors)
      }
    }
    errors.push('name can only contain URL-friendly characters')
  }

  return done(warnings, errors)
}
```

* `encodeURIComponent()`:原字串作为URI组成部分被编码后的新字符串
   1. 转义除了如下所示的所有文字`A-Z a-z 0-9 - _ . ! ~ * ' ( )`
   2. 例如`console.log(encodeURIComponent("#"))//%23`

> 不能含有nodejs等核心模块

```js
builtins.forEach(function (builtin) {
    if (name.toLowerCase() === builtin) {
      warnings.push(builtin + ' is a core module name')
    }
})
```

## 总结与感受

* 正则匹配构思巧妙,想不出来
* 学到一点关于测试方面的东西,弥补一直不知道的东西
* 项目虽小,逻辑清晰,值得学习

>参考:<https://juejin.cn/post/7012047954995314701>

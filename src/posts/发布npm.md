---
title: 发布npm
date: 2022-04-15 22:32:15
categories: JavaScript
tags: 
   - JavaScript
   - Config
summary: 发布一个属于自己的npm
---

## 字段

1. 首先需要登录自己的npm账号`npm login`
2. 初始化一个项目`npm init`
   - 最重要的两个字段`name`和`version`

   > `name`
   - 不要在name中包含js,node字样
   - 这个名字最终会是URL的一部分,命令行的参数,目录名,所以不能以点号或下划线开头
   - 这个名字可能在require()方法中被调用,所以应该尽可能短
   - 并且包的名字不能与npm中的其他包的名字一致

   > `version`:版本号.版本号基本是由三位数字组成
   - `MAJOR`:进行不兼容的API更改时的版本
   - `MINOR`:以向后兼容的方式添加功能时的版本
   - `PATCH`:向后兼容的错误修复程序的版本

   ```json
   1   .   0   .   0
   [MAJOR].[MINOR].[PATCH]
   ```

   ```bash
   npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid-<prerelease-id>] | from-git]

   'npm [-v | --version]' to print npm version
   'npm view <pkg> version' to view a package's published version
   'npm ls' to inspect current package/dependency versions
   ```

   | 选项       | 描述                                     | 例子                   | 说明                                    |
   | ---------- | ---------------------------------------- | ---------------------- | --------------------------------------- |
   | major      | 重大更新版本                             | npm version major      | 0.2.0 ->1.0.0                           |
   | minor      | 主要更新版本                             | npm version minor      | 0.2.0 ->0.3.0                           |
   | patch      | 补丁更新版本                             | npm version patch      | 0.2.0 ->0.2.1                           |
   | premajor   | 重大更新预发布版本                       | npm version premajor   | 0.2.0 ->1.0.0-0                         |
   | preminor   | 主要更新预发布版本                       | npm version preminor   | 0.2.0 ->0.3.0-0                         |
   | prepatch   | 补丁更新预发布版本                       | npm version prepatch   | 0.2.0 ->0.2.1-0                         |
   | prerelease | 预发布版本                               | npm version prerelease | 当前版本不是预发布版本的会出错          |
   | from-git   | 取git的tag作为版本号设置至`package.json` | npm version from-git   | git的tag标签没有设置的情况下,会抛出错误 |

   - 限定符
     - `^`:从左侧的第一个非`0`位置开始限定,例如`1.2.3<=^1.2.3<2.0.0`,`0.2.3<=^0.2.3<0.3.0`
     - `~`:从次版本号开始限定,例如`1.2.3<=~1.2.3<1.3.0`,但是如`~1.0.0`就没有此版本号
     - `*`:不限定任何版本
     - `-`:`1.2.3-1.2.6`,限定区间

   > `description`:对包进行描述,便于`npm search`
   > `repository`:本项目中代码的源地址位置

   1. 可以分层写出项目地址

      ```json
      {
        "repository": {
          "type": "git",
          "url": "https://github.com/npm/cli.git"
        }
      }
      ```

   2. 同时可以指定仓库名的形式

      ```json
      {
        "repository": "npm/npm",
        "repository": "github:user/repo"
      }
      ```

   > `keywords`:将关键字放入其中.它是一个字符串数组.便于使用`npm search`

   ```json
   {
     "keywords": [
       "test",
       "npm",
       "app"
     ]
   }
   ```

   > `homepage`:项目的主页.用于展示项目

   ```json
   "homepage": "https://github.com/owner/project#readme"
   ```

   > `main`:程序的主要入口点.一般用于require的引入
   - 也就是说,如果您的包被命名为foo,并且用户安装了它,然后会执行`require("foo")`,则将返回主模块的exports
     对象

   > `module`:一般是 esm 模块的入口点,用于 import 的引入
   - 如果包module被命名为foo,用户安装之后,然后执行`import...from "foo"`,会返回主模块

   > `author`:作者信息

   1. 每个字段的形式分开展现

      ```json
      {
        "name": "Barney Rubble",
        "email": "b@rubble.com",
        "url": "http://barnyrubble.tumblr.com/"
      }
      ```

   2. 以 `author` 合并展示

      ```json
      {
        "author": "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
      }
      ```

   > `license`:许可证.让人知道使用的权利和限制的
   - [参考github](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)

   > `file`:发布时需要包含的文件

   - 一定包含以下文件:`package.json`,`README`,`LICENSE / LICENCE`,`The file in the "main" field`
   - 同时可以指定需要包含的文件夹

   ```json
   {
     "files": [
       "dist"
     ]
   }
   ```

   > `engines`: 用于规范 node 的版本

   ```json
   {
     "engines": {
       "node": ">=18"
     }
   }
   ```

### 发布javascript版本的包

1. `name`:字段必须是仓库拥有者的名称,即`npm login`的名称
   - 由于作用域内包安装到作用域文件夹中,因此在代码中需要作用域时,必须包含作用域的名称
   - 每个 npm 用户/组织都有自己的作用域,只有你可以在作用域中添加包

   ```js
   require("@myorg/mypackage");
   ```

2. `npm publish`:npm中发布**公共的作用域包**需要使用`npm publish --access=public`(私有是收费的)
3. `npm unpublish 包名`:即可将 npm 上的包删除

```bash
npm publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>] [--otp otpcode] [--dry-run]

Publishes '.' if no argument supplied
Sets tag 'latest' if no --tag specified
```

- `<folder>`:包含`package.json`文件的文件夹
- `<tarball>`:指向gzip压缩tar存档的url或文件路径,其中包含一个包含package.json文件的文件夹.
- `[--tag <tag>]`:使用给定标记注册已发布的包,以便安装此版本.默认情况下,更新并安装标记(参考`npm-dist-tag`)
- `[--access <public|restricted>]`:告知注册表此包是应发布为公共包还是受限制程序包.仅适用于作用域内包,缺省为`restricted --access`.如果没有付费帐户,则必须发布`public`方式才能发布作用域内的程序包.
- `[--otp <otpcode>]`:启用了双因素身份验证,则可以使用此代码提供来自身份验证器的代码.否则系统将提示`auth-and-writes`
- `[--dry-run]`:截至npm@6,除了实际发布到注册表之外,是否所有发布都会执行.报告将要发布的内容的详细信息.
- `[--workspaces]`:在发布时启用工作区上下文.将发布所有工作区包.
- `[--workspace]`:启用工作区上下文,并将结果限制为此配置项指定的结果.将仅发布给定工作区中的包.

> 发布一个公共的包,不包含私有作用域

1. 设置npm的proxy代理`npm config set proxy="代理地址(如127.0.0.1:7890)"`
2. 检查自己的包名,不能与其他人的包名一样
3. 使用`npm publish`发布自己的包

### 打包typescript版本的包

1. 下载`npm install typescript -D`
2. 初始化一个`tsconfig.json`文件`tsc --init`
3. 在scripts中添加脚本:`npx tsc -p .`.打包当前目录下的所有文件

> 一些typescript中特有的配置

1. `package.json`中的`types`字段
   - 这是一个只在TypeScript中生效的字段,如果您的包有一个main.js文件,您还需要在`package.json`文件中指明主声明文件.将types属性设置为指向捆绑(bundled指main.js)的声明文件

   ```json
   {
     "types": "./lib/main.d.ts"
   }
   ```

2. `package.json`中的`typesVersions`字段
   - 控制typescript的版本号

   ```json
   "typesVersions": {
       ">=3.1": { "*": ["ts3.1/*"] }
   }
   ```

3. 在`.d.ts`文件中的`/// <reference types="..." />`
   - 当前库依赖于全局库,会导入全局库的`.d.ts`的名称
   - 在声明文件里包含`/// <reference types="node" />`，表明这个文件使用了`@types/node/index.d.ts`里面声明的名字.并且,这个包要在编译阶段与声明文件一起被包含进来
   - 解析@types包的名字的过程与解析import语句里模块名的过程类似.所以可以简单的把三斜线类型引用指令想像成针对包的import声明
   - 对于那些**在编译阶段生成的声明文件**,编译器会自动地添加`/// <reference types="..." />`;当且仅当结果文件中使用了引用的`@types`包里的声明时才会在生成的声明文件里添加`/// <reference types="..." />`语句

> 配置`tsconfig.json`.

1. 初始化一个tsconfig.json文件:`npx tsc --init`
2. 介绍几个重要的配置项
   - `target`: 将项目打包成目标兼容的版本
   - `module`: 指定要用的模块化标准
   - `lib`: lib用于指定要包含在编译中的库文件
     - 例如dom中的一些类型所需要的声明文件.或者使用`Array<T>`指定数组类型
     - [可以看下这篇文章](https://stackoverflow.com/questions/43874096/difference-in-the-lib-property-in-tsconfig-json-between-es6-and-es2017)
   - `declaration`: 为ts或者js项目生成定义文件(`.d.ts`)
   - `sourceMap`: 为源码生成映射文件,方便调试
   - `rootDir`: 指定根目录的源文件位置
   - `outDir`: 指定根目录的打包位置
   - `esModuleInterop`: 是commonjs模块兼容esm模块(意味着两者的方式都可以导出)
     - 参考:<https://zhuanlan.zhihu.com/p/148081795>

- 最终形成的tsconfig.json文件

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "CommonJS",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

- 对于`package.json`文件最好把项目放置在源文件`src`中,此时只需要配置打包生成的目录上传包就可以了

```json
"main": "dist/index.js",
"types": "dist/index.d.ts"
```

> 如果想要打包 mjs、cjs 等不同格式的资源，[请移步](./npm.md#module-导入导出)

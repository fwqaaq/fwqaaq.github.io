---
title: vue3+ts工程化搭建
date: 2021-10-02 18:16:44
author: Jack-zhang
categories: vue
tags:
   - JS
   - TS
   - vue
   - config
summary: vue3+ts工程化搭建
---

## [vue-cli配置脚手架的注意项](#vue-cli配置脚手架的注意项)

* 选择手动配置后的选项
  * [x] Babel: Babel编译
  * [x] TypeScript:TypeScript支持
  * [ ] Progressive Web App (PWA) Support: PWA支持
  * [x] Router: Vue路由
  * [x] Vuex: Vue状态管理
  * [x] CSS Pre-processors: CSS预编译器（包括:SCSS/Sass,Less,Stylus）
  * [x] Linter / Formatter: 代码检测和格式化
  * [ ] Unit Testing: 单元测试
  * [ ] E2E Testing: 端到端测试

* 使用Linter / Formatter选择
  * [x] ESLint+Prettier:选择自定义风格项(自己配置)
  * 之后是关于在保存前检测还是fix和commit时检测
  * ![选项](Prettier.png)

* ![包配置的保存](package的保存.png)
  * `In dedicated config files`:单独保存在各自的配置文件中
  * `In package.json`:保存在package.json文件中

## [集成editorconfig](#集成editorconfig)

> 说明:`editorconfig`配置是为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格

* VSCode需要安装一个插件:EditorConfig for VS Code
* 参考文档:<http://editorconfig.org>

* 配置`.editorconfig`文件

```yaml
root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行首的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

## [prettier工具](#prettier工具)

> 说明:一款强大的代码格式化工具,支持 `JavaScript`,`TypeScript`,`CSS`,`SCSS`,`Less`,`JSX`,`Angular`,`Vue`,`GraphQL`,`JSON`,`Markdown` 等语言

* vue脚手架并不会集成`prettier`插件,要自己安装
  * `npm install prettier -D`

### [配置`.prettierrc`文件](#配置prettierrc文件)

 | 属性          | 描述                                              |
 | ------------- | ------------------------------------------------- |
 | useTabs       | 使用tab缩进还是空格缩进,选择false                 |
 | tabWidth      | tab是空格的情况下,是几个空格,选择2个              |
 | printWidth    | 当行字符的长度,推荐80                             |
 | singleQuote   | 使用单引号还是双引号,选择true,使用单引号          |
 | trailingComma | 在多行输入的尾逗号是否添加,设置为 `none`          |
 | semi          | 语句末尾是否要加分号,默认值true,选择false表示不加 |

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "none",
  "semi": false
}
```

### [配置`.prettierignore`忽略文件](#配置prettierignore忽略文件)

```ignore
/dist/*
.local
.output.js
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

### [配置一次性修改](#配置一次性修改)

>在`package.json`中配置一个`scripts`(脚本):

```json
"prettier": "prettier --write ."
```

## [ESLint检测](#eslint检测)

> 说明: Vue会默认帮助我们配置需要的ESLint环境

* VSCode需要安装ESLint插件
* 注意:`eslint`和`prettier`冲突的问题
  * 插件的安装(vue创建项目时,如果选择`prettier`,这两个插件会自动安装):
  
  ```shell
  npm i eslint-plugin-prettier eslint-config-prettier -D
  ```

* 在`.eslintrc.js`继承中添加插件

```json
 extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
    'plugin:prettier/recommended'
  ],
```

## [git Husky和eslint](#git-husky和eslint)

>* 说明husky是一个git hook工具,可以帮助我们触发git提交的各个阶段：`pre-commit`,`commit-msg`,`pre-push`
>* 项目虽然使用eslint了,但是不能保证组员提交代码之前都将`eslint`中的问题解决掉

* 保证代码仓库中的代码都是符合eslint规范
* 在组员执行 `git commit` 命令的时候对其进行校验,如果不符合eslint规范,那么自动通过规范进行修复

1. 安装相关依赖:`npm install husky -D`
2. 在项目目录下创建`.husky`文件夹
   * `npx husky install`
3. 在`package.json`中添加一个脚本
   * `"prepare":"husky install"`
4. 初始化`pre-commit`脚本

```shell
npx husky add .husky/pre-commit "npm run lint"
```

> 这个时候我们执行git commit的时候会自动对代码进行lint校验.
>>这又产生了一个问题:那就是commit提交的规范,接下来要说的

## [git commit规范](#git-commit规范)

### [代码提交风格](#代码提交风格)

> 说明:`Commitizen` 是一个帮助我们编写规范 `commit message` 的工具

* git commit会按照统一的风格来提交,这样可以快速定位每次提交的内容,方便之后对版本进行控制

1. 安装相关依赖:`npm install commitizen -g`(产生两个命令行工具)
   * `cz`:根据约定用于提交,如果是`-g`,可以使用`git-cz`
   * `git-cz`是`cz`的别名
   * `commitizen`:将适配器安装到项目中
2. 详细的使用方法:`commitizen init < adapter-npm-name > (args)`
   * 从npm安装一个commizen适配器,并将其添加到你的`package.json`
   * 如果是`pnpm`,使用`pnpm add -D -E cz-conventional-changelog`
3. 安装`cz-conventional-changelog`并且初始化`cz-conventional-changelog`

```shell
npx commitizen init cz-conventional-changelog --save-dev --save-exact
# --save-exact固定依赖包的版本,不要带^或~,避免出现小版本
```

* 在项目中安装`cz-conventional-changelog` 适配器依赖
* 将适配器依赖保存到`package.json`的`devDependencies`字段信息
* 在`package.json`中新增`config.commitizen`字段信息,主要用于配置cz工具的适配器路径
* ![配置生成](commit规范.jpg)

> 或者也可以自定义提交信息,使用`cz-customizable`

* 参考:<https://www.npmjs.com/package/cz-customizable>

#### 使用命令以及配置脚本

* 提交代码需要使用`npx cz`
* 同时也可以在`scripts`中构建一个命令来执行 `cz`
  * `"commit":"cz"`:直接运行`npm run commit`

#### [commit message的选项](#commit-message的选项)

>* 选项一:本次更新的类型(Select the type of change that you're committing)
>* 选项二:本次修改的范围,可以事先约定好,例如:`login`,`main`等(What is the scope of this change)
>* 选项三:提交的信息(Write a short, imperative tense description of the change)
>* 选项四:提交详细的描述信息(Provide a longer description of the change)
>* 选项五:是否为一次重大的更改(Are there any breaking changes)
>* 选项六:是否影响到某个为解决的问题(Does this change affect any open issues)

##### git提交结构

>git提交说明可以分成三个部分**Header**,**Body**(commit的详细描述,说明代码提交的详细说明) 和 **Footer**

###### Header

> **Header**部分包括三个字段**type**(必需),**scope**(可选)和**subject**(必需)

* **Type**:用于说明commit的提交性质

| Type       | 作用                                           | 解释                                                |
| ---------- | ---------------------------------------------- | --------------------------------------------------- |
| `feat`     | 新增特性                                       | (feature)                                           |
| `fix`      | 修复                                           | Bug(bug fix)                                        |
| `docs`     | 修改文档                                       | (documentation)                                     |
| `style`    | 代码格式修改                                   | (white-space, formatting, missing semi colons, etc) |
| `refactor` | 代码重构                                       | (refactor)                                          |
| `perf`     | 改善性能                                       | (A code change that improves performance)           |
| `test`     | 测试                                           | (when adding missing tests)                         |
| `build`    | 变更项目构建或外部依赖                         | （例如 scopes: webpack、gulp、npm 等）              |
| `ci`       | 更改持续集成软件的配置文件和package中的scripts | 例如 scopes: Travis, Circle 等                      |
| `chore`    | 变更构建流程或辅助工具                         | (比如更改测试环境)                                  |
| `revert`   | 代码回退                                       |

* **scope**:说明commit影响的范围.scope依据项目而定,例如在业务项目中可以依据菜单或者功能模块划分,如果是组件库开发,则可以依据组件划分
  * `scope`可以省略
* **subject**:是对`commit`的简短描述

###### Footer

>如果代码的提交是不兼容变更或关闭缺陷,则Footer必需,否则可以省略。

* **不兼容变更**:当前代码与上一个版本不兼容,则Footer以`BREAKING CHANGE`开头,后面是对变动的描述,以及变动的理由和迁移方法。
* **关闭缺陷**:如果当前提交是针对特定的issue,那么可以在Footer部分填写需要关闭的单个 issue 或一系列issues

#### [commitizen代码的提交验证](#commitizen代码的提交验证)

>说明:如果`git commit` 按照不规范的格式提交,可以通过commitlint来限制提交

1. 安装依赖:
   * `npm i @commitlint/config-conventional @commitlint/cli -D`
2. 在根目录创建`commitlint.config.js`文件,配置`commitlint`:

   ```js
   module.exports = {
     extends: ['@commitlint/config-conventional']
   }
   ```

3. 使用husky生成`commit-msg`文件,验证提交信息

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

#### [Commitizen日志](#Commitizen日志)

>如果使用了以上的工具集,那么就可以使用`conventional-changelog-cli`快速生成开发日志

```shell
npm install conventional-changelog-cli -g
```

* 在`package.json`脚本中添加日志命令

```json
"version": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md"
```

> 执行`npm run version`后可查看产生的日志**CHANGELOG.md**
> <span style="color:red">注意要使用正确的Header的type,否则生成的日志会不准确,这里只是一个示例,生成的日志不是很严格</span>

## [生产环境,开发环境,测试环境](#生产环境开发环境测试环境)

* 根据`process.env.NODE_ENV`区分
  * 开发环境: `development`
  * 生成环境: `production`
  * 测试环境: `test`

### 使用config文件封装各种测试

> 脚手架会自动检测

```ts
let BASE_URL = ''
const TIME_OUT = 10000
if (process.env.NODE_ENV === 'development') {
  BASE_URL = '.../dev'
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = '.../prod'
} else {
  BASE_URL = '.../test'
}
export { BASE_URL, TIME_OUT }
```

### 使用不同的环境配置文件

> 使用`VUE_APP`开头的自定义变量,或者直接使用BASE_URL

1. `.env.development`:`VUE_APP_BASE_URL='.../dev'`
2. `.env.production`:`VUE_APP_BASE_URL= '.../prod'`
3. `.env.test`:`VUE_APP_BASE_URL= '.../test'`

> 如果需要取值,需要用`process.env.VUE_APP_BASE_URL`

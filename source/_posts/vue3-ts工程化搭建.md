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

> 说明:一款强大的代码格式化工具，支持 `JavaScript`,`TypeScript`,`CSS`,`SCSS`,`Less`,`JSX`,`Angular`,`Vue`,`GraphQL`,`JSON`,`Markdown` 等语言

* vue脚手架并不会集成`prettier`插件,要自己安装
  * `npm install prettier -D`

### [配置`.prettierrc`文件](#配置prettierrc文件)

 属性 | 描述
----|---
 useTabs | 使用tab缩进还是空格缩进，选择false
 tabWidth | tab是空格的情况下，是几个空格，选择2个
 printWidth | 当行字符的长度，推荐80
 singleQuote | 使用单引号还是双引号，选择true，使用单引号
 trailingComma | 在多行输入的尾逗号是否添加，设置为 `none`
 semi | 语句末尾是否要加分号，默认值true，选择false表示不加

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

>* 说明husky是一个git hook工具，可以帮助我们触发git提交的各个阶段：`pre-commit`,`commit-msg`,`pre-push`
>* 项目虽然使用eslint了，但是不能保证组员提交代码之前都将`eslint`中的问题解决掉

* 保证代码仓库中的代码都是符合eslint规范
* 在组员执行 `git commit` 命令的时候对其进行校验，如果不符合eslint规范，那么自动通过规范进行修复

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

* git commit会按照统一的风格来提交，这样可以快速定位每次提交的内容，方便之后对版本进行控制

1. 安装相关依赖:`npm install commitizen -D`
2. 安装`cz-conventional-changelog`并且初始化`cz-conventional-changelog`

```shell
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

* 这个命令会帮助我们安装`cz-conventional-changelog`依赖
* 并且在 `package.json`中进行配置
* ![配置生成](commit规范.jpg)

#### 使用命令以及配置脚本

* 提交代码需要使用`npx cz`
* 同时也可以在`scripts`中构建一个命令来执行 `cz`
  * `"commit":"cz"`:直接运行`npm run commit`

#### [commit message的选项](#commit-message的选项)

> 选项一:本次更新的类型

| Type     | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| `feat`     | 新增特性 (feature)                                           |
| `fix`     | 修复 Bug(bug fix)                                            |
| `docs`     | 修改文档 (documentation)                                     |
| `style`   | 代码格式修改(white-space, formatting, missing semi colons, etc) |
| `refactor` | 代码重构(refactor)                                           |
| `perf`    | 改善性能(A code change that improves performance)            |
| `test`    | 测试(when adding missing tests)                              |
| `build`   | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等） |
| `ci`       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| `chore`    | 变更构建流程或辅助工具(比如更改测试环境)                     |
| `revert`   | 代码回退                                                     |

>* 选项二:本次修改的范围
>* 可以事先约定好,例如:`login`,`main`等
>* 选项三:提交的信息
>* 选项四:提交详细的描述信息
>* 选项五:是否为一次重大的更改
>* 选项六:是否影响到某个为解决的问题

### [代码的提交验证](#代码的提交验证)

>说明:如果`git commit` 按照不规范的格式提交,可以通过commitlint来限制提交

1. 安装依赖:
   * `npm i @commitlint/config-conventional @commitlint/cli -D`
2. 在根目录创建`commitlint.config.js`文件，配置`commitlint`:

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

3. 使用husky生成`commit-msg`文件，验证提交信息

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

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

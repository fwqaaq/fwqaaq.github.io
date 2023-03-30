---
title: ESLint
date: 2022-01-28 22:29:13
author: Jack-zhang
categories: config
tags:
   - ESlint
   - JS
   - TS
summary: 使用ESlint规范项目
---

> 以下以`nuxt3`集成ESlint举例

* `npx nuxi init nuxt-app`:首先得初始化一个nuxt3的项目

## 初始化ESlint

* `eslint`可以全局安装,也可以局部安装,在这里我就使用`pnpm add eslint -D`

* `npx eslint --init`:此命令可以创建一个配置,并且你就可以继承推荐的规则

```js
module.exports = {
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:vue/essential",
      "plugin:@typescript-eslint/recommended"
  ],
  "parserOptions": {
      "ecmaVersion": "latest",
      "parser": "@typescript-eslint/parser",
      "sourceType": "module"
  },
  "plugins": [
      "vue",
      "@typescript-eslint"
  ],
  "rules": {
  }
}
```

* **env**:项目环境

### **extends**

>extends的模块名称以`eslint-config-`开头,例如 eslint-config-myconfig.同时支持 npm 作用域模块,例如 :@scope/eslint-config.使用的时候可以用全称,也可以用缩写(不使用`eslint-config-`)
>
>例如上面配置文件,extends中`"plugin:@typescript-eslint/recommended"`,这个就是插件中的配置

* **指定配置的字符串**(配置文件的路径,可共享配置的名称,`eslint:recommended` 或 `eslint:all`)
* **字符串数组**：每个配置继承它前面的配置

1. extends可以看做是集成一个个配置方案的最佳实践.它配置的内容实际就是一份份别人配置好的`.eslintrc.js`
2. 允许 extends 配置多个模块,如果规则冲突,位置靠后的包将覆盖前面的
3. rules中的规则相同,并且优先级恒定高于 extends

### plugin

>每个插件是一个命名格式为 eslint-plugin-\<plugin-name> ,比如 eslint-plugin-vue.你也可以用这样的格式 @\<scope>/eslint-plugin-\<plugin-name> 限定在包作用域下,比如 @vue/eslint-plugin-vue. 同样可以使用缩写
>
>例如上面配置文件中,plugins中的`"vue"`,这个就是简写的插件

1. 引入`plugin`可以理解为只是加载了(拥有额外的自定义的rules)插件。但是只有在 **rules,extends** 中定义后才会生效，如果没有则不生效
2. plugin里除了自定义的rules.还可以配置config，即自己的代码检查工具，类似配置好的`.eslintrc.js`(例如`"plugin:vue/essential"`),并且这部分可以在extends里配置:`plugin:config`名称
   * 参考:<https://cn.eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins>

### **rules**:[可以做下面的任何事情以扩展(或覆盖)规则](https://eslint.org/docs/user-guide/configuring/rules)

* `"off"或0`- 关闭规则
* `"warn"或1`- 打开规则作为警告（不影响退出代码）
* `"error"或2`- 将规则作为错误打开（触发时退出代码为 1）

1. 启用额外的规则
2. 改变继承的规则级别而不改变它的选项
   * 基础配置：`"eqeqeq": ["error", "allow-null"]`
   * 派生的配置：`"eqeqeq": "warn"`
   * 最后生成的配置：`"eqeqeq": ["warn", "allow-null"]`
   * `eqeqeq`是需要`===和!==`
3. 覆盖基础配置中的规则的选项
   * 基础配置：`"quotes": ["error", "single", "avoid-escape"]`
   * 派生的配置：`"quotes": ["error", "single"]`
   * 最后生成的配置：`"quotes": ["error", "single"]`
   * `quotes`强制一致使用反引号、双引号或单引号

>开启 "eslint:recommended"
>
>值为`eslint:recommended`的extends属性启用一系列核心规则,这些规则报告一些常见问题
>
>如果配置集成了推荐的规则：在使用命令行的 `--fix` 选项之前,检查一下报告的问题,这样就可以知道一个新的可修复的推荐的规则将更改代码

### extends和plugins的区别

1. 一般对js来说,extends是针对rules做的规则说明,类似于别人配置好的`.eslintrc.js`.而plugins是一堆规则集合
2. extends一般会加载plugin中的配置集,形成一套核心规则
3. plugin不仅仅可以 对js做扩展,又可以对除了js之外的做扩展

> 在extends中使用[plugins插件](https://cn.eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins)

* extends里的config和plugin里的config的区别
  1. `extends`中的config,是一种命名规范,扩展名称格式必须为eslint-config-\<name>
  2. plugin中的config,是一个属性,用于配置一堆自定义的规则的集合

### parserOptions

>参考<https://eslint.bootcss.com/docs/user-guide/configuring>

### 修改支持 vue3

>参考<https://eslint.vuejs.org/user-guide/#usage>

1. 将extends里的`"plugin:vue/essential"`换成vue3

   ```js
   extends: [
     ...,
     'plugin:vue/vue3-recommended',
   ],
   ```

2. 配置nuxt3中额外的规则
   * 下载插件:`npm install -D eslint-plugin-nuxt`

   ```js
   extends:[
     ...,
     "plugin:nuxt/recommended"
   ]
   ```

### ESlint命令行参数

>首先在脚本中配置eslint检查

```json
scripts:{
  // npx会自动执行脚本,不需要加上npx
  "lint": "eslint . --ext .ts,.vue"
}
```

>* 语法:`eslint [options] [file|dir|glob]*`
>* 常用命令行参数,通过`npx eslint --help`来输出所有选项参数

* 正常的使用
  1. `eslint app.js main.js`:检查`app.js` ,`main.js`文件
  2. `eslint lib/**`:检查lib下面的所有文件

* 一些常用选项
  1. `--ext`:允许你指定 ESLint 在指定的目录下查找 JavaScript 文件时要使用的文件扩展名.默认情况下`.js`作为唯一性文件扩展名
     * `--ext`只用当参数为目录时才会生效

     ```shell
     # 当前目录下所有目录
     eslint --ext .ts,.vue .
     # 忽略扩展名,匹配src下所有文件
     eslint --ext .vue ./src/**/*
     ```
  
  2. `--rulesdir`:允许你指定另一个加载规则文件的目录。允许你在运行时动态加载新规则。当你有自定义规则绑定到eslint会很有用。
     * `eslint --rulesdir my-rules/file.js`:只绑定一个规则文件
     * `eslint --rulesdir my-rules/ --rulesdir my-other-rules/file.js`:绑定多个规则文件
     * 注意，与核心规则和插件规则一样，你仍需要在配置文件或通过 --rule 命令行选项启用这些规则，以便在检测过程中实际运行这些规则。使用 --rulesdir 指定一个规则目录不会自动启用那些目录下的规则
  3. `-o, --output-file`:将报告写到一个文件
     * `eslint -o ./test.txt`:将报告写到test.txt
  4. `--fix`:该选项指示 ESLint 试图修复尽可能多的问题。修复只针对实际文件本身，而且剩下的未修复的问题才会输出。不是所有的问题都能使用这个选项进行修复，该选项在以下情形中不起作用：
     * 当代码传递给 ESLint 时，这个选项抛出一个错误。
     * 这个选项对使用处理器的代码不起作用。
     * 该选项对使用处理器的代码没有影响，除非处理器选择允许自动修复

    ```json
    {
      "script": {
         "lint": "eslint --fix --ext .tsx,.ts ."
      }
    }
    ```

> `.eslintignore`文件:eslint会忽略当前目录下的这些文件.

* `.eslintignore`是`--ignore-path`的选项的一个扩展,更方便的去管理文件

```shell
/dist/*
.local
.output.js
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

## prettier和husky

>* 使用prettier去规范代码风格
>* 参考:<https://prettier.io/>

* 下载关于prettier的插件:`npm i -D prettier eslint-plugin-prettier eslint-config-prettier`

```js
module.exports={
  "extends":[
  ...,
  // 用 eslint-config-prettier
  'plugin:prettier/recommended'
  ],
  plugin:["prettier"]// 避免与 prettier 冲突
}
```

>配置[`.prettierrc`](https://prettier.io/docs/en/options.html)文件,同时也可以添加`.prettierignore`文件来忽略不想要检查的文件

```js
{
  printWidth: 80, //单行长度
  tabWidth: 2, //缩进长度,不管是空格还是Tab
  useTabs: false, //使用空格代替tab缩进
  semi: true, //句末使用分号
  singleQuote: true, //使用单引号
  quoteProps: 'as-needed', //仅在必需时为对象的key添加引号
  jsxSingleQuote: true, // jsx中使用单引号
  trailingComma: 'all', //多行时尽可能打印尾随逗号
  bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
  jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
  arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
  requirePragma: false, //无需顶部注释即可格式化
  insertPragma: false, //在已被preitter格式化的文件顶部加上标注
  proseWrap: 'preserve', //不知道怎么翻译
  htmlWhitespaceSensitivity: 'ignore', //对HTML全局空白不敏感
  vueIndentScriptAndStyle: false, //不对vue中的script及style标签缩进
  endOfLine: 'lf', //结束行形式
  embeddedLanguageFormatting: 'auto', //对引用代码进行格式化
}
```

* 增加脚本配置`prettier --write .`

### husky

>线初始化husky:`git husky install`

* `npx husky add .husky/pre-commit "npx lint-staged"`将代码检查添加到预提交

### Lint-staged

* 直接使用命令:`npx mrm@2 lint-staged`

>此命令将根据项目依赖项中的代码质量工具安装和配置husky和 `lint-staged package.json，因此请确保在此之前安装npm install --save-dev并配置所有代码质量工具，如Prettier和ESLint

* `Lint-staged`参考:<https://github.com/okonet/lint-staged>

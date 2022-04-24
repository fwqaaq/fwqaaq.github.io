---
title: Jest
date: 2022-04-16 21:34:37
categories: config
tags: 
   - JS
   - config
summary: 对js,ts进行test
---

## 初始化一个test项目

1. `npm i jest -D`:下载jest测试框架
2. `npx jest --init`.初始化一个jest测试文件
   * 测试文件可以是ts或者js结尾的`jest.config.(js|ts)`
3. 在`package.json`的脚本中写入`"test":"jest"`配置
   * jest是test本项目中的所有目录的测试文件

>进行一个commonjs模块的测试

1. `math.js`文件中写入如下待测试代码

   ```js
   function add(a, b) {
     return a + b;
   }
   
   function minus(a, b) {
     return a - b;
   }
   
   function multi(a, b) {
     return a * b;
   }
   
   module.exports = { add, minus, multi };
   ```

2. `math.test.js`导入测试代码

   ```js
   const { add, minus, multi } = require("./math");
   
   test("测试加法 3 + 3", () => {
     expect(add(3, 3)).toBe(6);
   });
   
   test("测试减法 3 - 3", () => {
     expect(minus(3, 3)).toBe(0);
   });
   
   test("测试乘法 3 * 3", () => {
     expect(multi(3, 3)).toBe(9);
   });
   ```

3. 运行`npm run test`可以看到终端有成功运行的样式

## jest config

1. jest可以直接使用命令行参数`--config <path/to/file.js|cjs|mjs|json>`
2. jest可以直接在`package.json`中配置文件

   ```json
   {
       "jest": {}
   }
   ```

3. 直接使用`jest.config.(js|ts)`文件,在文件中配置

> 有如下的选项

* `automock`:`bool`默认值false.将所有的导入模块都自动mock
  * 但是当源文件下有**mocks目录**时,会自动mock.核心模块,如fs不会默认fock,需要手动设置`jest.mobk("fs")`
* `bail`:`number|bppl`.默认值是0.bail选项可以让你配置jest在经历几次失败后停止运行测试
* `browser`:`bool`默认值false.解析模块中是否遵循`package.json`中的`browser`字段
  * 有些模块导出的版本会不一样,取决于是在**Node**中还是**浏览器**中进行操作
* `cacheDirectory`:`string`.默认值**/tmp/\<path>**.用来储存依赖信息缓存目录
* `clearMocks`:`bool`.**默认值false**.在每个而是前自动清理mock的调用和实例instance
  * 相当于在每一个test之前调用`jest.clearAllMocks`,但不会删除已经有的mock实现
* `collectCoverage`: `bool`**默认值false**.是否打开代码覆盖率信息
* `collectCoverageFrom`:`array`.**默认值undefined**.表明哪些文件需要收集.如果文件匹配就会手机作为`coverage`的基数
  * 收集根目录下所有的js,jsx文件,同时排除node_modules下的所有文件
  * 并且此参数需要`collectCoverage`被设置成true

  ```js
  collectCoverageFrom:["**/*.{js,jsx}","!**/node_modules/**"]
  ```

* `coverageDirectory`:`string`.**默认值undefined**,输出覆盖信息文件的目录名称
* `coveragePathIgnorePatterns`:`[array<string>]`.**默认值[node_modules]**.排除出coverage的文件列表.
* `coverageProvider`:`string`.有两个选项,`v8`或者是`babel`.声明到底用哪个provider来用于指导代码的覆盖测试
* `coverageThreshold`:`object`.**默认值undefined**.该阈值作为覆盖最小阈值来设置.
  * 可以被设置为`global`,或者是目录及文件路径
  * 如果没有达到阈值,则jest失败,如果给了一个正数,就表示最小的百分比值

  ```js
  coverageThreshold: {
      global: {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": -10
      }
    }
  ```

* `dependencyExtractor`:`string`.**默认值undefined**.允许等地依赖提取器的使用,必须满足是一个node modules,同时导出的object中包含`extract`函数
* `displayName`:`string | object`.**默认值undefined**.允许在测试的时候打印显示标签.这里有多个repo和多个jest配置文件的时候很好用

   ```js
   //string
   displayName: 'CLIENT'
   //object
   displayName: {
    name: 'CLIENT',
    color: 'blue',
   },
   ```

* `errorOnDeprecated`:`bool`.**默认值false**.针对国企的API抛出提示性的错误
* `extensionsToTreatAsEsm`:`Array<string>.`**默认值[]**.将mjs字段视作esm模块.
  * 如果有其他文件使用ESM运行,需要在此处指定其文件的扩展名称

   ```js
   extensionsToTreatAsEsm:[".ts"]
   ```

* `extraGlobals`:`array<string>`**默认值undefined**.测试文件在[vm](https://nodejs.org/api/vm.html)中运行,会减慢全局上下文的属性的调用速度
* `forceCoverageMatch`:`array<string>`.在收集代码覆盖率的时候,通常会忽略测试文件.使用此选项,可以在coverage包含被忽略的文件
* `globals`:`object`.**默认值{}**.全局变量,需要在所有的测试环境中都可以使用

   ```js
   globals:{
     "__DEV__":true
   }
   ```

* `rootDir`:`string`.默认值**jest配置文件的根目录**.如果未找到则为`pwd`
  * 通常可以设置为`src`或者`lib`为根目录,对应于代码在存储库中的存储位置
* `roots`:`array<string>`.**默认值["<rootDir>"]**.Jest 应用于在其中搜索文件的目录路径列表
  * 根据`rootDir`决定根目录所在的位置
* `moduleFileExtensions`:`array<string>`.**默认值["js", "jsx", "ts", "tsx", "json", "node"]**
  * 模块使用的文件扩展数组.如果未指定文件扩展名的模块,则这些事jest将俺从左到有顺序查找的扩展名.建议将常用的扩展名放置左侧
* `moduleNameMapper`:`object<string,string | array<string>>`.正则表达式到模块名称或模块名称数组的映射(设置别名)
* `modulePathIgnorePatterns`:`object<string>`.**默认值[]**.定模块的路径与任何模式匹配,则它在测试环境中将不可用
  * 一个正则表达式模式字符串数组,这些字符串与所有模块路径匹配,然后这些路径将被视为对模块加载程序**可见**
  * 这些模式字符串与完整路径匹配`["<rootDir>/build/"]`
* `transform`:`[object<string, pathToTransformer | [pathToTransformer, object]>]`.默认值`{"\\.[jt]sx?$": "babel-jest"}`
  * 从正则表达式到转换器路径的映射.这些编译器将`JavaScript`的未来版本编译为当前版本,或者可以配合ts,webpack使用
* `transformIgnorePatterns`:`array<string>`.文件路径与任何模式匹配的时候,忽略这些匹配的文件
  * **默认值:["/node_modules/", "\\.pnp\\.[^\\\/]+$"]**

## jest中es,ts的配置项

> `npx jest --coverage`代码覆盖率

* 代码覆盖率会在控制台显示一个图表信息.并且有一个默认叫做`coverage`的文件夹.文件夹中的html文件就是对覆盖率的阐述
* 覆盖率就是编写的测试代码对原来的功能代码的占比,全部test,则为100%
* <span style="color:red">在配置文件中,初始化的时可以开启代码覆盖率的选项</span>,而不必使用cli的时候添加`--coverage`
   1. `collectCoverage: true`:是否打开代码覆盖率
   2. `coverageDirectory: "coverage"`:代码覆盖率生成的文件目录名称.可以自定义
   3. `coverageProvider: "v8"`:有两个选项,`v8`或者是`babel`.声明到底用哪个provider来用于指导代码的覆盖测试

>[配置esm模块进行测试](https://jestjs.io/docs/ecmascript-modules)

1. 首先需要在`package.json`中加入`"type":modules`.不需要改`.js`为`.mjs`
2. 对于`jest.config.js`文件,不能使用默认的`module.exports`导出
   * 需要使用esm的方式导出配置

   ```js
    export default{}
   ```

3. 执行需要使用`NODE_OPTIONS=--experimental-vm-modules`这种形式设置环境变量
   * 在脚本中配置此环境变量并没有成功
   * 这里我是直接使用`NODE_OPTIONS=--experimental-vm-modules npx jest`命令来运行此测试

>如果是ts项目,建议直接使用vitest直接进行TDD开发

* vitest基于vite开发,完全适用于`vite.config.ts`配置
* 下载`npm i vitest -D`

1. 基于`vite.config.ts`配置vitest
   * 如果你使用`vite`的`defineConfig`你还需要将三斜线指令写在配置文件的顶部

   ```ts
   /// <reference types="vitest" />
   import { defineConfig } from 'vite'
   
   export default defineConfig({
     test: {
       // ...
     },
   })
   ```

2. 基于`vitest.config.ts`配置vitest.
   * 此优先级高于`vite.config.ts`,可以直接使用vitest中的`defineConfig`配置

   ```ts
   import { defineConfig } from 'vitest/config'
   export default defineConfig({
     test: {
       // ...
     },
   })
   ```

3. 排除默认选项,自己配置测试的选项

   ```ts
   import { configDefaults, defineConfig } from 'vitest/config'
   export default defineConfig({
     test: {
       exclude: [...configDefaults.exclude, 'packages/template/*'],
     },
   })
   ```

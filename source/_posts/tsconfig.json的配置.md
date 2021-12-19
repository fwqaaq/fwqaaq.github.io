---
title: tsconfig.json的配置
date: 2021-10-01 12:43:14
author: Jack-zhang
categories: TS
tags:
   - JS
   - TS
   - config
summary: tsconfig.json中的配置
---
## tsconfig.json

> 生成```tsconfig.json```文件,命令:```tsc --init```

1. "include":[],是调试用来指定那些ts文件需要编译
   * 路径:**  表示任意目录,*  表示任意文件
2. "exclude":[],不需要被编译的文件目录 默认值：["node_modules", "bower_components", "jspm_packages"]
3. "files":[],也是指定ts文件,但是是一个一个ts文件

### compilerOptions

1. ```target```:用来ts被编译成js的版本
   * 可选值:'es3', 'es5', 'es6', 'es2015', 'es2016', 'es2017','es2018', 'es2019', 'es2020', 'es2021', 'esnext'

2. ```module```:指定要用的模块化标准
   * 可选值:"CommonJS", "AMD", "System", "UMD", "ES6", "ES2015", "ES2020", "ESNext", "None"

3. ```lib```:用来指定项目中要用来的库

4. `strict`:严格一些的严格检查(any)

5. `"jsx":"preserve"`:对jsx进行怎么样的处理

6. `"importHelpers"`:是否有辅助的导入功能

7. `"moduleResolution":"node"`按照node的方式去解析模块`import "/index.node"`

8. `"skipLibCheck"`跳过一些库的类型检查(比如axios->类型/loadsh->@types/loadsh/其它第三方库)

9. `"esModuleInterop": true`支持esmodule
10. `"allowSyntheticDefaultImports": true`支持commonjs

11. `"sourceMap"`:要不要生成映射文件

12. `"baseUrl":"."`文件在解析时,基本url

13. `"types":["webpack-env"]`指定具体要解析使用的类型

14. ```"outDir": "./dist"```: 用来指定编译后的目录

15. ```"outFile": "./dist/app.js"```, 将编译后的文件合并成一个js文件

16. ```allowjs```,是否对js进行编译,默认是false

17. ```checkJs```,是否对js语法进行检查

18. ```removeComments```,是否移除注释

19. ```noEmitOnError```,是否当有错误是不生成编译文件

20. ```alwaysStrict```, 是否用来使用编译后的文件是否使用严格模式

21. ```noImplicitAny```,是否允许隐式的any类型存在

```ts
function sum(a,b){
  return a+b
}//隐式any类型
```

12. ```noImplicitAny```,是否允许不明确的this存在

13. ```strictNullChecks```,严格检查空格

14. ```strict```,所有严格检查的总开关(建议开)
---
title: TS技巧
date: 2022-08-08 05:10:42
author: Jack-zhang
categories: TS
tags:
   - JS
   - TS
summary: tsconfig.json 配置技巧
---

## [Project Refrence](https://zhuanlan.zhihu.com/p/550953856)

>在一个项目 `src` 目录下有两个相对独立的模块,分别是 `src1` 和 `src2`,其中他们都包含一系列的 `.ts` 文件

* 此时,在根目录需要使用 `tsconfig.json` 来配置编译的方式

   ```json
   {
      "compilerOptions":{
        "lib":["es2015","dom"],
        "types":[],
        "outDir":"dist",
      },
      "include":["src/**/*.ts"]
   }
   ```

  * 此时编译后的文件会分别到 `dist/src1` 和 `dist/src2` 目录下.但是如果 `src1` 变化了,`src2` 同时也会再次被编译,这时候我们需要做一些缓存设置

1. 在 `src1` 和 `src2` 目录下分别创建 `tsconfig.json` 文件,其中需要添加 `composite:true` 这样的配置

   ```json
   //src1 目录下`tsconfig.json`,src2 目录同理
   {
      "compilerOptions":{
        "composite":"true",
        "lib":["es2015","dom"],
        "types":[],
        "outDir":"dist",
      },
      "include":["../../dist/src1"]
   }
   ```

2. 然后在根目录的 `tsconfig.json` 里加上一个 `references` 的配置

   ```json
   // 根目录下`tsconfig.json`
   {
      "compilerOptions":{
        "lib":["es2015","dom"],
        "types":[],
        "outDir":"dist",
      },
      "references":[
        {"path":"./src/src1"},
        {"path":"./src/src2"}
      ]
   }
   ```

3. 运行 `tsc --build`,编译的结果会多出 `.d.ts` 文件,和缓存文件 `tsconfig.tsbuildinfo`(此文件会记录这些文件的hash值)
   * 使用 `Project Refrence` 需要使用 `tsc --build | -b` 来编译,并且需要在子模块中设置 `composite:true` 来指定
   * 当然,也可以通过 `prepend` 来指定编译顺序.此时可以优先编译 `src2`

   ```json
   {
    ...,
    "references":[
        {"path":"./src/src1"},
        {"path":"./src/src2","prepend":true}
      ]
   }
   ```

## [TS类型来源](https://zhuanlan.zhihu.com/p/531084864)

> ts 中的 `declare` 语法可以单独声明变量的类型

   ```js
   //object
   interface Person {
       name: string
       age?: number
   }
   
   declare const guang: Person
   
   //function
   declare function add(num1: number, num2: number): number
   ```
  
* 但是像浏览器中内置的类型,基本都是必用的.所以 typescript 中内置了这些类型声明,在 typescript 下的 `lib` 文件下
  * 因为是内置的,所以很容易就可以配置

   ```json
   //stsconfig.json`
   {
      "compilerOptions":{
        "lib":["es2015","dom"],
        ...
      },
      ...
   }
   ```

* 像 `node` 这种非内置的类型,使用时需要下载 `@types/node` 才可以使用,这些包会默认放置在 `node_modules` 目录下的 `@types` 中
  * 当然也是需要引入才可以使用

   ```json
   //stsconfig.json`
   {
      "compilerOptions":{
        "types":["node"],
        ...
      },
      ...
   }
   ```

* 如果像 `vue3` 这种使用 typescript 编写的,可以自动生成内置的 `.d.ts` 文件

* 注意:
  * `module` 后一般接一个路径,而 `namespace` 后一般是一个命名空间名字
  * 但是,现在一般推荐使用 `esmodule`,**如果在 dts 中没有 `import` 或者 `export`,那么所有的类型声明都是全局的,否则是模块内部的**

   ```json
   //tsconfig.json
   {
      "files":["./global.d.ts"],
      "include":[
         "./types/**/*",
         "./src/**/*"
      ]
   }
   ```

  * 以下如果不注释 import，那么 .d.ts 不会是全局的

   ```ts
   //global.d.ts
   import * as fs from "fs"
   declare const fn:(a:number,b:number) => number
   ```

* `reference` 可以指定使用的模块的类型,所以在 `.d.ts` 文件中使用的是 reference,而不是 import

   ```ts
   /// <reference types="node">
   declare const fn:(a:number,b:number) => number
   ```

  * 或者在一些配置文件中也可以使用,例如 vite 中的 `env.d.ts`

   ```ts
   /// <reference types="vite/client" />
   ...
   ```
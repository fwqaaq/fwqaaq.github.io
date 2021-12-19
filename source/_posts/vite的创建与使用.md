---
title: vite的创建与使用
date: 2021-09-23 21:33:57
categories: vue
tags:
   - JS
   - vue
   - TS
   - config
summary: 用vite创建一个vue项目
---

## 关于用vite创建的坑

* 目前网上还有很多已经弃用有关vite的包,但是某些旧文章以及根据视频整理文章的作者,有着大片误导性的操作,和弃用的包.

* 已弃用包1 `@vitejs/create-app`
  ![弃用包](弃用1.png)
* 已弃用包2`create-vite-app`
  ![弃用包](弃用2.png)
  * 弃用包2是网上经常遇到的用来创建vite的包.
* vite生产阶段并不是跳过编译
  1. 嵌套导入会导致额外的网络往返,在生产环境中发布未打包的 ESM 仍然效率低下
  2. 为了在生产环境中获得最佳的加载性能

## 关于vite

* vite是一个打包工具,官方给出vite的解释:是下一代打包工具.(夸没夸大不好说,反正挺好用)
  * 关于`webpack`,`Rollup`和`Parcel`等工具打包,当项目越来越大型时,js代码量也会呈现指数级增长
  * vite利用的是浏览器开始原生支持ES模块的特性
  * vite天生支持ts文件,支持ts文件转译

## 使用vite构建vue项目

* 注意：Vite本身也是依赖Node的,所以也需要安装好Node环境
  * 并且Vite要求Node版本是大于12版本的

1. 安装方式一:(官方)
   * `npm init vite@latest my-vue-app --template vue`
   * 默认直接安装<span style="color:red">带有vite</span>的vue项目
   * 注意:要`npm install`初始化项目
2. 安装方式二:
   * 首先:`npm init create-vite -g`全局安装项目构造工具
   * `create-vite my-vue-app`:选择vue,如果使用ts,继续选择vue-ts
     * vanilla
     * vue
     * react
     * preact
     * lit-element
     * svelte
   * `npm install`:初始化项目

* **了解vite快速构建**
  1. 浏览器原生支持ES模块的特性,构建的项目中会将`script`标签的`type`属性设置为`module`
  2. 如果我们查看浏览器中的请求,会发现请求的依然是ts的文件：
     * 这是因为vite中的服务器Connect会对我们的请求进行转发；
     * 获取ts编译后的代码,给浏览器返回,浏览器可以直接进行解析
       * 且大多数逻辑靠插件钩子而不是中间件完成,对中间件的需求大大减小
     ![vite服务器原理](vite的服务器原理.png)

  3. 官方的解释:
     * 冷启动开发服务器,其中模块被区分为**依赖**和**源码**
        * 依赖:Vite 将会使用 esbuild 预构建依赖
        * 源码:Vite 只需要在浏览器请求源码时进行转换并按需提供源码<span style="color:red">(按需加载)</span>
          * 源码 通常包含一些并非直接是 JavaScript 的文件,需要转换(例如 JSX,CSS 或者 Vue/Svelte 组件),时常会被编辑.且不是所有的源码都需要同时被加载(路由)
     * 热更新(HMR):
       * 注意,非常重要一点:
          1. Vite 同时利用 HTTP 头来加速整个页面的重新加载(再次让浏览器为我们做更多事情)
          2. 源码模块的请求会根据 304 Not Modified 进行协商缓存,而依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存,<span style="color:red">因此一旦被缓存它们将不需要再次请求</span>
  4. 具体,官方文档<https://cn.vitejs.dev/guide/why.html>

## 使用vite

* 在`package.json`文件中
  
```json
"scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "serve": "vite preview"
  }
```

1. `npm run dev`启动开发服务器
2. `npm run build`为生产环境构建产物
   * `vue-tsc --noEmit`类型检查工具
3. `npm run serve`本地预览生产构建产物

## vite使用ESBuild打包而不是Babel

* ESBuild的特点
  * 超快的构建速度,并且不需要缓存
  * 支持ES6和CommonJS的模块化
  * 支持ES6的Tree Shaking
  * 支持Go,JavaScript的API
  * 支持TypeScript,JSX等语法编译
  * 支持SourceMap
  * 支持代码压缩
  * 支持扩展其他插件

* ESBuild快速打包的原因:
  * 使用Go语言编写的，可以直接转换成机器代码，而无需经过字节码
  * ESBuild可以充分利用CPU的多内核，尽可能让它们饱和运行
  * ESBuild的所有内容都是从零开始编写的，而不是使用第三方，所以从一开始就可以考虑各种性能问题

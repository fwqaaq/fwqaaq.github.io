---
title: 关于webpack
date: 2021-11-14 16:21:09
author: Jack-zhang
categories: config
tags:
   - JS
   - TS
   - config
summary: webpack5的配置和特性
---

## npx

>使用 `npx ~` 运行局部的脚本命令

* 在`scripts`配置脚本命令

```json
"scripts":{
  "build":"webpack"
}
```

* 使用 `pnpm run build` 可以构建
* 脚本会直接在 **bin** 目录下寻找脚本的命令

> Webpack的依赖图

1. webpack在处理应用程序时,它会根据命令或者配置文件找到入口文件
2. 从入口开始,会生成一个<span style="color:red">依赖关系图</span>,这个依赖关系图会包含应用程序中所需的所有模块
3. 然后遍历图结构,打包一个个模块(根据文件的不同使用不同的loader来解析)

## webpack构建

> 首先webpack依赖于node,要想运行webpack一定要在node环境下运行

* 下载`webpack`和`webpack-cli`
* 在文件`webpack.config.js`中构建项目

## [webpack配置项](#webpack配置项)

> 导入和导出文件的选项

* **entry**: 入口文件
* **output**: 出口文件
  * **path**: 打包后的文件夹(path是一个绝对路径)
  * **filename**: 打包后的文件名
* **target**: 目标选项(可以是`web`或者`node`),什么环境打包

```js
const path = require("path")
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "boundle.js"
  }
}
```

> 五个核心概念

* **Entry**:入口(Entry)指示 Webpack以哪个文件为入口起点开始打包,分析构建内部依赖图
* **Output**:输出（Output）指示Webpack打包后的资源bundles输出到那里去,以及如何命名
* **Loader**:loader让Webpack能够去处理那些非JavaScript文件（Webpack自身只理解javascript）
* **plugins**:插件（plugins）可以使用于执行范围更广的任务。插件的范围包括,从打包优化和压缩,一直到重新定义环境中的变量
* **Mode**:模式（Mode）指示Webpack使用相应模式的配置

### model和devtool配置

> model默认值是`production`,可选:`'none' | 'development' | 'production'`

| 选项        | 描述                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| development | 会将`DefinePlugin`中的`process.env.NODE_ENV`设置为`development`,为模块和chunk启用有效的名                                     |
| production  | 会将`DefinePlugin`中的`process.env.NODE_ENV`设置为`production`,为模块和chunk启用确定性的混淆名,`FlagDependencyUsagePlugin`... |
| none        | 不适用任何默认优化                                                                                                            |

* 不同选项会开启不同的配置

> `devtool: "source-map"`,建立js映射文件,方便代码调试

## module模块

> 相关module模块中rules的配置,使用数组的形式

### [loader](#loader)

>用于加载模块,例如`css`,`less`或者`png`等文件模块

* **rules**属性对应的值是一个数组
  * 数组中存放的是一个个的`Rule`,`Rule`是一个对象,对象中可以设置多个属性
  * **test**:用于对resource进行匹配,对象中可以设置多个属性
  * **use**:对应的属性:一般情况下是一个数组
    * **loader**:必须有一个 loader属性,对应的值是一个字符串
    * **options**:可选的属性,值是一个字符串或者对象,值会被传入到loader中
  * **include**(匹配文件)和**exclude**(排除文件):字符串数组的形式
  
> `css-loader`的使用

* `loader`可以用对<span style="color:red">模块的源代码</span>进行转换
* 我们可以<span style="color:red">将css文件也看成是一个模块</span>,我们是<span style="color:red">通过import来加载这个模块的</span>
* 在加载这个模块时,<span style="color:red">webpack其实并不知道如何对其进行加载</span>,我们必须制定对应的loader来完成这个功能

> `style-loader`的使用

* **css-loader**只是负责将`.css`文件进行解析,并不会将解析之后的css插入到页面中
* **style-loader**完成解析后插入\<style>的操作

```js
const path = require("path")
module.exports = {
...
  module: {
    rules: [
      {
        test: /\.css$/,
        //1.loader的写法(语法糖)
        //loader:'css-loader'
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      }
    ]
  }
}
```

* loader的两种写法
  1. 直接使用`loader:"css-loader"`
  2. 使用`use:[]`数组的形式可以传入配置
  * 第一种:use的简写,传入多个`loader`
  * 第二种:use对象的写法,可以配置多个属性 

### [css预处理](#css预处理)

1. 首先下载`less`编译工具
2. 下载`less-loader`工具转换`less`到`css`

> 关于use中loader的顺序问题,是从最后一个解析到第一个,顺序不能错

```js
rules:[
  {
    test:/\.less$/,
    use:[
      {loader:"style-loader"},
      {loader:"css-loader"},
      {loader:"less-loader"}
    ]
  }
]
```

### [postCSS工具](#postcss工具)

> 借助于js来转换css的适配,例如浏览器前缀等

* 构建PostCSS(导入其中需要的插件)
  1. 查找`webpack`中的**postcss-loader**
  2. 在项目中查找`postcss.config.js`文件

* 下载工具`postcss、postcss-cli`
  * `pnpm add postcss postcss-cli -D`

> 使用`postcss-loader`来进行处理

* 直接在`webpack.config.js`配置文件中处理

```js
use:[
  "style-loader",
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          require("postcss-preset-env")
        ]
      }
    }
  }
]
```

> 使用单独的配置文件`postcss.config.js`来配置

* `webpack`中只需要提供预处理,并不需要导入操作,webpack会自动查找并导入

```js
module.exports = {
  plugins: [
    require("postcss-preset-env")
  ]
}
```

### [file-loader](#file-loader)

>图片的导入

* webpack中rules的配置

```js
{
  test: /\.(jpg|png|jpeg|gif|svg)$/i,
  use: "file-loader"
}
```

* 注意:
  1. 使用`url()`可以直接引入图片
  2. 如果是`src`引入,<span style="color:red">切记要用import引入图片</span>

```js
import mvc from "../img/mvc封装式开发.png"
//设置img元素的src
const imgEl = document.createElement("img")
imgEl.src = mvc
document.body.appendChild(imgEl)
```

>使用**options**处理文件名称按照一定的规则进行显示:

* 使用**PlaceHolders**来完成,webpack提供了大量的**PlaceHolders**来显示不同的内容:
  * <https://webpack.js.org/loaders/file-loader/#placeholders>

  * **[ext]**: 处理文件的扩展名
  * **[name]**: 处理文件的名称
  * **[hash]**: 文件的内容,使用MD4的散列函数处理,生成的一个128位的hash值（32个十六进制）
  * **[contentHash]**: 在file-loader中和[hash]结果是一致的（在webpack的一些其他地方不一样,后面会讲到）
  * **[hash:\<length>]**: 截图hash的长度,默认32个字符太长了
  * **[path]**: 文件相对于webpack配置文件的路径

```js
use: {
  loader: "file-loader",
  options: {
    outputPath: "img",
    name: "[name]_[hash:6].[ext]",
    //可以直接将包名和文件名分开
    //name: "img/[name]_[hash:6].[ext]"
  }
}
```

### url-loader

>可以将较小的文件,转成**base64的URI**(与`file-loader`相似)

* 使用base64转码可以减少http请求,小的图片转换base64之后可以和页面一起被请求
  * 注意:`大的图片也进行转换,反而会影响页面的请求速度`

* 但是在dist文件夹中,我们会看不到图片文件
  * 这是因为我的两张图片的大小分别是38kb和295kb
  * 默认情况下**url-loader**会将所有的图片文件转成base64编码

> 在`url-loader`中`options`属性`limit`

* 下面的代码38kb的图片会进行base64编码,而295kb的不会

```js
{
  test:/\.(jpg|png|jpeg|gif|svg)$/i,
  use: {
  loader: "file-loader",
  options: {
    outputPath: "img",
    name: "[name]_[hash:6].[ext]",
    //可以直接将包名和文件名分开
    //name: "img/[name]_[hash:6].[ext]"
  }
}
}
```

## webpack5新特性

> <span style="color:red">资源模块类型(asset module type)</span>,来替代加载某些资源我们需要使用一些loader,比如`raw-loader` ,`url-loader`,`file-loader`

* 四种新的资源模块类型
  * **asset/resource**:替代file-loader:发送一个单独的文件并导出URL
  * **asset/inline**:替代url-loader:导出一个资源的 data URI
  * **asset/source**:替代raw-loader:导出资源的源代码,之前通过使用实现
  * **asset**:替代url-loader,并且配置资源体积限制实现:在导出一个data URI和发送一个单独的文件之间自动选择

```js
{
  test: /\.(jpg|png|jpeg|gif|svg)$/i,
  type: "asset",
  generator: {
    filename: "img/[name]_[hash:6][ext]"
  },
  parser: {
    dataUrlCondition: {
      maxSize: 1000 * 1024
    }
  }
}
```

### 字体的打包(file-loader)

> 这里使用webpack5新特性

```js
{
  test: /\.(eot|ttf|woff2?)$/,
  type: "asset/resource",
  generator: {
    filename: "font/[name]_[hash:6][ext]"
  },
}
```

## plugin模块

>plugin贯穿webpack的生命周期

* Loader是用于特定的模块类型进行转换；
* Plugin可以用于执行更加广泛的任务,比如打包优化、资源管理、环境变量注入等

```js
plugins: [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin()
]
```

### CleanWebpackPlugin

> 自动清除每次打包之后的文件,例如`dist`

### HtmlWebpackPlugin

>在进行项目部署的时,生成对应的入口文件`index.html`

* 默认情况下是根据`ejs的一个模块`来生成的
* 根据`html-webpack-plugin`中`default_index.ejs`模块来生成

#### 自定义HTML模块

* 添加一个noscript标签,在用户的JavaScript被关闭时,给予响应的提示
* 开发vue或者react项目时,使用一个可以挂载后续组件的根标签 \<div id="app">

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

* **EJS模块填充数据**:语法<% 变量 %>

```js
new HtmlWebpackPlugin({
  template: "./public/index.html",
  title: "webpack项目"
})
```

* template：指定我们要使用的模块所在的路径
* title：在进行`htmlWebpackPlugin.options.title`读取时,就会读到该信息

> 使用**DefinePlugin**:在编译时创建配置的全局常量(`BASE_URL`),是一个webpack内置的插件

* \<link rel="icon" href="<%= BASE_URL %>favicon.ico">
* 如果没有设置过这个常量值,会出现没有定义的错误

```js
new DefinePlugin({
  BASE_URL: "'./'"
})
```

#### CopyWebpackPlugin

> 在vue的打包过程中,将一些文件从public的目录下复制到dist文件夹中

```js
new CopyWebpackPlugin({
  patterns: [
    {
      from: "public",
      to: "./",
      globOptions: {
        ignore: [
          "**/index.html"
        ]
      }
    }
  ]
```

* `patterns`:复制的规则
  * from:设置从哪一个源中开始复制
  * to:复制到打包的目录下(dist)的位置(可以省略)
  * globOptions:设置一些额外的选项,其中可以编写需要忽略的文件
    * ignore:忽略的文件

## babel工具的使用

> 在编译间段(loader)中使用,babel可以将ES6以上的语法转换为ES5

* 将我们的**源代码**,转换成浏览器可以直接识别的**另外一段源代码**(可以看作一个编译器)
  * Babel的工作流程:
    * 解析阶段
    * 转换阶段
    * 生成阶段
  * 具体的工作流程是经过`词法分析`生成`tokens数组`然后`语法分析AST(抽象语法树)`,遍历所有的AST,使用`插件(plugins)`生成新的`AST(抽象语法树)`

* vue,react项目都是使用babel转换向后兼容的版本(vite是使用ESBuild)

> babel本身和postcss一样可以作为一个独立的工具,不需要和webpack构建工具搭配起来使用(不过命令行中要写很多命令,麻烦)

* babel的两个核心库:`@babel/cli`(命令行工具) `@babel/core`(核心代码)
* 有`@babel/core`核心代码库之后可以使用插件(可以自己写相关的插件)
  * `@babel/plugin-transform-arrow-functions`:转换箭头函数
  * `@babel/plugin-transform-block-scoping`:转换const或let这样的词法作用域

> 使用预设`@babel/preset-env`来加载插件,而不需要特定的指定加载插件,避免加载内容过多
>> 常见的预设有,**env**,**react**,**TypeScript**

* 使用`babel-loader`在webpack中进行构建

> 直接在webpack中配置所有选项

```js
{
  test: /\.js$/,
  loader: "babel-loader"
  use: {
    loader: "babel-loader",
    options: {
      presets: [
        "@babel/preset-env"
        //如果想传入其他参数
        //["@babel/preset-env",{}]
      ] 
    }
  }
}
```

> 另写一个`babel.config.js`文件,webpack会根据预设自动加载

```js
//webpack
{
  test: /\.js$/,
  loader: "babel-loader"
}

//babel
module.exports = {
  presets: [
    "@babel/preset-env"
  ]
}
```

## 关于webpack打包vue源码

### 关于vue打包不同版本的解析

* `production`是生产版本下的模式
* `runtime`是运行时

> **vue(.runtime).global(.prod).js**

* 通过浏览器中的 \<script src=“...”> 直接使用
* 我们之前通过CDN引入和下载的Vue版本就是这个版本
* 会暴露一个全局的Vue来使用

> **vue(.runtime).esm-browser(.prod).js**

* 用于通过原生 ES 模块导入使用 (在浏览器中通过 \<script type="module"> 来使用)

> **vue(.runtime).esm-bundler.js**

* 用于 webpack,rollup 和 parcel 等构建工具
* 构建工具中默认是vue.runtime.esm-bundler.js
* 如果我们需要解析模板template,那么需要手动指定vue.esm-bundler.js

> **vue.cjs(.prod).js**

* 服务器端渲染使用
* 通过`require()`在`Node.js`中使用

### vue中关于DOM元素的编写

1. `template`模板的方式:
   * template: `<h2>傻瓜</h2>`
   * 渲染:手动指定**vue.esm-bundler.js**
2. render函数方式渲染
   * h函数可以直接返回一个虚拟节点,也就是Vnode节点
3. 通过`.vue`文件中的`template`来编写模板
   * `.vue`文件中的template
   * 通过在`vue-loader`对其进行编译和处理

>Vue选择版本:**运行时+编译器**和**仅运行时**

* **运行时+编译器**包含了对template模板的编译代码,更加完整,但是也更大一些
* **仅运行时**没有包含对template版本的编译代码,相对更小一些

#### 关于App.vue的打包过程

> 关于SFC(单文件组件),真是开发中大多数情况下都是使用这个

* 使用`vue-loader`编译`.vue文件`,`vue-loader`会调用`@vue/compiler-sfc`来对`template`进行解析
* 下载:`npm i vue-loader @vue/compiler-sfc -D`

```js
{
  test:/\.vue$/,
  loader:"vue-loader"
}
```

> 配置Vue的插件

```js
const {VueLoaderPlugin} = require("vue-loader/dist/index")

new VueLoaderPlugin()
```

* 以上配置可以支持`App.vue`的写法

> 关于编译时会出现的警告:
> ![vue构建出现的警告](markdownVueBuildError.png)

* <span style="color:red">建议正确配置它们以便在最终包中获得适当的 tree-shaking</span>

* __VUE_OPTIONS_API__:（启用/禁用选项API的支持,默认:true）
* __VUE_PROD_DEVTOOLS__:（启用/禁用devtools生产支持,缺省false）
* 在`DefinePlugin`插件中配置这两个属性,属于wenpack自带的插件

```js
new DefinePlugin({
  BASE_URL: "'./'",
  __VUE_OPTIONS_API__: true,
  __VUE_PROD__DEVTOOLS: false
})
```

## devServe模块

> **contentBase**属性:`contentBase:"./public"`

* 在开发阶段不需要使用`copy-webpack-plugin`打包文件,而是直接以contentBase为相对位置查找资源位置.

> 设置host主机地址

```js
devServer:{
  host:0.0.0.0
}
```

> `localhost`和`0.0.0.0`的区别
  
* localhost本质是一个域名,通过DNS解析成127.0.0.1
  * 其实就是一个**回环地址**,不需要经过数据链路层,物理层,直接在网络层就能获取数据
  * 例如监听127.0.0.1,在同一网段下的主机中,通过ip地址是不能访问的
* 0.0.0.0:监听所有IPV4上所有的地址,根据端口找到不同的程序
  * 监听0.0.0.0时,同一个网段下的主句,可以通过ip地址访问

> port,open,compress

* **port**设置监听的端口,默认是8080
* **open**设置是否打开浏览器,默认false
* **compress**是否为静态文件开启`gzip compression`
  * 默认是false.
  * 在响应头中`Content-Encoding:gzip`

### HMR(热模块替换)

> 不刷新整个页面,替换,添加,删除模块.而立即在浏览器更新

* `webpack-dev-server`已经支持HMR,(只要开启即可)

```js
devServer:{
  hot:true
}
```

>由于没有指定哪一个模块热更新,需要手动实现`module.hot.accpet`

* 不过在大型框架中已经有包替我们实现好,例如`vue-loader`

> 关于HMR的原理

* `webpack-dev-server`会创建两个服务：提供静态资源的服务`express`发送http请求和Socket服务`net.Socket`
  * `express server`负责直接提供静态资源的服务<span style="color:red">打包后的资源直接被浏览器请求和解析</span>
  * `HMR Socket Server`负责监听模块的变化
    * 会生成两个文件:`.json`文件是对js需要更改的文件模块的映射
    * `.js`是更新后端文件

![HMR](markdownHMR.png)

### Proxy

```js
proxy: {
  "^/api": {
    target: "http://localhost:8080",
    pathRewrite: {
      "^/api": ""
    },
    secure: false,
    changeOrigin: true
  }
}
```

> 使用代理服务器解决开发中的跨域问题

| 属性         | 描述                                                      |
| ------------ | --------------------------------------------------------- |
| target       | 表示的是代理到的目标地址                                  |
| pathRewrite  | 使用此属性可以删除写入的`/api`                            |
| secure       | 默认情况下不接受转发到https服务器上,如果希望支持使用false |
| changeOrigin | 是否更新代理后请求的headers中的host地址                   |

## resolve模块

>通常是用来解析文件的路径

* 关于webpack可以解析的路径
  * **绝对路径**:可以直接解析
  * **相对路径**:在 import/require 中给定的相对路径,会拼接此上下文路径,来生成模块的绝对路径
  * **模块路径**:
    * 默认值是`['node_modules']`,默认会在这个包里查找文件
    * 使用`alias`配置别名的方式来替换初识模块路径

> extensions和alias配置

* extensions是解析到文件时自动添加扩展名：
  * 默认值是 `['.wasm', '.mjs', '.js', '.json']`
  * 所以如果我们代码中想要添加加载 .vue 或者 jsx 或者 ts 等文件时,我们必须自己写上扩展名
* alias配置别名
  * 如果项目结构比较深,可以使用别名简化

```js
resolve: {
    alias: {
      '@': resolve('src')
    }
  }
}
```

## 优化环境配置

> 开发环境性能优化

* 优化打包构建速度
  * HMR
* 优化代码调试
  * source-map

> 生产环境性能优化

* 优化打包构建速度 
  * oneOf
  * babel缓存
  * 多进程打包
    * externals
  * dll
* 优化代码运行的性能
  * 缓存(hash-chunkhash-contenthash)
  * tree shaking
  * code split
  * 懒加载/预加载
  * PWA

### devtools配置

> [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
>>内联和外部的区别:外部生成映射的文件,内联没有.内联构建速度更快

* **source-map**:外部
  * 错误代码的准确信息和源代码错误位置
* **inline-source-map**:内联
  * 错误代码的准确信息和源代码错误位置
* **hidden-source-map**:外部
  1. 错误代码的错误原因,但是但是没有错误位置
  2. 不能追踪源代码的错误,只能提示到构建后的代码的错误位置
* **eval-source-map**:内联
  1. 每一个文件都生成对应的source-map,都在eval
  2. 错误代码的准确信息和源代码错误位置
* **nosources-source-map**:外部
  * 错误代码的准确信息,但是没有任何源代码的信息
* **cheap-source-map**:外部
  1. 错误代码的准确信息和源代码错误位置
  2. 只能精确到行
* **cheap-module-source-map**:外部  
  1. 错误代码的准确信息和源代码错误位置
  2. module会将loader的source map加入

> 开发环境:速度和友好的调式

* 速度:`eval>inline>cheap>...`
  * eval-cheap-source-map
  * eval-source-map
* 调试:
  * souce-map
  * cheap-module-source-map
  * cheap-souce-map

> 生产环境下不使使用内,内联会使代码变的更大

* nosources-source-map
* hidden-source-map

### Oneof

> 使用Oneof加载loader,这里的loader只会匹配一个,不能有两个配置处理同一种文件

```js
//复用loader
const commonCssloader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
{
  //还需再package.json中定义browerslist,
  //或者.browerslist文件
  loader: "postcss-loader",
  options: {
    indent: "postcss",
    plugins: () => [
      require("postcss-preset-env")
    ]
  }
}]
```

```js
oneOf:[
  {
    test: /\.css$/,
    use: [...commonCssloader]
  },
  {
    test: /\.less$/,
    use: [...commonCssloader,"less-loader"]
  }
}
```

### 缓存

> babal缓存:`cacheDirectory:true`.解析js文件时使用

#### [文件名的哈希](#file-loader)

* **hash**:每次webpack构建时会生成一个唯一的hash值
  1. 问题:因为js和css同时使用一个hash值
  2. 如果重新打包,会导致所有的缓存失效
* **chunkhash**:根据chunk生成的hash值。如果打包来源于同一个chunk,那么hash值就一样
  1. 问题：js和css的hash值还是一样的
  2. 因为css是在js中被引入的,所以同属于一个chunk
* **contenthash**:根据文件的内容生成hash值。不同文件的hash值一定不一样

> 例如:`css/built.[contenthash:10].css`

### tree-shaking

> **tree shaking**:去除无用代码
  
* 前提:
  1. 必须使用ES6模块化 
  2. 开启production环境
* 配置:在`package.json`中配置`sideEffects`属性
  * `"sideEffects":false`,所有的代码都沒有副作用(都可以進行tree shaking)
    * 但是可能会把`css/@babel/polyfil`(有副作用)文件干掉
  * `"sideEffects":["*.css","*.less"]`

### code split(代码分割)

* 多入口:每有一个入口就会输出一个js入口文件

```js
entry: {
  index: "./src/js/index.js",
  test:"./src/js/test.js"
}
```

> 可以将`node_modules`中的代码单独打包一个chunk最终输出.自动分析多入口chunk中,有没有公共的文件.如果有会打包成一个公共的文件

```js
optimization:{
  splitChunks:{
    chunks:"all"
  }
}
```

### lazy loading

* 懒加载(现在es6已经支持):当文件需要用的时候才加载
* 预加载prefetch:等其他资源加载完毕,等浏览器空闲,再偷偷加载资源
* 正常加载可以认为是并行加载(同一时间可以加载多个文件)

```js
document.getElementById("btn").onclick=function(){
   import("./test").then(({mul})=>{
    console.log(mul(4,5))
  }) 
}
```

### PWA

> `workbox-webpack-plugin`:渐进式网络开发应用程序

1. 帮助serviceworker快速启动
2. 删除旧的serviceworker
3. 生成一个serviceworker配置文件

```js
new WorkboxWebpackPlugin.GenerateSW({
 clientsClaim:true,
 skipWaiting:true     
})
```

### 多进程打包

>进程启动大概约600ms,进程通信也有开销.只有工作消耗时间比较长,才需要多进程打包

```js
use:[
  {
    loader:"thread-loader",
    options:{
      workers:2//进程2个
    }
  }
]
```

### externals

>拒绝某个包被打包起来

```js
module.exports={
  externals:{
    jQuery:"jQuery"
  }
}  
```

### dll

>使用dll技术,对某些库(第三方库:jquery、react、vue...)进行单独打包

* 直接运行webpack时,默认查找 `webpack.config.js` 配置文件
* 需求：需要运行`webpack.dll.js`文件:`webpack --config webpack.dll.js`

```js
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // 最终打包生成的[name] --> jquery
    // ['jquery'] --> 要打包的库是jquery
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]' // 打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个 manifest.json --> 提供和jquery映射
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库的暴露的内容名称
      path: resolve(__dirname, 'dll/manifest.json') // 输出文件路径
    })
  ],
  mode: 'production'
};
```

## 不同环境的区分

> 配置相同的入口文件,配置不同的脚本参数区分他们

```json
"scripts":{
  "build":"webpack --config ./config/prod.config --env production",
  "serve":"webpack serve --config ./config/dev.config"
}
```

> 区分环境的配置

* 将文件的共同部分分离
  * `webpack.comm.conf.js`:开发和生产环境的共同部分
  * `webpack.dev.conf.js`:开发环境的配置
  * `webpack.prod.conf.js`:生产环境的配置
* 用到`webpack-merge`包将代码整合
  * merge函数第一个传入要整合的对象,第二个为自己特有配置编写

```js
const {merge} = require('webpack-merge');
const commonConfig = require('./webpack.comm.config');
module.exports = merge(commonConfig,{})
```

> 入口文件(`entry`)的解析规则

* 如果将webpack写在config目录中,<span style="color:red">并不需要</span>将`entry:./src/main.js`改成`entry:../src/main.js`
* 入口文件与webpack暴露出的一个api`context`有关
* `context`默认是解析入口和加载器`loader`
* 所以入口文件的解析默认是webpack的启动目录

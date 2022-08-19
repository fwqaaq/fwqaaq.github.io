---
title: vite配置
date: 2021-10-26 22:45:24
categories: vue
tags:
   - JS
   - vue
   - TS
   - config
summary: vite的一些技巧
---

## 共享配置

> 你可以显式地通过`--config`命令行选项指定一个配置文件(相对于cwd路径进行解析)

```bash
vite --config my-config.js
```

### 基础配置

>`defineConfig`,通过vite的智能提示实现vite的智能提示

* <span style="color:yellow">提示</span>:也可所以使用`jsDoc`或者`tsDoc`

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

* `root`:项目根目录所在的位置(即`index.html`所在的位置).默认是`process.cwd()`
* `base`:开发或者生产环境的公共基础路径.默认值是`/`
  * 一般开发环境使用`./`(linux中只有这一种的相对路径)
* `plugins`:需要用到的插件数组

   ```ts
   plugins: [vue()],
   ```

* `publicDir`:设置静态资源服务的文件夹.一般为`public`,如果为`false`不会生成静态资源到`outDir`(一般是`dist`目录)根目录中.可以是相对路径也可以是绝对路径

* `assetsInclude: string | RegExp | (string | RegExp)[]`.静态资源处理
  * 指定额外的**picomatch模式**作为静态资源处理
  * 当从 HTML 引用它们或直接通过`fetch`或`XHR`请求它们时,它们将被插件转换管道排除在外

* `logLevel:'info' | 'warn' | 'error' | 'silent'`:调整控制台输出的级别，默认为 'info'。
* `clearScreen:boolean`**默认: true**
  * 设为`false`可以避免Vite清屏而错过在终端中打印某些关键信息
  * 命令行模式下可以通过 `--clearScreen false` 设置
* `envDir:string`.**默认值root**
  * 用于加载`.env` 文件的目录.可以是一个绝对路径,也可以是相对于项目根的路径
* `envPrefix:string | string[]`**默认:VITE_**
  * 以`envPrefix`开头的环境变量会通过`import.meta.env`暴露在你的客户端源码中

### tsconfig.json

>isolatedModules:由于vite只会检查单文件组件(sfc),所以在暴露的时候会出现一些问题

```json
{
  "compilerOptions": {
   ...
    "isolatedModules": true
  }
}
```

* 开启isolatedModules,每一个.ts文件必须成为一个模块(必须有`import`或者`export`)

* 引入并暴露同一个types的时候,这样是错的(如果开启`isolatedModules`会有error提示)
  
   ```ts
   // types.ts
   export interface A{
     name:"zhangsan"
   }

   //test.ts
   import { A } from "./types"

   export {A} //* error 的提示
   ```

* 无法编译环境常量的枚举

   ```ts
   declare const enum Num{
     First = 0,
     Second = 1
   }
   
   const fw:A = {
     name:'fw',
     age:Num.First //报错
   }
   ```

### 配置css

#### 配置css预设

> 只需要下载预设,vite会自动集成配置,不需要像`webpack`一样需要`css-loader`,`style-loader`配置

* 直接使用npm下载`npm i scss -D`之后就可以直接使用,`less`等也都一样

>处理css预处理的选项(到scss或者less等其它官网找到配置)

```js
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `$injectedColor: orange;`
    }
  }
 }
```

#### 配置css模块

> `css.modules`的配置会传递给`postcss.modules`

```js
css:{
  modules:{
    // 是否使用 hash
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    hashPrefix: 'prefix'
  }
}
```

* `hash配置的参考`:<https://github.com/webpack/loader-utils#interpolatename>
* 样式文件名必须是`XXX.module.css[less,scss,style等]`,否则不生效的

> 这样就可以以模块的形式引入css

```css
/* test.module.css */
.greate{
  color: red;
}
.hekk{
  background-color: aqua;
}
```

```html
<h1 :class="`${module.greate} ${module.hekk}`">hello</h1>
<script>
  import module from "@/assets/css/test.module.css"
</script>
```

#### 关于css.postcss配置

>vite滋生已经集成`postcss`,无需再次安装.并且也无需单独创建postcss文件,已经集成到`vit.config.ts`中.vite会自动在`*.vue`中所有的style标签以及所有导入到`.css`文件中应用postcss

1. 使用配置文件`postcss.config.js`,默认基于项目根目录
2. 使用内联的`postcss`,格式于`postcss.config.js`一样

>PostCSS插件:嵌套CSS样式写法解决方案

| 插件                       | 描述                                                 |
| -------------------------- | ---------------------------------------------------- |
| postcss-import             | 支持@import写法                                      |
| postcss-url                | 支持@url写法                                         |
| postcss-bem                | 支持BEM元素规则命名                                  |
| postcss-nested             | 支持类选择器嵌套写法,模拟SASS嵌套选择器写法.         |
| postcss-nesting            | 支持符合W3C规范的嵌套类选择器写法                    |
| postcss-simple-vars        | 支持变量                                             |
| postcss-advanced-variables | 支持类似SASS自定义变量并引用,实现编写变量,条件,循环. |
| postcss-preset-env         | 支持变量运算                                         |

>PostCSS插件:H5移动端屏幕适用性解决方案

| 插件                      | 描述                                  |
| ------------------------- | ------------------------------------- |
| cssnano                   | 优化和压缩CSS,已包含autoprefixer插件. |
| postcss-aspect-ratio-mini | 容器比匹配                            |
| postcss-cssnext           | 实现嵌套编程                          |
| postcss-px-to-viewport    | 将px转换为vw以适应各种屏幕            |
| postcss-write-svg         | 1px细线的绘制                         |

>PostCSS通过@import将样式表合并到一起,当需要通过@import将第三方类库导入到主样式表时,首先需要运行的是@import插件.

| 插件                   | 描述                                                   |
| ---------------------- | ------------------------------------------------------ |
| postcss-import         | 支持通过内联内容来转换@import规则                      |
| postcss-partial-import | 让CSS文件支持@import语法,支持W3C的写法,也支持SASS写法. |

>浏览器自动添加前缀`autoprefixer`

1. 使用内联的方式,首先下载`autoprefixer`添加到项目中

   ```ts
   css:{
     postcss: {
       plugins: [autoprefixer()]
     }
   }
   ```

2. 在根目录创建文件`.browserslistrc`添加浏览器适配

```.browserslistrc
defaults
not ie < 11
last 2 versions
> 1%
iOS 7
last 3 iOS versions
```

### json

>`json.namedExports:boolean`.**默认:true**

* 是否支持从`.json`文件中进行按名导入

>`json.stringify:boolean`:**默认false**

* 若设置为`true`,导入的JSON会被转换为`export default JSON.parse("...")`,这样会比转译成对象字面量性能更好.尤其是当JSON 文件较大的时候
* 开启此项,则会禁用按名导入(`{version}=...`),会将json文件导入到一个对象上.

### resolve

#### 关于别名的配置

#### [import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)

>`import.meta`对象向 JavaScript 模块公开特定于上下文的元数据.它包含有关模块的信息,如模块的 URL

* `import.meta`的原型为null.该对象是可扩展的,其属性是可写的,可配置的和可枚举的
  * 使用:必须设置`type="module"`

  ```html
  <script type="module" src="my-module.js"></script>
  ```

* 可以通过`import.meta`对象获取这个模块的元数据信息

  ```js
  console.log(import.meta); // { url: "file:///home/user/my-module.mjs" }
  ```

* 注意,url也可能包含参数或者哈希(比如后缀?或#)

```html
<script type="module">
import './index.mjs?someURLInfo=5'
</script>
```

* Vite会在CommonJS和TypeScript配置文件中替换`__filename`,`__dirname`以及`import.meta.url`
* 即使项目没有在`package.json`中开启 `type: "module"`,Vite 也支持在配置文件中使用 ESM 语法

>`import.meta.url`:返回当前的模块的url路径.返回的总是本地路径,即是**file:URL**协议的字符串

* 如果当前模块中还有一个数据文件`data.txt`,可以使用以下代码
* [`new URL()`](./URL.md):返回一个当前的url地址

```js
new URL("data.txt",import.meta.url)
// URL {
//   href: 'file:///E:/Project/hexoPage/data.txt',
//   origin: 'null',
//   protocol: 'file:',
//   username: '',
//   password: '',
//   host: '',
//   hostname: '',
//   port: '',
//   pathname: '/E:/Project/hexoPage/data.txt',
//   search: '',
//   searchParams: URLSearchParams {},
//   hash: ''
// }
```

>import.meta.scriptElement:浏览器特有的元属性,返回加载模块的那个\<script>元素,相当于`document.currentScript`属性

```js
// HTML 代码为
// <script type="module" src="my-module.js" data-foo="abc"></script>

// my-module.js 内部执行下面的代码
import.meta.scriptElement.dataset.foo
// "abc"
```

#### 使用node中的路径模块

> 在`tsconfig.json`中配置路径别名:`compilerOptions`中配置两个选项:`baseUrl`和`paths`

* 设置baseUrl不会影响相对模块导入,因为它们始终相对于导入文件进行解析
  * 例如:`"baseUrl": "./src"`,然后jquery应该映射到`"../node_modules/jquery/dist/jquery"`
  * 参考: <https://zhuanlan.zhihu.com/p/46696498>
* `baseUrl`关联`path`的设置,将文件映射为自己设置的别名

> 例如:

```json
"compilerOptions":{
  "baseUrl": "./src",
  "paths":{
    "@/*":[
      "*"
    ]
  }
}
```

* 在src下目录开始查找(`baseUrl`最好设置为根路径)

```json
"compilerOptions":{
  "baseUrl": "./",
  "paths":{
    "@/*":[
      "src/*"
    ]
  }
}
```

> 在`vite.config.ts`配置别名

* 在`resolve`属性的`alias`配置别名

```ts
resolve: {
  alias: {
    //第一种
    //'@': path.resolve(__dirname, 'src')

    //第二种(本质一样)
    //'@': resolve('src')
  }
}  
```

* 第三种是以数组的形式,<span style="color:red">注意后面的分割符一定要写</span>

```ts
resolve: {
  alias: [
    {
      find: /@\//,
      replacement: `${path.resolve(__dirname, 'src')}/`
    }
  ]
}
```

#### resolve.dedupe

* 如果你在你的应用程序中有相同依赖的副本(比如`monorepos`),请使用此选项强制Vite始终将列出的依赖项解析为同一副本(从项目根目录)

#### resolve.conditions

> 条件导出:在package.json中可以将模块导出为ESM或者CommonJs或者其他你需要的模块

```json
{
  "exports": {
    ".": {
      "import": "./index.esm.js",
      "require": "./index.cjs.js"
    }
  }
}
```

* `resolve.conditions:string[]`:`import`,`module`,`browser`,`default`可以允许这些字段(在数组中设置他们)

#### resolve.mainFields

* `resolve.mainFields:string[]`: **默认值['module', 'jsnext:main', 'jsnext']**
* 一般用于发布包的时候指定模块的module等字段时候读取的文件入口

#### resolve.extensions

* `resolve.extensions:string[]`: 默认值**['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']**
  * 可以省略文件后缀名导入

### env

>* .env文件会在Vite启动一开始就被加载,改动会在重启服务器后生效
>* 开头以`VITE_APP`开头才可以
>* 也可以通过`import.meta.env`取到环境变量的值.例如`import.meta.env.VITE_APP_API`

* `.env`                # 所有情况下都会加载
* `.env.local`          # 所有情况下都会加载,但会被 git 忽略
* `.env.[mode]`         # 只在指定模式下加载
* `.env.[mode].local`   # 只在指定模式下加载,但会被 git 忽略

* `.env`类文件会在Vite启动一开始时被加载,而改动会在重启服务器后生效
* 一份用于指定模式的文件(例如`.env.production`)会比通用形式的优先级更高(例如`.env`)

* env中的预置的全局常量`BASE_URL: "/"`,`DEV: true`,`MODE: "development"`,`PROD: false`,`SSR: false`

> model属性可以是`production`,`development`

* `.env.production`或者`.env.development`文件

```env
# .env.production
VITE_APP_TITLE=My App
```

* `**模式**是一个更广泛的概念`
  * 如果希望有一个`staging”`(预发布|预上线)模式.它应该具有类似于生产的行为,但环境变量与生产环境略有不同

  ```bash
  vite build --mode staging
  ```

  * 或者使用`.env.staging`
  
  ```env
  # .env.staging
  NODE_ENV=production
  VITE_APP_TITLE=My App (staging)
  ```

>`env.d.ts`:代码中获取这些以VITE_为前缀的用户自定义环境变量的TypeScript智能提示

* 在vite下会暴露出一个`client.d.ts`文件,集成了这些配置
  * 包含`env`,`hot api`,`assset import`(静态文件的返回值)
* 可以直接在`tsconfig.json`中配置`types`

```json
{
  "compilerOptions":{
    "types": ["vite/client"]
  }
}
```

* 或者直接在`env.d.ts`中编写

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 静态文件的处理

1. `?url`:将文件当作路径返回

   ```ts
   import test from "@/assets/test.png?url"
   console.log(test)
   ```

2. `?raw`:将文件内容以字符串的内容显示

   ```ts
   import test from "./index?raw"
   console.log(test)
   ```

3. `?worker`:处理大任务计算量时,开的线程任务

   ```js
   //worker.js
   let i = 0

   function timedCloud(){
     i = i + 1
     postMessage(i)
     setTimeout(timedCloud, 500)
   }
   timeCloud()

   //main.js
   import Worker from "./worker?worker"
   const worker = new Worker()
   worker.onmessage = function(e){
     console.log(e)
   } 
   ```

4. `json`文件的引入

   ```js
   import pkg from "../package.json"
   // 引入单独字段
   import { version } from "../package.json"
   ```

5. 引入`wasm`文件

   ```js
   import init from "./fib.wasm"
   //异步的
   init().then(m=>{
     console.log(m)
   })
   ```

### import.meta.glob

>`import.meta.glob`:可以使用正则以异步的import的方式引入文件

```js
import.meta.glob("./glob/*")
//将glob下的所有文件以import的方式引入
//()=>import(...)
```

## build配置

> 一些基础配置

* `target`:构建浏览器兼容的选项.默认值是`modules`,支持远程ES模块的浏览器
  * 可以是单个es版本,例如`es2015`.同时也支持数组
* `outDir`:指定输出路径.默认值是`dist`,可以改成自己想配置的路径,例如`build`
* `assetsDir`:指定生成的静态资源存放路径(相对于`outDir`).默认值`assets`

### assetsInlineLimit

> 将小于阈值的导入或引用资源将内联为 base64 编码,一般用于图片,避免额外的http请求.优化浏览器速度

* 默认值是:`4096(4kb)`

### sourcemap

>常用于调试,默认值是false,一般开发环境不选false

* 类型:`boolean | 'inline' | 'hidden'`

* 如果为`true`:将会创建一个独立的 `source map` 文件
* 如果为 `'inline'`,`source map`的内容将会附加在输出文件中
* `'hidden'`的工作原理与'true'相似,只是 `bundle`(包) 文件中相应的注释将不被保留

### 删除调试项

>`build.minify`指定混淆器,默认为`esbuid`(速度最快)

* 可选值: `boolean | 'terser' | 'esbuild'`
* 如果需要删除调试输出的,需要手动开启`terser`

> `build.terserOptions`:配置terser默认导出的接口

```js
build:{
    minify: 'terser',
    terserOptions: {
      compress: {
        //删除生成的console
        drop_console: true,
        drop_debugger: true
      }
    }
}
```

### rollupOptions

```js
rollupOptions: {
    
    input: {
        default: './index.html'
    },
    output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
    }
},
```

1. `input`:指定打包的入口文件,默认是`./index.html`
2. `output`:指定文件输出的配置
   * `entryFileNames`:用于从入口点创建的块的打包输出格式
   * `chunkFileNames`:用于命名代码拆分时创建的共享块的输出命名
   * `assetFileNames`:用于输出静态资源的命名.

### ssr

* 可以参考<https://cn.vitejs.dev/guide/backend-integration.html>

1. `build.ssr`:boolean | string.如果是true,需要在`rollupOptions`指定入口文件
   * 如果是`string`,直接指定ssr的入口文件
2. `build.manifest`:boolean | string,默认值`false`.用于不是node服务器部署的项目
   * 当设置为`true`:构建后将会生成`manifest.json`文件,json包含了没有被`hash`过的资源文件名和`hash`后版本的映射
   * 如果是字符串,那么就是 manifest 文件的名字
3. `build.ssrManifest`:除了以上的东西,还会写入样式链接与资产预加载的链接进入json

* 在node下使用ssr:<https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server>
  * `middlewareMode`: 总共有两种模式
    * 如果是`html`,和直接使用vite配置一样,没有区别
    * `ssr`:使用服务端渲染,**需要提供服务端渲染的逻辑**.例如页面的渲染

## server

1. `host`:指定监听那个IP地址,默认是`127.0.0.1`
2. `port`:指定端口号,默认是3000
3. `open`:指定在浏览器打开的应用程序.可以是`boolean`或者`string`
4. `cors`:为开发服务器配置cors.默认启用并允许任何源

* 以上都可以使用cli执行(可以直接写进脚本中)

```json
"scripts": {
  "dev": "vite --open",
  "build": "vue-tsc --noEmit && vite build",
  "preview": "vite preview --port 5050 --open"
}
```

### proxy

>为服务器配置自定义代理规则

```js
proxy: {
  '/api': {
    target: '',
    changeOrigin:true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

1. `target`:目标更改选项
2. `changeOrigin`:是否将主机的源更改为目标源
3. `rewrite`:重写目标源

## optimizeDeps

> 预编译选项,vite会在node_modules下将项目所需要的依赖预先打包到.vite文件夹中

* `exclude`:`string[]`.在与构建中强制排除依赖项
  * 例如`lodash-es`这个依赖他也会将所有的工具函数打包
  * 需要使用`exclude:["lodash-es"]`
* `include`:使用此选项可强制预构建链接的包

* **entries**:默认情况下,Vite 会抓取你的`index.html`来检测需要预构建的依赖项
* [esbuildOptions](https://esbuild.github.io/api/#simple-options):在部署扫描和优化过程中传递给 esbuild 的选项s

## 插件

>`vite-plugin-compression`:[用于压缩资源](https://github.com/vbenjs/vite-plugin-compression)
>
>`vite-plugin-cdn-import`:[允许指定 modules 在生产环境中使用 CDN 引入](https://github.com/MMF-FE/vite-plugin-cdn-import)
>

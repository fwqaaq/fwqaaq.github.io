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
* `extensions`:导入时省略的扩展名列表(import 导入包的时候不需要带后缀)
  * 默认:`['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  * 不建议自定义导入类型的扩展名例如`.vue`

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

### 关于别名的配置

#### 使用node中的路径模块

>* `path`模块中的`resolve`方法,用于获取目录的路径.
  >* 可以传任意多的字符,返回一个绝对路径地址
  >* 如果第一个参数是`__dirname`,一样的效果
>* `__dirname`获取到当前文件下的绝对路径,文件名后缀不包括当前文件
>* `__filename`获取到当前文件下的绝对路径,文件名后缀包括当前文件

```ts
const path = require("path")
//这两个是一样的
console.log(path.resolve("src"))
console.log(path.resolve(__dirname,"src"))
```

> `path.basename()`:返回路径的最后一部分. 第二个参数可以过滤掉文件的扩展名

```js
console.log(path.basename("/source/_posts/axios.md",".md"))
//axios
console.log(path.basename("/source/_posts/axios.md"))
//axios.md
```

#### 在`tsconfig.json`中配置路径别名

> `compilerOptions`中配置两个选项:`baseUrl`和`paths`

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

#### 在`vite.config.ts`配置别名

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

### env

>* .env文件会在Vite启动一开始就被加载,改动会在重启服务器后生效
>* 开头以`VITE_APP`开头才可以
>* 也可以通过`import.meta.env`取到环境变量的值.例如`import.meta.env.VITE_APP_API`

* `.env`                # 所有情况下都会加载
* `.env.local`          # 所有情况下都会加载,但会被 git 忽略
* `.env.[mode]`         # 只在指定模式下加载
* `.env.[mode].local`   # 只在指定模式下加载,但会被 git 忽略

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

### server

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

#### proxy

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

## 插件

>`vite-plugin-compression`:[用于压缩资源](https://github.com/vbenjs/vite-plugin-compression)
>
>`vite-plugin-cdn-import`:[允许指定 modules 在生产环境中使用 CDN 引入](https://github.com/MMF-FE/vite-plugin-cdn-import)
>

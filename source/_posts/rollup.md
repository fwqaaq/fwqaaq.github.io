---
title: rollup
date: 2022-04-23 20:32:33
categories: JS
tags:
   - JS
   - vue
   - TS
   - config
summary: vite的一些技巧
---

## cli

* `-c == --config <filname>`,指定`rollup.config.js`配置文件
* `-i == --input <dirname>`:入口文件
* `-o == --file <output>`:单个输出文件
* `-f == --format <format>`:打包风格
  * amd, cjs, es, iife, umd, system
* `-d == --dir <dirname>`:将输出文件块打包到目录
* `-w == --watch`:执行监听
* `--environment <values>`:设置环境变量
  * `--envirment TEST:123`可以通过`process.env.TEST`来获取变量的值
* `-p == --plugin <plugin>`:使用插件
  * 如果在项目中使用rollup,不使用全局的rollup命令.需要使用npx:`npx rollup -c rollup.config.js`

## [配置项](https://rollupjs.org/guide/en/#configuration-files)

* 如果想要不同的配置文件,可以使用一个数组,在数组中配置各个对象

```js
export default[
  {input:...},
  {input: ...},
  ...
]
```

>* input:指定打包文件的入口
>* output:指定输出文件的出口

```js
export default {
  input: "./index.js",
  output: {
    //直接指定输出的文件夹
    file: "./dist/bundle.js",
    format: "es",
    name:"bundle",
    banner:"/* hello */"
  }
}
```

* name:示bundles(捆绑包)的全局变量名称.例如`iife`,`umd`是必要的.同一页面上的其他脚本可以使用此变量名称来访问捆绑包的导出
* banner:打包文件在最上行的介绍

* `output:[{},{}...]`,`input`也可以写成数组的形式

> 多入口打包:input写成数组的形式

* input可以写成数组的形式也可以写成对象的形式

```js
export default {
  input: ["./index.js", "./test.js"],
  plugins: [json()],
  output: {
    dir: "dist",
    format: "cjs",
  }
}
```

> plugins:使用插件.例如`@rollup/plugin-json`

```js
export default {
  ...
  plugins:[json()]
  ...
}
```

* rollup的插件是按照数组的加载顺序加载的
* 对于希望将依赖打包进自己的项目时,需要使用`@rollup/plugin-node-resolve`插件.并且最好放在第一个位置
  * 如果打包的依赖是只支持es项目,那么会和`@rollup/plugin-node-resolve`产生冲突.这时候最好需要下载`@rollup/plugin-commonjs`

```js
plugins:[resolve(),commonjs(),json()]
```

* `externals`:如果不想要将某个依赖打包进某个项目中,可以使用`externals`
  * 可以是一个对象或者是数组.如果是数组,`["react"]`默认的名字是`["React"]`.如果不是这样命名的内库,可以使用对象的形式`{"react":"React"}`

* `output`中的plugins.在编译之后启动,而不是编译之前.一般用于压缩代码.
  * 例如:`rollup-plugin-terser`

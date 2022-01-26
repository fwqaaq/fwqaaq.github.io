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

## 关于别名的配置

### 使用node中的路径模块

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

### 在`tsconfig.json`中配置路径别名

> `compilerOptions`中配置两个选项:`baseUrl`和`paths`

* 设置baseUrl不会影响相对模块导入，因为它们始终相对于导入文件进行解析
  * 例如:`"baseUrl": "./src"`，然后jquery应该映射到`"../node_modules/jquery/dist/jquery"`
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

* 在src下目录开始查找

### 在`vite.config.ts`配置别名

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

---
title: JS的模块化
date: 2021-9-14 0:19:30
author: Jack-zhang
categories: JS
tags:
   - JS
summary: js模块化打包形式
---

## ```IIFE```模式

* 模块化

```js
(function(window){//这里的window可写可不写
let msg="module"
function foo(){
  console.log("foo",msg)
}
window.module={foo}//将foo挂载到window对象
})(window)//这里的window可写可不写
```

* 调用

```html
  <script type="text/javascript" src="module.js"></script>
  <script type="text/javascript">
    module.foo()
  </script>
```

## commonjs模块化

* tips:
  1. 用户编写文件模块,相对路径必须加./,不能省略
  2. node中没有全局作用域,只有模块作用域
  3. 外部访问不到内部,内部也访问不到内部

* ```require``` 方法的两个作用:
  1. 加载文件并且执行里面的代码
  2. 拿到被加载文件模块导出的接口对象

* `exports`:
  1. 在每个文件模块都提供一个对象:exports
  2. exports默认是一个空对象
  3. 需要把所有需要被外部访问的成员变量挂载到exports上

* 暴露方式

```js
//第一种暴露方式(暴露对象)
module.exports={
  msg:"hello",
  foo(){
    console.log(this.msg)
  }
}

//第二种暴露方式(暴露函数)
module.exports=function(){
  console.log("hh")
}

//第三种暴露方式
exports.foo=function(){
  console.log("lj")
}
```

* 调用

```js
let module1=require(url)
let module2=require(url)
let module3=require(url)

module1.foo()
module2()
module3.foo()

```

## AMD(异步模块定义)

> * 专门用于浏览器端,模块的加载是异步的
> * 依赖于```Requirejs```,<span style="color:red">需要下载依赖</span>

* 语法:
  * 定义没有依赖的模块
    * ```define(function(){return 模块})```
  * 定义有依赖模块
  
  ```js
  define(["module1","module2"],function(){
    return 模块
  })
  ```

## CMD(通用模块定义)

> * 专门用于浏览器端,模块的加载是异步的
> * 模块使用时才会加载
> * 依赖于```Sea.js```

* 语法:
  * 定义没有依赖的模块

    ```js
    define(function(require,exports,module){
      exports.xxx=value
      module.exports=value
    })
    ```

  * 定义有依赖模块
  
  ```js
  define(function(require,exports,module){
      //引入依赖模块(同步)
      let module2=require(url)
      //引入依赖模块(异步)
      require.async(url,function(m3){})//m3是形参,注册成功注入回调函数函数
      //暴露模块
      exports.xxx=value
    })
  ```

## ES6

1. 导出模块`export`
2. 导入模块`import`

### 分别暴露

* 暴露模块
  
```js
export function fo(){
  console.log("foo")
}

export function ba(){
  console.log("foo")
}

export let msg="hh"
```

* 引入模块

```js
import {fo,ba,msg} from "url"
fo()
ba()
```

### 统一暴露

* 暴露模块

```js
function foo(){
  console.log("foo")
}

function bar(){
  console.log("foo")
}

export {foo ,bar}
```

* 引入模块
  
```js
import {foo,bar} from "url"
foo()
bar()
```

* 可以使用`*`整体加载到某个对象上

```js
import * as test from "url"
test.foo()
test.bar()
```

### 默认暴露

> 可以暴露任意数据类型

* 注意:<span style="color:red">不能写多个```export default```</span>

* 暴露模块
  
```js
export default { 
  msg:"桃桃",
  test(){
    console.log("桃桃")
  }
}
```

* 引入模块

```js
import modules from "./03默认暴露"
modules.test()
modules.msg
```

### import()

> `require()`是动态加载,即异步加载,而import是静态执行,处于代码的最顶层
>>`import()`函数实现了异步加载,返回一个`promise`对象,加载获取的值为then的回调参数

```js
function foo(){
  console.log("foo")
}
function bar(){
  console.log("foo")
}
export {foo ,bar}
```

* 加载动态模块(注意要开启server)

```js
async function main(){
  const {foo,bar} = await import("./myModule.js")
  foo()
  bar()
}
main()
```

### 导入断言

#### 静态导入

 ```js
 import json from "./package.json" assert {type: "json"}
 // 导入 json 文件中的所有对象
 ```

#### 动态导入

 ```js
 const json = 
      await import("./package.json", { assert: { type: "json" } })
 ```

# 使用 npm

## 关于代理

> 设置本地代理

```shell
# 设置代理
npm config set https-proxy http://127.0.0.1:7890
npm config set proxy http://127.0.0.1:7890
# 删除代理
npm config delete https-proxy
npm config delete proxy
```

>设置 npm 仓库

```shell
npm config set registry=http://registry.npmjs.org
```

## module 导入导出

> 所有包的版本都支持 main 字段，但它的功能是有限的，exports 如果存在，那么它将会替代 main 字段。

exports 可以为每个环境定义不同的入口，不管是 cjs 还是 esm。它可以导出文件甚至也可以导出整个文件夹

```json
{
  "name": "mod",
  "exports":{
    ".": "./lib/index.js",
    "./lib/*": "./lib/*.js"
  }
}
```

* 如果导出的是整个目录，则不能以简单的包名直接将其导入 `import name from mod`，我们需要使用它的完整路径。此时我们需要使用完整的路径，如下

```js
import feature from "mod/lib/feature.js"
```

### 导出

> 如果使用 exports 字段时，还有 main，那么只会读取 exports 字段

```json
{
  "main": "./index.js",
  "exports": "./index.js"
}
```

> exports 还可以导出子路径中的模块

```json
{
  "name": "mod",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./sub": "./src/sub.js"
  }
}
```

* 只有在 exports 中定义的子路径才能被导入

```js
import sub from "mod/sub"
```

> 当 "." 是唯一的导出，"exports" 字段为这种情况提供了语法糖

```json
{
  "exports": {
    ".": "./dist/index.js"
  }
}
// 可以改写为

{
  "exports": "./dist/index.js"
}
```

> 条件导出。根据导出包的格式不同而设置的情况

```json
{
  "exports":{
     "imports": "./dist/index.mjs",
     "require": "./dist/index.cjs"
  }
}
```

exports 默认支持以下字段

* `import`: 当包通过 `import` 或 `import()` 加载，或通过 es 模块加载器的任何顶层导入或解析操作加载时，该条件就会匹配。
* `require`: 当包通过 `require()` 加载时匹配。被引用的文件应该可以用 `require()` 加载，尽管该条件与目标文件的模块格式无关。预期的格式包括 CommonJS、JSON 和本地插件。由于 require 和 import 互斥，所以 require 不能加载 es 的模块
* `node`: 匹配任何 Node.js 环境。可以是 CommonJS 或 ESM 模块文件。这个条件应该总是在 import 或 require 之后。
* `default`: 默认的降级条件。可以是一个 CommonJS 或 ESM 模块文件. 这个条件应该总是排在最后

```json
{
  "exports": {
    ".": {
      "import":"./dist/index.mjs",
      "require":"./dist/index.cjs",
      "node": "./dist/ployfill.js",
      "default": "./dist/default.js"
    }
  }
}
```

### 自引用

>在包内部，package.json 中 `exports` 定义的值可以被用作包内引用的名称

```json
// package.json
{
  "name": "pro",
  "exports": {
    ".": "./dist/index.mjs",
    "./foo": "./dist/foo.js"
  }
}
```

* 无论是 require 还是 es 模块都可以自引用

```js
const foo = require("pro/foo")

//es
import foo from "pro/foo"
```

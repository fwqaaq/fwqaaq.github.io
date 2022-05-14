---
title: stream
date: 2022-05-14 19:27:26
author: Jack-zhang
categories: stram
tags:
   - JS
   - node
summary: node中的stream机制
---

## Stream

> 流(stream)是抽象的数据接口,流实现了`EventEmitter`这个接口,并且node中的很多对象实现了流

* 在读取大文件的时候,完全读完文件再响应大量用户并发请求的时候,程序可能会消耗大量的内存,可能会造成用户连接缓慢的问题

   ```js
   //mjs
   import http from "http"
   import * as fs from "fs"
   const server = http.createServer((req, res) => {
     const filename = new URL("data.txt", import.meta.url)
     let stream = fs.createReadStream(filename)
     stream.pipe(res)
   })
   server.listen(8000, () => {
     console.log("server is running")
   })
   ```

  * stream可以不需要把文件全部读取再返回,而是一边读取一边返回,数据通过管道流动给客户端,减轻服务器压力

![ ](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/10/16bdbb113be0341a~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

* stream整个流转过程包括`source`,`dest`,还有连接二者的管道`pipe`(stream核心)

### source

>stream常见的三种来源

1. 从控制台输入
2. http请求中的request
3. 读取文件

> process.stdin

* 当在控制台输入`hello world`时

```js
process.stdin.on("data", data => {
  console.log("stream=>", data)
  console.log(`stream=>${data}`)
})
// stream=> <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64 0d 0a>
// stream=>hello world
```

* 控制台输入的任何内容都会被`data`事件监听到,`process.stdin`是一个`stream`对象,data是用来监听数据传入的一个自定义函数

### pipe

>在`source`和`dest`之间有一个来凝结的管道`pipe`,他的基本语法是`source.pipe(dest)`,`source`和`dest`就是通过pipe管道,让数据从`source`流向`dest`

### dest

>stream常见的三种输出方式

1. 输出控制台
2. http请求中的response
3. 输出文件

* stream的应用场景主要是处理`IO`流.并且`http请求`和`文件操作`都属于IO操作
* stream的本质就是避免IO操作过大,硬件开销太多,因此将IO分批分段进行操作,让数据像水管一样流动

>get请求中应用stream

```js
import http from "http"
import * as fs from "fs"
const server = http.createServer((req, res) => {
  if (req.method === "GET") {//默认是get请求
    const filename = new URL("data.txt", import.meta.url)
    let stream = fs.createReadStream(filename)
    stream.pipe(res)
  }
})
server.listen(8000, () => {
  console.log("server is running")
})
```

* `response`也是一个stream对象,就是接受收数据的`dest`
* `request`是source,数据的源头

>在文件中拷贝数据

   ```js
   import * as fs from "fs"
   
   const filenameOne = new URL("data.txt", import.meta.url)
   const filenameTwo = new URL("data-copy.txt", import.meta.url)
   
   const readStream = fs.createReadStream(filenameOne)
   const writeStream = fs.createWriteStream(filenameTwo)
   
   readStream.pipe(writeStream)
   
   readStream.on("end", () => {
     console.log("readStream end")
   })
   ```

* 首先创建一个可读数据流`readStream`,一个可写数据流`writeStream`,然后直接通过`pipe`管道把数据直接传过去

### Stream种类

* `Readable Stream` 可读数据流
* `Writeable Stream` 可写数据流
* `Duplex Stream` 双向数据流,可以同时读和写
  * `Duplex Stream`是双向的,既可以读又可以写.`Duplex Stream`同时实现了`Readable`和`Writeable`接口
  * 包括`tcp sockets`,`zlib streams`,`crypto streams`
* `Transform Stream`转换数据流,可读可写,同时可以转换/处理数据(不常用)

>stream 的弊端

1. 使用`rs.pipe(ws)`方式来写文件,不是将rs的文件追加到ws文件之后,而是将rs的内容覆盖ws
2. 已结束/关闭 的流不能重复使用,必须重新创建数据流
3. `pipe`方法返回的是目标数据流,例如`a.pipe(b)`返回的是b,因此监听事件需要主义监听对象是否正确
4. 如果需要监听多个数据流,同时又使用`pipe`方法

```js
data
  .on('end', function() {
      console.log('data end');
  })
  .pipe(a)
  .on('end', function() {
      console.log('a end');
  })
  .pipe(b)
  .on('end', function() {
      console.log('b end');
  })
```

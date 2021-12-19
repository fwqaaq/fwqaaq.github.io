---
title: nodejs及网络请求
date: 2021-9-20 19:47:30
author: Jack-zhang
categories: JS
tags:
   - JS
   - node
summary: nodejs基础
---
## nodejs核心模块

### fs读写模块

* 读取文件
* 使用```fs.readFile```用来读取文件
  1. 第一个读取文件的路径
  2. 第二个参数是一个可选参数,字符编码转换:例如:`utf-8`
  3. 第三个参数是一个回调函数
     * 成功 ```data:数据```,```error:null``
     * 失败 ```data:undefined```,```error:错误对象```

```js
const fs=require("fs")
fs.readFile("./data/hello.txt",function(error,data){
  if(error){
    console.log(error)
    return
  }
  console.log(data.toString())
})
```

* 写入文件
* 使用```fs.writeFile```用来写入文件

 >第一个参数是文件路径,第二个参数是文件内容,第三个参数是回调函数  

```js
const fs=require("fs")
fs.writeFile("./data/helloworld.txt","dajiahao",function(error){
  if(error){
    console.log(error)
  }else{
    console.log("成功")
  }
})
```

* 读目录
* 使用```fs.readDir```

```js
const fs=require("fs")
fs.readDir("url",function(error,files){
  if(error){
    console.log(error)
    return
  }
  console.log(files)
})
```

### path模块

* `path.basename`
  * 获取一个路径的文件名(默认包含扩展名)
* `path.dirname`
  * 获取一个路径中的目录部分
* `path.extname`
  * 获取一个路径中的扩展名部分
* `path.parse`
  * 把一个路径转换为对象
    * root:根路径
    * dir:目录
    * base:包含后缀名的文件名
    * ext:后缀名
    * name:不包含后缀名的文件名
* `path.join`
  * 当你需要进行路径拼接的时候,推荐使用这个方法
* `path.isAbsolute`:判断一个路径是否为绝对路径  

### http

> http模块,用来创建编写服务器:提供服务,发请求,接收请求,处理请求

1. 创建一个Server实例
2. 注册request请求事件
3. 绑定端口号,启动服务器

* 当客户端请求过来,就会自动触发`request`请求事件,然后执行第二个参数(回调函数函数)
* request请求事件处理函数.接收两个参数
  * request: 请求对象

      请求对象可以用来获取客户端的的一些请求信息.例如请求路径
  * response: 响应对象

      响应对象可以用来给客户端发送响应消息

* `response` 对象的write方法,可以用来给客户端响应数据
* `write`可以使用多次,但是最后一定要用end来结束响应,否则客户端会一直等待
  
* 响应体的两种写法
  1. `write&end`

  ```js
  response.write("hello")
  response.end()//结束响应 */
  ```
  
  2. ```end```:`response.end("hello")`发送响应的同时,直接结束

* Tips:响应内容只能是二进制或者字符串
  1. 如果要响应数字,对象,数组,布尔值,要用JSON.stringify()
  2. ```response.end(JSON.stringify())```

```js
const http=require("http")
//使用http.createServer()方法创建一个web服务器
const server=http.createServer()

server.on("request",function(request,response){
  console.log("收到请求",request.url)


  if(request.url==="/"){
    response.end("hi")
  }else if(request.url==="/login"){
    response.end("hao")
  }else{
    response.end("404")
  }
})
server.listen(3000,function(){
  console.log("3000端口号成功启动")
})
```
  
### url模块

* `parse()`:解析地址,第一个参数为地址,第二个可选,默认为false,为true时,query查询参数为对象
  * ```pathname```:不带查询参数的请求路径
    * 例如: 请求路径为`/plugins?name=jack&password=123456`
    * 那么`pathname=/plugins`

```js
const url=require("url")
let u=url.parse("https://www.baidu.com/?tn=49055317_4_hao_pg",true)
console.log(u)
```

```js
  protocol: 'https:',
  slashes: true,
  auth: null,
  host: 'www.baidu.com',
  port: null,
  hostname: 'www.baidu.com',      
  hash: null,
  search: '?tn=49055317_4_hao_pg',
  query: [Object: null prototype] { tn: '49055317_4_hao_pg' },
  pathname: '/',
  path: '/?tn=49055317_4_hao_pg',
  href: 'https://www.baidu.com/?tn=49055317_4_hao_pg'
```

### 模块化

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

* 原理解析(理解)
  * `exports`是`module.exports`的一个引用
  
  ```js
  exports.foo=function(){
    console.log("lj")
  }

  //等价于
  module.exports.foo=function(){
    console.log("lj")
  }
  console.log(exports===module.exports)//true
  ```

* 内部暴露的是:`return module.exports`
  * <span style="color:red">默认指向同一个对象,最好不要混用</span>

### 其他成员

* `__dirname`和`__filename`

* `__dirname`:可以获取当前文件模块所属模块的绝对路径
* `__filename`:可以获取当前文件的绝对路径

## 服务端与客户端渲染

> 定义:

  1. 服务端渲染：DOM树在服务端生成,然后返回给前端.
  2. 客户端渲染（SSR）：前端去后端取数据生成DOM树.

* 服务端渲染的优点：
   1. 尽量不占用前端的资源,前端这块耗时少,速度快.
   2. 有利于SEO优化,因为在后端有完整的html页面,所以爬虫更容易爬取信息.

* 服务端渲染的缺点：
   1. 不利于前后端分离,开发的效率降低了.
   2. 对html的解析,对前端来说加快了速度,但是加大了服务器的压力.

* 客户端渲染的优点：
   1. 前后端分离,开发效率高.
   2. 用户体验更好,我们将网站做成SPA（单页面应用）或者部分内容做成SPA,当用户点击时,不会形成频繁的跳转.

* 客户端渲染的缺点：
   1. 前端响应速度慢,特别是首屏,这样用户是受不了的.
   2. 不利于SEO优化,因为爬虫不认识SPA,所以它只是记录了一个页面.

* 服务端和客户端渲染的区别：
   1. 二者本质的区别：是谁来完成了html的完整拼接,服务端渲染是在服务端生成DOM树,客户端渲染是在客户端生成DOM树.
   2. 响应速度：服务端渲染会加快页面的响应速度,客户端渲染页面的响应速度慢.
   3. SEO优化：服务端渲染因为是多个页面,更有利于爬虫爬取信息,客户端渲染不利于SEO优化.
   4. 开发效率：服务端渲染逻辑分离的不好,不利于前后端分离,开发效率低,客户端渲染是采用前后端分离的方式开发,效率更高,也是大部分业务采取的渲染方式.

* 直观的区分服务端渲染和客户端渲染：
  * 源码里如果能找到前端页面中的内容文字,那就是在服务端构建的DOM,就是服务端渲染,反之是客户端渲染.

* 应该使用服务端渲染还是客户端渲染：
   1. 我们要根据业务场景去选择渲染的方式.
   2. 如果是企业级网站,主要功能是页面展示,它没有复杂的交互,并且需要良好的SEO,那我们应该使用服务端渲染.
   3. 如果是后台管理页面,交互性很强,它不需要考虑到SEO,那我们应该使用客户端渲染.
   4. 具体使用哪种渲染方式也不是绝对的,现在很多网站使用服务端渲染和客户端渲染结合的方式：首屏使用服务端渲染,其他页面使用客户端渲染.这样可以保证首屏的加载速度,也完成了前后端分离.

## HTTP协议

### 请求报文

* 编码图
![http请求报文](http请求报文.jpg)
* 结构图
![请求报文](请求报文.png)

> 一个请求中会附带一个请求包头,包含一些“隐形”信息.语言、浏览器、操作系统和硬件设备.服务端可以根据这些信息再去生成有正对性的数据.

* HTTP请求报文由<span style="color:red">请求行(request line),请求头部(header),空行和请求数据(请求体)</span>4个部分组成
  * 请求行:请求方法字段,url字段和HTTP协议版本
    * 例如: `GET /index.html HTTP/1.1`
    * GET请求方法
      * GET方法的特点
        * GET请求能够被缓存
          * GET请求会保存在浏览器的浏览记录中
          * 以GET请求的URL能够保存为浏览器书签
          * GET请求有长度限制
          * GET请求主要用于获取数据
    * GET请求参数
      * 例如:<https://www.bilibili.com/video/BV1UE411H71P?p=30&spm_id_from=pageDriver>
      * 其中`?p=30&spm_id_from=pageDriver`为get的请求参数,用req.query即可拿到
    * POST
      * POST方法的特点
        * POST请求不能被缓存下来
        * POST请求不会保存在浏览器浏览记录中
        * 以POST请求的URL无法保存为浏览器书签
        * POST请求没有长度限制
        * 请求头(key value的形式):
  * 请求头
    * `User-Agent`:产生请求的浏览器类型
    * `Accept`:客户端可以接收的内容类型列表
    * `Host`:主机地址
    * `Referer`:表示这个请求是从哪个URL过来的
    * `Cache-Control`:对缓存进行控制:如一个请求希望响应返回的内容在客户端要被缓存一年，或不希望被缓存就可以通过这个报文头达到目的。 
    * `Cookie`:<span style="color:red">客户端</span>的Cookie就是通过这个报文头属性传给服务端
      * `Cookie: $Version=1; Skin=new;jsessionid=5F4771183629C9834F8382E23BE13C4C`
    * 其它属性: <http://en.wikipedia.org/wiki/List_of_HTTP_header_fields>
  * 请求数据(请求体)
    * 一般 <span style="color:red">GET请求没有主体内容</span>,但 `POST` 请求是有的.
      * get方法会将数据拼接在url后面,传递参数受限
      * post方法会把数据以key,value的形式发送请求
    * POST 请求体最常见的媒体类型是 `application/x-www-form-urlendcoded`,是键值对集合的简单编码,用 & 分隔（基本上和查询字符串的格式一样）.
    * 如果 POST 请求需要支持文件上传,则媒体类型是 `multipart/form-data` ,它是一种更为复杂的格式.
    * 最后是 AJAX 请求,它可以使用 application/json
  * 空行:
    * 发送回测回复和换行符,通知服务器以下不再有请求头

* 例如请求数据：

标号 | 请求报文
---|-----
1 | GET/sample.jspHTTP/1.1
2 | Accept:  image/gif.image/jpeg,/
3 | Accept-Language: zh-cn
4 | Connection:  Keep-Alive
5 | Host: | localhost
6 | User-Agent:  Mozila/4.0(compatible;MSIE5.01;Window NT5.0)
7 | Accept-Encoding: gzip,deflate
8 |
9 | username=jinqiao&password=1234

* 第一行为http请求行，包含方法，URL 和http版本
* 2-7为请求头，包含浏览器，主机，接受的编码方式和压缩方式
* 第8行表示一个空行 表示请求头结束 这个空行是必须的
* 第9行是数据体，比如是需要查询的信息。

### 响应报文

* 编码图
![响应报文](响应报文.jpg)

>服务器响应回传一些浏览器没必要渲染和显示的信息,通常是元数据和服务器信息.它告诉浏览器正在被传输的内容类型（网页、图片、样式表、客户端脚本等）.

* http响应体由三部分组成：
  * http响应由三个部分组成分别是<span style="color:red">状态行，响应头，响应正文</span>
  * 状态行是由：`HTTP-Version+Status-Code+Reason-Phrase`
    * `HTTP-Version`表示服务器HTTP协议的版本；`Status-Code`表示服务器发回的响应状态代码；`Reason-Phrase`表示状态代码的文本描述。`Status-Code`由三位数字组成，第一个数字定义了响应的类别，且有五种可能取值。
  * 比如：HTTP/1.1 200 ok
    * 分别表示http版本 + 状态码 + 状态代码的文本描述

* 状态码描述
  * 1xx：指示信息--表示请求已接收，继续处理。
  * 2xx：成功--表示请求已被成功接收、理解、接受。
  * 3xx：重定向--要完成请求必须进行更进一步的操作。
  * 4xx：客户端错误--请求有语法错误或请求无法实现。
  * 5xx：服务器端错误--服务器未能实现合法的请求。

* 常见状态代码、状态描述的说明如下。
  * `200 OK`：客户端请求成功。
  * `400 Bad Request`：客户端请求有语法错误，不能被服务器所理解。
  * `401 Unauthorized`：请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用。
  * `403 Forbidden`：服务器收到请求，但是拒绝提供服务。
  * `404 Not Found`：请求资源不存在，举个例子：输入了错误的URL。
  * `500 Internal Server Error`：服务器发生不可预期的错误。
  * `503 Server Unavailable`：服务器当前不能处理客户端的请求，一段时间后可能恢复正常，举个例子：HTTP/1.1 200 OK（CRLF）。

#### 常见的响应报文头属性

**Cache-Control**:响应输出到客户端后，服务端通过该报文头属告诉客户端如何控制响应内容的缓存

* 例如:`Cache-Control: max-age=3600`

**Set-Cookie**:服务端可以设置客户端的Cookie，其原理就是通过这个响应报文头属性实现的 

* 例如:`Set-Cookie: UserID=JohnDoe; Max-Age=3600; Version=1`

**Content-type**:在响应体中设置

1. 服务端默认发送的数据,默认是utf-8的内容
2. 浏览器不知道服务器端响应的是utf-8的编码,会默认使用当前操作系统的默认编码区解析
3. 中文默认是gbk
4. 在http协议中,```Content-type```是用来告诉对方,服务端发送的数据内容是什么类型
  
* 语法:```response.setHeader("Content-type","text/plain;charset=utf-8")```

* 注意:在html中使用```<meta charset="UTF-8">```也可以转换编码
  
* `Content-type`的类型

text/html | HTML格式
----------|-------
text/plain | 纯文本格式
text/xml | XML格式
text/css | .css
image/gif | gif图片格式
image/jpeg | jpg图片格式
image/png | png图片格式
application/x-javascript | .js
audio/mp3 | .mp3
video/mpeg4 | .mp4
application/pdf | .pdf

**其它响应报文头属性**:<http://en.wikipedia.org/wiki/List_of_HTTP_header_fields>  

### 请求对象

>请求对象（通常传递到回调方法,这意味着你可以随意命名,通常命名为 req 或 request ）的生命周期始于 Node 的一个核心对象 `http.IncomingMessage` 的实例.

* Express 添加了一些附加功能.（除了来自 Node 的 `req.headers` 和`req.url` ,所有这些方法都由 Express 添加）.

* `req.params`
  * 一个数组,包含命名过的路由参数.

* `req.param(name)`
  * 返回命名的路由参数,或者 GET 请求或 POST 请求参数.(建议你忽略此方法)

* `req.query`
  * 一个对象,包含以键值对存放的查询字符串参数（通常称为 GET 请求参数）

* `req.body`
  * 一个对象,包含 POST 请求参数.这样命名是因为 POST 请求参数在 REQUEST 正文中传递,而不像查询字符串在 URL 中传递.要使 req.body 可用,需要中间件能够解析请求正文内容类型.

* `req.route`
  * 关于当前匹配路由的信息.主要用于路由调试.

* `req.cookies/req.singnedCookies`
  * 一个对象,包含从客户端传递过来的 cookies 值.

* `req.headers`
  * 从客户端接收到的请求报头.

* `req.accepts([types])`
  * 一个简便的方法,用来确定客户端是否接受一个或一组指定的类型（可选类型可以是单个的 MIME 类型,如 `application/json` 、一个逗号分隔集合或是一个数组）,假定浏览器默认始终接受 HTML.

* `req.ip`
  * 客户端的 IP 地址.

* `req.path`
  * 请求路径（不包含协议、主机、端口或查询字符串）.

* `req.host`
  * 一个简便的方法,用来返回客户端所报告的主机名.这些信息可以伪造,所以不应该用于安全目的.

* `req.xhr`
  * 一个简便属性,如果请求由 Ajax 发起将会返回 true .

* `req.protocol`
  * 用于标识请求的协议（ http 或 https ）.

* `req.secure`
  * 一个简便属性,如果连接是安全的,将返回 true .等同于 `req.protocol==='https'` .

* `req.url/req.originalUrl`
  * 这些属性返回了路径和查询字符串（它们不包含协议、主机或端口）.

* `req.url`
  * 若是出于内部路由目的,则可以重写,但是 req.orginalUrl 旨在保留原始请求和查询字符串.

* `req.acceptedLanguages`
  * 一个简便方法,用来返回客户端首选的一组（人类的）语言.这些信息是从请求报头中解析而来的.

### 响应对象

> 响应对象（通常传递到回调方法,这意味着你可以随意命名它,通常命名为 res 、 resp 或response ）的生命周期始于 Node 核心对象 `http.ServerResponse` 的实例.

* **Express** 添加了一些附加功能.下面列举了响应对象中最有用的属性和方法（所有这些方法都是由 Express添加的）.

* **res.status(code)**
  * 设置 HTTP 状态代码.Express 默认为 200（成功）,所以你可以使用这个方法返回状态404（页面不存在）或 500（服务器内部错误）.

* **res.set(name,value)**
  * 设置响应头.这通常不需要手动设置.

* **res.cookie（name,vaue,[options]）,res.clearCookie(name,[options])**
  * 设置或清除客户端 cookies 值.需要中间件支持.

* **res.redirect([status],url)**
  * 重定向浏览器.默认重定向代码是 302（建立）.通常,你应尽量减少重定向,除非永久移动一个页面,这种情况应当使用代码 301（永久移动）.

* **res.send(body),res.send(status,body)**
  * 向客户端发送响应及可选的状态码.Express 的默认内容类型是 `text/html` .如果你想改为 `text/plain` ,需要在 res.send 之前调用`res.set(‘Content-Type’,’text/plain')` .如果 body 是一个对象或一个数组,响应将会以 JSON 发送（内容类型需要被正确设置）,不过既然你想发送 JSON,我推荐你调用 res.json .

* **res.json(json),res.json(status,json)**
  * 向客户端发送 JSON 以及可选的状态码.

* **res.jsonp()**
  * 发送带有JSONP支持的JSON格式数据响应

* **res.type(type)**
  * 一个简便的方法,用于设置`Content-Type` 头信息.基本上相当于 `res.set(‘Content-Type’,’type’)` ,只是如果你提供了一个_没有斜杠_的字符串,它会试图把其当作文件的扩展名映射为一个互联网媒体类型.比如, `res.type('txt')` 会将 Content-Type 设为`text/plain` .

* **res.format(object)**
  * 这个方法允许你根据接收请求报头发送不同的内容.这是它在 API 中的主要用途.这里有一个非常简单的例子：

```js
res.format({'text/plain':'hi there','text/html':'<b>hi there</b>'})
```

* **res.attachment([filename]),res.download(path,[filename],[callback])**

  * 这两种方法会将响应报头 `Content-Disposition` 设为 `attachment` ,这样浏览器就会选择下载而不是展现内容.你可以指定 filename 给浏览器作为对用户的提示.用 re`s.download` 可以指定要下载的文件,而 `res.attachment` 只是设置报头.另外,你还要将内容发送到客户端.

* **res.sendFile(path,[option],[callback])**
  * 这个方法可根据路径读取指定文件并将内容发送到客户端.使用该方法很方便.使用静态中间件,并将发送到客户端的文件放在公共目录下.

* **res.links(links)**
  * 设置链接响应报头.这是一个专用的报头,在大多数应用程序中几乎没有用处.

* **res.locals,res.render(view,[locals],callback)**
  * `res.locals` 是一个对象,包含用于渲染视图的默认上下文. `res.render` 使用配置的模板引擎渲染视图, `res.render`的默认响应代码为 200,使用 `res.status` 可以指定一个不同的代码.

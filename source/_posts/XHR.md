---
title: XHR
date: 2022-01-09 21:26:56
author: Jack-zhang
categories: JS
tags:
   - JS
   - xhr
summary: 原生ajax技术
---

## 跨域问题

> 只能访问同源URL,(域名相同,端口相同,协议相同).如果发送请求的url与页面有任何方面有所不同,则会抛出安全错误

### CORS

>使用自定义的HTTP头部允许浏览器和服务器相互了解,以确实请求或相应应该成功还是失败

* 例如GET或者POST请求,没有自定义头部,而且请求体是`text/plain`类型发送请求会包含额外的头部Origin.
  * `Origin`包含发送请求页面的源(协议,域名,端口):`Origin:https://www.baidu.com`
  * **服务器**如果要响应请求`Access-Control-Allow-Origin`设为`'*'`或者**源地址**(例如:`https://www.baidu.com`)

>CORS会通过一种叫预检请求的服务器验证机制,允许使用自定义头部,除GET,POST之外的方法,以及不同请求体内容的类型.

1. 请求会使用OPTIONS方法发送并包含以下头部
   * `Origin`: 源
   * `Access-Control-Request-Method`:请求希望使用的方法
   * `Access-Control-Request-Headers`:(可选)要使用`,`分隔的自定义头部列表
2. 服务器接收后会在响应中发送如下头部和浏览器沟通
   * `Origin`: 源
   * `Access-Control-Request-Method`:请求希望使用的方法
   * `Access-Control-Request-Headers`:服务器允许使用的头部
   * `Access-Control-Max-Age`:缓存预检请求的秒数

### 解决跨域

>默认情况下,跨域请求不提供凭据(cookie,HTTP认证和SSL证书等)

* <span style="color:red">如果要发送Cookie,`Access-Control-Allow-Origin`就不能设为星号(`*`)，必须指定明确的、与请求网页一致的域名</span>

1. 服务器端
   * `Access-Control-Allow-Credentials:true`表明服务器端允许带凭据的请求
   * `Access-Control-Allow-Origin:源`(例如:<https://www.baidu.com>)
2. 客户端
   * 设置`withCredentials`为`true`表明请求会发送凭据

## 理解原生Ajax

> ajax本质是在 HTTP 协议的基础上以异步的方式与服务器进行通信.
>>异步：指某段程序执行时不会阻塞其它程序执行，其表现形式为程序的执行顺序不依赖程序本身的书写顺序，相反则为同步.

* 使用`XMLHttpRequest` 对象的 `open()` 和 `send()` 方法

```js
var xhr = new XMLHttpRequest()
xhr.open('GET', 'url', true)
xhr.send()
xhr.onload=function(){
  console.log(xhr.responseText)
}
```

| 方法                     | 描述                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `open(method,url,async)` | 规定请求的类型、URL 以及是否异步处理请求,method：请求的类型.url：文件在服务器上的位置.async：true（异步）或 false（同步） |
| `send(string)`           | 将请求发送到服务器。string：适用于 POST 请求                                                                              |

* 其它的属性

| 属性                      | 说明                                                                   |
| ------------------------- | ---------------------------------------------------------------------- |
| `status`                  | 200: "OK"                                                              |
| `responseText`            | 获得字符串形式的响应数据。                                             |
| `responseXML`             | 获得 XML 形式的响应数据。                                              |
| `setRequestHeader`        | 设置请求头                                                             |
| `readyState`              | 存有 XMLHttpRequest 的状态。请求发送到后台后，状态会从 0 到 4 发生变化 |
| `onreadystatechange`      | 绑定readyState改变监听                                                 |
| `reponseType`             | 指定响应函数的数据类型，如果是json，得到响应后自动解析响应体函数       |
| `response`                | 响应体数据，类型取决于responseType的指定                               |
| `timeout`                 | 指定请求超时时间，默认为0代表没有限制                                  |
| `ontimeout`               | 绑定超时的监听                                                         |
| `onerror`                 | 绑定请求网络错误的监听                                                 |
| `abort()`                 | 中断请求                                                               |
| `getResponseHeader(name)` | 获取指定名称的响应头值                                                 |
| `getAllResponseHeaders()` | 获取所有的响应头组成的字符串                                           |

## Fetch

>能够执行XHR的所有任务,并且能够在Web工作者线程等现代Web工具中使用,提供拦截,重定向和修改通过fetch()生成的请求接口
>>**fetch() 方法的参数与 Request() 构造器是一样的**

* `fetch`一定是异步的,天生支持promise,接收两个参数
  1. 第一个参数:源.是必须的(例如`https://www.baidu.com`),只传第一个参数,默认是get请求
  2. 第二个参数是<span style="color:red">可选的</span>,是一个对象

```js
fetch("https://www.zhihu.com/roundtable/2021year",{method:'GET',mode:'no-cors'}).then(
  response =>console.log(response)
)
```

* mode:用于指定请求模式.以及客户端读取多少响应
  1. cors:允许遵守CORS的跨域请求.(非简单跨域,需要预检)
  2. no-cors:允许不需要发送预检请求的跨域请求.(同源请求或者简单跨域)
  3. same-origin:任何跨域请求都不允许发送

>以上就不一一介绍
>>参考:<https://developer.mozilla.org/zh-CN/docs/Web/API/fetch>

### fetch跨域问题

>从不同源请求资源,响应要包含CORS头部才能保证浏览器收到响应.<span style="color:red">如果我们测试用的别人的接口,使用`mode:cors`是不会成功的</span>

* 如果代码不需要服务器响应,可以设置`mode:'no-cors'`

### Headers对象

> Headers对象是发送请求和入站响应头部的容器.并且都可以通过`Request.prototype.headers`修改属性

* Headers和Map极其相似.都有`set()`,`has()`,`delete()`方法

```js
let h = new Headers()

h.set("foo","bar")
console.log(h.has("foo"))//true
```

### Request对象

```js
let r= new Request(url,init)
```

> 与之前的fetch是一模一样的.如果init中没有设置的值,会使用默认值

| 键             | 值                                       |
| -------------- | ---------------------------------------- |
| bodyUesd       | false                                    |
| cache          | "default"                                |
| credentials    | "same-origin"                            |
| destination    | ""                                       |
| headers        | Headers {}                               |
| integrity      | ""                                       |
| keepalive      | false                                    |
| method         | "GET"                                    |
| mode           | "cors"                                   |
| redirect       | "follow"                                 |
| referrer       | "about:client"                           |
| referrerPolicy | ""                                       |
| signal         | AbortSignal {aborted:false,onabort:null} |
| url            | "\<current URL>"                         |

> 克隆Request对象:构造函数或者`clone()`

* 使用构造函数第一个请求体会被标记为已使用

```js
let r = new Request("http://www.baidu.com")

//第一种:如果传入init对象值会覆盖源对象中同名的值
let r1 = new Request(r,{method:"POST"})

console.log(r.bodyUsed)//true
console.log(r1.bodyUsed)//fasle
```

* 使用`clone()`不会将任何请求体标记为已使用

```js
let r = new Request("http://www.baidu.com",{method:"POST"})

let r2 = r.clone()

console.log(r.bodyUsed)//false
console.log(r2.bodyUsed)//fasle
```

> 在fetch中使用request对象:与clone()方法一样,fetch()不能用使用过的Request对象来发送请求

```js
let r = new Request("http://www.baidu.com",{method:"POST"})

//第一种情况
r.text()
fetch(r)//TypeError

//第二种情况
fetch(r)
fetch(r)//TypeError
```

* 并且fetch()的`init`同样可以覆盖Request的对象

```js
let r = new Request("http://www.baidu.com",{method:"POST"})
fetch(r.clone())
fetch(r,{method:"POST",body:"body"})
```

### Response对象

>产生`Response`对象主要方式是调用`fetch()`,他会返回一个promise,这个`Response`对象代表实际HTTP的响应

```js
fetch('https://foo.com').then(
  response=>{
    console.log(response)
  }
)
```

* 初始化`Response`对象
  * body:(...)
  * bodyUsed:false
  * headers:Headers {}
  * ok:true
  * redirected:false
  * status:200
  * statusText:"OK"
  * type:"basic"
  * url:"https://foo.com"

> Response类有两个静态方法`Response.error()`和`Response.redirect()`

* **Response.redirect()**:接收一个url和重定向状态码,返回重定向Response对象
* 提供的状态码必须对应重定向,反则抛出错误

```js
Response.redirect("https://foo.com",301)
```

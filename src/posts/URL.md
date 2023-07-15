---
title: URL
date: 2022-03-28 23:46:36
categories: JavaScript
tags:
   - TypeScript
   - JavaScript
summary: 浏览器原生的URL方法
---

## URL

> URL用于解析,构造,规范化和编码urls.如果浏览器不支持`new URL()`构造函数.可以使用`new window.URL()`

### new URL()

> 构造函数:new URL(url[,base])

- `url`:表示绝对或者相对的url.如果是绝对的url,无论baseurl有没有参数都会被忽略.如果是相对的url,则参数会添加到baseurl后
- `base`:可选的,表示基准的url.只有url是带协议才可以生效.<span style="color:red">否则报一个TypeError</span>

```js
let baseurl = "https://www.baidu.com/laji";

//忽略参数
new URL("/zhenlan", baseurl); //https://www.baidu.com/zhenlan

//TypeError
new URL("www.baidu.com");

new URL("https://www.baidu.com"); //https://www.baidu.com
```

> 属性

- `hash`:返回包含URL标识中的'#'和fragment标识符
- `host`:返回一个主机信息.即`hostname`,如果URL接口有端口号(如果是默认端口号,则不会包含),也会包含端口号
- `hostname`:不包含端口号的主机信息
- `href`:返回一个完整的url
- `origin`:只读属性.
  - 如果是`http`或者是`https`,返回`协议名+'://'+域名+':'+端口号`
  - 如果是ftp协议,视浏览器而定
  - 如果是`blob:`协议,返回的是`blob:`紧跟的源地址
    - `"blob:https://mozilla.org"`返回`https://mozilla.org`
- `pathname`返回一个初始`/`和URL的路径(如果没有路径,则为空字符串)
- `port`:如果url中包含明确的端口信息,则返回一个端口号.否则返回`""`
- `protocol`:返回一个url的协议值
- `search`:返回一个查询字符串.`?`紧跟的
- `searchParams`:返回一个[URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams).这个对象包含当前URL中解码后的GET查询参数

```js
const url = new URL(
  "https://developer.mozilla.org:3300/en-US/docs/Web/API/URL/href?q=123#Examples",
);
const hash = url.hash; //#Examples
const host = url.host; //developer.mozilla.org:3300
const host = url.hostname; //developer.mozilla.org
const host = url.href; //https://developer.mozilla.org:3300/en-US/docs/Web/API/URL/href#Examples
const origin = url.origin; //https://developer.mozilla.org
const pathname = url.pathname; ///en-US/docs/Web/API/URL/href
const port = url.port; //3300
const protocol = url.protocol; //https
const search = url.search; //?q=123
```

- `username`:包含域名前指定的username
- `password`:返回域名之前指定的密码

```js
const url = new URL(
  "https://anonymous:flabada@developer.mozilla.org/en-US/docs/Web/API/URL/password",
);
const password = url.password; //flabada
const username = url.username; //anonymous
```

> 静态方法

1. `URL.createObjectURL(object)`:创建一个表示参数中给出的对象的URL
   - 这个新的URL对象表示指定的`File`对象或`Blob`对象
   - `object`:用于创建URL的`File`对象,`Blob`对象或者`MediaSource`对象
   - 返回一个用于指定源的URL
2. `URL.revokeObjectURL(objectURL)`:释放一个之前已经存在的,通过调用`URL.createObjectURL()`创建的URL对象
   - `objectURL`:通过调用`URL.createObjectURL()`方法产生的URL对象
3. `URL.toString()`与`URL.toJSON()`与`url.href`一样,返回序列化的url

### [URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams/append)

> 接口定义了一些实用的方法来处理URL的查询字符串

#### new URLSearchParams()

> `URLSearchParams()`构造器创建并返回一个新的`URLSearchParams`对象.并且会忽略`?`

- `const URLSearchParams = new URLSearchParams(init)`
- `init`:需要USVString(对应 unicode 标量值的所有可能序列的集合)

```js
new URLSearchParams("?foo=1&bar=2");
new URLSearchParams(url.search);
new URLSearchParams([["foo", 1], ["bar", 2]]);
new URLSearchParams({ "foo": 1, "bar": 2 });
```

> 方法

- `append(name, value)`:可以插入一个新搜索参数
- `getAll(name)`:以数组的形式返回与指定搜索参数对应的所有值
- `get(name)`:返回第一个与搜索参数对应的值
- `has(name)`:返回一个布尔值,表示查找的键名是否存在
- `set()`:设置和搜索参数相关联的值.如果设置前已经存在匹配的值,该方法会删除多余的,如果将要设置的值不存在,则创建它
- `delete(name)`:可以删除指定名称的所有搜索参数
- `sort()`:对对象中的所有键/值对进行排序.按unicode编码
- `entries()`:返回一个`iterator`,允许遍历该对象中包含的所有键/值对
- `forEach(callback)`:该回调函数可以接收到3个参数value,key,searchParams
- `keys()`:返回一个iterator,遍历器允许遍历对象中包含的所有键
- `values()`:返回一个iterator,遍历器允许遍历对象中包含的所有值
- `toString()`:返回适用在URL中的查询字符串

```js
let url = new URL("https://example.com?foo=1&bar=2");
let params = new URLSearchParams(url.search);
params.getAll("foo"); //['1', '4']
params.get("foo"); //'1'
params.append("foo", 4); //foo=1&bar=2&foo=4
params.has("bar"); // true
params.set("foo", 2); //foo=2&bar=2
params.delete("foo"); //bar=2
params.set("foo", 4);

//entries
for (let [key, value] of params.entries()) {
  console.log(key, value);
  //bar 2
  //foo 4
}

//forEach
params.forEach((item, key) => console.log(item, key));
//bar 2
//foo 4

//keys()
console.log(...params.keys());
//bar foo

//values()
console.log(...params.values());
//2 4

params.toString();
//'bar=2&foo=4'
```

### data:url

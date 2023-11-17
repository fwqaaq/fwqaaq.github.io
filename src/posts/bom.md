---
title: bom
date: 2022-01-03 11:00:53
categories: JavaScript
tags:
   - JavaScript
summary: 浏览器自带的 bom 属性
---

## Viewport

> 视口代表一个可看见的多边形区域（通常是矩形）.在浏览器的范畴里，他代表的就是浏览器网站中可见内容的部分，视口外的内容在被滚动进来前都是不可见的

- **可见视口**：视口当前可见的部分。可见视口可能回避布局视口更小，因为当用户缩小浏览器的比例，布局视口不变，而可见视口会变小
- **布局视口**：是浏览器在其中绘制网页的视口。从本质上讲，它表示可查看的内容，而可视视口表示用户显示设备上当前可见的内容

### 浏览器窗口大小

1. `innerWidth`、`innerHeight`：返回浏览器窗口中页面**可见视口**的大小（不包含边框，工具栏）
   - 使用：`window.innerWidth`
2. `outerWidth`、`outerHeight`：返回浏览器窗口自身的大小（整个浏览器，包含边框，工具栏）
   - 使用：`window.outerWidth`
3. `scrollX`、`scrollY`：返回文档当前水平滚动和垂直滚动的像素数
   - 使用`window.scroll(0,0)`：这样会把文档重新滚动到左上角
4. `clientWidth`、`clientHeight`：返回**布局视口元素**的大小
   - 使用：`document.documentElement.clientWidth`
5. `screen.height`、`screen.width`：返回屏幕（整个显示器）的大小
6. `screen.availHeight`、`screen.availWidth`：返回可使用的屏幕高度或者宽度（不会包括固定的任务栏等不可使用的区域）

> 注意：布局视口相对于可见视口的概念.可见视口只能显示页面的一小部分。

![浏览器视口](https://media.githubusercontent.com/media/fwqaaq/fwqaaq.github.io/dev/src/picture/浏览器视口.png)

- **移动窗口**（moveTo、moveBy）和**缩放窗口**（resizeTo、resizeBy）方法一般浏览器会禁用

### DOM 元素大小

1. `clientWidth`、`clientHeight`：CSS 的 width/height 和 padding 属性值之和
   - 元素边框和滚动条不包括在内，也不包含任何可能的滚动区域
2. `offsetWidth`、`offsetHeight`：元素在页面中占据的 width/height 总和，包括 width、padding、border 以及滚动条的宽度
3. `offsetLeft`、`offsetTop`：只读。返回元素左上角相对于 `HTMLElement.offsetParent`（父元素不是 `display:none`）节点的左或者上边界的偏移量
4. `scrollWidth`、`scrollHeight` 当元素不是 `overflow:hidden` 样式属性时，元素的总宽度（滚动宽度）
   - 在默认状态下，如果该属性值大于 clientWidth 属性值，则元素会显示滚动条，以便能够翻阅被隐藏的区域

### event 事件上的元素大小

> 该元素只会在 event（如 click、mousemove 等）上才有的属性

- 以下属性的方位都是相对于左上方为原点的坐标系，越往右/下，值越大

- `offsetX`、`offsetY`：鼠标相对于目标元素的距离。
  - 参照点是目标元素的左上角
- `clientX`、`clientY`：鼠标相对于浏览器视口的距离。
  - 参照点是目标元素的左上角，计算鼠标点距离浏览器内容区域的左上角的距离（不包含任何可能的滚动区域）
- `layerX`、`layerY`：鼠标相对于定位属性的距离。
  - 参照点是父元素（如果自身有定位属性的话就是相对于自身）都没有的话：就是相对于 body 元素
- `pageX`、`pageY`：鼠标相对与整个页面左上角的距离。
  - 参照点是页面本身的 body 原点。会以 body 左上角计算值，并且把滚动条滚过的高或宽计算在内（受滚动区域影响）
- `screenX`、`screenY`：鼠标相对于屏幕的距离。
  - 参照点是屏幕的左上角

## location

> `window.location` 和 `document.location`指向同一个对象

| 属性              | 描述                                     |
| ----------------- | ---------------------------------------- |
| Location.href     | 包含整个 URL,location 的 toString() 方法返回 |
| Location.protocol | 页面使用的协议。通常包括`http`或`https:` |
| Location.host     | 服务器名和端口号                         |
| Location.hostname | 服务器名                                 |
| Location.port     | 端口号                                   |
| Location.pathname | url 的路径                                |
| Location.search   | 查询字符串。以 `?` 开头                       |
| Location.hash     | 哈希散列值，开头有一个“#”                 |
| Location.username | 域名前指定的用户名                       |
| Location.password | 域名前指定的密码                         |
| Location.origin   | url 的源地址                              |

> 查询字符串的解码 `decodeURIComponent` 和编码 `encodeURIComponent`

1. `encodeURIComponent()`：原字串作为 URI 组成部分被编码后组成的新字符串
2. 转义除了如下所示的所有文字 `A-Z a-z 0-9 - _ . ! ~ * ' ( )`
3. 反之，`decodeURIComponent()` 就是将编码之后的字符串解码

```js
encodeURIComponent("#");
//'%23'
decodeURIComponent("%23");
//'#'
```

- `URLSearchParams`：给构造函数传入一个查询字符串即可创造一个实例。并且暴露了 `get()`、`has()`、`delete()` 等等，同时可以作为可迭代对象

```js
let searchParams = new URLSearchParams("?name=zhangsan&sex=gender");
searchParams.has("name"); //true
searchParams.get("name"); //zhangsan
searchParams.set("age", "15");
searchParams.toString();
//'name=zhangsan&sex=gender&age=15'
```

> 操作地址

- 例如：`location.assign("www.baidu.com")`，如果使用 `location.href` 设置一个 url，也会以同一个 url 值调用 assign() 方法
- 除了 **hash** 之外，只要修改了 `location` 的一个属性，就会导致页面重新加载 url

> 如果不希望浏览器的操作地址增加，可以使用 `location.replace()`，用户不能回到前一页
>
> `location.reload()`：重新加载当前显示页面
>
> - 如果不传参数，会以最有效的方式加载 (可能是缓存)
> - 如果传 `true`，会从服务器加载

## URL

> URL 用于解析，构造，规范化和编码 url。如果浏览器不支持 `new URL()` 构造函数。可以使用 `new window.URL()`

### new URL()

> 构造函数：new URL(url[,base])

- `url`：表示绝对或者相对的 url.如果是绝对的 url，无论 baseurl 有没有参数都会被忽略。如果是相对的 url，则参数会添加到 baseurl 后
- `base`：可选的，表示基准的 url。只有 url 是带协议才可以生效。否则报一个 TypeError

```js
let baseurl = "https://www.baidu.com/laji";

//忽略参数
new URL("/zhenlan", baseurl); //https://www.baidu.com/zhenlan

//TypeError
new URL("www.baidu.com");

new URL("https://www.baidu.com"); //https://www.baidu.com
```

> 属性

- `hash`：返回包含 URL 标识中的 '#' 和 fragment 标识符
- `host`：返回一个主机信息。即 `hostname`,如果 URL 接口有端口号（如果是默认端口号，则不会包含），也会包含端口号
- `hostname`：不包含端口号的主机信息
- `href`：返回一个完整的 url
- `origin`：只读属性。
  - 如果是 `http` 或者是 `https`，返回源地址
  - 如果是 ftp 协议，视浏览器而定
  - 如果是 `blob:` 协议，返回的是 `blob:` 紧跟的源地址
    - `"blob:https://mozilla.org"` 返回 `https://mozilla.org`
- `pathname`：返回一个初始 `/` 和 URL 的路径（如果没有路径，则为空字符串）
- `port`：如果 url 中包含明确的端口信息，则返回一个端口号。否则返回 `""`
- `protocol`：返回一个 url 的协议值
- `search`：返回一个查询字符串。`?` 紧跟的
- `searchParams`：返回一个 [URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)。这个对象包含当前 URL 中解码后的 GET 查询参数

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

- `username`：包含域名前指定的 username
- `password`：返回域名之前指定的密码

```js
const url = new URL(
  "https://anonymous:flabada@developer.mozilla.org/en-US/docs/Web/API/URL/password",
);
const password = url.password; //flabada
const username = url.username; //anonymous
```

> 静态方法

1. `URL.createObjectURL(object)`:创建一个表示参数中给出的对象的 URL
   - 这个新的 URL 对象表示指定的`File`对象或`Blob`对象
   - `object`:用于创建 URL 的`File`对象，`Blob`对象或者`MediaSource`对象
   - 返回一个用于指定源的 URL
2. `URL.revokeObjectURL(objectURL)`:释放一个之前已经存在的，通过调用`URL.createObjectURL()`创建的 URL 对象
   - `objectURL`:通过调用`URL.createObjectURL()`方法产生的 URL 对象
3. `URL.toString()`与`URL.toJSON()`与`url.href`一样，返回序列化的 url

### [URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams/append)

> 接口定义了一些实用的方法来处理 URL 的查询字符串

#### new URLSearchParams()

> `URLSearchParams()`构造器创建并返回一个新的`URLSearchParams`对象。并且会忽略`?`

- `const URLSearchParams = new URLSearchParams(init)`
- `init`:需要 USVString(对应 unicode 标量值的所有可能序列的集合)

```js
new URLSearchParams("?foo=1&bar=2");
new URLSearchParams(url.search);
new URLSearchParams([["foo", 1], ["bar", 2]]);
new URLSearchParams({ "foo": 1, "bar": 2 });
```

> 方法

- `append(name, value)`：可以插入一个新搜索参数
- `getAll(name)`：以数组的形式返回与指定搜索参数对应的所有值
- `get(name)`：返回第一个与搜索参数对应的值
- `has(name)`：返回一个布尔值，表示查找的键名是否存在
- `set()`：设置和搜索参数相关联的值。如果设置前已经存在匹配的值，该方法会删除多余的，如果将要设置的值不存在，则创建它
- `delete(name)`：可以删除指定名称的所有搜索参数
- `sort()`：对对象中的所有键/值对进行排序。按 unicode 编码
- `entries()`：返回一个 `iterator`，允许遍历该对象中包含的所有键/值对
- `forEach(callback)`：该回调函数可以接收到 3 个参数 value、key、searchParams
- `keys()`：返回一个 iterator，遍历器允许遍历对象中包含的所有键
- `values()`：返回一个 iterator，遍历器允许遍历对象中包含的所有值
- `toString()`：返回适用在 URL 中的查询字符串

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

## History

1. `history.go(-1)` 相当于 `history.back()`：后退一页
2. `history.go(1)` 相当于 `history.forward()`：前进一页
3. 可以接受一个字符串：可能前进也可能后退
4. `history.length`：返回具体的数目

> 如果页面的 url 发生变化，则会在历史记录中生成一个新条目。这也包括 url 的散列值 (`location.hash`)

### 管理历史状态

1. `history.pushState()`：接收三个参数，`state` 对象、一个新状态的标题、相对的 url（可选）
2. 一旦 `pushState()` 方法执行后，状态信息就会被推到历史记录中，浏览器地址栏也会相应变化新的 url。也就会相应的启用后退按钮
3. 当活动历史记录条目更改时，将触发 `popstate` 事件如果被激活的历史记录条目是通过对 `history.pushState()` 的调用创建，或者受到对 `history.replaceState()` 的调用的影响，popstate 事件的 state 属性包含历史条目的状态对象的副本
4. 注意用 `history.pushState()` 或 `history.replaceState()` 不会触发 popstate 事件只有在做出浏览器动作时，才会触发该事件
5. 测试：<http://example.com/example.html>

```js
window.addEventListener("popstate", (event) => {
  console.log(
    "location: " + document.location + ", state: " +
      JSON.stringify(event.state),
  );
});
history.pushState({ page: 1 }, "title 1", "?page=1");
history.pushState({ page: 2 }, "title 2", "?page=2");
history.replaceState({ page: 3 }, "title 3", "?page=3");
history.back();
// Logs "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back();
// Logs "location: http://example.com/example.html, state: null
history.go(2);
// Logs "location: http://example.com/example.html?page=3, state: {"page":3}
```

- 同时也可以使用 `history.state` 获取当前状态（`state对象`）

> `history.replaceState()` 更新状态不会创建新历史记录，只会覆盖当前状态

---
title: bom
date: 2022-01-03 11:00:53
author: Jack-zhang
categories: JS
tags:
   - JS
summary: 浏览器自带的bom属性
---

## Viewport

>视口代表一个可看见的多边形区域(通常是矩形).在浏览器的范畴里,他代表的就是浏览器网站中可见内容的部分,视口外的内容在被滚动进来前都是不可见的

* **可见视口**:视口当前可见的部分.可见视口可能回避布局视口更小,因为当用户缩小浏览器的比例,布局视口不变,而可见视口会变小
* **布局视口**:是浏览器在其中绘制网页的视口.从本质上讲,它表示可查看的内容,而可视视口表示用户显示设备上当前可见的内容

### 浏览器窗口大小

1. `innerWidth`,`innerHeight`:返回浏览器窗口中页面**可见视口**的大小(不包含边框,工具栏)  
   * 使用:`window.innerWidth`
2. `outerWidth`,`outerHeight`:返回浏览器窗口自身的大小(整个浏览器,包含边框,工具栏)
   * 使用:`window.outerWidth`
3. `scrollX`,`scrollY`:返回文档当前水平滚动和垂直滚动的像素数
   * 使用`window.scroll(0,0)`:这样会把文档重新滚动到左上角
4. `clientWidth`,`clientHeight`: 返回**布局视口(元素)**的大小
   * 使用:`document.documentElement.clientWidth`
5. `screen.height`,`screen.width`:返回屏幕(整个显示器)的大小
6. `screen.availHeight`,`screen.availWidth`:返回可使用的屏幕高度或者宽度(不会包括固定的任务栏等不可使用的区域)

>注意:布局视口相对于可见视口的概念.可见视口只能显示页面的一小部分.

![浏览器视口](http://zyjcould.ltd/blog/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%A7%86%E5%8F%A3.png)

* **移动窗口**(moveTo,moveBy)和**缩放窗口**(resizeTo,resizeBy)方法一般浏览器会禁用

### DOM元素大小

1. `clientWidth`,`clientHeight`:CSS的width/height和padding属性值之和
   * 元素边框和滚动条不包括在内,也不包含任何可能的滚动区域
2. `offsetWidth`,`offsetHeight`:元素在页面中占据的width/height总和,<span style="color:red">包括width,padding,border以及滚动条的宽度</span>
3. `offsetLeft`,`offsetTop`:只读.返回元素左上角相对于`HTMLElement.offsetParent`(父元素不是`display:none`)节点的左或者上边界的偏移量
4. `scrollWidth`,`scrollHeight`当元素不是`overflow:hidden`样式属性时,元素的总宽度(滚动宽度)
   * 在默认状态下,如果该属性值大于clientWidth属性值,则元素会显示滚动条,以便能够翻阅被隐藏的区域

### event事件上的元素大小

>该元素只会在event(如click,mousemove等)上才有的属性

* 以下属性的方位都是相对于左上方为原点的坐标系,越往右/下,值越大

* `offsetX`,`offsetY`:鼠标相对于目标元素的距离.
  * 参照点是目标元素的左上角
* `clientX`,`clientY`:鼠标相对于浏览器视口的距离.
  * 参照点是目标元素的左上角,计算鼠标点距离浏览器内容区域的左上角的距离(不包含任何可能的滚动区域)
* `layerX`,`layerY`:鼠标相对于定位属性的距离.
  * 参照点是父元素(<span style="color:red">,如果自身有定位属性的话就是相对于自身</span>),都没有的话:就是相对于body元素
* `pageX`,`pageY`:鼠标相对与整个页面左上角的距离.
  * 参照点是页面本身的body原点.会以body左上角计算值,并且把滚动条滚过的高或宽计算在内(受滚动区域影响)
* `screenX`,`screenY`:鼠标相对于屏幕的距离.
  * 参照点是屏幕的左上角

## window.open()

> 用于导航指定到url,也可以打开新的浏览器窗口(接收以下四个参数)

```html
<!-- 以下功能相同 -->
<a href="https://www.baidu.com"></a>

<script>
  window.open("https://www.baidu.com")
</script>
```

1. 要加载的url
2. 目标窗口(会弹出一个新的窗口):<span style="color:red">自己决定名字</span>
3. 特性字符串
4. 新窗口在浏览器历史记录中是否替代当前加载页面的**布尔值**

* 例如:`window.open("https://www.baidu.com","wro","height=400,width=400,resizable=true")`
* 打开一个400*400大小可拖动改变的`wro`窗口

## 定时器

1. `setTimeout()`:指定时间后执行代码.
   * 返回一个超时排期的ID,可用于取消该任务
   * <span style="color:red">设置循环任务推荐,因为他在满足条件时自动停止</span>.
2. `setInterval()`:指定每隔一段事件后执行某些代码.
   * 也会返回一个循环定时ID

* 注意:`clearTimeout(ID)`用于取消定时器

## 系统对话框

1. `alert()`:警告框,只有确认选项
2. `confirm()`:确认框,有**确认**和**取消**按钮,分别返回`true`和`false`
3. `prompt`:文本提示框.
   * 接收两个参数,第一个是提示消息,第二个是输入框输入信息.
   * 用户按确认按钮,返回输入框输入信息

## location

> `window.location`和`document.location`指向同一个对象

| 属性              | 描述                                     |
| ----------------- | ---------------------------------------- |
| Location.href     | 包含整个URL,location的toString()方法返回 |
| Location.protocol | 页面使用的协议.通常包括`http:`或`https:` |
| Location.host     | 服务器名和端口号                         |
| Location.hostname | 服务器名                                 |
| Location.port     | 端口号                                   |
| Location.pathname | url的路径                                |
| Location.search   | 查询字符串.以?开头                       |
| Location.hash     | 哈希散列值,开头有一个“#”                 |
| Location.username | 域名前指定的用户名                       |
| Location.password | 域名前指定的密码                         |
| Location.origin   | url的源地址                              |

>查询字符串的解码`decodeURIComponent`和编码`encodeURIComponent`

1. `encodeURIComponent()`:原字串作为URI组成部分被编码后组成的新字符串
2. 转义除了如下所示的所有文字`A-Z a-z 0-9 - _ . ! ~ * ' ( )`
3. 反之,`decodeURIComponent()`就是将编码之后的字符串解码

```js
encodeURIComponent("#")
//'%23'
decodeURIComponent("%23")
//'#'
```

* `URLSearchParams`:给构造函数传入一个查询字符串即可创造一个实例.并且暴露了`get()`,`has()`,`delete()`等等,同时可以作为可迭代对象

```js
let searchParams = new URLSearchParams("?name=zhangsan&sex=gender")
searchParams.has("name")//true
searchParams.get("name")//zhangsan
searchParams.set("age","15")
searchParams.toString()
//'name=zhangsan&sex=gender&age=15'
```

>操作地址

* 例如:`location.assign("www.baidu.com")`,如果使用`location.href`设置一个url,也会以同一个url值调用assign()方法
* <span style="color:red">除了**hash**之外,只要修改了`location`的一个属性,就会导致页面重新加载url</span>

> 如果不希望浏览器的操作地址增加,可以使用`location.replace()`,用户不能回到前一页
>
>`location.reload()`:重新加载当前显示页面
>
>* 如果不传参数,会以最有效的方式加载(可能是缓存)
>* 如果传`true`,会从服务器加载

## 导航

1. `history.go(-1)`相当于`history.back()`:后退一页
2. `history.go(1)`相当于`history.forward()`:前进一页
3. 可以接受一个字符串:可能前进也可能后退
4. `history.length`:返回具体的数目

>如果页面的url发生变化,则会在历史记录中生成一个新条目.这也包括url的散列值(`location.hash`)

### 管理历史状态

1. `history.pushState()`:接收三个参数,`state对象`,`一个新状态的标题`,`相对的url(可选)`
2. 一旦`pushState()`方法执行后,状态信息就会被推到历史记录中,浏览器地址栏也会相应变化新的url.也就会相应的启用`后退`按钮
3. 当活动历史记录条目更改时,将触发`popstate`事件如果被激活的历史记录条目是通过对`history.pushState()`的调用创建,或者受到对`history.replaceState()`的调用的影响,popstate事件的state属性包含历史条目的状态对象的副本
4. 注意用`history.pushState()`或`history.replaceState()`不会触发popstate事件只有在做出浏览器动作时,才会触发该事件
5. 测试:<http://example.com/example.html>

```js
window.addEventListener('popstate', (event) => {
  console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
});
history.pushState({page: 1}, "title 1", "?page=1");
history.pushState({page: 2}, "title 2", "?page=2");
history.replaceState({page: 3}, "title 3", "?page=3");
history.back(); 
// Logs "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); 
// Logs "location: http://example.com/example.html, state: null
history.go(2);  
// Logs "location: http://example.com/example.html?page=3, state: {"page":3}
```

* 同时也可以使用`history.state`获取当前状态(`state对象`)

>`history.replaceState()`更新状态不会创建新历史记录,只会覆盖当前状态

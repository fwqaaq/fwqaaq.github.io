---
title: html5标签
date: 2021-10-31 21:15:40
author: Jack-zhang
categories: JS
tags:
   - HTML
   - JS
summary: html5的规范
---

## 获取标签属性

* `console.dir`:打印标签的属性

> 获取display:行内元素还是块级元素

```js
function getDisplay(obj) {
  return getComputedStyle(obj).display
}
const a = document.getElementById("name")
console.log(getDisplay(a))
```

## html5的标记方法

* html5的内容类型
  * `ContentType`任然为`text/html`

* `DOCTYPE`声明
  * \<!DOCTYPE html>:不需要指定版本

* 指定字符编码
  * \<meta charset="UTF-8">,可以直接追加charest属性的方式来指定
  * 注意:不能将html4中的`content`元素属性指定和html5中`charset`指定混写

## 有关兼容性

> HTML5的语法是为了保证之前的HTML语法达到最大的兼容性而设计

* 不允许写结束标记的元素:
  * br,hr,img,input,link,meta...
* 可以省略结束标记的元素:
  * li,p,option,tr,td,th...
* 可以省略全部标记的元素:
  * html,body,head,colgroup,tbody.

* 例:`<br>...</br>`是错误的,正确的是\</br>,HTML5之前的\<br>也是可以的
* 例:可以省略全部标记的元素,如将`body`元素省略不写,但是<span style="color:red">他在文档结构中还是存在,可以使用`document.html`访问到</span>

> 具有`boolean`值的属性

* 设置属性为true:
  * 不写属性值:\<input type="checkbox" checked>
  * 属性值=属性名:\<input type="checkbox" checked="checked">
  * 属性值=空字符串:\<input type="checkbox" checked="">
* 设置属性为false:
  * 不写属性值:\<input type="checkbox">

* `hidden`:元素的隐藏与显示.不会影响别的元素(可以看做`display:none`的简写)
* `contentEditable`:使元素变成可更改的.富文本操作的原理
  * `document.body.contentEditable=true`:使整个页面可更改

## html5结构

> 关于内容区块的编排,可以分为**显示编排**和**隐式编排**

* 显示编排值明确使用section等元素创建文档结构
* 隐式编排值不明确使用section等元素

> 标题分级

* 隐式编排的规则
  * 如果新出现的标题比上一个标题级别低,生成下级内容区块
  * 如果新出现的标题比上一个标题级别搞或相等,生成新的内容区块

> 不同内容的区块可以使用相同级别的标题

* 父内容区块和子内容区块可以使用相同级别的标题,例如h1
  * 优点:每个级别的标题都可以单独设计

## 新增的元素

### 新增的结构元素

> 章节,页眉,页脚或页面中的其它部分,可以与h1,h2,h3,h4,h5,h6
>
> >取代的是\<div>...\</div>

1. \<section>...\</section>:**分段分块**
   * 对网站或者应用程序中页面上的内容进行分块
   * 注意:
     * 当一个容器需要被直接定义样式或者通过脚本定义行为是,推荐使用div而非section
     * 不推荐为那些没有标题的内同使用section
2. \<article>...\</article>:**强调独立性**
   * 代表文档,页面或者应用程序中独立的,完整的,可以独自被外部引用的内容
   * 可以为博客或报刊中的文中,独立的帖子,独立的插件或者任意独立的内容
   * 注意:
     1. 将所有页面从属部分,譬如导航条,菜单,版权说明等包含在一个统一的页面,以便统一使用CSS样式来进行装饰
     2. 不要将section元素用作<span style="color:red">设置样式的页面容器</span>,那是div元素的工作
     3. 如果article,aside或nav更符合使用条件,不要使用section元素
     4. 不要为没有标题的内容区块使用section元素
3. \<nav>...\</nav>取代的是:\<ul>\</ul>
   * 用作页面导航的链接组
   * 只需要将主要的,基本的链接组放进nav元素
   * 一个页面可以使用多个nav
4. \<aside>...\</aside>
   * 表示当前页面的附属信息部分
   * 可以包含当前页面或主要内容相关的引用,侧边栏,广告等有别于主要内容
5. \<time>\</time>,取代的\<span>\</span>
   * 表示24小时某个时刻或者某个日期

### 新增的非主体结构元素

* \<header>...\</header>
  * 引导和导航作用的结构元素,通常防止整个页面或页面中的一个内容区块的标题
  * 例如数据表格,搜索表单或相关的logo
* \<hgroup>...\</hgroup>
  * 将标题极其子标题进行分组的元素
* \<footer>...\</footer>
  * 可以作为上层父级内容区块或是一个跟区块的脚注
  * 通常包括起教官区块的脚注信息,如作者,相关阅读链接等
* \<address>...\</address>
  * 用来在文档中呈现联系信息,包括文档作者或文档维护者的网站链接,电子邮箱,名字,手机号等

> figure元素:表示一段独立的流内容,一般表示文档主体流内容中的一个独立单元.使用`figcaption`元素为figure元素组添加标签

* html5中代码示例

```html
<figure>
  <figcaption>PRC</figcaption>
  <p>zzzzzzzzz</p>
</figure>
```

> html4中代码示例:

```html
<dl>
  <h1>prc</h1>
  <p>zzzzzzzzz</p>
</dl>
```

### 新增的其它元素

* video元素定义视频,比如电影片段或其它视频流:
  * \<video src="moive.ogg" controls="controls">video元素\</video>
* audio元素定义音频:
  * \<audio src="someaudio.wav">audio元素\</audio>
* embed元素用来插入各种多媒体,格式可以是Midi,Wav,AIFF,AU,MP3:
  * \<embed src="horse.wav">\</embed>
* mark元素主要用来在视觉上向用户呈现那些需要突出显示或高亮显示的文字
  * \<mark>\</mark>取代\<span>\</span>
* progress元素表示JavaScript中耗费时间的函数的进程
  * \<progress>\</progress>,需要使用js脚本控制
* meter元素规定范围内的数值  
  * \<meter>\</meter>

| 属性    | 描述                                |
| ------- | ----------------------------------- |
| value   | 表示出来的实际值                    |
| min     | 规定范围是允许使用的最小值          |
| max     | 规定范围是允许使用的最大值          |
| low     | 规定范围的下限值,必须小于high属性值 |
| high    | 规定范围上限值                      |
| optimum | 最佳值,属性值必须在min与max之间     |

* 注意:
  * 如果low属性值小于min属性值,把min属性值视为low属性的值
  * 如果high属性大于max属性,把max属性的值视为high属性的值

* wbr元素表示软换行,
  * br是必须换行
  * wbr是浏览器窗口或父级元素的宽度足够宽时(没必要换行时),不进行换行,当宽度不够,主动进行换行(对中文没有啥用)
* canvas:本身没有行为,只提供一块画布,但他把一块绘图api展现给客户端js,使脚本能够把向蕙质的东西绘制这块画布上
* command元素表示命令暗流,比如单选框,复选框,或者按钮(只有ie支持)
  * 该元素必须在menu元素中
* menu指元素表示菜单列表.希望列出表单控件时使用该元素

```html
<menu>
  <command type="command" label="Save" onclick="save()">Save</command>
</menu>
```

* datalist元素表示可选数据列表,与input元素配合使用,可以制作输入值的下拉列表
  * \<datalist>\</datalist>
* datagrid表示可选数据列表,他以树形列表的形式来显示
  * \<datagrid>\</datagrid>
* keygen元素表示生成密钥
  * \<keygen>
* source元素为媒介元素(如\<video>和\<audio>)定义媒介资源
  * \<source>

### 新增的input类型

> 表示必须输入什么样的类型

| email  | 邮件地址                     |
| ------ | ---------------------------- |
| url    | URL地址                      |
| number | 数值的文本输入框             |
| range  | 一定范围内数字值的文本输入框 |
| Date   | 日期类...                    |
| file   | 上传文件                     |

### 新增的属性

> 链接相关的属性

| 属性  | 描述                                                           | 适用于标签 |
| ----- | -------------------------------------------------------------- | ---------- |
| media | 规定目标url时为什么类型的媒介进行优化,只能在href属性存在时使用 | a          |
| sizes | 与icons元素结合使用(通过rel属性),指定关联(icons元素)的大小     | link       |

> 其它属性

| 属性                    | 描述                 | 适用于标签 |
| ----------------------- | -------------------- | ---------- |
| reversed                | 列表倒序显示         | ol         |
| charset                 | 文档的字符编码       | meta       |
| scoped                  | 规定样式的作用域范围 | style      |
| async                   | 脚本是否异步执行     | script     |
| sandbox,seamless,srcdoc | 提高页面的安全性     | iframe     |

### 全局属性

> **hidden**属性:通值浏览器不渲染该元素,使用元素处于不可见状态

* 允许使用js脚本将该属性取消
  * 设置为true:元素处于不可见的状态
  * 设置为false:元素处于可见的状态

> **spellcheck**:针对`input`和`textarea`,对用户输入的文本内容进行拼写和语法检查

* 必须明确提供true和false
  * 正确:\<textarea spellcheck="true">
  * 错误:\<textarea spellcheck>
* 注意: 如果元素的`readOnly`或者`disabled`属性设为true,则不进行检查  

> **designMode**和**contentEditable**(略)

## \<link>标签

>link标签用于规定当前文档与外部资源的关系.该元素常用于链接**样式表**,此外也可以被用来创建站点图标

1. 用来加载网站图标

   ```html
   <link rel="icon" sizes="144x144" href="./avatar.png">
   ```

   * 如果是移动平台

   ```html
   <link rel="apple-touch-icon-precomposed" sizes="114x114"
        href="apple-icon-114.png" type="image/png"> 
   ```

   * `sizes`属性表示图标大小,`type`属性包含了链接资源的 MIME 类型

2. 加载css资源,同时可以使用`medias`属性内部进行查询

   ```html
   <link href="print.css" rel="stylesheet" media="print">
   <link href="mobile.css" rel="stylesheet" media="screen and (max-width: 600px)">
   ```

3. 使用`rel="preload"`或者`rel="prefetch"`:使用 fetch 请求,指定页面资源在页面生命周期的早期就开始加载.还需要设置以下值
   * `href`:属性中的资源路径
   * `as`:属性中的资源类型

   ```html
   <link rel="preload" href="style.css" as="style">
   <link rel="preload" href="main.js" as="script">
   ```

>as可以预加载以下内容

* `audio`:音频文件,通常用于\<audio>
* `document`:旨在由\<frame>或\<iframe>嵌入的 HTML 文档
* `embed`:要嵌入到\<embed>元素中的资源
* `fetch`:由 fetch 或 XHR 请求访问的资源,例如 ArrayBuffer 或 JSON 文件
* `font`:字体文件
* `image`:图像文件
* `object`:要嵌入到\<object>元素中的资源
* `script`:JavaScript 文件
* `style`:CSS 样式表
* `track`:WebVTT 文件
* `worker`:JavaScript Web worker 或 shared worker
* `video`:视频文件,通常用于\<video>

* `rel`:参考<https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types>

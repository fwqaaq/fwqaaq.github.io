---
title: cheerio
date: 2021-11-30 21:46:45
categories: 爬虫
tags:
   - JS
   - config
   - 爬虫
summary: cheerio语法
---

> Cheerio包括了JQuery核心的子集.Cheerio从jQuery库中去除了所有DOM不一致性和浏览器尴尬的部分,揭示了它真正优雅的API.
>
> Cheerio几乎能够解析任何的HTML和XMLdocument

## 初始化

```js
const { load } = require("cheerio")
const html = `<ul id="fruits">
              <li class="pear">pear111</li>
              <li id="apple">apple111
                <div class="redapple">redapple111<div>
              </li>
            </ul>`
const $ = load(html)
```

## 属性

> `$(selector,[context],[root])`

1. `selector`会在`Context`范围内搜索,`Context`会在`Root`的范围内搜索
2. `context`,`root`:**字符串表达式**,**DOM元素**,**DOM元素的数组**或者**cheerio对象**
3. 返回一个`cheerio`节点对象

```js
console.log($('ul .pear'))
```

>`text(textString)`:获得元素的text内容，包括子元素.
>
>如果指定了`textString`会替换所有内容(包括dom节点)

```js
console.log($('.redapple', '#fruits').text("app").text())
//app
```

>`html(htmlString)`:获得元素的HTML字符串
>
>如果`htmlString`有内容的话,将会<span style="color:red">替代原来的HTML</span>

```js
console.log($('ul').html('<li class="mango">Mango</li>').html())
//'<li class="mango">Mango</li>'
```

> `$.root()`:拿到最上层的根节点(root)

```js
console.log($.root().html())
<html>
  <head>
  </head>
  <body>
    <ul id="fruits">shuiguo
      <li class="pear">pear111</li>
      <li id="apple">apple111
        <div class="redapple">app</div>
      </li>
    </ul>
  </body>
</html>
```

> `attr(name,value)`:获得或者修改属性

1. 在匹配的元素中只能获得第一元素的属性.
2. 如果设置一个属性的值为null,则移除这个属性
3. 可以传递`键值`或者`函数`
4. 不指定值则返回一个对象

```js
//查找属性
console.log($('ul .pear').attr('class'))
//pear

//增加一个属性
console.log($('ul').attr('attr', "laji").attr())
//{ id: 'fruits', attr: 'laji' }
```
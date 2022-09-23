---
title: Range 相关的 API
date: 2022-04-19 17:02:23
author: Jack-zhang
categories: JS
tags:
   - JS
   - HTML
summary: 使用 Range 相关的 API
---

## API

>理解选区和范围，选区指 [Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection)，范围指 [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range)。一个选取可能有多个范围，也就是可以从 Selection 中获取 Range。

* 例如，在浏览器中的选中文本的高亮、选中出现工具栏、手动控制光标位置等。通常这被选中的部分都是蓝色的
   1. Selection 对象表示用户选择文本范围或插入符号的当前位置。它代表页面中的文本选区，可能横跨多个元素。通常由用户拖拽鼠标经过的文字而产生
   2. Range 对象表示包含节点和部分文本节点的文档片段。通过 selection 对象获得的 range 对象才是我们操作光标的重点

* 通常我们不会直接操作 `selection` 对象，而是需要操作 `selection` 对象所对应的用户选择的 `range`。我们一般不需要考虑多选区的情况（firfox 和 win 下 ctrl 支持）

```js
document.getSelection().getRangeAt(0)
// 打印选中的文本
document.getSelection().toString()
document.getSelection().getRangeAt(0).toString()
```

* 这两个 api 在文档可编辑的情况下，即富文本时使用较多，例如只读属性 `Range.collapsed`, 它返回起始点和结束点是否在同一个位置

```js
document.body.contentEditable = true
// 然后随意插入光标
document.getSelection().getRangeAt(0).collapsed 
// true

// 如果你想要将选区折叠为光标，你需要使用 Range.collapse(boolean)
document.getSelection().getRangeAt(0).collapse(true)
// true 代表折叠到 Range 的 start 节点，false 折叠到 end 节点。没有参数则是 false
```

### 浏览器实现的 API

> `Element.getBoundingClientRect()`:返回元素的大小及其**相对于视口**的位置

* 如果是标准盒子模型,元素的尺寸等于`width/height + padding + border-width`的总和.如果`box-sizing: border-box`,元素的的尺寸等于`width/height`.

* `DOMRect`:返回一个DOMRect对象.(DOMRect)代表一个矩形,表示盒子的类型右返回它的属性和方法决定
* ![ ](./rect.png)
* **原点**:当前视口的左上角(0,0)
  * `x`:矩形盒子的左边框(border)距离视口的左边的距离(可能为负数:当视口在盒子右边的时候)
  * `y`:矩形盒子的上边框距离视口上边的距离(可能为负数:当漱口在盒子下边的时候)
  * `height`:矩形盒子的高度
  * `width`:矩形盒子的宽度
  * `left`:视口到矩形盒子左边框的距离
  * `right`:视口到矩形盒子有边框的距离
  * `top`:视口到矩形盒子上边框的距离
  * `bottom`:视口到矩形盒子下边框的距离

>`Element.getClientRects()`:方法返回一个指向客户端中每一个盒子的边界矩形的矩形集合

* 返回`ClientRectList`:这是一个DOMRect的集合对象,属性和`getBoundingClientRect()`返回的方法一样
  * 如果是块级元素,只会返回一个数组,数组的内容和`getBoundingClientRect`一样
  * 实际上,该方法主要用于内联元素,内联元素有多少行,该方法返回的对象有多少个成员.这个方法主要用于判断**行内元素**是否换行,以及**行内元素**的每一行的位置偏移

>`Document/ShadowRoot.elementFromPoint(x: number, y: number): Element`:方法返回给定坐标点下最上层的`element`元素

* **DocumentOrShadowRoot**为`document`或者`shadowRoot`的接口

* 如果指定的坐标点在文档的可视范围外,或者两个坐标都是负数,那么结果返回null
* 如果该位置有多个元素层叠,则返回最上层的元素

---
title: FLIP
date: 2022-04-19 17:02:23
author: Jack-zhang
categories: JS
tags:
   - JS
   - HTML
summary: 使用FLIP进行布局
---

## API

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

>`DocumentOrShadowRoot.elementFromPoint(x: number, y: number): Element`:方法返回给定坐标点下最上层的`element`元素

* **DocumentOrShadowRoot**为`document`或者`shadowRoot`的接口

* 如果指定的坐标点在文档的可视范围外,或者两个坐标都是负数,那么结果返回null
* 如果该位置有多个元素层叠,则返回最上层的元素

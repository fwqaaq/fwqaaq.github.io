---
title: Observer
date: 2022-03-15 15:05:01
author: Jack-zhang
categories: JS
tags:
   - JS
summary: 浏览器的监听事件
---

>网页开发中经常会和用户交互而使用一些监听事件(例如onclick,onchange等).如果对于一些用户不直接触发的元素(例如渐变等),那就需要使用Observer去监听

* 浏览器为我们提供了五种`Observer`(观察者)来监听这些变动:`MutationObserver`,`IntersectionObserver`,`PerformanceObserver`,`ResizeObserver`,`ReportingObserver`

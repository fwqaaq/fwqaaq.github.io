---
title: 动画效果
date: 2024-12-30 08:30:03
categories: CSS
tags:
   - CSS
summary: 用于收集一些常见的 CSS 动画效果
---

## height 动画效果

众所周知，在之前的 CSS 中，例如 height 属性是不能直接进行动画效果的，需要使用 max-height 配合 transition 或者 animation 来实现该效果。

现在可以使用以下两个属性来实现 height 的动画效果：

1. `calc-size(<calc-size-basis>, <calc-sum>)`: <https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size>，该函数可以接受两个属性，其中第一个属性是初始值，第二个属性是 CSS 数学函数中可计算的值，例如 `height: calc-size(auto, size + 100px);`。（该属性仅针对尺寸属性有效果）
2. `interpolate-size`: <https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size>，该属性用于在 [`<length-percentage>`](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage) 和[固有尺寸](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)之间使用 animation 和 transition 效果。接受两个关键字，一个是 `allow-keywords` 该属性接受某个[插值](https://developer.mozilla.org/zh-CN/docs/Glossary/Interpolation)，另一个是 `numeric-only`，该属性为**默认值**不接受插值。

参见：<https://developer.chrome.com/docs/css-ui/animate-to-height-auto>、[`<calc-sum>`]((https://developer.mozilla.org/en-US/docs/Web/CSS/calc-sum))

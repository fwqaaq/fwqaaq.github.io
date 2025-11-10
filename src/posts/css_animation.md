---
title: 动画效果
date: 2024-12-30 08:30:03
categories: CSS
tags:
   - CSS
summary: 用于收集一些常见的 CSS 动画效果
updateAt: 2025-11-09 23:00:55
---

[TOC]

## height 动画效果

众所周知，在之前的 CSS 中，例如 height 属性是不能直接进行动画效果的，需要使用 max-height 配合 transition 或者 animation 来实现该效果。

现在可以使用以下两个属性来实现 height 的动画效果：

1. `calc-size(<calc-size-basis>, <calc-sum>)`: <https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size>，该函数可以接受两个属性，其中第一个属性是初始值，第二个属性是 CSS 数学函数中可计算的值，例如 `height: calc-size(auto, size + 100px);`。（该属性仅针对尺寸属性有效果）
2. `interpolate-size`: <https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size>，该属性用于在 [`<length-percentage>`](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage) 和[固有尺寸](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)之间使用 animation 和 transition 效果。接受两个关键字，一个是 `allow-keywords` 该属性接受某个[插值](https://developer.mozilla.org/zh-CN/docs/Glossary/Interpolation)，另一个是 `numeric-only`，该属性为**默认值**不接受插值。

示例：可以看该提交是如何修改 height 动画 <https://github.com/fwqaaq/fwqaaq.github.io/commit/068be22f827e8b75070f78a8ab5c05875842ce80>

参见：<https://developer.chrome.com/docs/css-ui/animate-to-height-auto>、[`<calc-sum>`](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-sum)

## [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

这是一个用于实现在不同 DOM 之间转换的动画效果的 API，并且可以实现非常平滑的过渡效果，它主要是对于 Transition API 的扩展，并且可以实现更加复杂的过渡效果。

```txt
::view-transition
└─ ::view-transition-group(root)
   └─ ::view-transition-image-pair(root)
      ├─ ::view-transition-old(root)
      └─ ::view-transition-new(root)
```

对于该 API 的使用，主要的参数分类分别是：`*`（匹配所有过渡的元素）、`root`（匹配过渡的根元素）以及 [`<custom-ident>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/custom-ident)（通过 [view-transition-name](https://developer.mozilla.org/zh-CN/docs/Web/CSS/view-transition-name) 属性分配给某个元素从而达到过渡效果）。

示例：

```css
header {
  view-transition-name: header-card;
}
/**带有 header-card 的都会实现以下基础的过渡效果*/
::view-transition-group(header-card) {
  animation-duration: 0.5s;
}
```

这里需要注意的是，主要用的是 `::view-transition-old` 和 `::view-transition-new` 这两个伪元素，浏览器会在后台为这两个元素创建快照，old 表示过渡之前的快照，new 表示过渡之后的快照。

在过渡过程中，浏览器会同时显示旧页面和新页面的元素，并根据计算好的动画路径对元素进行平滑的变换。例如，如果一个元素的位置、大小或颜色发生了变化，浏览器会以流畅的动画方式来展示这种变化，而不是突然的切换。

```css
::view-transition-new(root) {
  animation: turnOn 800ms ease-in-out;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  animation: none;
}

/* 新视图过渡 */
@keyframes turnOn {
  0% {
    clip-path: circle(0% at var(--click-x) var(--click-y));
  }

  100% {
    clip-path: circle(var(--end-radius) at var(--click-x) var(--click-y));
  }
}
```

可以完全使用 CSS 的伪元素配合增加或者移除**类**来实现过渡效果，但是使用 JavaScript 控制会更加灵活。

特性 | 自动触发 `startViewTransition` | 手动触发
---|----------------------------|-----
适用场景 | 简单的状态类切换 | 复杂的 DOM 变更或跨页面动画
动画控制 | 受限于 CSS 动画定义 | 完全可控，可插入任意逻辑
实现复杂性 | 更简单 | 需要额外的 JS 代码

### [JavaScript 相关的 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/startViewTransition)

`document.startViewTransition` 会接受一个改变当前 DOM 的回调函数，该回调函数完成兑现时，会返回一个 `ViewTransition` 对象。该对象可以的 `ready` 方法会在伪元素树被创建且过渡动画即将开始时兑现，如果过渡已经完成，则 `finished` 方法会返回一个已兑现的 `Promise`。

配合以上的 CSS 代码，就可以实现一个非常流畅的黑暗模式切换效果。

```js
document.startViewTransition(
  () => toggleColor(darkMode === 'dark', darkIcon),
)
;[
  ['--click-x', `${x}px`],
  ['--click-y', `${y}px`],
  ['--end-radius', `${endRadius}px`]
].forEach(([v, c]) => document.documentElement.style.setProperty(v, c))
```

### 过渡动画

在过渡动画中，经常可以看到在 AJAX 请求中，有一个圆圈过渡的动画，这个实现也是非常简单。

1. 圆圈动画的实现，实际上就是少了一个 border 的圆圈在不停的旋转：

    ```css
    .loading::after {
      content: "";
      display: block;
      position: absolute;
      top: 50vh;
      left: 50%;
      width: 60px;
      height: 60px;
      margin: -30px 0 0 -30px;
      border-radius: 50%;
      border-style: solid;
      border-color: var(--theme-color) var(--theme-color) var(--theme-color) transparent;
      animation: spin 1s ease-in-out infinite;
      z-index: 1;
    }
    
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
    
      100% {
        transform: rotate(360deg)
      }
    }
    ```

2. 在 AJAX 请求中，要选择对时机，在请求开始的时候添加 `.loading` 类，请求结束的时候移除 `.loading` 类。参见：<https://github.com/fwqaaq/fwqaaq.github.io/blob/13aab4ed811fa89898321e470382479ab053e5d8/public/JavaScript/index.js#L196-L204>

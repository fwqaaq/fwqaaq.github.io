---
title: css变量自定义
date: 2022-02-06 16:42:37
author: Jack-zhang
categories: CSS
tags:
   - CSS
summary: css自定义变量
---

## 使用css自定义属性

> 使用css自定义属性,是由css作者自定义的,他包含的值可以在整个`document`中重复使用

1. 使用自定义属性在某个地方存储一个值，然后在其他许多地方引用它
2. 更好的语义化标识
3. 自定义属性受级联的约束，并从其父级继承其值(<span style="color:red">自定义属性必须要定义在父级以上,才可以在子级中使用</span>)

### 基础语法

>* 声明一个自定义属性，属性名需要以两个减号（--）开始，属性值则可以是任何有效的CSS值
>* 通常定义在根伪类`:root`下,这样就可以在HTML的任何地方访问到了

```css
:root {
  --main-bg-color: black;
}
```

* 使用一个局部变量时用`var()`函数包裹以表示一个合法的属性值可以访问到其值

```css
body {
  background-color: var(--main-bg-color);
}
```

> 设置属性备用值

```css
.two {
  color: var(--my-var, red);
}
```

* 如果`--my-var`没有定义的化,可以直接使用`red`作为备用值

> 使用`fallback`,然而这可能导致性能问题(尽量避免)

```css
.three {
  background-color: var(--my-var, var(--my-background, pink)); 
}
```

### 使用JavaScript

>在js中获取或者修改css变量喝操作普通css属性是一样的

```js
let box = document.querySelector('.box')
box.style.setProperty('--bg-color', 'red')
console.log(getComputedStyle(box).getPropertyValue('--bg-color'))//red
```

* 如果不是自定义属性可以直接读取或者修改

```js
box.style.width = 300px
getComputedStyle(box).width
```

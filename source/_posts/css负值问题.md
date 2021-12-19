---
title: CSS负值问题
date: 2021-9-8 22:20:30
author: Jack-zhang
categories: CSS
tags:
   - CSS
summary: css负值运用
---

## margin负值

* 块级元素设置:
  1. ```margin-top```,此元素发生位移
  2. ```margin-bottom``` <span style="color:red">会发生位移的是其后边的元素</span>
  3. ```margin-left``` 块级元素发生位移，块级元素后边的内容不会发生位移，

* 行内元素
  1. 设置```margin-top margin-bottom``` <span style="color:red">都不会发生位移</span>
     * 解决:添加绝对定位(让其脱离文档流，比如浮动固定定位)，设置margin-top会发生位移
  2. 改变```vertical-align```的设置（middle top），行内块元素设置 ```margin-top margin-bottom``` 可以发生位移;
  3. 设置```margin-left margin-right```行内元素后的内容会发生位移

* 运动方向:![margin负值](margin负值.png)

## absolute的负值

> 子绝父相:父元素使用相对定位,子元素使用绝对定位

* Tips:
  1. 当激活的对象为绝对定位时,必须指定```left,right,top,bottom```中的至少一个.否则上述属性的默认值为<span style="color:red">auto</span>,这将导致对象遵循HTML布局规则
  2. 下文讲解一律是子元素是绝对定位,父元素为相对定位的情况

1. 当元素只设置一个方向元素有值时的运动方向,相对应方向元素的运动是相反的,下图只举例left,top的运动方向
   ![子元素运动方向](绝对定位移动.png)

2. 当元素设置对应方向值时,例如```left,right```和```top,bottom```,子盒子并不是移动方向,而是改变原有的大小
   ![子盒子大小的改变](绝对定位扩大盒子.png)

* 我的理解是:绝对定位是边的定位,相对的边的固定,会使盒子扩大

## ```transform:translate;```

> 理解:当单位为百分比是,<span style="color:red">以自身为基准</span>.当只有一个参数是,沿着x轴运动方向

* 运动方向与margin一致

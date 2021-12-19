---
title: CSS布局
date: 2021-9-9 1:8:30
author: Jack-zhang
categories: CSS
tags:
   - CSS
summary: css的布局以及居中的方式
---

## 布局

### 两列布局

#### 左定宽,右自适应

* float+margin

> 利用```margin-left```留出左边的定宽

```html
  <style>
    *{
      margin: 0;
      padding: 0;
    }
    .left{
      float:left ;
      width:12.5rem;
      height: 18.75rem;
      background-color: rebeccapurple;
      
    }
    .right{
      height: 18.75rem;
      background-color: blue;
      margin-left: 13rem;
    }
  </style>

  <div class="left"></div>
  <div class="right"></div>

```

* ```float+overflow```(利用BFC)
  1. BFC全称是块级格式化上下文，用于对块级元素排版，默认情况下只有根元素（body）一个块级上下文
  2. 但是如果一个块级元素设置了```float:left,overflow:hidden或position:absolute```样式，就会为这个块级元素生产一个独立的块级上下文，使这个块级元素内部的排版完全独立。
  3. 如何触发BFC
     * 根元素；
     * ```float```的值不为```none```；
     * ```overflow```的值为```auto、scroll或hidden```；
     * ```display```的值为```table-cell、table-caption和inline-block```中的任何一个；
     * ```position```的值不为```relative和static```。

> 通过```overflow:hidden;```将块级元素生产除一个独立的块级上下文

```html
 <style>
    *{
      margin: 0%;
      padding: 0%;
    }
    .left{
      background-color: blue;
      width: 12.5rem;
      height: 12.5rem;
      float: left;
      margin-right: 1.25rem;
    }
    .right{
      background-color: brown;
      height: 12.5rem;
      overflow: hidden;
    }
  </style>

  <!-- 给 right 设置 margin-left 的时候记得大于 left
直接给 left 设置 margin-right -->
  <div class="left"></div>
  <div class="right"></div>
```

* ```position:absolute```

```html
  <style>
    *{
      padding: 0%;
      margin: 0%;
    }
    .parent{
      position: relative;
      height: 12.5rem;
    }
    .left{
      width: 12.5rem;
      height: 12.5rem;
      position: absolute;
      background-color: brown;
    }
    .right{
      height: 12.5rem;
      position: absolute;
      background-color: chartreuse;
      left: 12.5rem;   
      right: 0;/* 撑大盒子 */
      margin-left: 1.25rem;
    }
  </style>

  <div class="parent">
    <!-- 绝对定位是边的定位,偏移量取正值,子盒子向里靠拢 -->
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

* flex布局

```html
  <style>
    *{
      padding: 0%;
      margin: 0%;
    }
   .container{
     display: flex;
     width: 100%;
   }
   .left{
     width: 12.5rem;
     height: 12.5rem;
     background-color: blue;
   }
   .right{
     flex-grow: 1;/* 自适应的分数 */
     height: 12.5rem;
     background-color: chartreuse;
     margin-left: 1.25rem;
   }
  </style>

  <div class="container">
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

#### 右定宽,左自适应

* ```float+margin```

```html
  <style>
    .left{
      background-color: blue;
      height: 12.5rem;
      margin-right: 7rem;
    }
    .right{
      background-color: hotpink;
      width: 6.25rem;
      height: 12.5rem;
      float: right;
      margin-top: -12.5rem;
    }
  </style>

  <div class="container">
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

* ```float+overflow```

> 思路:利用```float+overflow```产生独立的块级上下文

```html
<style>
  .right{
    float: right;
    height: 12.5rem;
    width: 12.5rem;
    background-color: gold;
    margin-left: 1.25rem;
  }
  .left{
    background-color: blueviolet;
    height: 12.5rem;
    overflow: hidden;
  }
</style>

  <!-- 浮动会脱标,从而达到固定的效果 -->
  <div class="right"></div>
  <div class="left"></div>
```

* ```position:absolute;```

```html
  <style>
    .container{
      position: relative;
      height: 12.5rem;
        }
    .right{
      position: absolute;
      width: 12.5rem;
      height: 12.5rem;
      background-color: gold;
      right: 0;
    }
    .left{
      position: absolute;
      height: 12.5rem;
      right: 13rem;
      background-color: gray;
      left:0;
    }
  </style>

  <div class="container">
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

* flex布局

```html
  <style>
    .container{
      display: flex;
    }
    .left{
      flex-grow: 1;
      height: 12.5rem;
      background-color: gray;
    }
    .right{
      height: 12.5rem;
      width: 12.5rem;
      background-color: yellow;
      margin-left: 1.25rem;
    }
  </style>

  <div class="container">
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

### 三栏布局

#### 中间自适应

* **流体布局**
  
> * 左右模块各自向左右浮动，并设置中间模块的 margin 值使中间模块宽度自适应。
> * 缺点就是主要内容无法最先加载，当页面内容较多时会影响用户体验。

```html
<style>
  *{
    padding: 0%;
    margin: 0%;
  }
  .left{
    float: left;
    width: 12.5rem;
    height: 18.75rem;
    background-color: aqua;
  }

  .main{
    /* 外边距增加间隙 */
    margin-left: 13.75rem;
    margin-right: 13.75rem;
    height: 18.75rem;
    background-color: cornflowerblue;
  }
  .right{
    float: right;
    width: 12.5rem;
    height: 18.75rem;
    background-color: brown;
  }
</style>

  <div class="container">
    <div class="left"></div>
    <div class="right"></div>
    <div class="main"></div>
  </div>
```

* **BFC三栏布局**

> 缺点跟方法一类似，主要内容模块无法最先加载，当页面中内容较多时会影响用户体验

```html
 <style>
    .left{
      float:left;
      height: 12.5rem;
      width: 6.25rem;
      margin-right: .625rem;
      background-color: red;
    }
    .right{
      float:right;
      height: 12.5rem;
      width: 6.25rem;
      margin-left: .625rem;
      background-color: seagreen;
    }
    .main{
      height: 12.5rem;
      background-color: skyblue;
      /* 隐藏溢出元素 */
      overflow: hidden;
    }
  </style>

  <div class="container">
    <div class="left"></div>
    <div class="right"></div>
    <div class="main"></div>
  </div>
```

* **圣杯布局**

```html
  <style>

    .container{
      margin-left: 7.5rem;
      margin-right: 13.75rem;
    }
    .main{
      height: 12.5rem;
      background-color: red;
    }
    .left{
      float: left;
      width: 7rem;
      height: 12.5rem;
      background-color: seagreen;
      /* position: relative;
      left: -7.5rem; */
      /* 等同于 */
      margin-left: -7.5rem;
      margin-top: -12.5rem;
    }
    .right{
      float: right;
      width: 12.5rem;
      height: 12.5rem;
      background-color: sienna;
      position: relative;
      left: 13.75rem; 
      margin-top: -12.5rem;
    }
  </style>

  <div class="container">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

* **position:absolute**

```html
  <style>
    .container{
      position: relative;
    }
    .main{
      height: 12.5rem;
      margin:0 7.5rem;
      background-color: blue;
    }
    .left{
      position: absolute;
      width: 6.25rem;
      height: 12.5rem;
      left:0;
      top:0;
      background-color: blueviolet;
    }
    .right{
      position: absolute;
      width: 6.25rem;
      height: 12.5rem;
      background-color: brown;
      top: 0;
      right: 0;
    }
  </style>

  <div class="container">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

* **双飞翼布局**

```html
<style>
  .content{
    float: left;
    width: 100%;
  }
  .main{
    height: 12.5rem;
    margin-left: 6.25rem;
    margin-right: 12.5rem;
    background-color: green;
  }
  .left{
    float: left;
    background-color: hotpink;
    height: 12.5rem;
    width: 5.625rem;
    /* margin-top: -12.5rem; */
    margin-left:-100%;
  }
  .right{
    float: right;
    height: 12.5rem;
    width: 12rem;
    margin-left: -12.5rem;
    /* margin-top: -12.5rem; */
    background-color: khaki;
  }
</style>

 <div class="content">
   <div class="main"></div>
 </div>
<div class="left"></div>
<div class="right"></div>
```

* **flex布局**

```html
  <style>
    .container{
      display: flex;
    }
    .main{
      flex-grow: 1;
      height: 12.5rem;
      background-color: red;
    }
    .left{
      order: -1;
      flex:0 1 12.5rem;
      width: 6.25rem;
      height: 12.5rem;
      margin-right: 1.25rem;
      background-color: green;
    }
    .right{
      flex:0 1 6.25rem;
      width: 12.5rem;
      height: 12.5rem;
      margin-left: 1.25rem;
      background-color: blue;
    }
  </style>

  <div class="container">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
</body>
```

#### 两列定宽

* **float+margin**
  
```html
  <style>
    .left{
      float: left;
      background-color: salmon;
      height: 12.5rem;
      width: 6.25rem;
      margin-right: 1.25rem;
    }
    .center{
      float: left;
      height: 12.5rem;
      width: 18.75rem;
      background-color: sandybrown;
    }
    .right{
      background-color: darkorchid;
      margin-left: 27rem;
      height: 12.5rem;
    }
  </style>

  <div class="left"></div>
  <div class="center"></div>
  <div class="right"></div>
```

* **float+hidden**

```html
<style>
    .left{
      float: left;
      background-color: darkorchid;
      height: 12.5rem;
      width: 6.25rem;
      margin-right: 1.25rem;
    }
    .center{
      float: left;
      background-color: darkred;
      height: 12.5rem;
      width: 18.75rem;
      margin-right: 1.25rem;
    }
    .right{
      background-color: darkslategrey;
      height: 12.5rem;
      overflow: hidden;
    }
  </style>

  <div class="left"></div>
  <div class="center"></div>
  <div class="right"></div>
```

* **position:absolute**

```html
<style>
  .parent {
    position: relative;
    height: 12.5rem;
  }
  .left{
    position: absolute;
    background-color: darkslategrey;
    height: 12.5rem;
    width: 6.25rem;
  }
  .center{
    position: absolute;
    background-color: darkturquoise;
    height: 12.5rem;
    width: 18.75rem;
    left: 7rem;
  }
  .right{
    position: absolute;
    background-color: deepskyblue;
    height: 12.5rem;
    right: 0;
    left: 27rem;
  }
</style>

  <div class="parent">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
  </div>
```

* **flex布局**

```html
  <style>
    .parent{
      display: flex;
    }
    .left{
      background-color: deepskyblue;
      width: 8.75rem;
      height: 12.5rem;
      margin-right: 1.25rem;
    }
    .center{
      background-color: dimgray;
      width: 12.5rem;
      height: 12.5rem;
      margin-right: 1.25rem;
    }
    .right{
      background-color: dodgerblue;
      height: 12.5rem;
      flex-grow: 1;
    }
  </style>

  <div class="parent">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
  </div>
```

### 多列布局

#### 多列等宽

* **float**

```html
 <style>
    .parent{
      /* 抵消最左边的盒子的padding-left */
      margin-left: -0.625rem;
    }
    .column {
      float: left;
      /* 改变盒模型宽度影响 保持设置了 padding 也在一行内 */
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      /* background-clip 只是为了方便看效果，因为 padding 也是有背景色的 */
      background-clip: content-box;
      width: 20%;
      height: 31.25rem;
      /* 不能用 margin-left，会把盒子挤下去，必须 padding 配合 border-box 使用 */
      padding-left: 10px;
    }
    .column:nth-child(2n){
      background-color: blueviolet;
    }
    .column:nth-child(2n-1){
      background-color: brown;
    }
  </style>

  <div class="parent">
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
  </div>
```

* **flex布局**

```html
  <style>
    .parent{
      display: flex;
      margin-left: -0.625rem;
    }
    .column{
      flex: 1;
      margin-left: .625rem;
      width: 20%;
      height: 12.5rem;
    }
    .column:nth-child(2n){
      background-color: brown;
    }
    .column:nth-child(2n+1){
      background-color: blueviolet;
    }
  </style>

  <div class="parent">
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
  </div>
```

#### 九宫格布局

* **flex布局**

```html
<style>
    .parent{
      display: flex;
      flex-direction: column;
    }
    .row{
      display: flex;
      flex-grow: 1;
      background-color: brown;
    }
    .item{
      flex:1 0 auto;
      height: 12.5rem;
      background-color:green;
      padding-right: .625rem;
      padding-bottom: .625rem;
      background-clip: content-box;
    }
  </style>

  <div id="parent">
    <div class="row">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
    </div>
    <div class="row">
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
    </div>
    <div class="row">
      <div class="item">7</div>
      <div class="item">8</div>
      <div class="item">9</div>
    </div>
  </div>
```

* **flex换行(wrap优化)**

```html
<style>
     .parent{
       width:100%;
       margin: 0 auto;
       display: flex;
       flex-wrap: wrap;
       background-color: green;
     }
     .child{
       flex-grow: 1;
       width:calc(100%/3);
       height: 6.25rem;
       -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
       box-sizing: border-box;
       padding-right: .625rem;
       padding-bottom: .625rem;
       background-color: grey;
       background-clip: content-box;
     }
  </style>

  <!-- 这种方式不用三个套一行的方式，比较灵活，数量不限制，满足三个 child 自动换行。 -->
  <div class="parent">
    <div class="child">
      <span>1</span>
    </div>
    <div class="child">
      <span>1</span>
    </div>
    <div class="child">
      <span>1</span>
    </div>
    <div class="child">
      <span>1</span>
    </div>
    <div class="child">
      <span>1</span>
    </div>
    <div class="child">
      <span>1</span>
    </div>
    <div class="child">
      <span>1</span>
    </div>
    <div class="child">
      <span>1</span>
    </div>
    <div class="child">
      <span>1</span>
    </div>
  </div>
```

### 全屏布局

* **position:absolute**

```html
<style>
  *{
    padding: 0%;
    margin: 0%;
  }
  html,
  body,
  #parent {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  #parent>div {
    border: 1px solid #000;
  }

  #top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
  }

  #left {
    position: absolute;
    top: 100px;
    /*值大于等于#top的高度*/
    left: 0;
    bottom: 50px;
    /*值大于等于#bottom的高度*/
    width: 200px;
  }

  #right {
    position: absolute;
    overflow: auto;
    left: 200px;
    /*值大于等于#left的宽度*/
    right: 0;
    top: 100px;
    /*值大于等于#top的高度*/
    bottom: 50px;
    /*值大于等于#bottom的高度*/
  }

  #bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
  }
</style>

  <div id="parent">
    <div id="top">top</div>
    <div id="left">left</div>
    <div id="right">right</div>
    <div id="bottom">bottom</div>
  </div>
```

* **Flex布局**

```html
  <style>
    *{
      padding: 0%;
      margin: 0%;
    }
    html,body,#parent{
      height: 100%;
    }
    #parent{
      display: flex;
      flex-direction: column;
    }
    div{
      box-sizing: border-box;
    }
    #top{
      height: 6.25rem;
      background-color: blueviolet;
    }
    #bottom{
      height: 3.125rem;
      background-color: cadetblue;
    }
    #middle{
      flex-grow: 1;
      display: flex;
    }
    #left{
      background-color: chocolate;
      flex-grow: 2;
    }
    #right{
      background-color: crimson;
      flex-grow: 1;
    }
  </style>

  <div id="parent">
    <div id="top">top</div>
    <div id="middle">
      <div id="left">left</div>
      <div id="right">right</div>
    </div>
    <div id="bottom">bottom</div>
  </div>

```

## 居中

### 水平居中

* **行内元素居中**

```html
  <style>
    div{
      width: 6.25rem;
      height: 6.25rem;
      background-color: crimson;
      text-align: center;
    }
    span{
      background-color: darkblue;
    }
  </style>

  <div>
    <span>绿色</span>
  </div>
```

* **块级元素margin居中**

```html
  <style>
    .parent{
      width: 12.5rem;
      height: 12.5rem;
      background-color: darkcyan;
    }
    .son{
      width: 3.125rem;
      height: 3.125rem;
      background-color: darkgoldenrod;
      margin: 0 auto;
    }
  </style>

  <div class="parent">
    <div class="son"></div>
  </div>
```

* **子元素含float(用这个的都是伞兵)**

```html
  <style>
    .parent{
      margin: 0 auto;
      background-color: darkgray;
      width: 12.5rem;
      height: 12.5rem;

    }
    .son{
      float: left;
      background-color: darkgoldenrod;
      width: 3.125rem;
      height: 3.125rem;
    }
  </style>

  <div class="parent">
    <div class="son"></div>
  </div>
```

* **flex布局**

```html
  <style>
    .parent{
      display: flex;
      justify-content: center;
      width: 12.5rem;
      height: 12.5rem;
      background-color: darkcyan;
    }
    .son{
      width: 3.125rem;
      height: 3.125rem;
      background-color: darkgoldenrod;
    }
  </style>

  <div class="parent">
    <div class="son"></div>
  </div>
</body>
```

* **position:absolute**
  
  * ```left:0;right:0;```
  
  ```html
    <style>
    .parent{
      position: relative;
      width: 12.5rem;
      height: 12.5rem;
      background-color: darkcyan;
    }
    .son{
      position: absolute;
      width: 3.125rem;
      height: 3.125rem;
      background-color: darkgoldenrod;
      /* 左右偏移量相同时 */
      left: 0;
      right: 0;
      margin: 0 auto;
    }
  </style>

  <div class="parent">
    <div class="son"></div>
  </div>
  ```

  * left

  ```html
    <style>
    .parent{
      position: relative;
      width: 12.5rem;
      height: 12.5rem;
      background-color: darkcyan;
    }
    .son{
      position: absolute;
      width: 3.125rem;
      height: 3.125rem;
      background-color: darkgoldenrod;
      /* 左右偏移量相同时 */
      left: 0;
      right: 0;
      margin: 0 auto;
    }
  </style>

  <div class="parent">
    <div class="son"></div>
  </div>
  ```

  * transform

  ```html
    <style>
    .parent{
      position: relative;
      width: 12.5rem;
      height: 12.5rem;
      background-color: darkcyan;
    }
    .son{
      position: absolute;
      width: 3.125rem;
      height: 3.125rem;
      background-color: darkgoldenrod;
      left: 50%;
      transform: translate(-50%,0);
    }
  </style>

  <div class="parent">
    <div class="son"></div>
  </div>
  ```

### 垂直居中

* **flex**

```html
  <style>
    .parent{
      display: flex;
      width: 12.5rem;
      height: 12.5rem;
      background-color: darkcyan;
      align-items: center;
      justify-content: center;
    }
    .son{
      width: 3.125rem;
      height: 3.125rem;
      background-color: darkgoldenrod;
    }
  </style>

  <div class="parent">
    <div class="son"></div>
  </div>
</body>
```

* **绝对定位**
  
  * ```top,bottom,left,right=0```
  
  ```html
    <style>
    .parent{
      position: relative;
      background-color: darkgray;
      width: 12.5rem;
      height: 12.5rem;
    }
    .son{
      position: absolute;
      background-color: darkgreen;
      width: 3.125rem;
      height: 3.125rem;
      right: 0;
      top: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
  </style>

  <div class="parent">
    <div class="son"></div>
  </div>
  ```

  * ```transform```

  ```html
    <style>
    .parent{
      position: relative;
      background-color: darkgray;
      width: 12.5rem;
      height: 12.5rem;
    }
    .son{
      position: absolute;
      background-color: darkgreen;
      width: 3.125rem;
      height: 3.125rem;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  </style>
  <div class="parent">
    <div class="son"></div>
  </div>
  ```

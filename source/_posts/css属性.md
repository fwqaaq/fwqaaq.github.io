---
title: CSS属性
date: 2021-8-28 19:34:30
author: Jack-zhang
categories: CSS
tags:
   - CSS
summary: css语法以及css3的相关内容,媒体查询,动画和盒子模型等.
---

## css基础

| 布局方式   | 描述                                                                                                                                                      | 特点                                                                   | 场景                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| 静态布局   | Static Layout,传统Web设计,网页上的所有元素的尺寸一律使用px作为单位.不管浏览器尺寸具体是多少,网页布局始终按照最初写代码时的布局来显示.一般需要设置最小宽度 | 不能根据用户的屏幕尺寸做出不同的表现                                   | 传统PC网页                                          |
| 流式布局   | Liquid Layout,页面元素的宽度按照屏幕分辨率进行适配调整,但整体布局不变.代表作栅栏系统（网格系统）                                                          | 网页中主要的划分区域的尺寸使用百分数（搭配min-、max-属性使用）         | 屏幕分辨率变化时,页面里元素的大小会变化而但布局不变 |
| 自适应布局 | Adaptive Layout,使用@media分别为不同的屏幕分辨率定义布局,即创建多个静态布局,每个静态布局对应一个屏幕分辨率范围                                            | 屏幕分辨率变化时,页面里面元素的位置会变化而大小不会变化                | -                                                   |
| 响应式布局 | Responsive Layout,一个页面在所有终端上（各种尺寸的PC、手机、手表、冰箱的Web浏览器等等）都能显示出令人满意的效果                                           | 每个屏幕分辨率下面会有一个布局样式,即元素位置和大小都会变              | 多终端页面                                          |
| 弹性布局   | rem/em布局,包裹文字的各元素的尺寸采用em/rem做单位,而页面的主要划分区域的尺寸仍使用百分数或px做单位                                                        | 理想状态是所有屏幕的高宽比和最初的设计高宽比一样,或者相差不多,完美适应 | 移动端                                              |

* **"流体布局"**,指的是利用元素"流"的特性实现的各类布局效果.因为"流"本身 具有自适应特性,所以"流体布局"往往都是具有自适应性的. 但是,"流体布局"并不等同于 "自适应布局".
* **"自适应布局"**是对凡是具有自适应特性的一类布局的统称,"流体布局"要狭窄得多.例如,表格布局也可以设置为100%自适应,但表格和"流"不是一路的,并不属于"流体布局". 通俗的说,流体布局就是在width:auto;或者格式化宽/高中,通过设定`margin/border/padding`来影响content的布局的方式

### width:auto

1. **充分利用空间**,块级元素的默认宽度使父级元素宽度的100%
2. **收缩与包裹**,当元素处于浮动,绝对定位或者为内敛快元素或table元素,父级元素失去原有的宽度收缩到与内部元素一样
3. **收缩到最小**,这个容易出现在table-layout为auto的表格中,为了超过父级元素的宽度
4. **超出容器限制**,除非右明确的width相关设置,否则上面三种情况都不会超过父级的容器宽度(如果设置很长的英文,或者`white-space:nowrap`)

#### 外部尺寸与流体特性

1. 正常流宽度默认是`100%`
   * 在页面中随便扔一个div元素,其尺寸表现就会和水流一样铺满容器.这就 是block 容器的流特性.
   * 所谓流动性是一种根据`margin/border/padding/content`属性对其内容区域自动分配水平空间的机制
  
   ```html
   <style>
   .width {
     width: 100%;
   }
   .nav {
     background-color: #cd0000;
   }
   .nav-a {
     display: block;
     margin: 0 10px;
     padding: 9px 10px;
     border-bottom: 1px solid #b70000;
     border-top: 1px solid #de3636;
     color: #fff;
   }
   .nav-a:first-child {
     border-top: 0;
   }
   .nav-a + .nav-a + .nav-a {
     border-bottom: 0;
   }
   </style>
   ...
   <h4>无宽度,借助流动性</h4>
   <div class="nav">
     <a href="" class="nav-a">导航1</a>
     <a href="" class="nav-a">导航2</a>
     <a href="" class="nav-a">导航3</a>
   </div>
   <h4>width:100%</h4>
   <div class="nav">
     <a href="" class="nav-a width">导航1</a>
     <a href="" class="nav-a width">导航2</a>
     <a href="" class="nav-a width">导航3</a>
   </div>
   ```

2. 格式化宽度
   * 格式化宽度仅出现在"绝对定位模型"中,也就是出现在position属性值为absolute和fixed的元素中,在预设情况下绝对定位元素的宽度表现是"包裹性","宽度由内部尺寸决定",但是有一中情况下由外部尺寸决定.
   * 在 CSS 中,可替换元素（replaced element）的展现效果不是由 CSS 来控制的.这些元素是一种外部对象,它们外观的渲染,是独立于 CSS 的. 典型的可替换元素有：<iframe><video><embed><img>
   * 对于非替换元素,当 left/right 或 top/bottom 对立方位的属性值同时存在的时候,元素的宽度表现为"格式化宽度",其宽度大小相对于最近的具有定位特性 (position属性值不是static) 的祖先元素计算

   ```html
   <style>
   .father {
      position: relative;
      width: 300px;
      height: 150px;
      border: 1px solid saddlebrown;
    }
    .father > .son {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      margin: auto;
      width: 100px;
      height: 50px;
      border: 1px solid salmon;
    }
   </style>
   <div class="father">
     <div class="son"></div>
   </div>
   ```

#### 内部尺寸与流体特性

>所谓"内部尺寸",简单来讲就是元素的尺寸由内部的元素决定,而非由外部的容器决定.

1. 包裹性
   * 包裹性"除了"包裹",还有"自适应性".所谓"自适应性"指的是元素尺寸由内部元素决定,但永远小于"包含块"容器的尺寸(除非容器尺寸小于元素的"首选最小宽度").
   * 按钮就是css世界中极具代表性的inline-block元素,可谓展示"包裹性"最好的例子,具体表现为：按钮文字越多宽度越宽(内部尺寸特性),但如果文字足够多,则会在容器的宽度处自动换行(自适应性)

2. 首选最小宽度
   * 图片和文字的权重要远大于布局,当布局中存在更高权重元素时(如width:0 不生效)最小宽度受其内容影响 (文字中的最小宽度为单个字符宽度)
   * `word-break: break-all` break-all 对于non-CJK (CJK 指中文/日文/韩文) 文本,可在任意字符间断行.

3. 最大宽度
   * white-space CSS 属性是用来设置如何处理元素中的空白.
   * 最大宽度就是元素可以有的最大宽度."最大宽度"实际等同于"包裹性"元素设置white-space: nowrap 声明后的宽度.(连续的空白符会被合并.但文本内的换行无效) 如果内部没有块级元素或者块级元素没有设定宽度值,则"最大宽度"实际上是最大的连续内联盒子的宽度

#### css流体布局下的宽度分离原则

>所谓"宽度分离原则"就是css中的width属性不与影响宽度的padding/border（有时候包括margin）属性共存, 通过设置 padding,margin,border,内部内容通过 width：auto 自动填充

#### min-width/max-width和min-height/max-height

>为流体而生的min-width/max-width

* 比如,网页宽度在1200～1400像素自适应,既满足大屏的大气又满足笔记本的良好显示,此时,`min-width/max-width`就可以大显神威了

```css
.container {
  min-width: 1200px;
  max-width: 1400px;
}
```

* 公众号的热门文章中,经常会有图片,这些图片都是用户上传产生的,因此尺寸会有大有小,为了避免图片在移动端展示过大的影响体验,常常会有下面的max-width限制

```css
img {
    max-width: 100%;
    height: auto!important;
}
```

* 原始图片有设定height,max-widht生效的时候图片就会被水平压缩.强制height为auto可以确保宽度不超出的同时使图片保持原来的比例. 但这样也会有体验上的问题,那就是在加载时图片占据高度会从0变成计算高度,图文会有明显的瀑布式下落

> 不同的初始值:`min-weidht/min-height` 的初始值是auto,`max-width/max-height` 的初始值是 none

* 超越!important,超越最大.超越!important 指的是 max-width 会覆盖 width
* 比方说,针对下面的 HTML 和 CSS 设置,图片最后呈现的宽度是多少？

```html
<img scr="1.jpg" style="width: 480px!important;"/>
<style>
img {
    max-width: 256px;
}
</style>
```

* 答案是256px.style、!important通通靠边站！因为max-width会覆盖width

* 超越最大指的是`min-width`的值大于`max-width`值时取`min-width`的值超越最大值得是min-width覆盖max-width,此规则发生在min-width和max-width冲突时

```css
.container {
  min-width: 1400px;
  max-width: 1200px;
}
```

* 最小宽度比最大宽度设置得还要大,遵循"超越最大"规则(注意不是"后台者居上"规则) 值取`min-width,max-width`被忽略,于是,.container元素表现为至少1400像素宽

### height:auto

>关于`height:100%`无效

* height和width还有一个比较明显的区别就是对百分比单位的支持.对于width属性,就算父元素width为auto,其百分比也是支持的；但是,对于height属性,如果父元素height为auto,只要子元素在文档流中,其百分比值完全就被忽略了.

```css
div {
  width: 100%; /* 这是多余的 */
  height: 100%; /* 这是无效的 */
  background: url(bg.jpg);
}
```

>要明白其中的原因要先了解浏览器渲染的基本原理. 首先,先下载文档内容,加载头部样式资源（如果有的话）,然后按照从上而下、自外而内的顺序渲染DOM内容. 套用本例就是,先渲染父级元素,后渲染子元素,是有先后顺序的.因此,当渲染到父元素的时候,子元素的width:100%并没有渲染,宽度就是图片加文字内容的宽度；等渲染到文字这个元素的时候,父元素的宽度已经固定,此时的width:100%就是已经固定好的父元素的宽度. 宽度不够怎么办？溢出就好了,overflow属性就是为此而生的

* 由于没有显示定义height,就将height解释成字符串`auto`=>`'auto' * 100/100 = NaN`

>设置显示的高度(或者也可以使用绝对定位)

```css
html, body {
    height: 100%;
}
```

#### 任意高度元素的展开收起动画技术

>第一反应就是使用`height + overflow:hidden`实现,但是,很多时候我们展开的元素内容是动态的,换句话说高度不是固定的,因此,height使用的值是默认的auto,应该都知道的auto是个关键字值,并非数值,正如height: 100%的100%无法和auto相计算一样,从0px到auto是无法计算的,因此无法形成过渡或动画效果

```css
/* 因此,下面代码呈现的效果也是生硬的展开和收起 */
.element {
    height: 0;
    overflow: hidden;
    transition: height .25s;
}

.element.active {
    height: auto; /* 没有transition效果,只是生硬的展开 */
}

/* 难道就没有什么一劳永逸的实现方法吗？有,不妨试试max-height */
.element {
    max-height: 0;
    overflow: hidden;
    transition: max-height .25s;
}

.element.active {
    max-height: 666px /* 一个足够大的高度值 */
}
```

>其中展开后的max-height值,我们只需要设定为保证比展开内容高度大的值就可以,因为max-height值比height计算值大的时候,元素的高度就是height属性的计算高度, 在本交互中,也就是height: auto时候的高度值。于是,一个高度不定的任意元素的展开动画就实现了

* 但是,使用此方法也有一点要注意,既虽然从适用范围讲,max-height值越大使用场景越多,但是,如果max-height值太大,在收起的时候可能会有“效果延迟”的问题。比方说,展开的元素高度是100px,而max-height是1000px,动画时间是250ms,假设动画函数是线性的,则前255ms我们是看不到收起效果的,因为max-height从1000像素到100像素变化这段时间,元素不会有区域被隐藏,会给人动画延迟225ms的感觉

* 因此,建议max-height使用足够安全的最小值,这样,收起时即使有延迟效果,也会因为时间很短,很难给用户察觉,并不会影响体验

### css的引入样式

1. 内部样式表:将代码写在```<style></style>```中
2. 行内样式表:```<div style="color:red">你好</style>```
3. 外部样式表:```<link ref="stylesheet(样式表)" href="路径">```

### 字体属性

1. 字体:```font-family:"Arial";```,属性可以写英文可以写中文
2. 字体大小: ```font-size:20px;```,属性是数值
3. 字体粗细:```font-weight:属性;```,提倡用数字表示(无单位),
   * normal:不加粗,等同于400
   * bold: 加粗,等同于700
4. 文字样式:```font-style:属性;```,```normal```:默认值,标准样式;```italic```:斜体字体样式
5. 简写 ```font:font-style font-weight font-size/line-height font-family```(<span style="color:red">不能颠倒顺序,且font-size和font-family不能省略</span>)

### 文本属性

1. 文本颜色:```color:red```
   * 预定义颜色:red等; 十六进制:#FF0000等; RGB:rgb(255,0,0)
2. 对齐文本:```text-align:center```,只能实现水平对齐
   * 左对齐:left;  右对齐:right;  居中对齐:center
3. 装饰文本:```text-decoration:none;```
   * none:默认,无装饰;underline:下划线:<span style="color:red">链接a自带下划线</span>;overline:上划线;line-through:上划线
4. 文本缩进:首行缩进,```text-indent:2em;```,em是当前文字的大小,<span style="color:red">1em=16px</span>
5. 行间距: ```line-height:50px;```;<span style="color:red">行间距=上间距+文本高度(默认16px)+下间距</span>

### Emment语法

1. 生成多个相同标签,用*,例如:div*3
2. 父子级关系标签,用>,例如,ul>li
3. 兄弟级关系的标签,用+,例如div+p  
4. 生成带有类名的或者id名的,直接写.demo或者#two, tab键
5. 如果生成div类名是有顺序的,可以用自增符号,例:```.demo$*5```
6. 如果在生成的标签内部些内容,可以用{}表示,```div{你好}```,tab键

### 背景

1. 背景颜色:```background-color:red;```,默认是<span style="color:red">transparent</span>
2. 背景图片:```background-image:url();```,默认是none
3. 背景平铺:```background-repeat:repeat;```,默认情况下是repeat

   | 属性:      | 值       |
   | ---------- | -------- |
   | repeat:    | 平铺     |
   | no-repeat: | 不平铺   |
   | repeat-y:  | 纵向平铺 |
   | repeat-x:  | 横向平铺 |

   * 注意:页面元素可以添加背景颜色也可以添加背景图片  只不过背景图片会压住背景颜色

4. 背景位置:```background-position:x y;```,可以使用<span style="color:red">方位名词</span>或者<span style="color:red">精确单位</span>
   * 参数是方位名词:```background-position:center top;```
     * 其中方位名词,和顺序无关
     * 如果只指定了一个方位名词,另一个省略,则第二个默认居中对齐```background-position:top;```
   * 参数是精确单位:```background-position:20px 50px;```
     * 其中x一定是第一个,第二个一定是y
     * 如果只指定一个数值,那么该数值一定会是x坐标,另一个默认垂直居中```background-position:50px;```
   * 参数是混合单位:```background-position:20px top;```
     * 如果指定的两个值是精确单位和方位名词混合使用,则第一个值是x坐标,第二个值是y坐标
5. 背景图像固定(背景附着):```background-attachment:scroll;```,背景图像是否固定或者随着页面的其余部分滚动,<span style="color:red">默认:滚动</span>

   | 参数   | 作用                       |
   | ------ | -------------------------- |
   | scroll | 背景图像是随着对象内容滚动 |
   | fixed  | 背景图像固定               |

6. 背景复合写法```background:背景颜色 背景图片地址 背景平铺 背景图像滚动 背景图片位置```,<span style="color:red">无顺序要求</span>
7. 背景图片半透明效果:```background:rgba(0,0,0,0.3)```,第四个参数(alpha透明度)取值范围在0~1之间

| 属性                  | 作用     | 值                                         |
| --------------------- | -------- | ------------------------------------------ |
| background-color      | 背景颜色 | 预定义/十六进制/RGB                        |
| background-img        | 背景图片 | url(路径)                                  |
| background-repeat     | 是否平铺 | repeat/no-repeat/repeat-y/repeat-x         |
| background-position   | 背景位置 | length/position                            | x和y值 |
| background-attachment | 背景附着 | scroll(背景图像滚动) /fixed (背景图像固定) |

## css特性

### 层叠性

* 样式冲突,遵循就近原则,哪个样式离结构近,就执行哪一个
* 样式不冲突,不会层叠

### 继承性

* 恰当是使用继承性,可以降低css样式的复杂性
* 子元素可以继承父元素的样式(text-,font-,line-这些元素开头的可以继承,以及color属性)
* 行高的继承```font:12px/1.5 "Microsoft YaHei"```,1.5指行高是字体的1.5倍,也即是18px
  * 如果子元素没有设置行高,则会继承父元素的行高为1.5
  * 此时子u元素的行高是:当前元素的字体大小*1.5

## 盒子模型

### 内容(content)

#### 替换元素

>替换元素:通过修改某个属性值呈现的内容就可以被替换的元素就称为替换元素(例如\<img>,\<input>登都是典型的替换元素)

1. 内容外观不受页面上的css的影响.即样式表现在css之外
2. 有自己的尺寸.默认的尺寸(不包括边框)是300px*150px,像\<video>等.也有如\<img>这样替换元素为0px的.
3. 在css属性上有一套自己的表现规则

* \<select>:首先内容可以替换,如果设置multiple属性,下拉就变成了展开直选多选的模式.并且样式外部的css很难更改.最后他也有自己的尺寸

> 替换元素的默认display

* 一般替换元素是内联元素(`inline`)或者是行内块元素(`inline-block`)

> 替换元素的尺寸

1. 固有尺寸:替换内容原本的尺寸
2. HTML尺寸,这些HTML原生的尺寸.例如\<img>的width,height,\<input>的size,\<textarea>的cols和rows
3. CSS尺寸,通过css属性的width和height或者max-width/min-width和max-height/min-height设置尺寸

* 注意
  * 如果固有尺寸含有固有的宽高比例,同时设置了宽度和高度,则元素依然按照固有的宽高比例
  * \<img>中如果图片缺省,不需要使用`src=""`,只要有`src=""`就会产生请求

>`object-fit`:替换内容的适配方式

1. 默认是`fill`,也就是外部设定的尺寸多大,我就填满,跟着一样大
2. `none`:图片的尺寸完全不受控制.会保持图片原来的大小.如果设置了大小,超过范围不会显示
3. `contain`:保持图片比例,尽可能利用html的尺寸但是不会超出的显示方式

* 同时在伪元素中可以使用`content:attr()`获取html标签中的属性例如`attr(alt)`.url等也可以使用

>content元素与替换元素

* `content`属性生成的对象被称为匿名替换元素

1. 使用content生成的文本是无法选中的,也是无法复制的.同时content生成的文本无法被屏幕设备阅读,搜索引擎抓取
2. 不能左右`:empty`(当元素中没有内容时进行匹配)伪类
3. 动态生成的值无法获取(自动累加,计数器)

#### content内容生成

> content设置成空字符串,然后利用其他的css代码生成辅助元素,或实现图形,或实现特定布局.

1. content中图片生成,直接使用`content:url()`不易控制图片.

   ```css
   div::before{
     content:'';
     background:url();
   }
   ```

2. attr属性值生成内容.除了原生的html属性.也可以使用自定义的html属性

> content计数器.两个属性`counter-reset`和`counter-increment`.两个方法`counter()`和`increment()`

1. **counter-reset**:计数器-重置,默认是从0开始,可以使用负数或者小数(各个浏览器不同)
   * 同时可以多个计数器同时命名
2. **counter-increment**:计数器递增.值为`counter-reset`的一个或者多个关键字,后面可以跟数字,表示每次计数的变化值

    ```html
    <style>
      .counter {
        counter-reset: cun 2;
        counter-increment: cun 1;
      }
      .counter:before {
        content: counter(cun);
      }
    </style>
    <body>
      <p class="counter"></p>
      <p class="counter"></p>
    </body>
    ```

3. `counter()/counters()`:显示计数
   * `counter(name,style)`,其中style支持的参数就是`list-style-type`支持的参数
   * `counters(name,string,style)`string参数是字符串,表示子序号的连接字符串
     * 使用这个方法可以实现序列的嵌套.通过子辈对父辈的`counter-reset`重置,配合counters()方法

```html
<style>
  .reset {
    counter-reset: cun 0;
  }
  .counter:before {
    counter-increment: cun 1;
    content: counters(cun, ".");
  }
</style>

<body>
  <div class="reset">
    <div class="counter">
    </div>
    <div class="reset">
      <div class="counter">大儿子</div>
      <div class="counter">二儿子</div>
      <div class="counter">三儿子</div>
    </div>
    <div class="counter">王小三</div>
    <div class="reset">
      <div class="counter">大儿子</div>
      <div class="counter">二儿子</div>
      <div class="counter">三儿子</div>
    </div>
  </div>
</body>
```

* 由于一个容器的普照元素`reset`应该是固定的,一但子元素出现,其实就已经进入下一级嵌套

### 边框(border)

* 简写:```border:border-width || border-style || border-color;```,没有顺序
* 分开写法:border-right/border-left/border-top/border-bottom  

| 属性         | 作用                                         |
| ------------ | -------------------------------------------- |
| border-width | 边框粗细,px                                  |
| border-style | 边框样式 实线:solid/ 虚线:dashed/ 点线dotted |
| border-color | 边框颜色                                     |

* 合并相邻边框```border-collapse:collapse;```

* <span style="color:red">注意:</span>
  1. 测量盒子大小的时候,不量边框
  2. 如果测量的时候包含了边框,则需要width/height减去边框宽度

### 内边距(padding)

> 在使用padding时尽量不要使用`box-sizing:border-box`.局部使用尽量使用无宽度以及宽度分离准则

* 内联元素的padding依然会对垂直方向的元素有影响.不过内联元素没有可视化的宽高(clientHight和clientWidth永远是0)
  * 垂直方向的行为完全受`line-height`和`vertical-align`的影响
  * 不过视觉上并不会改变上一行和下一行内容的间距(需要加上一些效果,例如`background-color`)

>css中出现这种层叠的现象

1. 一类是纯视觉层叠,不影响外部尺寸.(例如relative元素的定位,box-shadow,以及outline等)
2. 另一种会影响外部尺寸.例如`padding`

* 区分:给父级设置`overflow:auto`,如果层叠区域超出父容器,没有出现滚动条,则是纯视觉的;如果出现滚动条,则会影响尺寸,影响布局

1. padding属性用于设置内边距,即边框与内容之间的距离
  
| 属性           | 作用     |
| -------------- | -------- |
| padding-left   | 左内边距 |
| padding-right  | 右内边距 |
| padding-top    | 上内边距 |
| padding-bottom | 下内边距 |

| 值的个数                    | 表达意思                                  |
| --------------------------- | ----------------------------------------- |
| padding:5px;                | 1个值代表上下左右都有5px                  |
| padding:5px 10px;           | 2个值代表上下内边距5px,左右内边距10px     |
| padding:5px 10px 20px;      | 3个值,代表上内边距5px,左右10px,下20px     |
| padding:5px 10px 20px 30px; | 4个值,上是5px,右10px,下20px,左30px,顺时针 |

* <span style="color:red">注意:</span>
  1. 内容和边框有了距离,添加内边框
  2. padding影响盒子实际大小
  3. 如果盒子有了高度和宽度,此时指定内边框,会撑大盒子
     * 解决方案: 让width/height减去多出来的内边距大小
  4. 如果盒子本身没有指定width/height属性,则此时paddiong不会撑开盒子大小

> padding的百分比值:<span style="color:red">无论是水平方向还是垂直方向均是相对于宽度计算的</span>

* 很多表单元素都会内置`padding`
  * 内置padding的元素:\<input>,\<textarea>,\<button>,\<select>
  * 单选框不内置,\<radio>,\<checkbox>

>使用padding回值双层圆点

```css
.box {
  display: inline-block;
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 10px solid;
  border-radius: 50%;
  background-color: black;
  background-clip: content-box;
}
```

### 外边距(margin)

>margin对尺寸没有影响,只是元素是<span style="color:green">充分利用可用空间</span>状态的时候.margin才可以改变元素的可视尺寸

* 对于普通的块状元素,在默认的水平流下,margin之恶能改变左右的内部尺寸,垂直方向无法改变(这是由`margin:auto`的计算规则决定的)
  
> margin的百分比值也是相对于宽度计算的

1. 不过由于margin无法在垂直方向上改变元素自身的内部尺寸,往往需要父元素作为载体
2. 并且由于margin合并的问题,垂直方向往往需要双倍尺寸 

>margin属性

* margin属性用于设置外边距,用于控制盒子与盒子之间的距离

   | 属性          | 作用     |
   | ------------- | -------- |
   | margin-left   | 左外边距 |
   | margin-right  | 右外边距 |
   | margin-top    | 上外边距 |
   | margin-bottom | 下外边距 |

> margin合并

* 块级元素的上外边距`margin-top`和下外边距`margin-bottom`有时会合并采购和各位单个外边距

1. 块级元素:但不包括浮动和绝对定位
2. 只发生在垂直方向(不考虑`writing-mode`)

* margin合并的场景
  1. 相邻兄弟元素margin合并
  2. 父级和第一个/最后一个子元素(嵌套块元素垂直外边距的塌陷)
     * 对于来攻嵌套关系(父子关系)的块元素,父元素有上外边距同时子元素也有上外边据,此时父元素会塌陷较大的外边距值
     * 解决方案:
      1. 可以为父元素定义上边框
      2. 可以为父元素定义上内边框
      3. 设置格式化上下文,例如父元素添加```overflow:hidden```(不会增加盒子的大小)

* margin合并的计算规则
  1. 正正取大值
  2. 正负值相加
  3. 负负值最负值

* margin负值的意义在于:在页面中任何地方嵌套或者直接放入任何裸\<div>,都不会影响原来的块状布局

#### margin:auto

>有时候元素没有设置width或者height也会自动填充

```html
<!-- 自动填充 -->
<div></div>

<!-- 自动填充对应的方位 -->
<style>
  div{
    position:absolute;
    left:0;right:0;
  }
</style>
```

>margin:auto填充规则

1. 如果一侧是定值,一侧是auto,则auto为剩余空间大小
2. 如果两侧均是auto,则平分剩余空间大小

* 那就很容易实现右对齐,只要margin-right为0或者不设置

```css
.son{
  width:200px;
  margin-left:auto;
}
```

* 水平居中`margin:0 auto`,会让div布局水平居中在浏览器中
* `margin:auto`不能垂直居中.由于这个属性有一个前提条件,当width或者height为auto时,元素是<span style="color:red">具有对应方向的自动填充特性的</span>.根据html文档流是水平方向自适应的,所以设置垂直方向没用

>设置水平垂直居中(不适用`writing-mode`)

```css
.father{
  width:300px;height:200px;
  position:relative;
}
.son{
  position:absolute;
  top:0;right:0;bottom:0;left:0;
  width:150px;height:100px
}
```

### 清除内外边距

```css
*{
  margin:0;
  padding:0;
}
```

> <span style="color:red">注意:行内元素为了照顾兼容性,尽量只设置左右内外边距,不要设置上下内外边距,但是转换为块级和行内块元素就可以了</span>

## css3新增

### 圆角边框

> css3:border-radius属性设置元素的外边框圆角```border-radius:length;```,length是圆的半径,用⚪替代矩形的角

1. 如果是一个正方形,```border-radius:50%;```得到一个圆,50%就是高度的一半.
2. 如果是一个矩形,设置高度的一半,得到一个圆角矩形
3. 该属性是一个简写属性,可以写4个值,分别代表左上角,右上角,右下角,左下角<span style="color:red">border-top-left-radius/border-top-right-radius/border-bottom-right-radius/border-bottom-left-radius</span>

### 盒子阴影

> css3:我们可以使用```box-shadow```属性为盒子添加阴影
语法:```box-shadow:h-shadow v-shadow blur spread color inset;```

| 值       | 描述                                |
| -------- | ----------------------------------- |
| h-shadow | 必需,水平阴影的位置,允许负值        |
| v-shadow | 必需,垂直阴影的位置,允许负值        |
| blur     | 可选,模糊距离(越大越模糊)           |
| spread   | 可选,阴影的尺寸(大小)               |
| color    | 可选,阴影的颜色                     |
| inset    | 可选,将外部阴影(outset)改为内部阴影 |

* <span style="color:red">注意:</span>
   1. 默认的是外阴影(ouset),但是不可以写这个单词,否则导致阴影无效
   2. 盒子阴影不占用空间,不会影响其他盒子排列

### 文字阴影

> css3:我们可以使用```text-shadow```属性为盒子添加阴影
语法:```text-shadow:h-shadow v-shadow blur color;```

| 值       | 描述                         |
| -------- | ---------------------------- |
| h-shadow | 必需,水平阴影的位置,允许负值 |
| v-shadow | 必需,垂直阴影的位置,允许负值 |
| blur     | 可选,模糊距离(越大越模糊)    |
| color    | 可选,阴影的颜色              |

## 浮动(float)

### 浮动特性

> float属性用于创建浮动框,将其移动到一边,直到左边或右边缘及包含块或另一个浮动框的边缘```选择器{float:属性值;}```

| 属性值 | 描述               |
| ------ | ------------------ |
| none   | 元素不浮动(默认值) |
| left   | 元素向左浮动       |
| right  | 元素向右浮动       |

* 浮动特性:
  1. <span style="color:red">浮动元素会脱离标准流</span>
      * 浮动的盒子<span style="color:red">不再保留原先的位置</span>
  2. 浮动的元素会一行内显示并且元素顶部对齐
      * 如果多个盒子设置了浮动,则他们会按照属性值--行内显示并且顶端对齐排列
      * <span style="color:red">注意:浮动的元素是相互考在一起的(不会右缝隙),如果父级宽度装不下这些浮动的盒子,多出的盒子会另起一行对齐</span>
  3. 浮动的元素会具有行内块元素的特性
      * 如果块级盒子没有设置宽度,默认宽度和父级一样宽,但是添加浮动后,他的大小根据内容来决定
* 浮动元素经常和标准流父元素搭配使用:用标准流的父元素排列上下位置,之后内部子元素采取浮动排列左右位置,符合网页布局的第一准则
* <span style="color:red">浮动的盒子只会影响盒子后面的标准流,不会影响前面的标准流</span>

### 清除浮动

>* 父级盒子很多情况下,不方便给高度,但是子盒子浮动又不占有位置,最后父级盒子高度为0时,就会影响下面的白标准流盒子
>* 由于浮动的元素不再占有原文档的位置,所以他会对后面的元素排版产生影响

1. 清楚浮动的本质:清楚浮动造成的影响
2. 如果父盒子本身有高度,则不需要清楚浮动
3. <span style="color:red">清楚浮动之后,父级就会根据浮动的子盒子自动检测高度.父级有了高度,就不会影响下面的标准流</span>

* ```clear:属性值;```

| 属性值 | 描述                                     |
| ------ | ---------------------------------------- |
| left   | 不允许左侧有浮动元素(清楚左侧浮动的影响) |
| right  | 不允许右侧有浮动元素(清楚右侧浮动的影响) |
| both   | 同时清楚左右两侧浮动的影响(通常用)       |

* 清楚浮动的方法
   1. 额外标签法(隔墙法):<span style="color:red">缺点:结构化比较差</span>

       ```html
       <style>
         .clear{
           clear:both;
         }
       </style>
       ...
      <div>
       <div style="float:right">你好</div>
       <div style="float:right">不错</div>
       <div class="clear"></div><!-- 且新增的盒子必须是块级元素,不能是行内元素 -->
      </div> 
       ```

   2. 父级添加overflow属性<span style="color:red">缺点:无法显示溢出部分</span>

      ```html
      <div style="overflow:hidden">
       <div style="float:right">你好</div>
       <div style="float:right">不错</div>
       <div style="float:right">真的</div>
      </div> 
      ```

   3. 父级添加after伪元素<span style="color:red">优点:没有增加标签,结构简单</span>

      ```html
      <style>
         .clearfix:after{
           content:"";
           clear:both;
           height:0;
           visibility:hidden;
         }
       </style>
      ...
      <div class="clearfix">
        <div style="float:right">你好</div>
        <div style="float:right">不错</div>
        <div style="float:right">真的</div>
      </div> 
      ```

   4. 父级添加双伪元素<span style="color:red">代码更简洁</span>

    ```html
    <style>
      .clearfix:before,
       .clearfix:after{
         content:"";
         display:table;
       }
       .clearfix:after{
         clear:both;
       }
     </style>
    ...
     <div class="clearfix">
      <div style="float:right">你好</div>
      <div style="float:right">不错</div>
      <div style="float:right">真的</div>
    </div> 
    ```

## 定位

### 定位的意义

> 1. 浮动可以让多个块级盒子一行没有缝隙排列显示,经常用于横向排列盒子
> 2. 定位则是可以让盒子自由的在某个盒子内移动位置或者固定在屏幕中某个位置,并且可以压住其他盒子

### 定位的组成

>* 定位:将盒子定在某一个位置,所以定位也是摆放盒子,按照定位的方式移动盒子.<span style="color:red">定位=定位模式+边偏移</span>
>* 定时模式用于指定元素在文档中的定位方式.边偏移则决定了该元素的最终位置

1. 定位模式:通过css的```position```属性来设定

   | 值       | 语义     |
   | -------- | -------- |
   | static   | 静态定位 |
   | relative | 相对定位 |
   | absolute | 绝对定位 |
   | fixed    | 固定定位 |

2. 边偏移:top,bottom,left,right4个值(相对于父元素而言)

### 静态定位

* 按照标准流特性摆放,没有边偏移

### 相对定位relative

* 相对定位是元素移动的时候,相对于原来的位置来说```position:relative;```

* 特点:
   1. 他是相对于子级原来的位置移动的(<span style="color:red">移动位置的时候参照点是自己原来的位置</span>)
   2. 原来在标准流的位置继续占有,后面的盒子任然以标准流的方式对待它(<span style="color:red">不脱标,继续保留原来的位置</span>)

### 绝对定位absolute

* 绝对定位是在元素移动位置的时候,相对于它祖先元素来说的```position:absoulte;```

* 特点:
   1. 如果没有祖先元素或者祖先元素没有定位,以浏览器定位为准(Document文档)
   2. 如果祖先元素有定位(相对,绝对,固定),则以最近一级的有定位祖先元素为参考点移动位置
   3. 绝对定位<span style="color:red">不再占有原来的位置</span>(脱离标准流)

### 子绝父相

1. 子级绝对定位,不会占有位置,可以放到父盒子里面的任何一个地方,不会影响其它的兄弟盒子
2. 父盒子需要加定位限制子盒子在父盒子内显示
3. 父盒子布局时,需要占有位置,因此父亲只能是相对定位

### 固定定位(fixed)

* 固定定位是固定于浏览器的可视区的位置,可在浏览器滚动时元素的位置不会改变```position:fixed;```

* 特点:
   1. 以浏览器的可是窗口为参照点移动元素. 
      * 跟父元素没有任何关系
      * 不随滚动条移动
   2. 固定定位<span style="color:red">不再占有原先的位置</span>
      * 固定定位也是脱标的,其实固定定位也可以看作是一种特殊的绝对定位

### 粘性定位(sticky)

* 粘性定位可以被认为是相对定位和固定定位的混合```position:sticky;```

* 特点:
   1. 以浏览的可视窗口为参照点移动元素(固定定位特点)
   2. 粘性定位占有原先的位置(相对定位特点)
   3. 必须添加top,bottom,left,right其中一个才有效

### 定位叠放次序z-index

> 使用z-index来控制盒子的前后次序(z轴)```z-index:1;```

* 数值可以是正整数,负整数或0,默认是auto,数值越大,盒子越靠上
* 如果属性相同,则按照书写顺序,后来居上
* 数字后面不能加单位
* 只有定位的盒子才有z-index

### 定位的特殊性

1. 行内元素添加绝对或者固定定位,可以直接设置高度和宽度
2. 块级元素添加绝对或者固定定位,如果不给宽度或者高度,默认是内容的大小
3. 绝对定位(固定定位)会完全压住盒子.浮动元素不会,只会眼珠它下面的标准流盒子,但是不会压住标准流盒子里面的文字,<span style="color:red">浮动可以做文字环绕效果.</span>

## 显示与隐藏

### display

* `display:none;`隐藏对象,<span style="color:red">不再占有原来的位置</span>
* `display:block;`除了转换为块级元素之外,同时还有显示元素的意思

### visibility 可见性

* `visibility:visible;`元素可见
* `visibility:hidden;`元素隐藏<span style="color:red">继续占有原来的位置</span>

### overflow 溢出

* `overflow:visible;`,默认值,显示可见
* `overflow:hidden;`,隐藏溢出
* `overflow:scroll;`,不管有没有溢出都显示滚动条
* `overflow:auto;`,有溢出,才显示滚动条

## CSS技巧

### 字体图标iconfont

> 字体图白哦展示的是图标,本质属于字体

### css三角

* 普通三角形
  
```html
<style>
  .box{
    weight:0;
    height:0;
    border:50px solid transparent;
    border-left-color:red;
    margin:100px auto;
  }
</style>

...
<div class="box"></div>
```

* 提示框:矩形加三角

```html
<style>
  .box{
    width:120px;
    height:40px;
    background-color:red;
  }
  .box span{
    position:absolute;
    right:15px;
    top:-10px;
    weight:0;
    height:0;
    border: 5px solid transparent;
    border-bottom-color:red;
  }

</style>

...
<div class="box">
  <span></span>
</div>
```

### 鼠标样式

>鼠标样式:`cursor:pointer;`

| 属性值      | 描述 |
| ----------- | ---- |
| default     | 默认 |
| pointer     | 小手 |
| move        | 移动 |
| text        | 文本 |
| not-allowed | 禁止 |

### 表单轮廓线

* `input{outline:none;}`,取消表单轮廓线
* `textarea{resize:none;}`,防止拖拽文本域

### vertical-align 属性的应用

> 经常用于设置图片或者表单(行内块)和文字的垂直对齐.
> 官方解释:用于设置一个元素的垂直对齐方式,但是只针对域行内块元素或者行内元素有效

* 语法:`vertical-align:baseline | top | middle | bottom;`

| 值       | 描述                                 |
| -------- | ------------------------------------ |
| baseline | 默认.元素放在父元素的基线上          |
| top      | 把元素的顶端域行中最高元素的顶端对齐 |
| middle   | 把此元素放置在父元素的中部           |
| bottom   | 把元素的顶端与行中最低元素的顶端对齐 |

### 解决图片底部默认空白缝隙问题

* 图片底侧会有一个空白缝隙,愿意是行内块元素和文字的基线对齐
* 解决:
    1. 给图片添加 ```vertical-align: top | middle | bottom等;```(提倡)
    2. 把图片转换为块级元素```display:block;```

### 溢出文字的省略号显示

* 单行文本溢出显示省略号--满足三个条件

```css
.class{
  /* 1.先强制一行内显示文本 */
  white-space:nowrap;/* 默认normal是自动换行 */
  /* 2.超出部分隐藏 */
  overflow:hidden;
  /* 3.文字用省略号替代超出的部分 */
  text-overflow:ellipsis;
}
```

* 单行文本溢出显示省略号--满足三个条件(适用于webKit浏览器或移动端)

```css
.class{
  overflow:hidden;
  text-overflow:ellipsis;
  /* 弹性伸缩盒子模型显示 */
  display:-webkit-box;
  /* 限制在一个块元素显示的文本行数 */
  -webkit-line-clamo:2;
  /* 设置或检索伸缩盒对象的子元素排列方式 */
  -webkit-box-orient:vertical;

}
```

### 常见布局技巧

* margin负值的妙用
   1. 让每个盒子margin往左侧移动-1px正好压住相邻盒子边框
   2. 鼠标经过某个盒子的时候,提高当前盒子的层级即可(如果没有定位,则加相对定位(保留位置),如果有定位,则加z-index)

* 文字围绕浮动元素(浮动)

* 直角三角形

```css
.box{
  width:0;
  height:0;
  border-top:100px solid transparent;
  border-right:50px solid skyblue;
  border-bottom:0 solid blue;
  border-left:0 solid green;
}
```

## CSS3和HTML5

### CSS3盒子模型(box-sizing)

1. ```box-sizing:content-box;```盒子大小为width+padding+border(默认的)
2. ```box-sizing:border-box;```盒子默认大小是width

* 如果盒子模型改为```box-sizing:border-box;```,那么padding和border就不会撑大盒子(前提padding和border不会超过width的宽度)

### CSS3其它特性

* 滤镜filter:```filter:函数();```例如:```filter:blur(5px);```blur模糊处理,数值越大越模糊
* calc函数:```width:calc(100%-30px)```,可以用来加减乘除计算

### CSS3过渡(重点)

```transition:要过度的属性 花费时间 运动曲线 何时开始;```

1. 属性:想要变化的css属性,宽度高度 背景颜色 内外边距都可以.如果想要所有的属性都变化过度,写一个all就可以
2. 花费时间: 单位是秒,(必须写单位)
3. 运动曲线:默认是ease(可以省略)
4. 何时开始:单位是 秒,可以设置延迟触发事件 默认是0s(可以省略)

## CSS3动画

### 2D转换translate

```CSS
.class{
  transform:translate(x,y);/* 或者分开写 */
  transform:translateX(n);
  transform:translateY(n);
}
```

* 沿着x,y轴运动
* translate不会影响到其它的元素
* translate的百分比是相对于自身元素的translate(50%,50%)
* 对行内标签无效

* 居中

```css
.class{
  position:absolute;
   left:50%;/* 父容器宽度的一半 */
   top:50%;/* 父容器高度的一半 */
/*   margin-left:-100px; 
  margin-top:-100px;*/
  transform:translate(-50%,-50%);
  width:200px;
  height:200px
}

```

### 旋转rotate

1. ```transform:rotate(度数);```

2. 注意
   * rotate里面跟度数,单位是deg,比如```rotate(45deg)```
   * 角度为正时,顺时针,负时逆时针
   * 默认旋转的中心点时元素的中心点

### 旋转中心点transform-origin

1. ```transform-origin:x y;```

2. 注意
   * 参数用空格隔开
   * x y默认转换的中心点时元素的中心点(50% 50%)等价于(center center)
   * 还可以给x y设置 像素 或者 方位名词( top bottom left right center)

### 缩放scale

1. ```transform:scale(x,y);```

2. 注意:
   * 注意x和y用,隔开
   * ```transform:scale(1,1);```宽和高都放大一倍,相当于没变
   * ```transform:scale(2,2);```宽和高都放大了2倍
   * ```transform:scale(2);``` 只写了一个参数,那第二个参数和第一个一样是scale(2,2)
   * ```transform:scale(0.5,0.5);```缩小
   * scale缩放最大的优势:可以设置旋转中心缩放,默认以中心点缩放,而且不影响其它盒子

><span style="color:red">注意</span>

   1. 同时使用多个转换,其格式为```transform:tranlate() rotate() scale()...```
   2. 顺序会影响旋转效果(先旋转会改变坐标轴方向)
   3. 当同时又位移和其它属性时,记得要将位移放到最前面

### CSS动画

* 制作动画:
    1. 先定义动画
    2. 在调用动画

1. 用keyframes定义动画(类似定义类选择器)

```css
@keyframs move{
  0%{
    width:100px;
  }

  100%{
    width:200px;
  }
}

div{
  width:200px;
  height:200px;
  background-color:blue;
  margin:100px auto;
  /* 调用动画 */
  animation-name: move;/* 动画名称 */
  /* 持续时间 */
  animation-duration:0.5s;/* 持续时间 */
}
```

* 0%是动画的开始.100%是动画的完成
* 在```@keyframs```中规定某项CSS样式,就能创建由当前样式初见改为新样式的动画效果
* 动画是是使元素从一种样式逐渐变化为另一种样式说的效果可以改变任意多的样式任意多的次数
* 请用百分比来规定变化发生的时间,或用关键词```"from"```和```"to"```,等同于0%和100%

```css
@keyframs move{
  from{
    transform:translate(0,0);
  }

  to{
    transform:translate(1000px,0);
  }
}

div{
  width:200px;
  height:200px;
  background-color:blue;
  margin:100px auto;
  /* 调用动画 */
  animation-name: move;/* 动画名称 */
  /* 持续时间 */
  animation-duration:0.5s;/* 持续时间 */
}
```

| 属性                      | 描述                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| @keyframes                | 规定动画.                                                                                                                                  |
| animation                 | 所有动画属性的简写属性.除了animation-play-state                                                                                            |
| animation-name            | 规定 @keyframes 动画的名称.(必须写)                                                                                                        |
| animation-duration        | 规定动画完成一个周期所花费的秒或毫秒.默认是 0.(必写)                                                                                       |
| animation-timing-function | 规定动画的速度曲线.默认是 "ease"                                                                                                           |
| animation-fill-mode       | 规定当动画不播放时（当动画完成时,或当动画有一个延迟未开始播放时）,要应用到元素的样式.默认是backwards,回到起始状态,forwards是停留在结束状态 |
| animation-delay           | 规定动画何时开始.默认是 0.                                                                                                                 |
| animation-iteration-count | 规定动画被播放的次数.默认是 1.`infinite`(指无限循环)                                                                                       |
| animation-direction       | 规定动画是否在下一周期逆向地播放.默认是 "normal",alternate是反方向走回来,而不是直接跳回来                                                  |
| animation-play-state      | 规定动画是否正在运行或暂停.默认是 "running",暂停是pause                                                                                    |

* 动画简写: ```animate:动画名称 持续时间 运动曲线 何时开始 播放次数 是否反方向 动画起始或者结束的状态```

* ```animation-timing-function```

| 值          | 描述                                      |
| ----------- | ----------------------------------------- |
| linear      | 动画从头到尾的速度是相同的.匀速           |
| ease        | 默认.动画以低速开始,然后加快,在结束前变慢 |
| ease-in     | 动画以低速开始                            |
| ease-out    | 动画以低速结束                            |
| ease-in-out | 动画以低速开始和结束                      |
| steps()     | 指定了时间函数中的间隔数量(步长)          |

### 3D转换

* 主要内容
  * 3D位移(简写):```transform:translate3d(x,y,z);```
    * ```transform:translateX(100px);```仅仅是在x轴上运动  
    * ```transform:translateY(100px);```仅仅是在y轴上运动  
    * ```transform:translateZ(100px);```仅仅是在z轴上运动(后面的单位一般跟px) 
  * 透视:```perspective:200px;```单位像素,数值越大物体越大,数值越小越立体
    * <span style="color:red">透视写在被观察元素的父盒子上面</span>
    * 视距是一个人眼睛到屏幕的距离
    * z是z周,物体距离屏幕的距离,z轴越大,看到的物体越大
  * 3D呈现```transform-style```
    * 控制子元素是否开启三维立体环境
    * ```transform-style:flat;```子元素不开启sd立体空间,默认
    * ```transform-style:preserve-3d;```子元素开启sd立体空间
    * 代码写给父级,但是影响的是子盒子
    * 重要

* 3D旋转rotate3d
  * ```transform:rotateX(45deg)```: 沿着x轴正方向旋转45度
    * 左手准则:拇指沿着x正轴,四指弯曲的方向就是旋转方向
  * ```transform:rotateY(45deg)```: 沿着Y轴正方向旋转45度
    * 左手准则:拇指沿着y正轴,四指弯曲的方向就是旋转方向(正值)
  * ```transform:rotateZ(45deg)```: 沿着Z轴正方向旋转45度
  * ```transform:rotatesd(x,y,z,deg)```: 沿着自定义方向旋转deg度
    * x,y,z表示矢量 ```transform:rotatesd(1,1,0,deg)```(即对角线)

## 移动端布局

### meta视口

```html
<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
```

| 属性          | 解释说明                                      |
| ------------- | --------------------------------------------- |
| width         | 宽度是指的是viewport宽度,可以设置device-width |
| initial-scale | 初始缩放比例,大于0的数字                      |
| maximum-scale | 最大缩放比例,大于0的数字                      |
| minimum-scale | 最小缩放比例,大于0的数字                      |
| user-scalable | 用户可以缩放,yes或no(1或0)                    |

## flex布局

### 布局原理

1. 当为父盒子设为flex布局以后,子元素的float,clear和vertical-align属性将失效
2. 通过给父盒子添加flex属性,来控制子盒子的位置和排列方式

### 父元素属性

| 属性            | 描述                                               |
| --------------- | -------------------------------------------------- |
| flex-direction  | 设置主轴方向                                       |
| justify-content | 设置主轴上的子元素排列方向                         |
| flex-wrap       | 设置子元素是否换行                                 |
| align-content   | 设置侧轴上的子元素的排列方式(多行)                 |
| align-items     | 设置侧轴上的子元素的排列方式(单行)                 |
| flex-flow       | 复合属性,相当于你是设置了flex-direction和flex-wrap |

* ```flex-direction```设置主轴方向,子元素跟着主轴来排列

| 属性值         | 说明             |
| -------------- | ---------------- |
| row            | (默认值)从左到右 |
| row-reverse    | 从右到左         |
| column         | 从上到下         |
| column-reverse | 从下到上         |

* ```justify-content``` : 设置主轴上的子元素排列方向
  * <span style="color:red">注意:使用这个一定要确定主轴是哪一个</span>

| 属性值        | 说明                                          |
| ------------- | --------------------------------------------- |
| flex-start    | (默认值)从头部开始 , 如果主轴是x轴,则从左到右 |
| flex-end      | 从尾部开始排列                                |
| center        | 在主轴居中对齐(如果主轴是x轴,则水平居中)      |
| space-around  | 平分剩余空间                                  |
| space-between | 先两边贴边 再平分剩余空间(重要)               |

* ```flex-wrap```  设置子元素是否换行

| 属性值 | 说明            |
| ------ | --------------- |
| nowrap | (默认值),不换行 |
| wrap   | 换行            |

* ```align-items```  设置侧轴上的子元素的排列方式(单行)

| 属性值     | 说明                   |
| ---------- | ---------------------- |
| flex-start | 从上到下               |
| flex-end   | 从下到上               |
| center     | 挤在一起居中(垂直居中) |
| stretch    | 拉伸(默认值)           |

* ```align-content``` 设置侧轴上的子元素的排列方式(多行)
  * <span style="color:red">注意:设置子项在侧轴上的排列方式并且只能用于子项出现换行的情况(多行),在单行下是没有效果的</span>

| 属性值        | 说明                                |
| ------------- | ----------------------------------- |
| flex-start    | (默认值)在侧轴的头部开始排列        |
| flex-end      | 侧轴的尾部开始排列                  |
| center        | 在侧轴中间显示                      |
| stretch       | 设置子项元素高度平分父元素高度      |
| space-around  | 子项在侧轴平分剩余空间              |
| space-between | 子项在侧轴先分布两头 再平分剩余空间 |

* ```flex-flow```  复合属性,相当于你是设置了flex-direction和flex-wrap,语法:例```flex-flow:column wrap;```

### 子元素常见属性

> flex属性:定义子项目分配剩余空间,用flex来表示占多少分数

```css
.item{
  flex:number;/* default 0 */
}
```

* flex的复合属性:```flex:flex-grow flex-shrink flex-basis```

   | 属性        | 描  述                                                                                                    |
   | ----------- | --------------------------------------------------------------------------------------------------------- |
   | flex-grow   | 定义放大比例,默认为0,规定项目相对于其他灵活的项目进行扩展的  量                                           |
   | flex-shrink | 定义了项目的缩小比例,仅在宽度之和大于容器的时候才会发生收缩,其收缩的大小是依据 flex-shrink 的值,默认为  1 |
   | flex-basis  | 给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即项目本身的大  小                 |

> `align-self` 控制子项自己在侧轴上的排列方式

* <span style="color:red">注意:align-self属性允许单个项目有与其它项目不一样的对齐方式,可覆盖align-items属性</span>默认值auto,表示继承父元素的align-items属性,如果没有父元素,则等同于stretch

> ```order```属性定义项目的排列顺序

* 数值越小,排列越靠前,默认为0
* 注意:和```z-index```不一样

### 媒体查询(Media Query)

* @media可以针对不同的屏幕尺寸设置不同的样式
* 语法规范:```@media mediatype and|not|only (media feature){CSS-Code;}```
  * 用@media开头,注意@符号
  * mediatype 媒体类型

      | 值    | 解释说明                         |
      | ----- | -------------------------------- |
      | all   | 所有设备                         |
      | print | 用于打印机和打印预览             |
      | scree | 用于电脑屏幕,平板电脑,智能手机等 |

  * 关键字 and|not|only
    * and:可以将多个媒体特性链接到一起,相当于且
    * not:排除某个媒体类型,相当于非的意思,可以省略
    * only:指定某个特定的媒体类型,可以省略 
  * media future 媒体特性 必须有小括号包含

      | 值        | 解释说明                             |
      | --------- | ------------------------------------ |
      | width     | 定义输出设备中页面可见区域的宽度     |
      | min-width | 定义输出设备中页面最小可见区域的宽度 |
      | max-width | 定义输出设备中页面最大可见区域的宽度 |

* 例:

```css
/* 表示在频幕上并且最大的宽度是800px,只有在800px以下,才能设置成我们想要的样式 */
@media screen and(max-width:800px){
    body{
       background-color:red; 
 } 
}
```

### 媒体查询+rem实现元素动态大小变化

* 针对不同的媒体使用不同的stylesheets(样式表),就是在link中判断设备的尺寸,然后应用css文件

> 语法:```<link rel="stylesheet" media="mediatype and|not|only (media feature)"> href="url"```

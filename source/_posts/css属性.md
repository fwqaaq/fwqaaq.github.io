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

### css的引入样式

1. 内部样式表:将代码写在```<style></style>```中

2. 行内样式表:```<div style="color:red">你好</style>```

3. 外部样式表:```<link ref="stylesheet(样式表)" href="路径">```

### 选择器

#### 基础选择器

1. 标签选择器: ```h2{}```

2. 类选择器:样式点定义 结构类(class)调用 一个或多个 

```html
<style>
  .red{
    color:red;
  }
</style>

...
<h2 class="red">你好</h2>
```

* <span style="color:red">注意:可以写多个类名,但是中间必须使用空格</span>

3. id选择器:样式#定义,结构id调用,只能调用一次,其它切勿调用

```html
<style>
  #red{
    color:red;
  }
</style>

...
<h2 id="red">你好</h2>
```

4. 通配符选择器:```*{}```所有标签的属性都会增加
  
#### 复合选择器

1. 后代选择器:元素1 元素2{样式},例```ul li {color:red;}```
  
* <span style="color:red">注意:元素2必须是子级,只要是元素的子级都可以选到</sapn>

* 元素1和2可以是任意基础选择器

2. 子选择器(重要):元素1>元素2(样式声明),表示选择元素1里的所有直接后代的(子元素)元素2,例:```div > a{color:red;}```

* 元素1是父级,元素2是子级,最终选择的元素是元素2

* 元素2必须是最近一级的子级(亲儿子),子子集(孙子)等都不归他管

```html
<style>
  div > a{color:red;}
</style>

...
<div>
  <a href="#">你好</a>
  <p>
    <a href="#">你好(选不到)</a>
  </p>
</div>
```

3. 并集选择器:可以选择多组标签,同时定义相同的样式,用于集体声明```div,ul, .pig(class) li{color:red;}```

4. 伪类选择器:给选择器添加特殊效果,特点:<span style="color:red">用冒号(:)</span>,比如: :hover,:first-child

* 链接伪类选择器:

  * a:link   /*选择所有未被访问的链接*/  
  * a:visited   /*选择所有已被访问的链接*/  
  * a:hover   /*选择所有指针位于其上的链接*/  
  * a:active   /*选择所有活动的链接(鼠标按下未弹起)*/
  
  * 注意:  
    * <span style="color:red">请按照LVHA的顺序声明:link-:visited-:hover-:active</span>
    * 因为链接在浏览器中有单独默认样式,所以在实际工作中需要给链接指定单独样式
  
  * :focus伪类选择器:<span style="color:red">用于获得焦点,焦点就是光标</span>,一般情况下\<input>类表单才能获取,主要针对于表单元素```input:focus{background-color:red;}```
  
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

> 预定义颜色:red等; 十六进制:#FF0000等; RGB:rgb(255,0,0)

2. 对齐文本:```text-align:center```,只能实现水平对齐

> 左对齐:left;  右对齐:right;  居中对齐:center

3. 装饰文本:```text-decoration:none;```

> none:默认,无装饰;underline:下划线:<span style="color:red">链接a自带下划线</span>;overline:上划线;line-through:上划线

4. 文本缩进:首行缩进,```text-indent:2em;```,em是当前文字的大小,<span style="color:red">1em=16px</span>

5. 行间距: ```line-height:50px;```;<span style="color:red">行间距=上间距+文本高度(默认16px)+下间距</span>

### Emment语法

1. 生成多个相同标签,用*,例如:div*3

2. 父子级关系标签,用>,例如,ul>li

3. 兄弟级关系的标签,用+,例如div+p  

4. 生成带有类名的或者id名的,直接写.demo或者#two, tab键

5. 如果生成div类名是有顺序的,可以用自增符号,例:```.demo$*5```

6. 如果在生成的标签内部些内容,可以用{}表示,```div{你好}```,tab键

### 元素的显示模式

* 块元素:\<h1>~\<h6>,\<div>,\<p>,\<ul>,\<ol>,\<li>等
  1. 自己独占一行
  2. 高度,宽度,外边距以及内边距都可以控制
  3. 宽度默认是容器(父级宽度)的100%
  4. 是一个容器及盒子,里面可以放行内或者块级元素
  
  * 注意:
    1. 文字类的元素不能使用块级元素
    2. \<p>标签主要用于存放文字,因此\<p>里面不能放块级元素,特别是不能放\<div>
    3. 同理,\<h1>~\<h6>等都不能放其它块级元素

* 行内元素:\<a>,\<strong>,\<b>,\<em>,\<i>,\<del>,\<s>,\<ins>,\<u>,\<span>等,也称内联元素
  1. 相邻行内元素在一行上,一行可以显示多个
  2. 高宽直接设置是无效的
  3. 默认宽度是它本身内容的宽度
  4. 行内元素只能容纳文本或其它行内元素

  * 注意:
     1. 链接里面不能再放链接
     2. 特殊情况链接\<a>里面可以放块级元素,但是给\<a>转换一下块级模式最安全

* 行内块元素:\<img/>,\<input/>,\<td>.他们<span style="color:red">同时具有块元素和行内元素的特点</span>,有些资料称他们为行内元素
  1. 和相邻的行内元素(行内块)再一行上,但是他们之间会有空白缝隙,一行可以显示多个(行内元素特点)
  2. 默认宽度就是它本身的宽度(行内元素的特点)
  3. 高度,行高,外边距都可以控制(块级元素的特点)

* 元素显示模式转换:
  1. ```display:block```:行内元素转换为块级元素
  2. ```display:inline```:块级元素转换为行内元素
  3. ```display:inline-block```:转换为行内块元素

### 垂直居中

1. 方式```line-height=height```
2. 原理:行间距(line-height)=上间距+文本高度(默认16px)+下间距,上下间距平分剩余大小

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

### 优先级

* 选择器相同 执行层叠性
* 选择器不同,则根据<span style="color:red">选择器权重</span>执行

| 选择器              | 选择器权重 |
| ------------------- | ---------- |
| 继承或者*           | 0,0,0,0    |
| 元素选择器          | 0,0,0,1    |
| 类选择器,伪类选择器 | 0,0,1,0    |
| ID选择器            | 0,1,0,0    |
| 行内样式style=""    | 1,0,0,0    |
| !important重要的    | 无穷大     |

注意:

   1. 权重是有4组数字,不会有进位
   2. 从左向右判断,如果某一位数值相同,则判断下一位数值
   3. <span style="color:red">继承的权重是0,(重要)</span>,如果该元素没有直接选中,不管父元素权重多高,子元素得到的权重都是0

* 权重叠加:如果是复合选择器,则会有权重叠加,需要计算权重

## 盒子模型

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
     * 解决方案: 让<span style="color:red">width/height减去多出来的内边距大小</span>
  4. 如果盒子本身没有指定width/height属性,则此时paddiong不会撑开盒子大小

### 外边距(margin)

1. margin属性用于设置外边距,用于控制盒子与盒子之间的距离

| 属性          | 作用     |
| ------------- | -------- |
| margin-left   | 左外边距 |
| margin-right  | 右外边距 |
| margin-top    | 上外边距 |
| margin-bottom | 下外边距 |

2. 外边距可以让块级盒子水平居中,但是必须要满足两个条件
   * 盒子必须指定宽度(width)
   * <span style="color:red">盒子的左右的外边框都设置为auto</span>

<span style="color:red">注意:</span>以上方法是让块级元素水平居中,<span style="color:red">行内元素或者行内块元素水平居中给其父元素添加  text-align:center;即可</span>

3. 嵌套块元素垂直外边距的塌陷
   * 对于来攻嵌套关系(父子关系)的块元素,父元素有上外边距同时子元素也有上外边据,此时父元素会塌陷较大的外边距值
   * 解决方案:
     1. 可以为父元素定义上边框
     2. 可以为父元素定义上内边框
     3. 可以为父元素添加```overflow:hidden```(不会增加盒子的大小)

<span style="color:red">注意:如果```margin:0 auto;```,会让div布局水平居中在浏览器中</span>

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

<span style="color:red">注意:</span>

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

### 绝对定位盒子居中

1. 水平居中

```css
.class{
  position:absolute;
  left:50%;/* 父容器宽度的一半 */
  margin-left:-100px;/* margin负值,往左边走,自己盒子宽度的一半 */
  width:200px;
  height:200px
}

```

1. 垂直居中

```css
.class{
  position:absolute;
  top:50%;/* 父容器高度的一半 */
  margin-top:-100px;/* margin负值,往上边走,自己盒子高度的一半 */
  width:200px;
  height:200px
}

```

### 定位的特殊性

1. 行内元素添加绝对或者固定定位,可以直接设置高度和宽度
2. 块级元素添加绝对或者固定定位,如果不给宽度或者高度,默认是内容的大小
3. 绝对定位(固定定位)会完全压住盒子.浮动元素不会,只会眼珠它下面的标准流盒子,但是不会压住标准流盒子里面的文字,<span style="color:red">浮动可以做文字环绕效果.</span>

## 显示与隐藏

### display

* ```display:none;```隐藏对象,<span style="color:red">不再占有原来的位置</span>
* ```display:block;```除了转换为块级元素之外,同时还有显示元素的意思

### visibility 可见性

* ```visibility:visible;```元素可见
* ```visibility:hidden;```元素隐藏<span style="color:red">继续占有原来的位置</span>

### overflow 溢出

* ```overflow:visible;```,默认值,显示可见
* ```overflow:hidden;```,隐藏溢出
* ```overflow:scroll;```,不管有没有溢出都显示滚动条
* ```overflow:auto;```,有溢出,才显示滚动条

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

>鼠标样式:```cursor:pointer;```

| 属性值      | 描述 |
| ----------- | ---- |
| default     | 默认 |
| pointer     | 小手 |
| move        | 移动 |
| text        | 文本 |
| not-allowed | 禁止 |

### 表单轮廓线

* ```input{outline:none;}```,取消表单轮廓线
* ```textarea{resize:none;}```,防止拖拽文本域

### vertical-align 属性的应用

> 经常用于设置图片或者表单(行内块)和文字的垂直对齐.
> 官方解释:用于设置一个元素的垂直对齐方式,但是只针对域行内块元素或者行内元素有效

* 语法:```vertical-align:baseline | top | middle | bottom;```

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

### Html5新增的标签

1. 语义化标签
   * ```<header>```头部标签
   * ```<nav>```导航标签
   * ```<article>```内容标签
   * ```<section>```定义文档某个区域
   * ```<aside>```侧边栏标签
   * ```<footer>```尾部标签

2. 视频标签
   * ```<video src="url" controls="controls"></video>```视频标签

| 属性       | 值           | 描述                                                          |
| ---------- | ------------ | ------------------------------------------------------------- |
| autoplay   | autoplay     | 视频就绪自动播放(谷歌浏览器需要添加```muted="muted"```来解决) |
| controls   | controls     | 向用户显示播放控件                                            |
| width      | pixels(像素) | 设置播放器宽度                                                |
| height     | pixels(像素) | 设置播放器高度                                                |
| loop       | loop         | 播放完是否继续播放该视频，循环播放                            |
| preload    | proload      | 是否等加载完再播放                                            |
| src        | url          | 视频url地址                                                   |
| poster     | Imgurl       | 加载等待的画面图片                                            |
| autobuffer | autobuffer   | 设置为浏览器缓冲方式，不设置autopaly才有效                    |
| muted      | muted        | 静音播放                                                      |

3. 音频标签
    * ```<audio src="url" controls="controls"></audio>```音频标签

| 属性     | 值       | 描述                               |
| -------- | -------- | ---------------------------------- |
| autoplay | autoplay | 音频就绪自动播放                   |
| controls | controls | 向用户显示播放控件                 |
| loop     | loop     | 播放完是否继续播放该音频，循环播放 |
| src      | url      | 音频url地址                        |

* 注意:谷歌浏览器把音频和视频自动播放禁止了

4. 新增input类型

| 属性          | 说明                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| type="email"  | 避免自己编写js代码对邮箱格式进行校验                                       |
| type="tel"    | 该类型没有对输入内容进行校验,在移动端输入时弹出数字键盘;                   |
| type="url"    | 对输入的网址内容合法性校验,且必须以http或https开头;                        |
| type="number" | 表示该文本框只能输入数字(包括小数点)                                       |
| type="search" | 表示搜索时的文本框,该文本框输入时有提示,右侧有删除的"X"号可以将文本框清空; |
| type="range"  | 表示范围:                                                                  |
| type="data"   | 表示必须输入日期类型                                                       |
| type="time"   | 表示必须输入为日期类型                                                     |
| type="month"  | 表示必须输入月类型                                                         |
| type="month"  | 表示必须输入月类型                                                         |
| type="color"  | 表示必须输入颜色类型                                                       |

5. 表单新增属性

| 属性         | 值        | 说明                                                                                                                                              |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| autofocus    | autofocus | 自动获取焦点                                                                                                                                      |
| autocomplete | off/on    | 当用户在字段开始键入时,浏览器基于之前键入过的值,应该显示出在字段中填写的选项默认已经打开,自动匹配 off关掉自动匹配,在表单内,同时加上name且成功提交 |
| required     | required  | 表单拥有该属性表示其内容不能为空,必填                                                                                                             |
| placeholder  | 文本内容  | 表单的提示信息,存在默认值将不显示                                                                                                                 |
| multiple     | multiple  | 可以多选文件提交                                                                                                                                  |

### CSS3新特性

1. 属性选择器

| 选择符        | 简介                                  |
| ------------- | ------------------------------------- |
| E[att]        | 选择具有att属性的E元素                |
| E[att="val"]  | 选择具有att属性且属性值等于val的E元素 |
| E[att^="val"] | 匹配具有att属性且值以val开头的E元素   |
| E[att$="val"] | 匹配具有att属性且值以val结尾的E元素   |
| E[att*="val"] | 匹配具有att属性且值中含有的E元素      |

2. 结构伪类选择器:主要根据<span style="color:red;">文档结构</span>,常用于根据父级选择器里的子元素
  
| 选择符           | 简介                        |
| ---------------- | --------------------------- |
| E:first-child    | 匹配父元素中的第一个元素E   |
| E:last-child     | 匹配父元素中的最后一个元素E |
| E:nth-child(n)   | 匹配父元素中的第n个元素E    |
| E:first-of-type  | 指定类型E的第一个           |
| E:last-of-type   | 指定类型E的最后一个         |
| E:nth-of-type(n) | 指定类型E的第n个            |

* nth-child(n) 选择某个父元素的一个或多个特定的子元素
  * n可以是数字,关键字和公式
  * n如果是数字,就是第n个子元素,里面数字从1开始
  * n可以是关键字:even是偶数,odd是奇数
  * n可以是公式:常见的公式如下(如果n是公式,则从0开始计算,但是第0个元素或者超出的元素会被忽略)

| 公式 | 取值                           |
| ---- | ------------------------------ |
| 2n   | 偶数                           |
| 2n+1 | 奇数                           |
| 5n   | 5  10 ....                     |
| n+5  | 从第五个开始(包含第五个)到最好 |
| -n+5 | 前五个(包含第五个)             |

* 注意:```nth-child(n)```给所有元素都排列序号,要求选择器与标签匹配得当
* 注意:```nth-of-type(n)```给指定元素都排列序号

3. 伪元素选择器

选择器           简介
::before        在元素内部的前面插入内容
::before        在元素内部的后面插入内容

* <span style="color:red;">注意</span>
   1. before和after创建一个元素,但是属于行内元素
   2. 新创建的这个元素在文档树中是找不到的,
   3. 语法```element::before{}```
   4. before和after必须有content属性
   5. before在父元素内容的前面创建元素.after在父元素内容的后面插入元素
   6. 伪元素选择器和标签选择器一样,权重为1

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

| 属性                      | 描述                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| @keyframes                | 规定动画。                                                                                                                                    |
| animation                 | 所有动画属性的简写属性。除了animation-play-state                                                                                              |
| animation-name            | 规定 @keyframes 动画的名称。(必须写)                                                                                                          |
| animation-duration        | 规定动画完成一个周期所花费的秒或毫秒。默认是 0。(必写)                                                                                        |
| animation-timing-function | 规定动画的速度曲线。默认是 "ease"                                                                                                             |
| animation-fill-mode       | 规定当动画不播放时（当动画完成时，或当动画有一个延迟未开始播放时），要应用到元素的样式。默认是backwards,回到起始状态,forwards是停留在结束状态 |
| animation-delay           | 规定动画何时开始。默认是 0。                                                                                                                  |
| animation-iteration-count | 规定动画被播放的次数。默认是 1。```infinite```(指无限循环)                                                                                    |
| animation-direction       | 规定动画是否在下一周期逆向地播放。默认是 "normal",alternate是反方向走回来,而不是直接跳回来                                                    |
| animation-play-state      | 规定动画是否正在运行或暂停。默认是 "running",暂停是pause                                                                                      |

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

属性                 解释说明
width                宽度是指的是viewport宽度,可以设置device-width
initial-scale        初始缩放比例,大于0的数字
maximum-scale        最大缩放比例,大于0的数字
minimum-scale        最小缩放比例,大于0的数字
user-scalable        用户可以缩放,yes或no(1或0)

### 物理像素和物理像素比

### 多倍图

1. 二倍图:手机端图片模糊处理方法
2. ```background-size:背景图片宽度 背景图片高度;```
   * 单位:  长度|百分比|cover|contain
   * cover把背景图像扩展至足够大,以使背景图像完全覆盖背景区域(可能有背景图片显示不全)
   * contain把图像扩展至最大尺寸(等比例拉伸,宽或者高铺满div盒子就不再拉伸了,可能有部分空白区域),以使其宽度和高度完全适应内容区域

### 开发方案

1. 单独制作移动端页面
   * 流式布局(百分比布局)
     * max-width 最大宽度(max-height 最大高度) 
     * min-width 最小宽度(min-height 最小高度) 
   * flex弹性布局
   * less+rem+媒体查询
   * 混合布局

2. 响应式
   * 媒体查询
   * bootstrap

### 特殊样式

```css
*{
  box-sizing:border-box;
  -webkit-box-sizing:border-box;
  /* 点击高亮我们需要清楚  设置为transparent 完成透明*/
  -webkit-tap-highlight-color:transparent;
  /* 在移动端浏览器默认的外观在ios上加这个属性才能给按钮和输入框自定义样式 */
  -webkit-appearance:none;
}
  /* 禁用长按页面时的弹出菜单 */
  a,img{-webkit-touch-callout:none;}
```

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

1. flex属性:定义子项目分配剩余空间,用flex来表示占多少分数

```css
.item{
  flex:number;/* default 0 */
}
```

* flex的复合属性:```flex:flex-grow flex-shrink flex-basis```

 | 属性        | 描述                                                                                                       |
 | ----------- | ---------------------------------------------------------------------------------------------------------- |
 | flex-grow   | 定义放大比例，默认为0，规定项目相对于其他灵活的项目进行扩展的量                                            |
 | flex-shrink | 定义了项目的缩小比例，仅在宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值，默认为1 |
 | flex-basis  | 给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即项目本身的大小                    |

2. ```align-self``` 控制子项自己在侧轴上的排列方式

* <span style="color:red">注意:align-self属性允许单个项目有与其它项目不一样的对齐方式,可覆盖align-items属性</span>默认值auto,表示继承父元素的align-items属性,如果没有父元素,则等同于stretch

3. ```order```属性定义项目的排列顺序

* 数值越小,排列越靠前,默认为0
* 注意:和```z-index```不一样

### rem单位

1. rem是一个相对单位
2. rem的基准是相对于html元素的字体大小

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

### 引入资源

* 针对不同的媒体使用不同的stylesheets(样式表),就是在link中判断设备的尺寸,然后应用css文件

> 语法:```<link rel="stylesheet" media="mediatype and|not|only (media feature)"> href="url"```
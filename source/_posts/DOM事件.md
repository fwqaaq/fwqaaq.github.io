---
title: DOM事件
date: 2022-02-15 21:11:41
author: Jack-zhang
categories: JS
tags:
   - JS
summary: 关于直接操控DOM属性,编译速度大于任何框架,但是不利于维护
---
## 事件对象

![DOM事件](DOM事件.png)

### 事件的绑定

>使用 `对象.事件=函数`的形式只能同时为一个元素的一个事件绑定一个响应函数.不能绑定多个,如果绑定多个,则后边会覆盖前边的

* `addEventListener()`:通过这个方法也可以为元素绑定响应函数
  * 参数
     1. **事件的字符串,不要on**
     2. 回调函数,当事件触发时,该事件触发时该函数会被调用
     3. 是否在捕获阶段触发事件,需要一个布尔值,<span style="color:red">默认值false(冒泡阶段调用)</span>
  * 注意:
    * 使用`addEventListener()`可以同时为一个元素的相同事件同时绑定多个响应函数.
    * 这样当事件触发时,响应函数将会按照函数的绑定顺序执行
* `removeEventListener()`:使用addEventListener()绑定的事件只能通过`removeEventListener()`来移除.并且如果addEventListener()中的第二个参数是匿名参数将无法移除
  * 参数和`addEventListener()`相同

```html
<script type="text/javascript">
  window.onload = function () {
    let btn01 = document.getElementById("btn01");
     btn01.addEventListener("click", function () {
        alert(1);
    }, false);
    let ale = function () {
        alert(2);
    }
    btn01.addEventListener("click", ale, false);
    btn01.removeEventListener("click",ale,fasle)

    //函数调用式
    function bond(obj, eventStr, callback) {
      obj.addEventListener(eventStr, callback, false)      
    }
    bond(btn01,"click",function(){
        alert("sb");
    });
  };
</script>
</head>

<body>
    <button id="btn01">点我一下</button>
</body>
```

### event对象

>event对象是传给事件处理程序的唯一参数.不管任何方式都会指定`event`(类似arguments)

* `event.type`:获得触发事件的类型

> `currentTarge`和`targe`.前者是当前事件处理程序的所在元素.并且始终等于this对象,而target只包含事件的实际目标

```js
let btn =  document.getElementById("myBtn")
btn.onclick = function(){
   console.log(event.currentTarge === this)//true
   console.log(event.targe === this)//true
}

//将事件处理程序添加到父节点
document.body.onclick = function(){
   console.log(event.currentTarge === this)//true
   console.log(document.body === this)//true
   console.log(event.targe === document.getElementById("myBtn"))//true
}
```

* `event.preventDefault()`:用于阻止特定事件的默认动作.比如链接的默认行为是在被单机时导航到href属性指定的url
* `event.stopPropagation()`:立即组织事件流在DOM结构中传播.取消后续事件捕获或者冒泡

### 事件的传播

> W3C

1. 捕获阶段:-在捕获阶段时,从最外层的祖先元素,向目标元素进行事件捕获,但是默认此时不会触发事件
2. 目标阶段:-事件捕获到目标元素,捕获结束开始再目标元素上触发事件
3. 冒泡阶段:-事件从目标元素向他的祖先元素传递,依次触发祖先元素上的事件
   * 注意:
     1. 如果希望在捕获阶段就触发事件,可以将addEventListener()的第三个参数设置为true
     2. 一般情况下我们不希望再捕获阶段触发时间,所以这个一般都是false

```html
<style type="text/css">
  #box1 {
    width: 300px;
    height: 300px;
    background-color: green;
  }
  #box2 {
    width: 200px;
    height: 200px;
    background-color: yellow;
  }
  #box3 {
    width: 150px;
    height: 150px;
    background-color: red;
  }
</style>
<script type="text/javascript">
  window.onload = function () {
    let box1 = document.getElementById("box1");
    let box2 = document.getElementById("box2");
    let box3 = document.getElementById("box3");
    bind(box1, "click", function () {
        alert("我是box1的单机响应函数");
    });
    bind(box2, "click", function () {
        alert("我是box2的单机响应函数");
    });
    bind(box3, "click", function () {
        alert("我是box3的单机响应函数");
    });
  };

  function bind(obj, eventStr, callback) {
    obj.addEventListener(eventStr, callback, false);
  }
</script>
</head>

<body>
    <div id="box1">
        <div id="box2">
            <div id="box3"></div>
        </div>
    </div>
</body>

```

### 事件的冒泡(Bubble)

1. 所谓的冒泡指的就是事件的向上传导,当后代的事件被触发时,其祖先元素的相同事件也会被触发
2. 在开发中大部分情况冒泡都是有用的
3. 如果不希望发生事件冒泡可以通过事件对象来取消冒泡

* 解决:将事件对象的cancelBubble设置为true,即可取消冒泡.```event.cancelBubble=true```

```html
<style type="text/css">
  #box1 {
    width: 200px;
    height: 200px;
    background-color: green;
  }
  #s1 {
    background-color: yellow;
  }
</style>
<script type="text/javascript">
  window.onload=function(){
    //为s1绑定一个单机响应函数
    let s1=document.getElementById("s1");
    s1.onclick=function(event){
      alert("我是span的单机响应函数");
      //取消冒泡
      event.cancelBubble=true;
    };
    let box1=document.getElementById("box1");
    box1.onclick=function(event){
      alert("我是div的单机响应函数")
      event.cancelBubble=true;
    };
    document.body.onclick=function(){
      alert("我是body的单机响应函数")
    };
  }
</script>
</head>

<body>
    <div id="box1">
        我是box1
        <span id="s1">
            我是span
        </span>
    </div>
</body>
```

### 事件的委派

> * 指将事件统一绑定给元素的共同的祖先,这样当后代元素上的事件触发时,会一直冒泡到祖先元素.从而通过祖先元素的响应函数来处理事件
> * 事件委派是**利用了冒泡**,通过委派可以减少事件的绑定次数,提高程序的性能

```html
<script type="text/javascript">
  window.onload = function () {
    //点击按钮以后添加超链接
    let btn01 = document.getElementById("btn01");
    let ul = document.getElementById("u1")
    btn01.onclick = function () {
      //创键一个li
      let li = document.createElement("li");
      li.innerHTML = "<a href='javascript:;'class='link'>新建超链接一</a>";
      //将li添加到ul中
      ul.appendChild(li);
    };
     //我们希望只绑定一次事件,即可应用到多个元素上,即使元素是后添加的.我们可以尝试将其绑定给元素的共同祖先元素
    ul.onclick=function(){
       //target:-event中的target表示的触发对象
      if(event.target.className=="link"){
          alert("我是单机响应函数");
      }
    };
  };
</script>
</head>

<body>
  <button id="btn01">添加超链接</button>
  <ul id="u1" style="background-color: green;">
    <li>
        <p>我是p元素</p>
    </li>
    <li><a href="javascript:; " class="link">超链接一</a></li>
    <li><a href="javascript:; " class="link">超链接二</a></li>
    <li><a href="javascript:; " class="link">超链接三</a></li>
  </ul>
</body>
```

## 事件类型

* [x] 用户界面事件(UIEvent):涉及BOM交互的通用浏览器事件
* [x] 焦点事件(FocusEvent):元素获得或失去焦点时触发
* [x] 鼠标事件(MouseEvent):鼠标在页面上执行某些操作触发
* [x] 滚轮事件(WheelEvent):使用鼠标滚轮或者类似设备触发
* [x] 键盘事件(InputEvent):在文档中输入文本时触发
* [ ] 合成事件(CompositionEvent):使用某种IME(输入法编辑器)输入字符时触发

### 用户界面事件

>load事件,在window对象上,load事件会在整个页面(包括所有的外部资源,js文件和css文件)加载完成后触发

* 使用`window.onload`或者使用`addEventListener()`

>`unload`:与事件load相对.会在文档卸载完成后触发.unload事件一般是在从一个页面导航到另一个页面时触发,常用于清理引用,以避免内存泄露

* 使用`window.onunload`或者使用`addEventListener()`

### 焦点事件

* `blur`:当元素失去焦点时触发.不冒泡
* `focus`:当元素获得焦点时触发.不冒泡
* `focusin`:当元素获得焦点时触发.是`focus`的冒泡版
* `focusout`:当元素失去焦点时触发.是`blur`的通用版

> 文本框自动获取元素

```html
<script type="text/javascript">
function loseFocus(){
   document.getElementById('password1').blur()
}
</script>

<form>
   <input type="button" οnclick="setFocus()" value="Set focus" />
</form>

<!-- 或者直接使用autofocus -->
<input type="tel" autofocus="autofocus">
```

### 鼠标和滚轮事件

* `click`:用户单机鼠标主键(通常是左键)或者按回车键时触发.
* `dblclick`:用户双机鼠标主键(通常是左键).
* `mousedown`:用户按下任意鼠标键触发
* `mouseenter`:用户把光标从元素的外部移动到元素的内部触发.该事件不冒泡,也不会在光标经过后代元素触发
* `mouseleave`:用户把光标从元素的内部移动到元素的外部触发.该事件不冒泡,也不会在光标经过后代元素触发
* `mousemove`:鼠标在元素上移动时反复触发
* `mouseout`:鼠标光标从一个元素移动到另一个元素时触发.移到的元素可以是原始元素的外部元素也可以是子元素
* `mouseover`:用户把鼠标光标从元素的外部移动到元素的内部时触发
* `mouseup`:用户释放鼠标时触发

>点击事件的触发顺寻

1. mousedown
2. mouseup
3. click
4. mousedown
5. mouseup
6. click
7. dblclick

> 客户端坐标:被保存在`event.clientX`(鼠标指针的水平坐标)和``event.clientY`(鼠标指针的垂直坐标)

* 这两个属性表示事件发生时鼠标光标在视口中的位置

> 页面坐标:页面坐标时事件发生在页面上的坐标`event.pageX`和`event.pageY`可以获取.

* 这个属性返回的是鼠标在页面上的位置,并不是像客户端坐标一样返回的是视口左边与上边的距离

> 屏幕坐标:相对于屏幕,而不是相对于浏览器视口.所以通常屏幕坐标大于等于客户端坐标

* `event.screenX`和`event.screenY`来获取坐标位置

```html
<style type="text/css">
  #areaDiv {
    width: 200px;
    height: 20px;
    border: 2px solid black;
  }
  #showMsg {
    width: 200px;
    height: 50px;
    border: 2px solid black;
  }
</style>
<script type="text/javascript">
  window.onload = function () {
    let areaDiv = document.getElementById("areaDiv");
    let showMsg = document.getElementById("showMsg");
    areaDiv.onmousemove = function (event) {
      let x = event.clientX;
      let y = event.clientY;
      //在showMsg中显示鼠标的坐标
      showMsg.innerHTML = "x=" + x + "," + "y=" + y
    }
  }
</script>

<body>
    <div id="areaDiv"></div>
    <br>
    <div id="showMsg"></div>
</body>
```

* `onmousewheel`鼠标滚轮滚动的事件,会在滚轮滚动时触发,但是火狐不支持
  * `event.wheelDelta`可以获取鼠标滚轮滚动的方向

```html
<style type="text/css">
  #box1 {
    width: 100px;
    height: 100px;
    background-color: red;
  }
</style>
<script type="text/javascript">
  window.onload = function () {
    //获取id为box1的div
    let box1 = document.getElementById("box1");
    //为box1绑定一个鼠标滚轮滚动的事件
    box1.onmousewheel = function (event) {
      //判断鼠标滚轮滚动的方向
      if (event.wheelDelta > 0 || event.detail < 0) {
          //向上滚,box1变短
          box1.style.height = box1.clientHeight - 10 + "px";
      } else {
          //向下滚,box1变长
          box1.style.height = box1.clientHeight + 10 + "px";
      }
      /* 
      当滚动条滚动时,如果浏览器有滚动条,滚动条会随之滚动
      这是浏览器的默认行为,如果不希望发生,则取消默认行为
      */
      return false;
    };
  };
</script>

<body style="height: 2000px;">
    <div id="box1"></div>
</body>
```

### 拖拽

* 拖拽的流程
  1. 当鼠标在被拖拽的元素上按下时,开始拖拽```onmousedown```
  2. 当鼠标移动时被拖拽元素跟随鼠标移动```onmousemove```
  3. 当鼠标松开时,被拖拽元素被固定在当前位置```nomousemove```

```html
<style type="text/css">
  #box1 {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: red;
  }
  #box2{
    width: 100px;
    height: 100px;
    background-color: yellow;
    position: absolute;
    left: 200px;
    top: 200px;
  }
</style>
<script type="text/javascript">
  window.onload = function () {
    //获取box1
    let box1 = document.getElementById("box1");
    //为box1绑定一个鼠标按下事件
    box1.onmousedown = function (event) {
      //div的偏移量 鼠标.clientX-offsetLeft
      //div的偏移量 鼠标.clientY-offsetTop
      let ol=event.clientX-box1.offsetLeft;
      let ot=event.clientY-box1.offsetTop;
      //当鼠标移动时被拖拽元素跟随鼠标移动onmousemove
      document.onmousemove = function (event) {
        //当鼠标移动时被拖拽元素跟随鼠标移动onmousemove
        //获取鼠标的坐标
        let left = event.clientX-ol;
        let top = event.clientY-ot;
        //设置div的偏移量
        box1.style.left = left + "px";
        box1.style.top = top + "px";
      };
      //为元素绑定一个鼠标松开事件
      document.onmouseup=function(){
        //当鼠标松开时,被拖拽元素固定在当前位置onmouseup
        //取消document的onmousemove事件
        document.onmousemove=null;
        //取消document的onmouseup事件
        document.onmouseup=null;
      };
       /* 当我们拖拽一个网页时,浏览器会默认去搜索引擎中搜索内容
         此时会导致拖拽功能异常,这个是浏览器提供的默认行为
         如果不希望这个行为发生,则可以通过return false来取消默认行为*/
      return false;
    };
  };
</script>
</head>

<body>
  一段文字
  <div id="box1"></div>
  <div id="box2"></div>
</body>
```

### 键盘事件

* `keydown`-按键被按下
  * <span style="color:red">注意:</span>
    1. 对于onkeydown来说如果一直按着某个按键不松手,则事件会一直触发
    2. 当onkeydown连续触发时,第一次和第二次之间隔时间会稍微长一点,防止误操作
* `keyup`-按键被松开:键盘事件一般都会绑定给一些可以获取到焦点的对象或者是document

> 键码`keyCode`

* event对象的`keyCode`属性会保存一个键码.对于键盘上特定的键.例如A键的键码是`65`

> `key`在DOM3中,key属性用于替代keyCode.同样属于event对象的属性

* 按下字符键时,key的值等于文本字符(如`K`或者`M`).如果按下的是非字符键,key的值就是键名(如`Shift`)

> 修饰键:通过event对象暴露.`event.altKey`,`event.ctrlKey`等等.来判断按下键是否属于这个键

* `altKey & ctrlKey & shiftKey`:这个用来判断alt ctrl 和shift是否被按下.如果按下则返回true,否则返回false

> `textInput`事件,在字符串输入到可编辑区域时触发.

* `textInput`主要关注字符.所以在event对象上提供了一个data属性.data值始终是要插入的字符

```html
<script type="text/javascript">
  window.onload = function () {
    let input = document.getElementById('abc');
    input.addEventListener("textInput", function (e) {
      console.log(e.data);
    })
  };
</script>
</head>

<body>
  <input id="abc" type="text">
</body>
```

* 同时event上还有一个`inputMethod`属性,表示向控件输入文本的手段

* 0:不能确定是什么手段
* 1:表示键盘
* 2:表示粘粘
* 3:表示拖放操作
* 4:表示IME
* 5:表示表单选项
* 6:表示手写
* 7:表示语音
* 8:表示组合方式
* 9:表示脚本

### 其它事件

>`onchange`:用于在 input,textarea,select,radio 等元素中监听的变化

* 当元素的值发生改变时.会发生`onchange`事件。对于单选框和复选框.在被选择的状态改变时.发生`onchange`事件

```html
<body>
  <a id="btn" download="index.html">下载</a>
  <input type="file" id="input">
</body>
<script>
document.getElementById("input").onchange = function (e) {
  let file = e.target.files[0]
  let img = new Image()
  img.src = URL.createObjectURL(file)
  document.body.appendChild(img)
}
```

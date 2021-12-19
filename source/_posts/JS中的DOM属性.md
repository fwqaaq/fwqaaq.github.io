---
title: JS中的DOM属性
date: 2021-9-5 11:04:30
author: Jack-zhang
categories: JS
tags:
   - JS
summary: 关于直接操控DOM属性,编译速度大于任何框架,但是不利于维护
---

## 用DOM属性操控文档

### 什么是DOM属性

> 浏览器为我们提供的文档节点对象,这个对象是window属性.可以在页面中直接使用.文档节点代表的是整个网页

### 文档的加载

> * 浏览器在加载一个页面是是按照自上而下的顺序加载的,读取到一行就运行一行,如果将script标签写到页面上面、在代码执行时,页面还没有加载,页面没有加载DOM对象也没有加载,会导致无法获取到DOM对象
> * onload事件会在整个页面加载完成之后才触发:为window绑定一个onload事件,该事件对应的响应函数会在页面加载之后执行.这样可以确保我们的代码执行时所有的DOM对象已经加载完毕了

### DOM查询

* 方法

1. ```getElementById(id)```,通过id属性来获取一组元素
2. ```getElementByTagName(tag)```,通过标签来获取一组元素,此方法会给我们返回一组类数组对象,所有查询到的元素都会封装到对象中.(即使只有一个,也会封装到数组中).
3. ```getElementByName(name)```,查找name=name的所有节点,返回一个数组
4. ```getElementsByClassName(class)```:可以根据class属性值获取一组元素节点对象
5. ```querySelector()```:需要一个选择器的字符串作为参数,可以根据一个CSS选择器来查询一个元素节点对象
   * 注意:使用该方法总会返回唯一的一个元素,如果满足条件的有多个,那么它只会返回第一个
6. ```querySelectorAll()```:该方法和querySelector()用法类似,不同的是它会将符合条件的元素封装
   * -即使符合条件的元素只有一个,他也会返回数组

```js
var div=document.querySelector(".box1 div");
console.log(div.innerHTML);//内容:   div标签中的内容
var box1=document.querySelector(".box1");
console.log(box1.innerHTML);// <div> 内容</div>:标签以及内容
```

* 属性:此属性都是通过<span style="color:red">元素.属性</span>的方式访问到

1. ```innerHTML&innerText```(自结束标签无意义)
   * ```innerHTML```可以获取当前元素的内容以及标签
   * ```innerText```只能获取当前元素的内容,自动去除标签
2. ```children```属性可以获取当前元素的所有子元素,返回一个数组.通过索引可以获取子元素的属性
3. ```className```,语法```HTMLElement.className```,id,value,name等属性直接访问即可
4. ```firstChild&lastChild```,获取到当前元素的第一个/最后一个子节点,可以获取到一个空白文本.(#text)
5. ```firstElementsChild```获取当前元素的第一个元素
6. ```parentNode```,获取到当前元素的父元素
7. ```previousSibling```,获取前一个兄弟节点[也可能获取空白的文本](object Text)
8. ```previousElementSibling```,获取前一个兄弟元素[object HTMLLIElement]
9. ```documentElement```:保存的是html跟标签

    ```js
    var html=document.documentElement;
    console.log(html);//所有标签
    ```

```html
<script type="text/javascript">
  function myClick(idStr, fun) {
    //为id为btn01的按钮绑定一个单机响应函数
    var btn = document.getElementById(idStr);
    btn.onclick = fun;
  }
  window.onload = function () {
    //为id为btn01的按钮绑定一个单机响应函数
    var btn01 = document.getElementById("btn01");
    btn01.onclick = function () {
        var bj = document.getElementById("bj");
        console.log(bj.innerHTML);//含有tag标签
    };
    var btn02 = document.getElementById("btn02");
    btn02.onclick = function () {
        //查找所有的li节点
        var lis = document.getElementsByTagName("li");
        console.log(lis.length);//7
        for (let i = 0; i < lis.length; i++) {
            console.log(lis[i].innerHTML);
        }
    };
    //为id为btn03的按钮绑定一个单机相应函数
    var btn03 = document.getElementById("btn03");
    btn03.onclick = function () {
        //查找name=gender的所有节点
        var inputs = document.getElementsByName("gender");
        for (var i = 0; i < inputs.length; i++) {
            //
            console.log(inputs[i].className);//返回class的名称
        }
    };
    //为id为btn04的按钮绑定一个单机响应函数
    var btn04 = document.getElementById("btn04");
    btn04.onclick = function () {
        //获取id为city的元素
        var city = document.getElementById("city");
        //获取#city下所有的li节点
        var lis = city.getElementsByTagName("li");
        console.log(lis.length);//4
        for (var i = 0; i < lis.length; i++) {
            console.log(lis[i].innerHTML);
        }
    };
    //为id为btn05的按钮绑定一个单机响应函数
    var btn05 = document.getElementById("btn05");
    btn05.onclick = function () {
        //获取id为city的节点
        var city = document.getElementById("city");
          var cns =city.childNodes;
        var cns2 = city.children;
        console.log(cns2[0]);//HTMLElement
    };
    //为id为btn06的按钮绑定一个单机响应函数
    var btn06 = document.getElementById("btn06");
    btn06.onclick = function () {
        var iphone = document.getElementById("iphone");
        var fir = iphone.firstChild;//HTMLText
        fir = iphone.firstElementChild;
        console.log(fir);//HTMLElement
    };
    //为id为btn07的按钮绑定一个单机响应的函数
    myClick("btn07", function () {
        //获取id为bj的节点
        var bj = document.getElementById("bj");
        //返回#bj的的父节点
        var pn = bj.parentNode;
        console.log(pn);//HTMLElement
        console.log(pn.innerText);
    });
    //为id为btn08的按钮绑定一个单机响应的函数
    myClick("btn08", function () {
        //获取id为android
        var and = document.getElementById("android");
        //返回#android的前一个兄弟节点(也可能获取空白的文本)
        var ps = and.previousSibling;
        //previousElementSibling获取前一个兄弟元素,IE8及以下不支持
        var pe = and.previousElementSibling;
        console.log(ps);//[object Text]
        console.log(pe);//[object HTMLLIElement]
    });
    //读取#username的value属性值
    myClick("btn09",function(){
        //获取id为username的元素
        var um =document.getElementById("username");
        //读取um的value
        console.log(um.value);//abcde
    });
    //设置#username的value属性值
    myClick("btn10",function(){
        //获取id为username的元素
        var um =document.getElementById("username");
        //设置um的value
        um.value="今天天气好";
    });
    //返回#bj的文本值
    myClick("btn11",function(){
        //获取id为bj的元素
      var bj =document.getElementById("bj");
      var fc=bj.firstChild;
      console.log(fc.nodeValue);
    });
  };
    </script>
</head>

<body>
    <div id="total">
        <div class="inner">
            <p>
                你喜欢哪个城市
            </p>
            <ul id="city">
                <li id="bj">beijing</li>
                <li>shanghai</li>
                <li>dongjing</li>
                <li>shouer</li>
            </ul>

            <br />
            <br />
            <p>
                你手机的操作系统是
            </p>
            <ul id="iphone">
                <li id="ios">IOS</li>
                <li id="android">Android</li>
                <li>windows phone</li>
            </ul>
        </div>
        <div class="inner">
            gender:
            <input class="hello " type="radio" name="gender" value="male" />
            Male
            <input class="hello2" type="radio" name="gender" value="female" />
            female
            <br>
            <br>
            name:
            <input type="text" name="name" id="username" value="abcde">
        </div>
    </div>
    <div id="btnList">
        <div><button id="btn01">查找#bj节点</button></div>
        <div><button id="btn02">查找所有的li节点</button></div>
        <div><button id="btn03">查找name=gender的所有节点</button></div>
        <div><button id="btn04">查找#city下所有li节点</button></div>
        <div><button id="btn05">返回#city的所有子节点</button></div>
        <div><button id="btn06">返回#phone的第一个子节点</button></div>
        <div><button id="btn07">返回#bj的fujiedian</button></div>
        <div><button id="btn08">返回#android的前一个兄弟节点</button></div>
        <div><button id="btn09">返回#username的value属性值</button></div>
        <div><button id="btn10">设置#username的value属性值</button></div>
        <div><button id="btn11">返回#bj的文本值</button></div>
    </div>
</body>
```

### dom增删改

* 方法:
  1. ```createElement()```:可以用于创建一个元素节点对象,他需要一个标签名作为参数,将会根据该标签名创建元素节点对象,并将创建好的对象作为返回值返回
  2. ```createTextNode()```:可以用来创建一个文本节点对象,需要一个文本内容作为参数,将会根据改内容创建文本节点,并将新的文本节点返回
  3. ```appendChild()```:向一个父节点中添加一个新的子节点
     * 用法：父节点.appendChild(子节点)
  4. ```insertBefore()```:可以再指定的子节点前插入新的子节点
     * 语法:父节点.insertBefore(新节点,旧节点);
  5. ```replaceChild()```:可以使用指定的子节点替换已有的子节点
     * 语法：replaceChild(新节点,旧节点);
  6. ```removeChild()```:可以删除一个子节点
     * 语法：父节点.removeChild(子节点);
     * 语法:子节点.parentNode.removeChild(子节点);

  ```html
  <script type="text/javascript">
    window.onload = function () {
      //创建一个“广州”节点,添加到#city下
      myClick("btn01", function () {
        let li = document.createElement("li");
        let gzText = document.createTextNode("广州");
        li.appendChild(gzText);
        let city = document.getElementById("city");
        city.appendChild(li);
      });
      //将“广州”节点插入到#bj前面
      myClick("btn02", function () {
        //创建一个广州
        let li = document.createElement("li");
        let gzText = document.createTextNode("广州");
        li.appendChild(gzText);
        let bj = document.getElementById("bj");
        let city = document.getElementById("city");
        city.insertBefore(li, bj);
      });
      //使用“广州”节点替换#bj节点
      myClick("btn03", function () {
        //创建一个广州
        let li = document.createElement("li");
        let gzText = document.createTextNode("广州");
        li.appendChild(gzText);
        //获取id为bj的节点
        let bj = document.getElementById("bj");
        //获取city
        var city = document.getElementById("city");
        city.replaceChild(li, bj);
      });
      //删除#bj节点
      myClick("btn04", function () {
        let bj = document.getElementById("bj");
        let city = document.getElementById("city");
        bj.parentNode.removeChild(bj);
      });
      //读取#city内的HTML代码
      myClick("btn05", function () {
        let city = document.getElementById("city");
        alert(city.innerHTML);
      });
      //设置#bj内的HTML
      myClick("btn06", function () {
        //获取bj
        let bj = document.getElementById("bj");
        bj.innerHTML = "昌平";
      });
      //向city中添加广州
      myClick("btn07",function(){
        let city=document.getElementById("city");
        /* 
        使用innerHTML也可以完成DOM的增删改的相关操作
        一般我们会两种方式结合使用
        */
        //city.innerHTML +="<li>广州</li>";
        //创建一个li
        let li=document.createElement("li");
        //向li中设置文本
        li.innerHTML="广州";
        //将li添加到city
        city.appendChild(li);
      });
    };
    function myClick(idStr, fun) {
      var btn = document.getElementById(idStr);
      btn.onclick = fun;
    }
  </script>

   <body>
    <div id="total">
        <div class="inner">
            <p>
                你喜欢哪个城市
            </p>
            <ul id="city">
                <li id="bj">北京</li>
                <li>上海</li>
                <li>东京</li>
                <li>首尔</li>
            </ul>
       </div>
    </div>
     <div id="btnList">
        <div><button id="btn01">创建一个"广州"节点,添加到#city</button></div>
        <div><button id="btn02">将“广州”节点插入到#bj前面</button></div>
        <div><button id="btn03">使用“广州”节点替换#bj节点</button></div>
        <div><button id="btn04">删除#bj节点</button></div>
        <div><button id="btn05">读取#city内的HTML代码</button></div>
        <div><button id="btn06">设置#bj内的HTML</button></div>
        <div><button id="btn07">创建一个"广州"节点,添加到#city</button></div>
    </div>
  </body>
  ```

### DOM操作CSS

* 语法：```元素.style.样式名=样式值```
* <span style="color:red">注意:</span>
  1. 如果css的样式中含有-,
  2. 这种名称再JS中是不合法的：比如background-color
  3. 需要将这种样式修改为驼峰命名法:去掉-,然后将-后的字母大写
  4. <span style="color:red">通过stytle属性设置的样式都是内联式:而内联式样式有较高的优先级,所以通过JS修改的样式往往会立即显示</span>
  5. 如果样式中写了!important,则此时样式会有最高的优先级,即使通过JS也不能覆盖改样式,此时会导致JS修改样式失效,所以尽量不要为样式添加```!important```

* ```getComputedStyle()```:这个方法来获取元素当前的样式,这个方法是window的方法,可以直接使用
* 需要两个参数：
  1. 第一个：要获取样式的元素
  2. 第二个：可以传递一个伪元素,一般传null
* 返回值:该方法会返回一个对象,对象封装了当前元素对应的样式
  1. 可以通过对象.样式名来读取样式
  2. 如果获取的样式没有设置,则会获取到真实的值,而不是默认值
  3. 比如：没有设置width,则不会获取到auto,而是一个长度

注意:<span style="color:red"> 通过```getComputedStyle()```读取到的样式是只读的,不能修改,如果要修改,必须通过style属性</span>

```html
<style type="text/css">
#box1 {
  width: 100px;
  height: 100px;
  background-color: yellow;
}
</style>
<script type="text/javascript">
  window.onload = function () {
    //点机按钮以后读取box1的样式
    let box1 = document.getElementById("box1");
    let btn01 = document.getElementById("btn01");
    btn01.onclick = function () {
      alert(getComputedStyle(box1,null).backgroundColor)
    };
  };
</script>
</head>

<body>
  <button id="btn01">点我</button>
  <br><br>
  <div id="box1" style="width: 200px;"></div>
</body>

```

* ```clientWidth & clientHeight```:这两个元属性可以获取元素的可见高度和宽度
  <span style="color:red">属性:</span>
  1. 这些属性都是不带px的,返回的都是一个数字,可以直接进行计算
  2. 会获取元素的宽度和高度包括内容区和内边距
  3. 这些属性都是只读的,不能修改
* ```offsetWidth & offsetHeight```:-获取元素的整个宽度和高度,包括内容区、内边距和边框
* ```offsetParent```-可以用来获取当前元素的定位父元素
  * 注意:
    1. 会获取到离当前元素最近的开启了定位的祖先元素
    2. 如果所有的祖先元素都没有开启定位,则返回body
* ```offsetLeft```: -当前元素相对于其定位父元素的水平偏移量
* ```offsetTop```: 当前元素相对于其定位父元素的垂直偏移量
* ```scrollWidth & scorllHeight```-可以获取元素整个滚动区域的宽度和高度
* ```scrollLeft & scrollTop```-可以获取水平和垂直滚动条滚动的距离
  * 注意:当满足```scrollHeight -scrollTop==clientHeight```说明滚动条滚动到底了

```html
<style type="text/css">
    /* 如果为表单绑定disabled="disabled"为不可用状态 */
  #box1 {
    width: 6.25rem;
    height: 6.25rem;
    background-color: red;
    padding: 10px;
    border: .625rem solid yellow;
  }
  #box2 {
    padding: 6.25rem;
    background-color: #bfa;
  }
  #box4 {
    width: 200px;
    height: 300px;
    background-color: #bfa;
    overflow: auto;
  }
  #box5{
    width: 550px;
    height: 600px;
    background-color: yellow;
  }
</style>
<script type="text/javascript">
  window.onload = function () {
    let box1 = document.getElementById("box1");
    let btn01 = document.getElementById("btn01");
    let box4=document.getElementById("box4")
    btn01.onclick = function () {
      alert(box1.offsetHeight);
      let op = box1.offsetParent;
      alert(box1.offsetLeft);
      alert(box4.clientHeight);//300px
      alert(box4.scrollHeight);//600px
      alert(box4.scrollLeft);
      alert(box4.scrollTop);
      alert(box4.clientHeight);//283
      alert(box4.scrollHeight);//600
      alert(box4.scrollHeight-box4.scrollTop);
    };
  };
</script>

<body>
    <button id="btn01">点我</button>
    <br><br>
    <div id="box4">
        <div id="box5"></div>
    </div>
    <div id="box3">
        <div id="box2" style="position: relative;">
            <div id="box1"></div>
        </div>
    </div>

</body>
```

## 事件对象

### 鼠标事件

* ```onmousemove```-该事件会在鼠标移动时会触发
  1. ```clientX```可以获取鼠标指针的水平坐标
  2. ```clientY```可以获取鼠标指针的垂直坐标

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

* ```onmousewheel```鼠标滚轮滚动的事件,会在滚轮滚动时触发,但是火狐不支持
  * ```event.wheelDelta```可以获取鼠标滚轮滚动的方向

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

### 键盘事件

* ```onkeydown```-按键被按下
  * <span style="color:red">注意:</span>
    1. 对于onkeydown来说如果一直按着某个按键不松手,则事件会一直触发
    2. 当onkeydown连续触发时,第一次和第二次之间隔时间会稍微长一点,防止误操作
* ```onkeyup```-按键被松开:键盘事件一般都会绑定给一些可以获取到焦点的对象或者是document
* ```altKey & ctrlKey & shiftKey```:这个用来判断alt ctrl 和shift是否被按下.如果按下则返回true,否则返回false

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

### 事件的绑定

>使用 对象.事件=函数的形式绑定响应的函数,他只能同时为一个元素的一个事件绑定一个响应函数.不能绑定多个,如果绑定多个,则后边会覆盖前边的

* ```addEventListener()```-通过这个方法也可以为元素绑定响应函数
  * -参数
     1. 事件的字符串，不要on
     2. 回调函数，当事件触发时，该事件触发时该函数会被调用
     3. 是否在捕获阶段触发事件，需要一个布尔值，，一般都传false
  * 注意:
    * 使用addEventListener()可以同时为一个元素的相同事件同时绑定多个响应函数.
    * 这样当事件触发时，响应函数将会按照函数的绑定顺序执行

```html
<script type="text/javascript">
  window.onload = function () {
    let btn01 = document.getElementById("btn01");
     btn01.addEventListener("click", function () {
        alert(1);
    }, false);
    btn01.addEventListener("click", function () {
        alert(2);
    }, false);

    //函数调用式
    function bind(obj, eventStr, callback) {
      obj.addEventListener(eventStr, callback, false)
        
    }
    bind(btn01,"click",function(){
        alert("sb");
    });
  };
</script>
</head>

<body>
    <button id="btn01">点我一下</button>
</body>
```

### 事件的传播

> W3C

1. 捕获阶段:-在捕获阶段时，从最外层的祖先元素，向目标元素进行事件捕获，但是默认此时不会触发事件
2. 目标阶段:-事件捕获到目标元素，捕获结束开始再目标元素上触发事件
3. 冒泡阶段:-事件从目标元素向他的祖先元素传递，依次触发祖先元素上的事件
   * 注意:
     1. 如果希望在捕获阶段就触发事件，可以将addEventListener()的第三个参数设置为true
     2. 一般情况下我们不希望再捕获阶段触发时间，所以这个一般都是false

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

### 事件的委派

> * 指将事件统一绑定给元素的共同的祖先，这样当后代元素上的事件触发时，会一直冒泡到祖先元素.从而通过祖先元素的响应函数来处理事件
> * 事件委派是**利用了冒泡**，通过委派可以减少事件的绑定次数，提高程序的性能

```html
<script type="text/javascript">
  window.onload = function () {
    //点击按钮以后添加超链接
    let btn01 = document.getElementById("btn01");
    btn01.onclick = function () {
      //创键一个li
      let li = document.createElement("li");
      li.innerHTML = "<a href='javascript:;'class='link'>新建超链接一</a>";
      //将li添加到ul中
      u1.appendChild(li);
    };
     //我们希望只绑定一次事件，即可应用到多个元素上，即使元素是后添加的.我们可以尝试将其绑定给元素的共同祖先元素
    u1.onclick=function(){
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

### 拖拽

* 拖拽的流程
  1. 当鼠标在被拖拽的元素上按下时，开始拖拽```onmousedown```
  2. 当鼠标移动时被拖拽元素跟随鼠标移动```onmousemove```
  3. 当鼠标松开时，被拖拽元素被固定在当前位置```nomousemove```

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
        //当鼠标松开时，被拖拽元素固定在当前位置onmouseup
        //取消document的onmousemove事件
        document.onmousemove=null;
        //取消document的onmouseup事件
        document.onmouseup=null;
      };
       /* 当我们拖拽一个网页时，浏览器会默认去搜索引擎中搜索内容
         此时会导致拖拽功能异常，这个是浏览器提供的默认行为
         如果不希望这个行为发生，则可以通过return false来取消默认行为*/
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

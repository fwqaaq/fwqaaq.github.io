---
title: ChromeDevtools
date: 2022-09-06 08:37:57
categories: Config
tags:
   - Config
summary: 浏览器控制台内置的语法
---

1. `$_`:使用上一次表达式的结果

   ```js
   2 + 2;
   $_; //4
   ```

2. `$0`:光标在 `Element` 中选中的元素,如果是上一个选中的可以使用`$1`
3. `$()`:等价于`document.querySelector()`

   ```js
   $("img");
   //<img>...</img>
   ```

   - 当然,你也可以将`$0`和它组合:`$('img',$0)`,其中`$0`指的是上下文
4. `$$()`:等价于`document.querySelectorAll()`,返回所有的元素,同样,它也可以指定上下文`$0`,或者`$(main)`

   ```js
   $$("img");
   //[5]...
   ```

5. `$x(path)` 能使用xpath选择器来返回符合选择器的所有元素

   ```js
   $x("/html/body/div[1]/header");
   //<header>..</header>
   ```

6. `queryObjects(Promise)`:选中该网页所有的 Promise 对象

   ```js
   queryObjects(Promise);
   //Promise{}...
   //...
   ```

7. `player`:打印网页嵌入的浏览器标签
   - `table(player)`:以表格的形式打印出浏览器的 player 的状态
   - 也可以用于打印对象成为表格

   ```js
   const names = {
     0: { firstName: "John", lastName: "Smith" },
     1: { firstName: "Jane", lastName: "Doe" },
   };
   table(names);
   ```

8. `keys(object)/values(object)`:返回对象中所有键/值的集合
9. `getEventListeners(object)`:打印元素的所有事件的集合

   ```js
   getEventListeners($0);
   ```

10. `copy(object)`:可以直接复制字符串表达式,`copy($0)`
11. `dir(object)`:列出指定元素的所有属性
12. `monitor(function)`:监听函数调用,会返回这个函数调用的参数

    ```js
    function sum(x, y) {
      return x + y;
    }
    //undefined
    monitor(sum);
    //undefined
    sum(1, 2);
    //init.js:1 function sum called with arguments: 1, 2
    //3
    ```

13. `monitorEvents(object[, events])`:监听一个或者一组事件

    ```js
    monitorEvents(window, "resize");
    monitorEvents(window, ["resize", "scroll"]);
    ```

14. `dirxml(object)`: dirxml返回指定对象的xml结构，相当于console.dirxml()

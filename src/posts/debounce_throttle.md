---
title: 防抖节流
date: 2022-01-18 15:55:58
categories: JavaScript
tags:
   - JavaScript
summary: 防抖和节流
---

## 场景

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Document</title>
  <style>
    #container {
      width: 100%;
      height: 200px;
      line-height: 200px;
      text-align: center;
      color: #fff;
      background-color: #444;
    }
  </style>
</head>

<body>
  <div id="container"></div>
  <script>
    let count = 0
    let divContainer = document.getElementById("container")
    function getUserAction() {
      divContainer.innerHTML = count++
    }
    divContainer.onmousemove = getUserAction
  </script>
</body>

</html>
```

> [!TIP]
> 当鼠标一放到矩形框中，就会不停的触发事件 (如果是复杂的回调或者 ajax 的请求就会很频繁的触发事件)
>
> 有两种解决方案：防抖和节流

## 防抖

> 防抖的原理就是：尽管触发事件，但是我只触发最后一次事件，且 n 秒内不再触发。总之，就是要等你触发完事件 n 秒内不再触发事件

```js
function debounce(func, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func();
    }, wait);
  };
}
divContainer.onmousemove = debounce(getUserAction, 1000);
```

- 注意：
  1. setTimeout 中建议使用箭头函数，会指向函数外的 this(这个 this 就是调用这个事件的 id 为 container 的 div)
  2. 如果使用普通的函数，会指向 setTimeout 内部设定好的 this，即 window
  3. timeout 在外部初始化，`clearTimeout`会清理上一次的定时器

> 如果不使用箭头函数，就得考虑 this 绑定问题，还有事件对象`event`

```js
function debounce(func, wait) {
  let timeout;
  let _self = this;
  return function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      Reflect.apply(func, _self, e);
    }, wait);
  };
}
```

### 立即执行

> 如果希望事件每次重新点击都会立刻执行，然后等到停止触发 n 秒后，才可以重新触发。而不是非要等到事件停止触发后才执行

```js
function debounce(func, wait, immediate) {
  let timeout;
  return function (e) {
    //timeout 为 false 才会立即执行
    let hasImmediate = !timeout && immediate;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      //执行完定时器之后也会立即执行
      timeout = null;
    }, wait);
    if (hasImmediate) {
      func(e);
    }
  };
}
```

- 两种立即执行的情况
  1. 当开始滑动时，再次触发事件，事件会立即执行
  2. setTimeout 是宏任务，初始化之后会放到队列中。
  3. 当定时器执行完毕时，再次触发事件，事件会立即执行
  4. 除了定时器之外的依然会按照事件的频率触发

### 取消

```js
function debounce(func, wait, immediate) {
  let timeout;
  function debounced(e) {
    let hasImmediate = !timeout && immediate;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (timeout) {
        func(e);
      }
      timeout = null;
    }, wait);
    if (hasImmediate) {
      func(e);
    }
  }
  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
}
```

> 使用：`click`事件绑定一个监听器

```js
let setUserAction = debounce(getUserAction, 10000, true);
divContainer.onmousemove = setUserAction;
document.getElementById("btn").addEventListener("click", function () {
  setUserAction.cancel();
});
```

- 不要绑定`click`事件，这是浏览器开放的一个鼠标点击自定义接口
- 不要与`onclick`事件搞混

```js
document.getElement("btn").onclick = function () {
  setUserAction.cancel();
};
```

## 节流

> [!TIP]
> 持续触发事件，每隔一段时间，只执行一次事件

### 使用时间戳

> 当触发事件的时候，取出当前的时间戳，然后减去之前的时间戳 (一开始值为 0),如果大于设置的时间周期，然后更新时间戳为当前的时间戳。反之不执行

```js
function throttle(func, wait) {
  let previous = 0;
  return function (e) {
    let now = new Date().getTime();
    if (now - previous > wait) {
      func(e);
      previous = now;
    }
  };
}

container.onmousemove = throttle(getuserAction, 1000);
```

### 使用定时器

> 当触发事件的时候，设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行完，执行函数，清空定时器

```js
function throttle(func, wait) {
  let timeout;
  return function (e) {
    timeout = setTimeout(() => {
      func(e);
      timeout = null;
    }, wait);
  };
}
container.onmousemove = throttle(getUserAction, 1000);
```

1. 使用时间戳事件会立刻执行，并且停止触发后不会再执行
2. 使用定时器事件会在 n 秒后执行，并且停止触发后依然会在执行一次

### 优化

> 如果鼠标移入能立刻执行，且停止触发的时候还能在执行一次

1. leading:false 表示禁用第一次
2. trailing:false 表示警用停止触发
3. 不能同时设置为 false，同时为 false 的时候。鼠标移出过了设置的时间，在移入就会立即执行

```js
function throttle(func, wait, options) {
  let timeout, previous = 0;
  if (!options) options = {};
  let later = function () {
    privous = options.leading === fasle ? 0 : new Date().getTime();
    let previous = new Date().getTime();
    func();
    timeout = null;
  };
  function throttled() {
    let now = new Date().getTime();
    if (options.leading === false && !privous) privous = now;
    let remaining = wait - (now - previous);
    if (remaining < 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func();
    } else if (!timeout && options.trailing === true) {
      timeout = setTimeout(later, remaining);
    }
  }
  return throttled;
}
```

1. 为什么会有 `!timeout`,当触发的时间小于等待的时间的时候会执行，并且因为是定时器会在一段时间后再执行（并且不断的触发定时器都会重新执行，直到 `remaining<=0`）
2. `remaining <= 0 || remaining > wait`：小于等待时间，或者时间超过了等待时间（previous 只有在 if...内部会更新。第一次触发后只有 now 会不停更新）

### throttled 取消

```js
throttled.cancel = function () {
  clearTimeout(timeout);
  timeout = null;
  previous = 0;
};
```

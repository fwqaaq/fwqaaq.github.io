---
title: Observer
date: 2022-03-15 15:05:01
categories: JavaScript
tags:
  - JavaScript
  - TypeScript
  - Browser
summary: 浏览器的监听事件
---

## Observer

> [!IMPORTANT]
> 网页开发中经常会和用户交互而使用一些监听事件（例如 onclick、onchange 等）。如果对于一些用户不直接触发的元素（例如渐变等），那就需要使用 Observer 去监听

- 浏览器为我们提供了五种 `Observer`（观察者）来监听这些变动：`MutationObserver`、`IntersectionObserver`、`PerformanceObserver`、`ResizeObserver`、`ReportingObserver`
- 以下观察者 API 都是构造函数
- 观察者属于微任务，并且优先级小于 Promise

### IntersectionObserver

> `IntersectionObserver`（交叉观察者）用于观察一个元素是否在视窗可见。构造函数创建并返回一个新的`IntersectionObserver`对象
>
> 如果未指定或为空字符串，则缺省的值为属性的默认值
>
> 一般用于**无限滚动**、**图片懒加载**、**埋点**、**控制动画/视频执行**

- 无论是使用视口（body）还是其他元素作为根，API
  的工作方式都相同，并且会**异步**查询观察目标元素的可见性发生变化，就会执行提供的回调函数
- 通过提供一种新方法来**异步**查询元素相对于其他元素或全局视口的位置
- **异步处理**消除了昂贵的`DOM`和样式查询，连续轮询以及使用自定义插件的需求
- Intersection Observer 的三个步骤
  1. 创建观察者
  2. 定义回调事件
  3. 定义要观察的目标对象

#### 实例方法

1. `IntersectionObserver.observe(target)`：告诉要观察的目标元素
2. `IntersectionObserver.takeRecords()`：从 IntersectionObserver 的通知队列中删除所有待处理的通知，并将它们返回到 IntersectionObserver 对象的新 Array 对象中
3. `IntersectionObserver.unobserve()`：指定停止观察特定目标元素
4. `IntersectionObserver.disconnect()`：停止 IntersectionObserver 对象观察任何目标

#### 创建观察者

- 接收一个回调函数。只要目标元素发生变化就会触发回调函数
- 第二个参数是一个可选项

```js
let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  //阈值为 1.0 表示当 100% 的目标在选项指定的元素中可见时，将调用回调
  //每个阈值是观测目标的交集区域与边界框区域的比率
  threshold: 1.0
}

let observer = new IntersectionObserver(callback, options?);
```

> option 字段

1. `root`：用作检查**目标可见性的视口的元素**，必须是目标的祖先。如果未指定或缺省为浏览器视口（html）
2. `rootMargin`：**根周围的边距**（默认全部为 0），语法类似于`margin`可以是百分比或者像素，用于在计算交集之前增大或缩小根元素边界框的矩形偏移量，有效的扩大或者缩小根的判定范围从而满足计算要求。（top、right、bottom、left）
3. `threshold`：阈值。**单个数字或数字数组**.默认值为 0（这意味着只要有一个像素可见，就会运行回调）阈值是监听对象的交叉区域和边界区域的比例，每当监听对象超过阈值就会触发回调
   - 如果只想检测可见性何时超过 50% 标记，则可以使用值 0.5。
   - 如果希望每次可见性每次超过 25% 时都运行回调，则应指定数组 [0, 0.25, 0.5, 0.75, 1]
   - 如果值为 1.0 表示在每个像素可见之前，不会认为阈值已通过。

#### 监听观察的目标对象

> 开启对目标对象的监听，如果没有

```javascript
const target = document.querySelector('.target')
observer.observe(target)
```

#### 回调函数

> callback 是添加监听后，当监听目标发生滚动变化时触发的回调函数。

- 第一个参数 `entries`（数组），即 `IntersectionObserverEntry` 实例。描述了目标元素与 root 的交叉状态。

| 属性                  |                                                          说明                                                          |
| --------------------- | :--------------------------------------------------------------------------------------------------------------------: |
| boundingClientRect    |                         返回包含目标元素的边界信息，返回结果与 `getBoundingClientRect()` 相同                          |
| **intersectionRatio** |                                             返回目标元素出现在可视区的比例                                             |
| intersectionRect      |                                           用来描述 root 和目标元素的相交区域                                           |
| **isIntersecting**    | 返回布尔值，下列两种操作均触发回调：1.如果目标元素出现在 root 可视区，返回 true。2. 如果从 root 可视区消失，返回 false |
| rootBounds            |                                             用来描述交叉区域观察者中的根。                                             |
| target                |                                          目标元素：与根出现相交区域改变的元素                                          |
| time                  |                        返回一个记录从 IntersectionObserver 的时间原点到交叉被触发的时间的时间戳                        |

- 第二个参数就是 `IntersectionObserver` 这个实例对象本身。可以使用实例上的方法。

#### 图片懒加载

```html
<body>
  <img width="200px" height="200px" src="logo.png" data-src="0.jpg" />
  <img width="200px" height="200px" src="logo.png" data-src="1.jpg" />
  <img width="200px" height="200px" src="logo.png" data-src="2.jpg" />
</body>
<script>
  const img = document.getElementsByTagName('img')
  let observe = new IntersectionObserver(
    (entries, observe) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          item.target.src = item.target.dataset.src
          observe.unobserve(item.target)
        }
      })
    },
    { rootMargin: '0px 600px 0px -600px' }
  )
  // observe 遍历监听所有 img 节点
  Array.from(img).forEach((img) => observe.observe(img))
</script>
```

> `HTMLCollectionOf` 和 `NodeListOf`的区别

- 参考：[DOM 标准 (whatwg.org)](https://dom.spec.whatwg.org/#interface-htmlcollection)
- 由于是历史遗留的产物，`HTMLCollectionOf` 他返回的是一个集合，并不支持任何数组的高级 api
  - 并且一切由 `getElements...` 返回的节点都是动态的集合类型，没有实现 forEach 等方法
  - 动态的：如果基本的文档改变时。所有 `HTMLCollection` 对象会立即改变
- `NodeListOf`是静态的。实现了所有的高级数组都有的 API，`forEach`等
  - 了解了这些，使用元素选择的时候也可以使用 `querySelectAll()` 来选择元素。他会返回一个 NodeListOf 的类型

> 理解可视区

- 重要的一点就是可视区的理解
  - **intersectionRatio** 对应的是 `threshold`
  - **isIntersecting** 对应的是 `rootMargin`
- 只要理解了 `rootMargin` 就很容易理解 threshold 的概念
- 理解 margin，由于文档流的缘故，在设置 margin 的 `top` 或者 `bottom` 任意值的时候会移动盒子。如果设置 `left` 或者 `right` 必须同时设置才会改变盒子原来的位置，只设置一个值只会撑大盒子
- 例如上面图中设置的整体元素会向左移动 600px.并且目标元素是相对于视口来说，但是理论上所有的图片都应该移动到视口之外的位置。并且不可以看到图片的懒加载。但是由于浏览器本身有一定的默认值，我们会得到最后一个图片是触发观察者实现懒加载的
- 明白了这个，就可以明白`threshold`，只有目标元素的可见性达到视口的一定比例（threshold 的属性值）之后才可以触发观察者模式

<iframe height="300" style="width: 100%;" scrolling="no" title="IntersectionObserver" src="https://codepen.io/jack-zhang-1314/embed/YzYXYrV?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/jack-zhang-1314/pen/YzYXYrV">
  IntersectionObserver</a> by Jack-Zhang-1314 (<a href="https://codepen.io/jack-zhang-1314">@jack-zhang-1314</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### MutationObserver

- `Mutation Observer` 是**异步**触发，DOM 的变动并不会马上触发，而是要等到当前所有 DOM 操作都结束才触发
- 可以通过配置项，监听目标 DOM 下子元素的变更记录
- 构造函数返回一个新的，包含监听 DOM 变化回调函数的
  [`MutationObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
  对象
- 使用用途
  - 一般用于更高性能的数据绑定及响应
  - 实现视觉差滚动
  - 图片预加载
  - 实现富文本编辑器

#### Mutation 实例方法

1. `MutationObserver.observe(dom,options)`：阻止 `MutationObserver`
   实例继续接收的通知，直到再次调用其 [`observe()`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe) 方法，该观察者对象包含的回调函数都不会再被调用
2. `MutationObserver.takeRecords()`：从 MutationObserver 的通知队列中删除所有待处理的通知，并将它们返回到 [`MutationRecord`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord)（保存每次的变化信息）对象的新 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
3. `MutationObserver.disconnect()`：停止 MutationObserver 对象观察任何目标

#### Mutation 创建观察者和监听目标对象

```js
const MutationObserver = new MutationObserver(callback)
MutationObserver.observe(dom, options)
```

- 第一个参数是一个 dom 对象，被观察子节点 (目标元素) 的父节点
- 第二个参数 options 是一个 [MutationObserverInit](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/API/MutationObserver/observe_2f2addbfa1019c23a6255648d6526387) 对象
  - `attributeFilter`：（无默认值）要监视的特定属性名称的**数组**（如 `['src','class']`）。如果未包含此属性，则对所有属性的更改都会触发变动通知
  - `attributes`：默认值 false。设置 true 观察受监视元素的属性值变更
  - `characterData`：无默认值。设为 true 监视指定目标节点或者子节点树中节点所包含的字符数据的变化
  - `characterDataOldValue`：无默认值。设为 true，是否观察文本的内容（文本节点）
  - `childList`：默认值为 false。设为 true，监视木匾检点添加或删除新的子节点（不包括修改子节点以及子节点后代的变化）。如果 `subtree` 为 true，则包含子节点
  - `subtree`：默认值为 false，设置 true，将监视范围扩展到目标节点以及子节点
- 属性特定项
  - 其中调用 `observe()` 方法时 `childList`、`attributes`、`characterData` 或者`attributeOldValue`、`characterDataOldValue` 两组中，至少有一个必须为 `true`，否则会抛出异常
  - `attributeFilter`/`attributeOldValue` > `attributes`
  - `characterDataOldValue` > `characterData`
  - 避免重复的特定项，不需要同时设置同样的效果

#### mutation 回调函数

> 同样是接收两个参数

- 第一个参数是 [`MutationRecords`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord)，依然是一个数组。其中每个 `MutationRecord` 对象，记录着 `DOM` 每次发生变化的变动记录。`MutationRecord` 对象包含了 DOM 的相关信息

| 属性                   | 描述                                                                                                                                                                                                                 |
| ---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **target**             | 被修改影响的目标 dom 节点                                                                                                                                                                                            |
| **type**               | 变化的类型，也就是 MutationObserverInit 对象中的三种 `attributes`、`characterData` 或 `childList`，并且返回该类型                                                                                                    |
| **attributeName**      | 针对 `attributes` 类型的变化时，返回被修改属性的名字（或者 null）                                                                                                                                                    |
| **attributeNamespace** | 针对命名空间的`attributes`类型的变化。返回被修改属性的命名空间，或者 null                                                                                                                                            |
| **oldValue**           | 如果在 `MutationObserverInit`对象中启用（`attributeOldValue` 或 `characterDataOldValue` 为 true）。则 `attributes` 或 `characterData` 的变化事件会返回变化之值或数据。`childList`类型的变化始终将这个属性设置为 null |
| **addedNodes**         | 针对 `childList` 的变化，返回包含变化中添加节点的 `NodeList`，没有节点被添加，返回空 `NodeList` 数组                                                                                                                 |
| **previousSibling**    | 对于 `childList` 变化。返回被添加或移除的节点之前的兄弟节点，或者 null                                                                                                                                               |
| **nextSibling**        | 对于 `childList` 变化，返回被添加或移除的节点之后的兄弟节点。或者 null                                                                                                                                               |
| **removedNodes**       | 对于 `childList` 变化，返回被移除的节点 (没有则为 null)                                                                                                                                                              |

- 第二个参数就是 `MutationObserver` 这个实例对象本身。可以使用实例上的方法。

> [`MutationObserver` 的引用](https://juejin.cn/post/7036733000565915655)

- `MutationObserver` 对要观察的目标节点的引用属于**弱引用**,所以不会妨碍垃圾回收程序回收目标节点
- 目标节点对于 `MutationObserver` 是强引用。如果目标节点从 DOM 中被移除，随后被垃圾回收，则关联的 MutationObserver 也会被垃圾回收

> `MutationRecord` 的引用

- `MutationRecord` 实例至少包含对已有 DOM 节点的一个引用，即里面的 target 属性，如果变化是 `childList` 类型，则会包含多个节点的引用
- 记录队列和回调处理的默认行为是耗尽这个队列，处理每个 `MutationRecord`，然后让它们超出作用域并被垃圾回收

  - `MutationObserver` 核心是异步回调与记录队列模型。为了在大量变化事件发生时不影响性能，每次变化的信息**由 oberver 实例决定**。保存在 **MutationRecord** 实例中，然后添加到记录队列
  - 记录队列对每个 **MutationObserver** 实例都是唯一的，是所有 **DOM**
    变化事件的有序列表（DOM 变化事件都会以数组的形式存在 MutationRecord 中），多次修改的信息会在一次回调中执行

- 有时候需要保存某个观察者的完整变化记录，那么就保存所有的 `MutationRecord` 实例，也就会保存它们引用的节点，而这会妨碍这些节点被回收
- 如果需要尽快地释放内存，可以从每个 `MutationRecord` 中抽取出最有用的信息，保存到一个新对象，然后释放 `MutationRecord` 中的引用

### ResizeObserver

- **`ResizeObserver`**
  构造器创新一个新的 `ResizeObserver` 对象，用于接收 `Element` 内容区域的改变或 `SVGElement` 的边界框改变改变

- 用途：更智能的响应式布局（取代 `@media`）以及响应式组件
- 由于 resize 事件会监听视窗的变化而不是元素的大小发生变化。可能一秒内会触发几十次，导致性能问题

#### Resize 实例方法

1. `observe(target,options?)`:用于指定观察一个指定的 `Element` 或者 `SVGElement`
2. `disconnect()`:停止和取消目标对象上所有对 `Element` 或者 `SVGElement` 监视
3. `unobserve()`:用于结束一个指定的 `Element` 或者 `SVGElement` 监视

#### 创建 Resize 实例

```js
const ResizeObserver = new ResizeObserver(callback)
resizeObserver.observe(target, options?);
```

- `box`
  - `content-box`: 默认值。CSS 中定义的内容区域的大小。
  - `border-box`: CSS 中定义的边框区域的大小。
  - `device-pixel-content-box`: 在对元素或其祖先应用任何 CSS 转换之前，CSS 中定义的内容区域的大小，以设备像素为单位

```js
resizeObserver.observe(target, { box: 'content-box' })
```

#### Resize 回调函数

- 只接收一个 `ResizeObserverEntry` 实例 [ResizeObserverEntry - Web API 接口参考 (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserverEntry)

- 目前只接受五个属性
  1. `target`：当前改变尺寸大小的元素的引用
  2. `contentRect`：对改变尺寸大小的元素的 [`DOMRectReadOnly`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMRectReadOnly) 引用（包含 x、y、width、height、top、right、bottom、left）
  3. `borderBoxSize`：一个对象，当运行回调时，该对象包含着正在观察元素的新边框盒的大小
  4. `contentBoxSize`：一个对象，当运行回调时，该对象包含着正在观察元素的新内容盒的大小
  5. `devicePixelContentBoxSize`：一个对象，当运行回调时，该对象包含着正在观察元素的新内容盒的大小（**以设备像素为单位**）

### PerformanceObserver

> **`PerformanceObserver`**
> 用于监测性能度量事件，在浏览器的性能时间轴记录下一个新的
> [performance entries](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry)
> 的时候将会被通知

- 用途：更细颗粒的性能监控。分析新跟那个对业务的影响（交互快/慢是否会影响销量）

- 尽可能使用 `PerformanceObserver`，而不是通过 `Performance` 获取性能参数及指标
  - 避免不知道性能事件啥时候会发生，需要重复轮训 `timeline` 获取记录。
  - 避免产生重复的逻辑去获取不同的性能数据指标
  - 避免其他资源需要操作浏览器性能缓冲区时产生竞态关系

> 实例方法和 MutationsObserver 一样，但是 `observe()` 只接受 `options`

#### 创建 Performance 实例

```js
const PerformanceObserver = new PerformanceObserver(callback)
PerformanceObserver.observe({ entryTypes: ['measure'] })
```

- `options`只接收一个 entryTypes 的键，值为一个性能检测数组

| 属性                  | 别名                                                | 类型      |                                      描述                                      |
| :-------------------- | :-------------------------------------------------- | :-------- | :----------------------------------------------------------------------------: |
| `frame`, `navigation` | PerformanceFrameTiming, PerformanceNavigationTiming | URL       |                                   文件的地址                                   |
| `resource`            | PerformanceResourceTiming                           | URL       |              文件请求资源解析的 URL。只有在资源加载完毕后才会创建               |
| `mark`                | PerformanceMark                                     | DOMString |  通过调用创建标记使用的名称。会在资源获取开始时创建 `performance.mark(name)`   |
| `measure`             | PerformanceMeasure                                  | DOMString | 通过调用创建度量时使用的名称。会在对资源操作时创建 `performance.measure(name)` |
| `paint`               | PerformancePaintTiming                              | DOMString |             渲染时间点的信息接口。找出那些花费太多时间去绘制的区域             |

#### Performance 回调函数

> 回调函数只接受一个参数，该参数 `PerformanceObserverEntryList` 对象。该对象有三个接口

1. `getEntries()`：返回所有的 [`PerformanceEntry`](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry) 对象组成的数组
2. `getEntriesByType(entryType)`：返回指定的 `entryType` 类型组合成的 `PerformanceEntry` 对象数组
3. `getEntriesByName(name)`：返回通过指定的属性名（例如 `performance.measure(name)` 的 name）组合成 `PerformanceEntry` 对象的数组

> `PerformanceEntry` 对象

- 属性值：
  - `name`：该性能条目的名字。例如 mark、measure 通过指定名称 name
  - `entryType`：上述的 options 包含所有的 entryType 属性
  - `startTime`：返回 `PorformanceEntry` 的第一个时间戳
    1. `frame`：当页面开始加载时，返回的时间戳
    2. `mark`：当使用 `performance.mark(name)` 创建 mark 标记之后返回的时间戳
    3. `measure`：当使用 `performance.measure(name)` 创建 measure 标记之后返回的时间戳
    4. `navigation`：返回值为 0 的时间戳
    5. `resource`：返回浏览器开始获取资源的时间戳
  - `duration`：该资源的耗时时间
- 方法：`toJSON()`：返回 JSON 格式数据的 PerformanceEntry 对象

```html
<body>
  <button onclick="measureClick()">Measure</button>
  <img
    src="http://zyjcould.ltd/blog/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%A7%86%E5%8F%A3.png"
  />
  <script>
    const performanceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(entry.entryType)
        console.log(entry.startTime)
        console.log(entry.name)
        console.log(entry.duration)
        console.log(entry.toJSON())
      })
    })
    performanceObserver.observe({ entryTypes: ['resource', 'mark', 'measure'] })

    performance.mark('registered-observer')

    function measureClick() {
      performance.measure('button clicked')
    }
  </script>
</body>
```

### ReportingObserver(实验)

> `ReportingObserver()` 构造函数会创建一个新的
> [`ReportingObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ReportingObserver) 对象实例，该实例可用于收集和获取 reports

- 使用：将浏览器弃用的 `API` 或者运行时**浏览器的干预行为**由自己约束
  - 违反浏览器的选项时
  - JS 的异常和错误（替代 `window.onerror`）
  - 未处理的 promise 的 `reject`（替代 `window.onunhandledrejection`）

> ReportingObserver 实例方法和 `MutationObserver` 的实例方法一样。但是 `observer()` 不需要任何参数

#### 创建 Reporting 实例

```js
let options = {
  types: ['deprecation'],
  buffered: true
}
const reportingObserver=new ReportingObserver(callback, options?)
```

- options 提供两个属性，`types` 和 `buffered`

1. `types`：提供三个属性值

   - `deprecation`：浏览器运行时遇到弃用的 API 会打印这个选项
   - `intervention`：浏览器自己的干预行为。可能遇到一些不安全的行为（如带有不安全的 iframe，过时的 API 等）
   - `crash`：浏览器崩溃时的行为

2. `buffered`：布尔值，如果时 true，可以查看创建观察者之前生成的报告（使用于延迟加载的情况，不会错过页面加载之前发生的事情）

#### Reporting 回调函数

> 提供两个参数，第一个参数是一个 `reports` 数组对象。同样也可以通过 `takeRecords()` 实例方法获取这些数组

- `report` 对象有三个属性：`body`、`type`、`url`
  - `type`：返回的是 report 类型，即 options 选项中的 types
  - `url`：返回的是生成 report 的文档
  - `body`：返回 report 正文，包含详细的 report 对象，目前只有两种 **body 对象**（取决于 type 的返回值）
    1. [`DeprecationReportBody、InterventionReportBody`](https://developer.mozilla.org/en-US/docs/Web/API/DeprecationReportBody)
       - `id`：已弃用的功能或 API 的字符串
       - `anticipatedRemoval`：Data 对象，表示应从浏览器中要删除的日期。如果日期位置，返回 null
       - `message`：字符串，api 的弃用说明。包括新功能的取代说明
       - `sourceFile`：string 类型，使用已弃用 API 的源文件路径。已知或其他返回 null
       - `lineNumber`：number 类型，表示源文件中使用已弃用的功能的行。已知或其他返回 null
       - `columnNumber`：number 类型，表示源文件中使用已弃用的功能的行=列。已知或其他返回 null
    2. [`CrashReportBody`](https://developer.mozilla.org/en-US/docs/Web/API/CrashReportBody)
       - `reason`：表示崩溃原因的字符串。如果返回的是 `oom`：浏览器内存不足。如果返回的是 `unresponsive`：页面由于无响应而被终止

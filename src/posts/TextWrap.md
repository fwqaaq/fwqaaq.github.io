---
date: 2023-12-15 20:59:44
title: 文本换行
categories: CSS
tags:
  - CSS
summary: 文本换行
---

> 今天发现 blog 的文章文字溢出，其实这种情况也不是一次两次了，所以就准备总结一下文本的换行问题。

## 文字换行

不同的文字换行是不同的

>如果是汉字，在没有标点的情况下，<span style="color: red;">任意的文字都是换行点</span>；如果有标点，有些标点不能出现在开头，有些标点不能显示在结尾

* **避头标点**：不能出现在开头的标点。例如：逗号、句号、问号、顿号、感叹号等
* **闭尾标点**：不能放在尾部的标点。例如：上引号、上括号等

> 英文字符只能在某些特定的中断字符那里才会触发换行

* **Space**（空格）：unicode 值为 `U+0020`
* `google`、`safria`、`webview`：短横线（U+002D）<span style="color: red;">后面是字母或者数字，不能是标点</span>，英文问号（U+003F），各种前括号 `(`、`[`、`{`
* `firfox`：短横线（U+002D），<span style="color: red;">后面是字母，不能是数字</span>，斜杠（U+002F）
* `Edge`：短横线（U+002D）<span style="color: red;">前后是字符个数大于 1 的字符单元</span>，连续百分号 `%`

## [overflow-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow-wrap)

```css
overflow-wrap: normal | break-word | anywhere;
```

* **normal**：默认值，只在允许的默认点点换行（`word-break`）
* **break-word**：如果行内没有多余的地方容纳该单词到结尾，则那些正常的不能被分割的单词会被强制分割换行。
* **anywhere**：允许在单词内换行。

`break-word` 和 `anywhere` 区别：如果是自适应的宽度，那们 `width: min-content` 的大小第一个会是最长单词的宽度，而 `anywhere` 将每个字母都会换行，宽度就是字母宽度。

## [word-break](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break)

```css
word-break: normal | break-all | keep-all;
```

* **normal**：默认值，只在允许的默认点点换行（`overflow-wrap`）
* **break-all**：对于 non-CJK 文本允许在单词内换行。
* **keep-all**：CJK 文本不断行。Non-CJK 文本表现同 normal。

## [white-space](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)

> white-space 属性用于设置如何处理元素内的空白字符，这里的空白指的是 HTML 文件中的留白。

```css
white-space: normal | nowrap | pre | pre-wrap | pre-line | break-spaces;
```

* **normal**：默认值，空白会被浏览器忽略。
* **nowrap**：文本不会换行，文本会在在同一行上继续，直到遇到 `<br>` 标签为止。
* **pre**：空白会被浏览器保留。其行为方式类似 HTML 中的 `<pre>` 标签。
* **pre-wrap**：保留空白符序列，但是正常地进行换行。
* **pre-line**：合并空白符序列，但是保留换行符。
* **break-spaces**：与 `pre-wrap` 类似，但是在遇到换行符或者 `<br>` 标签时会进行换行。

## [line-break](https://developer.mozilla.org/zh-CN/docs/Web/CSS/line-break)

> 用来处理如何断开（break lines）带有标点符号的中文、日文或韩文（CJK）文本的行。

## 文字溢出

> web 默认的换行特性带来的连续英文宽度溢出问题

* 由于默认特性会在 `-` 字符换行，只需要加上 `word-break: break-all` 就可以使单词断行，而不是 `-`

>`break-all` 断开了单词或者固定词组，因为小部分的场景的排版问题，牺牲了大多数场景的阅读体验

* **注意**：`word-break: break-all` 无法使破折号换行
  * 使用 `word-break: break-word` 使中文破折号换行（已弃用）。现在已使用 `overflow-wrap` 代替，`word-wrap` 现在用作 `overflow-wrap`
  * `overflow-wrap` 仅会在无法将整个单词放在自己的行而不会移除的情况下才会产生中断

```css
/* 字符换行 */
word-break: break-all;
/* 破折号换行 */
overflow-wrap: break-word;
```

## [hyphens](https://developer.mozilla.org/zh-CN/docs/Web/CSS/hyphens)

>在英文文字换行的时候自动添加连接符（`-`）

```css
hyphens: none | manual | auto;
```

* 两种连字符
  * **硬连字符**：（U+2010），可见换行机会
  * **软连字符**：（U+00AD），不可见换行机会。<span style="color: red;">需要换行时候连字符才出现，不需要换行的时候连字符隐藏</span>
    * 在 HTML 中使用 `&shy;` 表示软连字符。只适用于英文字符换行，不适用于 url 换行

>\<wbr>\</wbr>：表示有机会才换行

* 原理：创建了一个 Unicode 编码为 `U+200B` 的 0 宽换行空格

```css
wbr:after{
  content:"\00200B";
}
```

## 总结

* 动态内容：使用 `word-break: break-all` 以及 `overflow-wrap:break-all` 来进行换行
* 静态内容：排版英文单词使用 `&shy`；软连字符优化排版；如果使非英文单词，使用 \<wbr> 标签优化排版

1. 中文都是换行点的情况（中文默认都是换行点），`word-break: keep-all` 中文不再换行
2. 避首避尾标点不是换行点，`line-break:anywhere` 首尾标点是换行点
3. 连续破折号不是换行点，`overflow-wrap:break-word`
4. 空格是换行点，`white-space:nowrap` 空格不再换行。由于中文之后的换行点也是插入 `\n`，所以也可以改变中文不再换行
5. 英文单词不是换行点 `word-break:break-all`
6. 部分引文标点不是换行点，`overflow-wrap:anywhere`：使部分英文标点成为换行点（如 `'`）

参考：<https://juejin.cn/post/7111880813230161933>

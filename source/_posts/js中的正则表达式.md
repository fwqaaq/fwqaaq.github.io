---
title: js中的正则表达式
date: 2021-11-18 16:09:23
author: Jack-zhang
categories: config
tags:
   - JS
   - TS
   - config
summary: 正则表达式的运用
---

## [正则表达式](#正则表达式)

> js正则语法

* 语法:

```js
new RegExp(pattern,flags)
```

* 语法糖:`/pattern/flags`

> 关于flags参数:

| 选项 | 参数                                                                                |
| ---- | ----------------------------------------------------------------------------------- |
| g    | 全局匹配.找到所有匹配,而不是再第一个匹配结束                                        |
| i    | 忽略字母大小写                                                                      |
| m    | 多行,将(^和$)视为多行工作,不只是匹配整个输入字符串最开始和结束                      |
| s    | dotAll模式,匹配任何字符串,例如`\n`                                                  |
| u    | uniCode,将模式视为Unicode序列点的序列                                               |
| y    | 粘性匹配.从上次匹配成功的下个位置开始后续匹配.若下个相符内容不紧接在后,则不继续匹配 |

> 元字符的表达方式

| 元字符 | 描述                                            |
| ------ | ----------------------------------------------- |
| .      | 句号匹配任意单个字符除了换行符                  |
| []     | 匹配方括号内的任意字符                          |
| [^]    | 匹配除了方括号里的任意字符                      |
| \*     | 匹配>=0个重复的再*号之前的字符                  |
| \+     | 匹配>0个重复的再+号之前的字符                   |
| ?      | 标记?之间的字符为可选                           |
| (xyz)  | 匹配与xyz完全相等的字符                         |
| \|     | 或,匹配符号前或后的任意字符                     |
| \      | 转义字符,用于匹配保留一些字符                   |
| ^      | 从开始行开始匹配                                |
| $      | 从末端开始匹配                                  |
| {n}    | 指定出现的次数,`/8{n}5/g`,指定8出现的次数       |
| {n,}   | 指定至少出现的次数,`/8{n,}5/g`,指定8至少出现n次 |
| {n,m}  | 指定至少出现n次,至多出现m次                     |
| \w     | 任意的本义字符,[0-9a-zA-Z_]的简写形式           |
| \W     | 任意的非本义字符,除了[0-9a-zA-Z_]的字符         |
| \d     | 等价于[0-9]                                     |
| \D     | 等价于[^0-9]                                    |
| \s     | 任意空白                                        |
| \S     | 任意非空白                                      |
| \n     | 换行                                            |
| \t     | 制表                                            |
| (...)  | 代表一个捕获组,捕获括号中的匹配项               |

## [常用正则表示](#常用正则表示)

> [ ]表示区间

| 选项   | 描述                                |
| ------ | ----------------------------------- |
| [abc]  | 单个a或b或c                         |
| [^abc] | 非a或b或c                           |
| [a-Z]  | 相当于[a-zA-Z],匹配任意的大小写字母 |

> 关于文件中的正则匹配

| 选项            | 描述                   |
| --------------- | ---------------------- |
| `.(css\|less)$` | 以css或less结尾的文件  |
| `*.ts`          | 所有以ts结尾的文件     |
| `**/index.html` | 所有文件下的index.html |

* 一个\*代表文件,两个\*\*代表文件夹

## 使用正则匹配位置

> `^ $ \b \B (?=p) (?!p)` 六个锚字符

* 把位置理解空字符,是对位置非常有效的理解方式

* 例如hello字符等价于:

```js
"hello" == "" + "h" + "" + "e" + "" + "l" + "" + "l" + "o" + ""
"hello" == "" + "" + "hello"
const result = /^^hello?$/.test("hello");
console.log(result)
//true
```

### ^和$

* ^匹配开头
* $匹配结尾

```js
const result="hello".replace(/^|$/g, '#')
console.log(result)
//"#hello#"
```

### \b和\B

\b是单词边界,具体就是\w和\W之间的位置,也包括\w和^之间的位置,也包括\w和$之间的位置

```js
const result = "[JS] Lesson_01.mp4".replace(/\b/g, '#')
console.log(result)
//"[#JS#] #Lesson_01#.#mp4#"
```

### (?=p)和(?!p)

> `?=p`p前面的位置,`?<=p`:p后面的位置

```js
const result = "petter".replace(/(?=p)/g, '#')
console.log(result)//#petter
const result = "petter".replace(/(?<=p)/g, '#')
console.log(result)//p#etter
```

> `?!p`:除了p前面的位置,匹配其它所有位置.`?!<p`:除了p后面的位置,匹配其它所有位置

```js
const result = "petter".replace(/(?<!p)/g, '#')
console.log(result)//#pe#t#t#e#r#
const result = "petter".replace(/(?!p)/g, '#')
console.log(result)//p#e#t#t#e#r#
```

## 正则中()的作用

1. 分组:匹配连续出现的`ab`时`/(ab)+/`
2. 分支:多选分支结构`(p1|p2)`

>引用分组:使用相应API来引用分组

1. 关于正则匹配的构造函数的全局属性:`$1,$2...$99`分别代表分组匹配到的参数

```js
const regex = /(\d{4})-(\d{2})-(\d{2})/;
const string = "2021-12-12"
const result1 = string.replace(regex, function() {
 return RegExp.$2 + "/" + RegExp.$3 + "/" + RegExp.$1;
})
console.log(result)//"12/12/2021"
//等价
const result2 = string.replace(regex, function(match, year, month, day) {
  return month + "/" + day + "/" + year;
})
console.log(result2)//"12/12/2021"
```

>反向引用:在正则本身里引用分组,但只能引用之前出现的分组

```js
const regex = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
const stringArr = 
[
  "2017-06-12", 
  "2017/06/12", 
  "2017.06.12", 
  "2017/06.12"
]
const result = stringArr.map((value) => {
  return regex.test(value)
})
console.log(result)
```

1. 例如`\1,\2...\99`,分别代表1-99的分组
2. <span style="color:red">反向引用保证前后的分割符前后一致</span>
3. 引用不存在的分组,正则不会报错,匹配到反向引用的字符本身,例如`\2`表示对2进行了转义
4. 括号嵌套:以<span style="color:red">左括号</span>为准

```js
const regex = /((\d)(\d(\d)))/
const string = "1231231233"
console.log( regex.test(string) ) // true
console.log( RegExp.$1 ) // 123
console.log( RegExp.$2 ) // 1
console.log( RegExp.$3 ) // 23
console.log( RegExp.$4 ) // 3
```

1. `$1`匹配的是`((\d)(\d(\d)))`
2. `$2`匹配的是`(\d)`
3. `$3`匹配的是`(\d(\d))`
4. `$4`匹配的是`(\d)`

> 非捕获分组`(?:)`:只想要括号最原始的功能,但不会引用它,即不在API里引用,也不在正则里反向引用

```js
const regex = /(?:ab)+/g
const string = "ababa abbb ababab"
console.log( string.match(regex) )
//["abab", "ab", "ababab"]
```

## 回溯法

1. 没有回溯的匹配:
   * 例如:`/ab{1,3}c/`,匹配字符串`abbbc`
2. 有回溯的匹配:
   * 例如:`/ab{1,3}c/`,匹配字符串`abbc`
   * 当匹配到第三个b时,发现接下来的字符串时"c",就会回到之前的状态
3. 常见回溯的形式:贪婪量词,惰性量词,分支结构

> 本质:<span style="color:red">深度优先搜索算法</span>.倒退到之前的某一部着一过程,称之为`回溯`

### 贪婪量词

> 例如`b{1,3}`:多个贪婪量词挨着,会按顺序优先匹配

```js
const string = "12345"
const regex = /(\d{1,3})(\d{1,3})/
console.log(string.match(regex))
//["12345","123","45"]
```

### 惰性量词

>惰性量词就是在贪婪量词后面加个问号:<span style="color:red">尽可能少的匹配</span>

```js
const string = "12345"
const regex = /(\d{1,3}?)(\d{1,3})/
console.log(string.match(regex))
// ["12345","1","345"]
```

### 分支结构

> 分支结构也是惰性的:`/can|candy/`,去匹配字符串"candy",得到的结果是`"can"`.分支会一个一个尝试,如果前面的满足了,后面就不会再试验

## 正则相关的api

### test

>检测一个字符串是否匹配某个模式

* 返回值
  1. 成功:true
  2. 失败:false

```js
const string = "abc12345"
const regex = /\w+\d+/g
console.log(regex.test(string))
//true
```

### exec

>该方法再指定一个字符串中执行一个搜索匹配.匹配返回一个数组或者null
>
>设置`g`或者`y`,`exec()`可对当字符串的多次匹配结果**进行逐条遍历**,(通过更新`lastIndex`).然而`match`只会匹配到返回的结果
>
>只会返回第一个成功的匹配

* 返回值:
  1. 成功:返回一个数组(包括index何input),并更新`lastIndex`属性
     * `index`:匹配到的字符位于原始字符串的基于0的索引值
     * `input`:原始字符串
     * `lastIndex`:下一次匹配开始的位置
  2. 失败:返回null

```js
const regex = /(\d{4})\D(\d{2})\D(\d{2}).?/g
const string = "2017-06-26,2018-09-12,2018-09-12"
console.log(regex.exec(string))
//['2017-06-26,', '2017', '06', '26', index: 0, input: '2017-06-26,2018-09-12,2018-09-12', groups: undefined]
console.log(regex.exec(string))
//['2018-09-12,', '2018', '09', '12', index: 11, input: '2017-06-26,2018-09-12,2018-09-12', groups: undefined]
```

### match

>在字符串内检索指定的值,或找到一个或多个正则表达式的匹配.

* 返回值:
  1. 存放匹配结果的数组.该数组内容很大程度依赖于`g`
  2. 如果没找到匹配结果返回null

```js
const regex = /(\d{4})\D(\d{2})\D(\d{2})/g
const string = "2017-06-262018-09-12"
console.log(string.match(regex))
//['2017-06-26', '2018-09-12']
```

### search

>用于检索字符串中指定的子字符串,或检索与正则表达式相匹配的子字符串

* 返回值
  1. 成功:返回到匹配到子串的起始位置
  2. 失败:返回-1

> 注意:不执行全局匹配,他将忽略`g`

```js
const string = "abc12345"
const regex = /\d/
console.log(string.search(regex))
//3
```

### split

>方法使用指定的分隔符字符串将一个String对象分割成子字符串数组,以一个指定的分割字串来决定每个拆分的位置

* 参数:
  1. `separator`:指定表示每个拆分应发生的点的字符串.separator 可以是一个字符串或正则表达式
  2. `limit`:限定返回的分割片段数量

```js
const regex = /\,/
const string = "2017-06-26,2018-09-12,2018-09-12"
console.log(string.split(regex, 2))
//['2017-06-26', '2018-09-12']
```

### replace和replaceAll

>参数:

1. regexp|substr:正则表达式或者匹配的字符
2. newSubstr|function:要替换的字符或者函数

| function参数 | 解释                                     |
| ------------ | ---------------------------------------- |
| match        | 匹配的子串                               |
| p1, p2, ...  | 括号中的捕获组找到的第n个字符串          |
| offset       | 被检查的整个字符串中匹配子字符串的偏移量 |
| string       | 正在检查的整个字符串                     |

* 不同:
  1. replace只会匹配第一个匹配到的字符,replaceAll会匹配所有字符
  2. 如果是正则,replaceAll必须加上全局修饰符`g`

```js
console.log("xxx".replace("x", "."))//.xx
console.log("xxx".replaceAll("x", "."))//...
```

```js
"123xxx8add444".replaceAll(/(\d+).+([a-z])/g, 
  (match, p1, p2, offset, str) => {
    console.log(match)
    console.log(p1)
    console.log(p2)
    console.log(offset)
    console.log(str)
  })
//123xxx8add
//123
//d
//0
//123xxx8add444  
```

### eval

>可以将任意的字符串类型正则转换成正则对象

## 参考

><https://juejin.cn/post/6844903487155732494#heading-24>

---
title: JS的数组
date: 2021-9-4 10:04:30
author: Jack-zhang
categories: JS
tags:
   - JS
summary: 本文只介绍数组上的原型方法
---

## 数组原型上的方法

### join():  <span style="color:red">原数组不变</span>

> join(separator): 将数组的元素组起一个字符串.以separator为分隔符.省略的话则用默认用逗号为分隔符.<span style="color:red">该方法只接收一个参数：即分隔符.</span>

~~~js
let arr=[1,2,3]
console.log(arr.join(-))//1-2-3
console.log(arr.join())//1,2,3
console.log(arr)//[1,2,3]
~~~

> 通过join()方法可以实现重复字符串.只需传入字符串以及重复的次数.就能返回重复后的字符串.函数如下：

~~~js
function repeatString(str,n){
   return new Array(n+1).join(str)
}
console.log(repeatString("abc",3))//"abcabcabc"
~~~

### push()和pop(): <span style="color:red">改变原数组</span>

1. push(): 可以接收任意数量的参数.把它们逐个添加到数组末尾.<span style="color:red">并返回修改后数组的长度.</span>
2. pop()：数组末尾移除最后一项.减少数组的 length 值.然后返回移除的项.

~~~js
let arr=["a","b","c"]
let count=arr.push("d","e")

console.log(arr)//(5)["a","b","c","d","e"]
console.log(count)//5

let item=arr.pop()
console.log(arr)//(4)["a","b","c","d"]
console.log(item)//e
~~~

注意：pop（）里面没有参数.即时有参数.也是删除最后一项.

### shift() 和 unshift(): <span style="color:red">改变原数组</span>

1. shift()：删除原数组第一项.并返回删除元素的值；如果数组为空则返回undefined .
2. unshift:将参数添加到原数组开头.并返回数组的长度 .

> 这组方法和上面的push()和pop()方法正好对应.一个是操作数组的开头.一个是操作数组的结尾.

~~~js
let arr=["c","d","e"]]
let count=arr.unshift("a","b")

console.log(arr)//(5)["a","b","c","d","e"]
console.log(count)//5

let item=arr.shift()
console.log(arr)//(4)["b","c","d","e"]
console.log(item)//a
~~~

### sort(): <span style="color:red">改变原数组</span>

* sort()：按升序排列数组项——即最小的值位于最前面.最大的值排在最后面.

> 在排序时.sort()方法会调用每个数组项的 toString()转型方法.然后比较得到的字符串.以确定如何排序.即使数组中的每一项都是数值. sort()方法比较的也是字符串.因此会出现以下的这种情况：

~~~js
let arr=[13,24,51,3]
console.log(arr.sort())//[13,24,3,51]
console.log(arr)//[13,24,3,51](原数组改变)
~~~

>为了解决上述问题.sort()方法可以接收一个比较函数作为参数.以便我们指定哪个值位于哪个值的前面.

   1. 比较函数接收两个参数.如果第一个参数应该位于第二个之前则返回一个负数.
   2. 如果两个参数相等则返回 0.
   3. 如果第一个参数应该位于第二个之后则返回一个正数.以下就是一个简单的比较函数：

~~~js
function compare(value1,value2){
   return value1-value2
}

let arr=[13,54,3,10,87]
console.log(arr.sort(compare))//(5)[3,10,13,54,87]
~~~

### reverse()<span style="color:red">改变原数组</span>

* reverse()：反转数组项的顺序.

~~~js
let arr=[13,54,3,10,87]
console.log(arr.reverse())//(5) [87,10,3,54,13]
console.log(arr)//(5) [87,10,3,54,13]
~~~

### concat()<span style="color:red">不改变原数组</span>

> concat() ：将参数添加到原数组中.这个方法会先创建当前数组一个副本.然后将接收到的参数添加到这个副本的末尾.最后返回新构建的数组.在没有给 concat()方法传递参数的情况下.它只是复制当前数组并返回副本.

~~~js
let arr=[1,3,5,7]
console.log(arr.concat(9,[11,13]))//[1,3,5,7,9,11,13]
console.log(arr)//[1,3,5,7](原数组未被修改)
~~~

> 从上面测试结果可以发现：传入的不是数组.则直接把参数添加到数组后面.如果传入的是数组.则将数组中的各个项添加到数组中.但是如果传入的是一个二维数组呢？

~~~js
let arr=[1,3,5,7]
let arrCopy=arr.concat([9,[11,13]])
console.log(arrCopy)//[1,3,5,7,9,Array[2]]
console.log(arrCopy[5])//[11,13]
~~~

>上述代码中.arrCopy2数组的第五项是一个包含两项的数组.也就是说concat方法只能将传入数组中的每一项添加到数组中.如果传入数组中有些项是数组.那么也会把这一数组项当作一项添加到arrCopy中

### slice() <span style="color:red">不改变原数组</span>

* slice()：返回从原数组中指定开始下标到结束下标之间的项组成的新数组.
  
> slice()方法可以接受一或两个参数.<span style="color:red">即要返回项的起始和结束位置.</sapn>

1. 在只有一个参数的情况下. slice()方法返回从该参数指定位置开始到当前数组末尾的所有项.
2. 如果有两个参数.该方法返回起始和结束位置之间的项——但不包括结束位置的项.

~~~js
let arr=[1,3,5,7,9,11]
let arrCopy=arr.slice(1)
let arrCopy2=arr.slice(1,4)
let arrCopy3=arr.slice(1,-2)
let arrCopy4=arr.slice(-4,-1)
console.log(arr)//[1,3,5,7,9,11]
console.log(arrCopy)//[3,5,7,9,11]
console.log(arrCopy2)//[3,5,7]
console.log(arrCopy3)//[3,5,7]
console.log(arrCopy4)//[5,7,9]
~~~

1. arrCopy只设置了一个参数.也就是起始下标为1.所以返回的数组为下标1（包括下标1）开始到数组最后.
2. arrCopy2设置了两个参数.返回起始下标（包括1）开始到终止下标（不包括4）的子数组.
3. arrCopy3设置了两个参数.终止下标为负数.当出现负数时.将负数加上数组长度的值（6）来替换该位置的数.因此就是从1开始到4（不包括）的子数组.
4. arrCopy4中两个参数都是负数.所以都加上数组长度6转换成正数.因此相当于slice(2,5).

### splice()<span style="color:red">改变原数组</span>

> splice()：很强大的数组方法.它有很多种用法.可以实现删除、插入和替换.

1. 删除：可以删除任意数量的项.只需指定 2 个参数：要删除的第一项的位置和要删除的项数.例如. splice(0,2)会删除数组中的前两项.

2. 插入：可以向指定位置插入任意数量的项.只需提供 3 个参数：起始位置、 0（要删除的项数）和要插入的项.例如.splice(2,0,4,6)会从当前数组的位置 2 开始插入4和6.

3. 替换：可以向指定位置插入任意数量的项.且同时删除任意数量的项.只需指定 3 个参数：起始位置、要删除的项数和要插入的任意数量的项.插入的项数不必与删除的项数相等.例如.splice (2,1,4,6)会删除当前数组位置 2 的项.然后再从位置 2 开始插入4和6.

> splice()方法始终都会返回一个数组.该数组中包含从原始数组中删除的项.如果没有删除任何项.则返回一个空数组.

~~~js
let arr=[1,3,5,7,9,11]
let arrRemove=arr.splice(0,2)
console.log(arr)//[5,7,9,11]
console.log(arrRemove)//[1,3]

let arrRemove2=arr.splice(2,0,4,6)
console.log(arr)//[5,7,4,6,9,11]
console.log(arrRemove2)//[]

let arrRemove3=arr.splice(1,1,2,4)
console.log(arr)//[5,2,4,4,9,11]
console.log(arrRemove3)//[7]
~~~

### indexOf()和lastIndexOf()

1. indexOf()：接收两个参数：要查找的项和（可选的）表示查找起点位置的索引.其中. 从数组的开头（位置 0）开始向后查找.
2. lastIndexOf：接收两个参数：要查找的项和（可选的）表示查找起点位置的索引.其中. 从数组的末尾开始向前查找.

> 这两个方法都返回要查找的项在数组中的位置.或者在没找到的情况下返回-1.在比较第一个参数与数组中的每一项时.会使用全等操作符.

~~~js
let arr=[1,3,5,7,7,5,3,1]
console.log(arr.indexOf(5))//2
console.log(arr.lastIndexOf(5))//5
console.log(arr.indexOf(5,2))//2
console.log(arr.lastIndexOf(5,4))//2
console.log(arr.indexOf("5"))//-1
~~~

### includes()

>用于判断一个数组是否包含一个指定的值

| 参数            | 描述                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `searchElement` | 必须.需要查找的元素值.                                                                           |
| `fromIndex`     | 可选.从该索引处开始查找,如果为负值,则按升序从 `array.length + fromIndex` 的索引开始搜索.默认为 0 |

* 注意:`fromIndex`如果大于大于或等于数组长度,则改数组不会被搜索

~~~js
let arr = ['a', 'b', 'c'];
arr.includes('c', 3);   //false
arr.includes('c');   //true
~~~

### fill()(改变原数组)

>将数组用其他元素填充或者替换

1. `value`:填充的值
2. `start`?:开始填充的位置
3. `end`?:结束填充的位置

~~~js
let arr=[1,2,3,4,5]
//如果end越界,会按照最后一个值计算
//如果start为负数:start+数组的索引>0,则会按照此时的索引位置计算
//如果start+数组的索引<=0,则会按照=0计算
console.log(arr.fill(0,2,5))//[1,2,0,0,0]
~~~

### at()

>接收一个整数值,并返回该索引的项目,允许正数以及负数

* 如果是负数,则从数组尾部开始

~~~js
let arr =[1,2,3]
arr.at(0) //1
arr.at(-1) //3
~~~

### 数组的迭代方法

> ECMAScript为数组定义了五个迭代方法.每个方法都接收两个参数：要在每一项上面运行的函数和运行该函数的作用域——影响this的值.传入这些方法的函数会接收三个参数（数组项的值.索引.数组本身）

#### forEach()(<span style="color:red">不改变原数组</span>)

>对数组的每一项运行给定函数.该方法没有返回值

~~~js
let arr=[1,2,3,4,5]
arr.forEach(function(item,index,arry)){
   console.log(index+"-"+item+"-"+arry)
   /* 
   0-1-1,2,3,4,5
   1-2-1,2,3,4,5
   2-3-1,2,3,4,5
   3-4-1,2,3,4,5
   4-5-1,2,3,4,5
    */
}

console.log(arr);//(5)[1,2,3,4,5]
~~~

#### some()(<span style="color:red">不改变原数组</span>)

>对数组中的每一项运行给定函数.如果该函数对任一项返回true.则返回true

~~~js
let arr=[1,2,3,4,5]
let b=arr.some(function(value){
   return value>3
})
console.log(b)//true

let c=arr.some(function(value,index,array){
   return value>2
})
console.log(c)//true
console.log(arr);//(5)[1,2,3,4,5]
~~~

#### every()(<span style="color:red">不改变原数组</span>)

>对数组中的每一项运行都给定函数.如果该函数对每一项都返回true.则返回true

~~~js
let arr=[1,2,3,4,5]
let b=arr.every(function(value){
   return value>3
})
console.log(b)//false
console.log(arr);//(5)[1,2,3,4,5]
~~~

#### filter()(<span style="color:red">不改变原数组</span>)

>对数组的每一项运行给定函数.返回该函数会返回true的项组成的数组

~~~js
let arr=[1,2,3,4,5]
let a=arr.filter(function(value){
   return value>3
})

console.log(a)//[4,5]
console.log(arr);//(5)[1,2,3,4,5]
~~~

* <span style="color:red">注意:</span>对新数组变化不会影响原数组的改变

#### map()(<span style="color:red">不改变原数组</span>)

>对数组的每一项运行给定函数.返回每次函数调用结果所组成的数组

~~~js
let arr=[1,2,3,4,5]
let a=arr.filter(function(value){
   return value*3
})

console.log(a)//[3,6,9,12,15]
console.log(arr);//(5)[1,2,3,4,5]
~~~

#### find()(<span style="color:red">不改变原数组</span>)

>返回符合测试条件的第一个数组元素的值.如果没有符合条件的则返回undefined

~~~js
const arr = [1,2,3,4,5,6]

let value = arr.find((value)=>{
   return value > 4
})//5
~~~

* 补充
  * `findIndex()`:与find()方法相同,只是返回的是符合条件的索引

### 迭代方法

>ES5新增了两个归并数组的方法：reduce（）和 reduceRight().这两个方法都会迭代数组所有的项.然后构建一个最终的值返回.

* 使用:这两个方法都接收两个参数：一个在每一项上面调用的函数和（可选）作为归并基础的初始值.

> * 给reduce和reduceRight这两个方法的函数都接收四个参数值：前一个值.当前值.索引.数组对象.
> * 这个函数返回的任何值都会作为第一个参数自动传给下一项.第一次迭代发生在数组的第二项上.因此第一个参数是数组的第一项.第二个参数是数组的第二项.

~~~js
let arr=[1,2,3,4,5]
let sum=arr.reduce(function(pre,cur,index,array){
    return pre+cur
},0)//0是初始值
console.log(sum)//15
~~~

第0次回调的时候.pre为0,cur为1,第一次执行回调函数的时候.pre为1.cur为2.第二次.pre为3（1加2的结果）.cur为3（数组的第三项）.依次类推.直到将数组的每一项都访问一遍.最后返回结果.

* <span style="color:red">注意:</span>reduceRight（）与reduce（）使用一样.只不过是从后往前遍历.

## 数组扁平化(flat)(不改变原数组)

* `flat()`:默认参数为1
  * 可选参数一:整数(拉平几层嵌套)
  * 可选参数二:`Infinity`(任意拉平几层嵌套)

~~~js
console.log([1,2,[3,4]].flat())
//[1,2,3,4]
~~~

## Object对象语法(不改变原数组)

### Object.keys

>返回一个由一个给定对象的自身可枚举属性(`key`)组成的数组，数组中属性名的排列顺序和使用 `for...in` 循环遍历该对象时返回的顺序一致

* 注意:如果没有key值(数组)则返回索引

~~~js
const obj={a:"cd",b:false,c:3}
console.log(Object.keys(obj))
//["a","b","c"]
~~~

### Object.value

> `Object.values()` 方法会返回一个由一个给定对象的自身可枚举属性(`value`)组成的数组，数组中属性值的排列顺序和使用`for...of`循环遍历该对象时返回的顺序一致

~~~js
const obj={a:"cd",b:false,c:3}
console.log(Object.values(obj))
//["cd",false,3]
~~~

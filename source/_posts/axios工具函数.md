---
title: axios工具函数
date: 2022-01-05 17:47:21
categories: JS
tags: 
   - JS
   - Axios
summary: axios的工具函数
---

## unknown

1. `.eslintrc.js`:ESlint需要一个配置文件来决定对哪些规则进行检查，配置文件的名称一般是 `.eslintrc.js` 或 `.eslintrc.json`
2. `tslint.json`:检查 typescript 代码的可读性、可维护性和功能上的错误
   * 核心:<https://palantir.github.io/tslint/rules/>
3. `bower.json`:建议使用npm,yarn,pnpm管理
4. `CHANGELOG.md`:是一个由人工编辑，以时间为倒序的列表。 这个列表记录所有版本的重大变动。
   * [如何生成CHANGELOG](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
5. `CODE_OF\_CONDUCT.md`:axios的社区行为规范准则
   * 翻译:<https://www.contributor-covenant.org/version/2/1/code_of_conduct/>
6. `CONTRIBUTING.md`:为潜在的项目贡献者提供了一个简短的指南，说明他们如何为您的项目或研究小组提供帮助
   * 参考:<https://mozillascience.github.io/working-open-workshop/contributing/>
7. `SECURITY.md`:提供有关报告项目中安全漏洞的说明
   * 参考:<https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository>
8. `Gruntfile.js`:在grunt里面，我们可以使用自动编译LESS、压缩CSS、JS这样的工具。Grunt是一个平台，没有插件，Grunt什么事也不能做。它是提供了一个标准，任何插件都要去遵守的一个机制和规则
   * Gulp也是相同的的功能,只不过是语法不通(上手简单)
   * 参考:<https://www.gruntjs.net/getting-started>
9. `karma.conf.js`:基于Node.js的JS测试执行过程管理工具.可用于测试所有主流Web浏览器，也可集成到`CI`工具，也可和其他代码编辑器一起使用。这个测试工具的一个强大特性就是，它可以监控(`Watch`)文件的变化，然后自行执行，通过`console.log`显示测试结果
    * 参考:<http://karma-runner.github.io/6.3/config/configuration-file.html>

## axios的工具函数

>很多和vue中的工具函数差不多就直接跳过了

### isBuffer

```js
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val)
}
```

* `typeof val.constructor.isBuffer === 'function'`:判断构造函数中有没有`isBuffer`方法
* `val.constructor.isBuffer(val)`:用node提供的`isBuffer()`
* 原型对象的`constructor`会指向构造函数自身

```js
const a = Buffer.alloc(5)
console.log(isBuffer(a))//true
console.log(isBuffer(Buffer))//false
```

### isArrayBuffer&&isFormData\.\.\.

>判断是不是一个实例对象

```js
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

...
```

### isObject&&isPlainObject

```js
function isObject(val) {
  return val !== null && typeof val === 'object';
}

function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

```

1. `isObject(val)`判断时,如果`val=[]`也会返回true
2. `isPlainObject(val)`判断对象更纯碎
   * 当`val=Object.prototype`,`prototype === null`为true
   * 其它情况下只会取得`Object.prototype`

### isArrayBufferView

```js
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}
```

* val如果是`ArrayBuffer`,定义和未定义的两种可能  

>`ArrayBufferView`:<https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBufferView>

### trim

>去除首位空格,如果是false,则用正则

```js
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}
```

### stripBOM

```js
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}
```

>删除开头的标识字节序BOM,本身是一个Unicode字符

### forEach&&merge

```js
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (Array.isArray(obj)) {
    // for循环执行回调函数
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // for循环执行回调函数
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    //如果键是相同的,把之前的val替换为之后的val
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      //递归执行,如果是对象还是对象
      result[key] = merge({}, val);
    } else if (Array.isArray(val)) {
      //如果是数组还是数组
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

console.log(merge(["name", "zhangsan"], { age: 12 }))
```

1. merge函数会将对象或者数组或者任意参数统统合并到一个对象中
   * 如果是对象,key就是键
   * 如果是数组,key就是索引
2. foreach重写估计是对象上没有这个方法,重写了一个更统一的
   * `fn.call(null, obj[key], key, obj)`
   * 回调函数不需要绑定this,并传入参数obj[key],key,obj

## 总结与感悟

1. 看了vue的工具函数这个并不是很难了,理解也更容易了
2. 调试方面更加熟练,不懂的文件也不停的探索
3. 随着慢慢的深入不会的东西暴露的越来越多

---
title: Vue3 的组件化
date: 2021-09-25 10:54:51
categories: Vue
tags:
   - Vue
   - JavaScript
   - TypeScript
summary: 关于 vue3 组件化的使用，兼容的 vue2
---

## 理解插槽

- 使组件具备更强的通用性，组件中的内容不再限制为固定的 div、span 等等这些元素
- 使用者可以决定某一块区域到底存放什么内容和元素
- 定义插槽 slot
  - 插槽的使用过程其实是抽取共性、预留不同
  - 我们会将共同的元素、内容依然在组件内进行封装
  - 同时会将不同的元素使用 slot 作为占位，让外部决定到底显示什么样的元素
- 使用插槽
  - Vue 中将 \<slot> 元素作为承载分发内容的出口
  - 在封装组件中，使用特殊的元素 \<slot> 就可以为封装组件开启一个插槽
  - 该插槽插入什么内容取决于父组件如何使用

### 默认插槽

> 当插槽内部不具有 name 属性时，vue 会自动给一个隐式名称`name:default`
> > 且子组件不管有多少个插槽，每个插槽都会显示一样的内容

```html
 父组件中:
<Category>
  <div>html 结构</div>
</Category>
子组件中:
<template>
   <div>
    <!--定义插槽-->
      <slot>插槽默认值</slot>
   </div>
</template>
```

### 具名插槽

- 具名插槽顾名思义就是给插槽起一个名字，\<slot> 元素有一个特殊的
  `attribute：name`
- 一个不带 name 的 slot，会带有隐含的名字 default

```html
//父组件中
<Footer>
  <template v-slot:footer>
    <div>
      你好
    </div>
  </template>
</Footer>
//子组件中
<slot name="footer">插槽默认值</slot>
```

- 动态插槽名

```html
<template v-slot:[name]>
  <div>
    你好
  </div>
</template>
<script>
  //...
  data(){
    return {
      name:"footer"
    }
  }
</script>
```

- 具名插槽的缩写
  - 把参数之前的所有内容`(v-slot:)`替换为字符 `#`
    - 例如 `#footer`或者`#[name]`

### 作用域插槽

- vue 渲染作用域：
  - 父级模板里的所有内容都是在父级作用域中编译的
  - 子模板里的所有内容都是在子作用域中编译的

- 希望插槽可以访问到子组件中的内容
  - 当一个组件被用来渲染一个数组元素时，我们使用插槽，并且希望插槽中没有显示每项的内容

```html
<!-- 子组件中：有一个 names 的数组 -->
  <template v-for="(item,index) in names" :key="item">
     <slot name="footer" :item="item" :index="index"></slot>
  </template>

<!-- 具名插槽与作用域插槽 -->
<Footer>
  <template #footer="slotProps">
    <button>{{slotProps.item}}-{{slotProps.index}}</button>
  </template>
</Footer>
```

- 独占默认插槽
  - 当默认插槽和作用域插槽简写，如果还有其它具名插槽那么简写方式不可以
  - 子组件中的 \<slot> 标签不能有 name 属性

```html
<Foot v-slot="slotProps">
  <button>{{slotProps.item}}-{{slotProps.index}}</button>
</Footer>
```

## 动态组件

> 动态组件是使用 `component` 组件，通过一个特殊的`attribute is`
来实现，is 属性是一个组件

```html
<component 
  :is="currentTab" 
  :age="18" 
  name="张三" 
  @pageClick="pageClick">
</component>
```

- 注意点：
  1. currentTab 可以是通过 component 函数注册的组件
  2. currentTab 可以是在一个组件对象的 components 对象中注册的组件
  3. 动态组件的传值和其它组件的传值 是一样的

## 缓存组件 keep-alive

> 默认情况下，我们在切换组件后，组件会被销毁掉，再次回来时会重新创建组件
> > 然而某些情况我们希望继续保持组件的状态，而不是销毁掉，这个时候我们就可以使用一个内置组件：`keep-alive`

```html
<keep-alive include="home,about">
  <component 
    :is="currentTab" 
    :age="18" 
    name="张三" 
    @pageClick="pageClick">
  </component>
</keep-alive>
```

### keep-alive 的一些属性

- `include`:可以使用`string`|`RegExp`|`Array`.只有名称匹配的组件会被缓存
  - string:`include:"a,b"`
  - RegExp:`:include:"/a|b/"`
  - Array:`:include:"['a','b']"`

- `exclude` : `string` | `RegExp` | `Array`.任何名称匹配的组件都不会被缓存

- `max`(不常用) : `number` |
  `string`.最多可以缓存多少组件实例，一旦达到这个数字，那么缓存组件中最近没有被访问的实例会被销毁

### 缓存组件的生命周期

> <span style="color:red">对于缓存的组件来说，再次进入时，我们是不会执行 created 或者 mounted 等生命周期函数的</span>

- **activated**:在 vue 对象存活的情况下，进入当前存在`activated()`函数的页面时，一切到改页面就触发。
- **deactivated**:当离开组件 A，切到组件 B 之前，需要对组件 A 做某些处理，比如清除定时器，这时就需要使用**deactivated**

## 异步组件的实现 (多在路由中用到)

> 默认情况下，在构建整个组件树的过程中，因为组件和组件之间是通过模块化直接依赖的，那么 webpack 在打包时就会将组件模块打包到一起（比如一个 app.js 文件中）

### webpack 的代码分包

```js
import("./utils/math").then(
  (res) => {
    console.log(res.sum(20, 30));
  },
);
```

### vue 中实现异步组件

- 如果我们的项目过大了，对于某些组件我们希望通过异步的方式来进行加载 (即进行分包处理),利用 vue 中的`defineAsyncComponent`函数
  - 写成工厂函数，该工厂函数需要返回一个 Promise 对象

  ```js
  import { defineAsyncComponent } from "vue";
  const AsyncMain = defineAsyncComponent(() => import("./components/Main.vue"));

  export default ({
    components: {
      AsyncMain,
    },
  });
  ```

  - 接受一个对象类型，对异步函数进行配置

  ```js
  const AsyncMain=defineAsyncComponent({
  loader:()=>import("./components/Main.vue"),
  loadingComponent: Loading,

  errorComponent:Failing
  //在显示 loadingComponents 组件之前，等待多长时间
  delay:2000,

  onError:function(err,retry,fail,attempts){}
  })
  ```

| 属性               | 描述                                               |
| ------------------ | -------------------------------------------------- |
| `loadingComponent` | 传入一个组件，如果没有加载出异步组件，占位组件会占位 |
| `errorComponent`   | 传入一个组件，组件加载失败时显示的组件              |
| `delay`            | 在显示 loadingComponents 组件之前，等待多长时间       |
| `onError`          | 传入一个带有四个参数的函数，                       |

- `onError`参数
  - `err`:错误信息
  - `retry`:函数，调用 retry 尝试重新加载
  - `fail`:函数，指加载程序结束退出
  - `attempts`:记录尝试的次数

### 异步组件与 Suspense(<span style="color:red">还在实验中，API 随时可能修改</span>)

- `Suspense`是一个内置的全局组件，该组件有两个插槽：
  - `default`:如果 default 可以显示，那么显示 default 的内容
  - `fallback`:如果 default 无法显示，那么会显示 fallback 插槽的内容

```html
<template #default>
  <AsyncHeader></AsyncHeader>
</template>
<template #fallback>
  <Loading></Loading>
</template>
```

## 引用元素和组件

- `$refs`:持有注册过`ref attribute` 的所有 DOM 元素或者组件实例
- `$parent` 和 `$root`,获取父元素实例和根元素实例

## 组件的 v-model

> 在 input 中可以使用 v-model 来完成双向绑定
>
> 在封装一个组件，其他地方在使用这个组件时，也可以使用 v-model 来同时完成这两个功能

- 在\<input>中绑定`v-model`默认帮我们完成的两件事：
  - <span style="color:red">v-bind:value 的数据绑定和@input 的事件监听</span>

```html
<!-- 父组件 -->
<MainInput v-model="message"></MainInput>

<!-- 组件直接绑定 v-model，相当于写成以下模式 -->
<MainInput :modelValue="message" 
           @update:modelValue="message=$event">
</MainInput>
```

```html
<!-- 子组件 -->
<template>
  <div>
     <input v-model="value">
     <h2>Main 的 message:{{modelValue}}</h2>
  </div>
</template>
<script>
export default {
  props:{
    modelValue:String,
  },
  emits:["update:modelValue"],
  computed:{
    value:{
      get(){
        return this.modelValue
      },
      set(value){
        this.$emit("update:modelValue",value)
      }
    }
  },
}
</script>
```

- 注意:<span style="color:red">v-model 不能直接绑定到 props,props 中的属性只读不要改</span>

- 绑定多个参数，可以给`v-model`传参
  1. 默认情况下:v-model 其实是绑定了 `modelValue` 属性和
     `@update:modelValue`的事件
  2. `v-model:tittle`绑定了`title`属性，监听了 `@update:title`的事件

```html
<!-- 父组件 -->
<MainInput v-model:demo="message" v-model:tittle="tittle"></MainInput>
```

```html
<!-- 子组件 -->
<template>
  <div>
     <input v-model="tittleValue">
     <h2>Main 的 message:{{tittleValue}}</h2>
      <input v-model="demoValue">
     <h2>Main 的 message:{{demoValue}}</h2>
  </div>
</template>
<script>
export default {
  props:{
    demo:String,
    tittle:String
  },
  emits:["update:tittle","update:demo"],
  computed:{
    tittleValue:{
      get(){
        return this.tittle
      },
      set(value){
        this.$emit("update:tittle",value)
      }
    },
    demoValue:{
      get(){
        return this.demo
      },
      set(value){
        this.$emit("update:demo",value)
      }
    }
  },
}
</script>
```

---
title: vuex4mapState和mapGetters
date: 2021-09-30 01:03:11
author: Jack-zhang
categories: vue
tags:
   - vue3
   - JS
   - vuex
summary:  在setup函数中并不真的要使用mapState和mapGetters
---

## 封装mapState和mapGetters

>在CompusitionsAPI要将`mapState`和`mapGetters`封装

- setup函数中没有this,任何的this都是没有意义的
- 解构出来的`mapState`和`mapGetters`是一个函数,而不是一个对象

> 在OptionsAPI不需要封装`mapState`和`mapGetters`

- 解构出来的`mapState`和`mapGetters`的函数,`computed属性`会自动拿到返回值

> 封装了两个文件

- `proStateStore.js`:对`mapState`和`mapGetters`的封装

```js
import {mapState, mapGetters, createNamespacedHelpers } from 'vuex'
import  {proMapper}  from 'proMapper.js'

export const proGetters=function(spaceName,mapArry){
  let mapFn = mapGetters
  if (typeof spaceName === 'string' && spaceName.length > 0) {
    mapFn = createNamespacedHelpers(spaceName).mapGetters
  } else {
    mapArry = spaceName
  }
  return proMapper(mapArry, mapFn)
}

export const proState=function(spaceName, mapArry) {
  let mapFn = mapState
  if (typeof spaceName === 'string' && spaceName.length > 0) {
    mapFn = createNamespacedHelpers(spaceName).mapState
  } else {
    mapArry = spaceName
  }
  return proMapper(mapArry, mapFn)
}
```

- `proMapper.js`:对`mapState`和`mapGetters`共同遍历功能的封装

```js
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
export const proMapper= function(mapArry,mapFn){
  const store=useStore()
  const stateStoreFn=mapFn(mapArry)
  let stateStore={}
  Object.keys(stateStoreFn).forEach(item=>{
    const fn=stateStoreFn[item].bind({$store:store})
    stateStore[item]=computed(fn)
  })
  return stateStore
}
```

> 封装对于大型项目的解耦合是有必要的,如果在组件中并没有太多属性,冗长的封装加大了阅读性的难度

## 使用解构赋值

> 使用对象的解构赋值,可以拿到所有属性,更容易阅读🐕🐕🐕

```html
<script>
import { useStore } from "vuex"
export default{
  setup(){
    const store=useStore()
    return{
      ...store.getters,
      ...store.state
    }
  }
}
</script>
```

### 解构出的值并不是响应式

- 使用reactive包裹`let counter=reactive({...store.state})`
  - 同时可以使用`toRefs`去解包
- 使用ref包裹单个值

```js
let {counter} =  {...store.state}
let counter=ref(counter)
```

---
title: vuex@4.0.0
date: 2021-09-29 21:43:14
author: Jack-zhang
categories: vue
tags:
   - vue3
   - JS
   - vuex
summary:  vue3的状态管理器
---

## vuex

![vuex](https://www.zyjcould.ltd/img/markdownvuex.png)

> 状态之间相互会存在依赖,一个状态的变化会引起另一个状态的变化,View页面也有可能会引起状态的变化,所以管理不断变化的state本身是非常困难的

- 使用Vuex状态管理
  - 在这种模式下,我们的组件树构成了一个巨大的 试图`View`
  - 不管在树的哪个位置,任何组件都能获取状态或者触发行为
  - 通过定义和隔离状态管理中的各个概念,并通过强制性的规则来维护视图和状态间的独立性,代码会变得更加结构化和易于维护,跟踪

### store(仓库)

> store本质上是一个容器,它包含着你的应用中大部分的状态(state)

- vuex和全局对象的区别
  - Vuex的状态是响应式的
    - 当vue组件从store读取状态,若store中的状态发生改变,其相应的状态也会改变
  - 不能直接改变store中的状态
    - 该变store中的状态的唯一途径就是提交**(commit)mutation**

- 使用
  - 创建`Store`对象
  - 在app中使用插件安装

### 单一状态树

>将状态信息同时保存到多个Store对象中的,那么之后的管理和维护等等都会变得特别困难

- 所以Vuex也使用了单一状态树来管理应用层级的全部状态
- 单一状态树能够让我们最直接的方式找到某个状态的片段,而且在之后的维护和调试过程中,也可以非常方便的管理和维护

## 五大核心

### state

```js
state() {
  return {
    books: [
      { name: "深入Vuejs", price: 200, count: 3 },
      { name: "深入Webpack", price: 240, count: 5 },
      { name: "深入React", price: 130, count: 1 },
      { name: "深入Node", price: 220, count: 2 },
    ]
  }
```

- 获取state状态
  - 在模板中使用`$store.state.name`
  - 在setup函数中用计算属性获取
  
  ```js
  import { useStore } from 'vuex'
  import { computed } from 'vue'
  setup(){
    const store = useStore()
    const Counter = computed(() => store.state.counter)
  }
  ```

### Getters

> 改变某些属性的状态变化

#### 定义getters

```js
getters:{
  totalPrice(state,getters){
    let totalprice=0
    for(const book of state.books){
      totalPrice+=book.count*book.price
    }
    return totalPrice
  }
}
```

- 第一个参数`state`,可以拿到state中的状态
- 第二个参数`getters`,可以拿到其它的getters

#### 获取

- 在模板中使用:`$store.getters.totalPrice`

- setup中用计算属性获取

```js
 import { useStore } from 'vuex'
  import { computed } from 'vue'
  setup(){
    const store = useStore()
    const totalPrice=(()=>store.getters.totalPrice)
  }
```

## 使用mapState和mapGetters

- 使用数组类型:`...mapGetters(["totalPrice","myName"])`
- 使用对象类型:

```js
...mapGetters({
  finalPrice:"totalPrice",
  finalName:"myName"
})
```

- 参考<https://zyjcould.ltd/2021/09/30/vuex-4mapstate-he-mapgetters/#toc-heading-1>

## Actions

- Action提交的是mutation,而不是直接变更状态
- Action可以包含任意异步操作
- 参数`context`:
  - context是一个和store实例均有相同方法和属性的context对象
  - 从其中获取到commit方法来提交一个`mutation`,或者通过`context.state`和`context.getters`来获取`state和getters`

```js
actions:{
  increment(context){
    context.commit("increment")
  }
}
```

- 同时也接收第二个参数payload,获取从组件中传入的参数

### actions的分发操作

- 同时actions可以执行异步操作
  - 例如ajax请求,定时器等等

```js
actions:{
  increment(context){
    return new Promise(
      resolve=>{
        setTimeout(()=>{
          context.commit("increment")
          resolve("异步完成")
        },1000)
      },
      reject=>{
        reject("失败")
      }
    )
  }
}
```

```js
const store=useStore()
  store.dispatch("increment").then(
    resolve=>{
      cosnole(resolve)
    },
    error=>{
      console.log(error)
    })

//携带参数
store.dispatch("increment",{count:100})
//使用对象形式
store.dispatch({
  type:"increment",
  count:100
})
```

### mapActions

- `mapActions`返回的就是一个函数
- 数组写法:`...mapActions(["increment","decrement"])`
- 对象写法:

```js
const action= mapActions({
//将`this.add()`映射为`this.$store.dispatch('increment')`  
  add: 'increment' 
})
```

## Mutation

> 提交`mutation`是更改Vuex的store中的状态的唯一方法

- 重要的原则: `mutation` 必须是同步函数
  - devtool工具记录每一条mutation,devtools都需要捕捉到前一状态和后一状态的快照
  - 但是在mutation中执行异步操作,就无法追踪到数据的变化

```js
mutations:{
  increment:{
    increment(state,payload){
      state.counte+=payload
    }
  }
}
```

### mapMutations

- `mapMutations`返回的就是一个函数
- 数组写法:`...mapMutations(["Increment","Decrement"])`
- 对象写法:

```js
const action= mapMutations({
//将`this.Add()`映射为`this.$store.commit('Increment')`  
  Add: 'Increment' 
})
```

## module

> 使用单一状态树,应用的所有状态会集中到一个比较大的对象,应用会变得复杂
> 使每个模块拥有自己的 `state,mutation,action,getter`甚至是嵌套子模块

```js
//子模块a
const moduleA={
  state()=>{},
  mutations:{},
  actions:{},
  getters:{}
}
//子模块b
const moduleB={
  state()=>{},
  mutations:{},
  actions:{},
  getters:{}
}
//引入模块
const store=createStore({
  modules:{
    a:moduleA,
    b:moduleB
  }
})

//moduleA和moduleB的状态
store.state.a
store.state.b
```

### 局部状态

> 模块内部action参数context的解构(所有action都携带)

- commit:提交对象
- dispatch:分发的函数
- state:此模块内的状态
- rootState:根模块的state
- getters:此模块的getter
- rootGetters:跟模块的getters

> 模块内部的 getter,根节点状态会作为第三个参数暴露出来`state, getters, rootState`

### module命名空间

- 默认情况下,模块内部的action和mutation仍然是注册在全局的命名空间中的
  1. 这使得多个模块能够对同一个 `action 或 mutation` 作出响应
  2. `Getter` 同样也默认注册在全局命名空间

- 添加 `namespaced: true` 的方式使模块成为带命名空间的模块
  - 模块将具有更高的封装度和复用性
  - 模块被注册后,它的所有 `getter`,`action`及`mutation` 都会自动根据模块注册的路径调整命名

### module中修改和派发根组件

```js
actions: {
  incrementAction({commit,dispatch,state,rootState,getters,rootGetters}){
    commit("increment", null, {root: true})
    dispatch("incrementAction", null, {root: true})
  }
}
```

### module辅助函数

> 在setup函数中使用辅助函数来分发提交等

1. 通过完整的模块空间名称来查找
2. 第一个参数传入模块空间名称,后面写上要使用的属性

#### createNamespacedHelpers

> 可以直接使用辅助函数去和模块交互,而不用传入任何其它的参数

```js
const { mapState, 
        mapGetters, 
        mapMutations, 
        mapActions } = createNamespacedHelpers("home")        
```

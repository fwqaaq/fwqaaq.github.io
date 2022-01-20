---
title: Vue3中的CompositionApi
date: 2021-09-26 15:19:00
author: Jack-zhang
categories: vue
tags:
   - vue3
   - JS
summary: vue3的compositionApi
---

## setup函数的参数

1. 第一个参数:`props`
2. 第二个参数:`context`

- `props`:父组件传递过来的属性会被放到`props`对象中
  1. 还是在props选项中定义
  2. 在`template`中依然是可以正常去使用props中的属性,比如message
  3. 如果我们在setup函数中想要使用props,<span style="color:red">那么不可以通过 this 去获取</span>
  4. 因为props有直接作为参数传递到setup函数中,所以我们可以直接通过参数来使用即可

- `context`:
  1. `attrs`:所有的非prop的attribute；
  2. `slots`:父组件传递过来的插槽
  3. `emit`:当我们组件内部需要发出事件时会用到emit(<span style="color:red">不可以通过 this.$emit发出事件</span>

## setup函数的返回值

> - `setup`的返回值可以在模板`template`中被使用,通过setup的返回值来替代data选项
> - 通过返回一个执行函数来代替在methods中定义的方法

```js
let name="zhangsan"
let counter=0
const increment=()=>{
  counter++
}
const decrement=()=>{
  counter--
}

return {
  name,counter,increment,decrement
}
```

- 注意:<span style="color:red">对于定义的一个变量来说,默认情况下,Vue并不会跟踪他的变化,这不是响应式的</span>

## setup中的this不可以用

- 表达的含义是this并没有指向当前组件实例
- 并且在setup被调用之前,data,computed,methods等都没有被解析
- 所以无法在setup中获取this

## 响应式API

### reactive

```js
const state=reactive({
  name:"zhangsan",
  counter:0
})
return { state }
```

- 使用`template`访问时,要使用`state.name`的形式访问到,template并不能直接解构

- 使用reacitve响应式的原理
  - reactive函数处理我们的数据之后,数据再次被使用时就会进行依赖收集
  - 当数据发生改变时,所有收集到的依赖都是进行对应的响应式操作(比如更新界面)
  - data选项中,也是在内部交给了`reactive`函数将其编程响应式对象的

### ref的一些API

#### ref

- `cosnt name=ref("zhangsan")`
  - `ref` 会返回一个可变的响应式对象,该对象作为一个 响应式的引用 维护着它内部的值
  - 内部的值是在<span style="color:red">ref的 value 属性中被维护的</span>

- 注意:
  - 模板中引入ref的值时,Vue会自动帮助我们进行解包操作,所以我们<span style="color:red">并不需要在模板中通过 `name.value` 的方式,直接使用`name`即可</span>
  - 在 `setup` 函数内部,它依然是一个 ref引用, 所以对其进行操作时,我们依然需要使用 `name.value`的方式

- 关于ref自动解包

```js
setup() {
  let counter = ref(100)
  const info = {
    counter
  }
  const reactiveInfo = reactive({
    counter
  })
return {counter,info,reactiveInfo}
}
```

1. 当我们在`template`模板中使用ref对象, 它会自动进行解包,`{{counter}}`可以访问到
2. info是一个普通的JavaScript对象:ref的解包只能是一个浅层解包,`{{info.counter.value}}`
3. 当如果最外层包裹的是一个reactive可响应式对象, 那么内容的ref可以解包`{{reactiveInfo.counter}}`

#### toRefs

>对reactive返回的对象进行解构获取值,那么之后无论是<span style="color:red">修改结构后的变量,还是修改reactive返回的state对象</span>,数据都不再是响应式的

1. `toRefs`的函数,可以将reactive返回的对象中的属性都转成ref
2. 那么我们再次进行结构出来的 name 和 age 本身都是 ref的
3. 这种做法相当于已经在`state.name`和r`ref.value`之间建立了 链接,任何一个修改都会引起另外一个变化

```js
const state=reavtive({
  name:"zhangsan",
  age:13
})
//const {name,age}=state//这种不能做到响应式
const {name,age}=toRefs(state)
```

#### toRef

>只希望转换一个`reactive`对象中的属性为ref

```js
const age=toRef(state,"name")
```

#### ref的其它api

- `isRef`
  - 判断值是否是一个ref对象。
- `unref`
  - 如果我们想要获取一个ref引用中的value,那么也可以通过unref方法
  - 如果<span style="color:red">参数是一个 ref,则返回内部值,否则返回参数本身</span>
  - 这是 `val = isRef(val) ? val.value : val` 的语法糖函数
- `shallowRef`
  - 创建一个浅层的ref对象
- `triggerRef`
  - 手动触发和 `shallowRef` 相关联的副作用

```js
const info =shallowRef({name:"zhangsan"})

const changeName=()=>{
  info.value.name="lisi"
  //手动修改
  triggerRef(info)
}
```

#### customRef

- 创建一个自定义的ref,并对其依赖项跟踪和更新触发进行显示控制
  - 它需要一个工厂函数,该函数接受 track 和 trigger 函数作为参数
  - 并且应该返回一个带有 get 和 set 的对象

- 简单的防抖操作

```js
import { customRef } from 'vue';
export default function(value, delay = 300) {
  let timer = null;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      }
    }
  })
}
```

## readonly

- `readonly`返回的对象都是不允许修改的
- 但是经过`readonly`处理的原来的对象是允许被修改的
  - 例如`const info = readonly(obj)`,info对象是不允许被修改的,但是obj对象可以修改
  - 本质上就是readonly返回的对象的setter方法被劫持了

- 传递readonly处理过的对象(`info`)给子组件,父组件可以通过修改原来的对象(`obj`)来达到响应式

```js
  // 1.普通对象
  const info1 = {name: "why"};
  const readonlyInfo1 = readonly(info1);
  // 2.响应式的对象reactive
  const info2 = reactive({
    name: "why"
  })
  const readonlyInfo2 = readonly(info2);
  // 3.响应式的对象ref
  const info3 = ref("why");
  const readonlyInfo3 = readonly(info3);
```

## reactive判断的API

- `isProxy`: 检查对象是否是由`reactive` 或 `readonly`创建的 proxy
- `isReactive`:
  - 检查对象是否是由 `reactive`创建的响应式代理：
  - 如果该代理是 `readonly` 建的,但包裹了由 `reactive` 创建的另一个代理,它也会返回 true
- `isReadonly`:检查对象是否是由 `readonly` 创建的只读代理。
- `toRaw`:返回 `reactive` 或 `readonly` 代理的原始对象(<span style="color:red">不建议保留对原始对象的持久引用。请谨慎使用</span>)。
- `shallowReactive`: 创建一个响应式代理,它跟踪其自身 `property` 的响应性,但不执行嵌套对象的深层响应式转换 (深层还是原生对象)
- `shallowReadonly`: 创建一个 proxy,使其自身的 property 为只读,但不执行嵌套对象的深度只读转换(深层还是可读、可写的)
  
## computed

> `Composition API`中, setup 函数中使用 computed 方法来编写一个计算属性

- 接收一个getter函数,并为 getter 函数返回的值,返回一个不变的 ref 对象
- 接收一个具有 get 和 set 的对象,返回一个可变的(可读写)ref 对象

```js
const fullName=computed(()=>{
  return lastName.value+""+firstName.value
})

const fullName=({
  get:()=>{
    return lastName.value+""+firstName.value
  },
  set(newValue) {
    const names = newValue.split(" ");
    firstName.value = names[0];
    lastName.value = names[1];
  }
})
```

## setup中使用ref

>只需要定义一个ref对象,绑定到元素或者组件的ref属性上即可

```html
<template>
  <div>
    <h2 ref="title">哈哈哈</h2>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const title = ref(null)
    return {
      title
    }
  }
}
</script>
```

## 监听数据

- watchEffect用于自动收集响应式数据的依赖
- watch需要手动指定侦听的数据源

### watchEffect

- watchEffect传入的函数<span style="color:red">会被立即执行一次,并且在执行的过程中会收集依赖</span>
- 只有收集的依赖发生变化时,watchEffect传入的函数才会再次执行

```js
const name=ref("zhangsan")
const age=ref(18)

watchEffect(()=>{
  console.log("watchEffect",name.value,age.value)
})
```

#### 停止监听:可以获取watchEffect的返回值函数,调用该函数

```js
const stopWatch=watchEffect(()=>{
  console.log("watchEffect",name.value,age.value)
})

const changeAge=()=>{
  age.value++
  if(age.value>20){
    stopWatch()
  }
}
```

#### watchEffect清除副作用

>- 比如在开发中我们需要在侦听函数中执行网络请求,但是在网络请求还没有达到的时候,我们停止了侦听器,或者侦听器侦听函数被再次执行了
>- 那么上一次的网络请求应该被取消掉,这个时候我们就可以清除上一次的副作用

- 在我们给watchEffect传入的函数被回调时,其实可以获取到一个参数：`onInvalidate`

```js
const stopWatch=watchEffect((onInvalidate)=>{
  console.log("watchEffect",name.value,age.value)
  const timer=setTimeout(()=>{
    console.log("2s后执行")
  },2000)
  onInvalidate(()=>{
    clearTimeout(timer)
  })
})
```

#### watchEffect的执行时机

- setup函数在执行时就会立即执行传入副作用函数,这个时候DOM并没有挂载,打印ref对象的值为null
- 当DOM挂载时,会给title的ref对象赋值新的值,副作用函数会再次执行,打印出来对应的元素
- 函数执行时机,第二个参数(一个含有flush的对象)
  - 默认值是pre,它会在元素 挂载 或者 更新 之前执行；
  - 首先先打印出来一个空的,当依赖的title发生改变时,就会再次执行一次,打印出元素

```js
watchEffect(()=>{
  console.log(tittle.value)
},{
  flush:"post"
})
```

- 绑定`flush:"post"`之后并不会在元素挂载之前更新

### watch的使用

- watchEffect的比较,watch允许我们
  1. 懒执行副作用(第一次不会直接执行)
  2. 更具体的说明当哪些状态发生变化时,触发侦听器的执行
  3. 访问侦听状态变化前后的值

#### 监听单个数据

- 一个getter函数：但是该getter函数必须引用可响应式的对象

```js
const info=reactive({name:"zhangsan"})
watch(()=>info.name,(newValue,oldValue)=>{
  console.log(newValue,oldValue)
})
const changeName=()=>{
  info.name="lisi"
}
```

- 直接写入一个可响应式的对象,reactive或者ref
  - `info.name`

#### 监听多个数据

```js
const name=ref("zhangsan")
const age=ref(18)
watch([name,age],(newValue,oldValue)=>{
  console.log(newValue,oldValue)
})
const changeName=()=>{
  name.value="lisi"
}
```

#### 监听响应式对象

- 侦听一个数组或者对象,那么可以使用一个getter函数,并且对可响应对象进行解构

```js
const info=reactive({"wangwu",lisi"","zhagnsan"})
watch(()=>[...info],(newValue,oldValue)=>{
  console.log(newValue,oldValue)
})
const changeName=()=>{
  info.push("wangba")
}
```

#### watch的选项

- 第三个参数,传入一个对象
  - `deep:true`,深层监听
  - `immediate:true` 立即执行

```js
const info=reactive({
  name:"zhangsan",
  age:18,
  feiends:{
    name:"lisi",
    age:19
  }
})
watch(()=>info.name,(newValue,oldValue)=>{
  console.log(newValue,oldValue)
},{deep:true,immediate:true})
const changeName=()=>{
  info.friends.name="wangwu"
}
```

## 生命周期钩子

| optionsAPI      | CompositionAPI    |
| --------------- | ----------------- |
| beforeCreate    | 使用 setup()      |
| created         | 使用 setup()      |
| beforeMount     | onBeforeMount     |
| mounted         | onMounted         |
| beforeUpdate    | onBeforeUpdate    |
| updated         | onUpdated         |
| beforeUnmount   | onBeforeUnmount   |
| unmounted       | onUnmounted       |
| errorCaptured   | onErrorCaptured   |
| renderTracked   | onRenderTracked   |
| renderTriggered | onRenderTriggered |
| activated       | onActivated       |
| deactivated     | onDeactivated     |

## Provide和Inject

- 可以通过 provide 方法来提供数据
- provide可以传入两个参数
  - name：提供的属性名称
  - value：提供的属性值

- 在后代组件中通过 inject 来注入需要的属性和对应的值
  - 可以通过 inject 来注入需要的内容
  - inject可以传入两个参数

- 使用ref或者reactive包裹数据,使其成为响应式

```js
let counter =ref(100)
let info =reactive({
  name:"zhangsan",
  age:19
})
provide("counter",counter)
provide("info",info)

//后代组件
const counter =inject("counter")
const info =inject("info")
```

- 将修改的方法共享,在后代组件中复用

```js
const changeInfo=()=>{
  info.name="lisi"
}
const changeInfo=()=>{
provide("changeInfo",changeInfo)
```

## 简单介绍JSX的使用

```html
<script>
import { ref } from "vue"
export default {
  setup(props) {
    const counter = ref(0)
    const increment=()=>{
      counter.value++
    }
    const decrement=()=>{
      counter.value--
    }
    return () => {
      return (
        <div>
          <h2>当前计数器{counter.value}</h2>
          <button onClick={increment}>+1</button>
          <button onClick={decrement}>-1</button>
        </div>)
    }
  },
}
</script>
```

- JSX中也可以使用vue组件<https://v3.cn.vuejs.org/guide/render-function.html#jsx>

## Teleport

- 当封装一个组件A,在另外一个组件B中使使用
  - 组件A中template的元素,会被挂载到组件B中template的某个位置
  - 最终的应用会形成一颗DOM树结构
- 将组件从组件树移除挂载,移动组件到Vue app之外的其他位置
  - 如移动到body元素上,或者我们有其他的`div#app`之外的元素上

- 关于`Teleport`:个Vue提供的内置组件
  - 两个属性:
  - to:指定将其中的内容移动到的目标元素,可以使用选择器
  - disabled：是否禁用 teleport 的功能

- <span style="color:red">其中teleport也可以使用组件,也可以给他传入一些数据</span>

```vue
<template>
  <div>
    <teleport to="body">
      <Home></Home>
      <h2>你好啊.jack</h2>
    </teleport>
  </div>
</template>
```

- <span style="color:red">注意:多个teleport应用到同一个目标上(（)to的值相同),那么这些目标会进行合并</span>

## vue插件进行编写

> 向Vue全局添加一些功能时,会采用插件的模式

- 对象类型:一个对象,但是必须包含一个 install 的函数,该函数会在安装插件时执行
- 函数类型：一个function,这个函数会在安装插件时自动执行

- **可以完成的功能**
  - 添加全局方法或者 property,通过把它们添加到 `config.globalProperties` 上实现；
  - 添加全局资源：指令/过滤器/过渡等；
  - 通过全局 mixin 来添加一些组件选项；
  - 一个库,提供自己的 API,同时提供上面提到的一个或多个功能

- 对象写法

```js
export default{
  install(app){
    app.config.globalProperties.$name ="zhangsan" 
  }
```

- 函数类型的写法

```js
export default function(app){
  console.log(app)
}
```

- 在`main.js`引入插件的包,再用`app.use()`挂载
- 使用compositionApi引入

```js
import { getCurrentInstance } from 'vue'
  export default {
    setup() {
      const instance=getCurrentInstance()
      onMounted(() => {
        console.log(instance.appContext.config.globalProperties.$name)
      })
    }
  }
```

## 自定义指令

参考:<http://mail.zyjcould.ltd/2021/09/27/vue3-zhong-zi-ding-yi-zhi-ling/>

## nexttick

> 官方解释:将回调推迟到下一个 DOM 更新周期之后执行.在更改了一些数据以等待 DOM 更新后立即使用它

1. <span style="color:red">watch回调函数,组件更新,生命周期回调函数</span>会放入微任务中执行
2. 同步函数放入`nexttick()`钩子中,会放入微任务的最后执行
  
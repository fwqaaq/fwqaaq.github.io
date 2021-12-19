---
title: vue的基础
date: 2021-8-22 19:00:00
author: Jack-zhang
categories: vue
tags:
   - vue2
   - JS
summary:  一个简单vue使用的介绍,内含vue-cli,vuex,router等一些简单的使用.
---

## 脚手架文件结构

```js
vue-test
├── babel.config.js:babel配置文件  
├── output.js:vue的隐藏配置项        
├── package-lock.json:包版本配置文件
├── package.json:应用包配置文件     
├── public
│   ├── favicon.ico:页签图标  
│   └── index.html:主页面   
├── readme.md:应用描述文件        
├── src
│   ├── App.vue:汇总所有文件      
│   ├── assets:存放静态资源     
│   │   └── logo.png 
│   ├── components:存放组件
│   │   ├── School.vue
│   │   └── Student.vue
│   └── main.js:入口文件
└── vue.config.js:可选择配置项,
```

## 关于不同版本的Vue

- vue.js与vue.runtime.xxx.js的区别
    (1)vue.js是完整版的Vue,包括:核心功能+模板解析器
    (2)vue.runtime.xxx.js是运行版的Vue,只包含:核心功能,没有解析器模板
- 因为vue.runtime.xxx.js,没有解析器模板,所以不能使用template配置项,需要使用
    render函数接收到createElement函数去指定具体内容

## vue.config.js配置文件

> 使用vue inspect > output.js可以看到Vue脚手架的默认配置项
> 使用vue.config.js可以对脚手架进行个性化定制,详情见:https://cli.vuejs.org/zh

## ref属性

- 1.被用来给元素子组件注册引用信息(id的替代者)

- 2.应用在html标签上获取真实的DOM元素,应用在组件标签上是组件的实例对象(vc)

- 3.使用方式:打标识:

```html
  <h1 v-text="msg" ref="title"></h1> 或者<School ref="sch"/>
```

- 4.获取:this.$refs.xxx
  
## 配置项props

- 功能:让组件接收外部传过来的数据
  - (1)传递数据:

   ```html
   <Demo name="xxx"/> 
   ```

  - (2)接收数据
    - 第一种方式(只接收):

     ```js
     props:["name"]
     ```

    - 第二种方式(限制类型):
  
     ```js
     props:{
         name:Number
     }
     ```

    - 第三种方式(限制类型,限制必要性,指定默认值)
  
     ```js
     props:{
         type:String,//类型
         required:true,//必要性
         default:"老王"//默认值
     }
     ```

      备注:props是只读,Vue底层只会监测你对props的修改,如果进行了修改,就会发出警告,若业务需求确实修改需要修改,那么请复制props的内容到data中一份,然后去修改data中的数据

## mixin(混入)

- 功能:可以把多个组件共用的配置提取成一个混入对象
  
- 使用方式:
  - 第一步定义混合:

     ```vue
     {
         data(){....},
         methods(){...}
         .....
     }
     ```

    - 第二步使用混入,例如:
        >
        >- (1)全局混入:Vue.mixin(xxx)
        >- (2)局部混入: mixins:[xxx]

## 插件

- 功能用于增强Vue

- 本质:包含install方法的一个对象,install的第一个参数是Vue,第二个参数是插件使用者传递的数据

- 定义插件:

  ```js
    对象.install=function(Vue,options){
      //1.添加全局过滤器
      Vue.filter(...)
      
      //2添加全局指令
      Vue.directive(...)
      
      //3.配置全局混合
      Vue.mixin(...)
      
      //4.添加实例方法
      Vue.prototype.$myMethod=function(){...}
      Vue.prototype.$myProperty=xxx
      
      使用插件
      Vue.use()
      
    }
  ```

## scoped样式

- 作用:让样式在局部生效,防止冲突
- 写法:

 ```vue
  <style scoped>
 ```

## 总结TodoList案例

1. 组件化编码流程：

   (1).拆分静态组件：组件要按照功能点拆分，命名不要与html元素冲突。

   (2).实现动态组件：考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用：

      1).一个组件在用：放在组件自身即可。

      2). 一些组件在用：放在他们共同的父组件上（<span style="color:red">状态提升</span>）。

   (3).实现交互：从绑定事件开始。

2. props适用于：

   (1).父组件 ==> 子组件 通信

   (2).子组件 ==> 父组件 通信（要求父先给子一个函数）

3. 使用v-model时要切记：v-model绑定的值不能是props传过来的值，因为props是不可以修改的！

4. props传过来的若是对象类型的值，修改对象中的属性时Vue不会报错，但不推荐这样做。

## webStorage

1. 存储内容大小一般支持5MB左右（不同浏览器可能还不一样）

2. 浏览器端通过 Window.sessionStorage 和 Window.localStorage 属性来实现本地存储机制。

3. 相关API：

   1. ```xxxxxStorage.setItem('key', 'value');```
      该方法接受一个键和值作为参数，会把键值对添加到存储中，如果键名存在，则更新其对应的值。

   2. ```xxxxxStorage.getItem('person');```

      该方法接受一个键名作为参数，返回键名对应的值。

   3. ```xxxxxStorage.removeItem('key');```

      该方法接受一个键名作为参数，并把该键名从存储中删除。

   4. ```xxxxxStorage.clear()```

      该方法会清空存储中的所有数据。

4. 备注：

   1. SessionStorage存储的内容会随着浏览器窗口关闭而消失。
   2. LocalStorage存储的内容，需要手动清除才会消失。
   3. ```xxxxxStorage.getItem(xxx)```如果xxx对应的value获取不到，那么getItem的返回值是null。
   4. ```JSON.parse(null)```的结果依然是null。

## 组件的自定义事件

1. 一种组件间自通信的方式,适用于:子组件==>父组件

2. 使用场景:A是父组件,B是子组件,B想给A传数据,那么就要在A中给B绑定自定义事件（<span style="color:red">事件的回调在A中</span>）

3. 绑定自定义事件:
    1. 第一种方式,在父组件中:
    ``` <Demo @demo="test"/> ```或 ``` <Demo v-on:demo="test"/> ```
    2. 第二种方式:在父组件中

    ```js
      <Demo ref="demo">
     ......
     mounted(){
        this.$ref.xxx.$on("demo",this.test)
     }
    ```

    1. 若想让自定义事件只触发一次,可以使用once修饰符,或$once方法

4. 触发自定义事件: ``` this.$emit("demo",数据) ```

5. 解绑自定义事件:this.$off("demo")

6. 组件上也可以绑定DOM事件,需要使用native修饰符

7. 注意:通过 ``` this.$ref.xxx.$on("demo",回调) ```绑定自定义事件,回调（<span style="color:red">要么配置在methods中,要么用箭头函数</span>）,否则this指向会出问题

## 全局事件总线(GlobalEventBus)

1. 一种组件间通信的方式,适用于\<span style="color:red">任意组件间通信</span>

2. 安装全局事件总线:

  ```js
   new Vue({
      ......
      beforeCreated(){
         Vue.prototype.$bus=this//安装劝酒事件总线,$bus就是当前应用的vm
      },
      ......
   })
  ```

3. 使用事件总线:

     1. 接收数据:A组件想接收数据,则在A组件汇总给$bus绑定自定义事件,事件的<span style="color:red">回调留在A组件自身</span>

   ```js
     methods(){
        demo(data){......}
     } 
     ......
     mounted(){
        this.$bus.$on("xxx",this.demo)
     }
   ```

     1. 提供数据: ``` this.$bus.$emit("xxx",数据) ```

4. 最好在beforeDestory钩子中,用$off去解绑\<span style="color:red">当前组件所用到的</span>事件

## 消息订阅与发布（pubsub）

1. 一种组件间通信的方式，适用于\<span style="color:red">任意组件间通信</span>。

2. 使用步骤：

   1. 安装pubsub：```npm i pubsub-js```

   2. 引入: ```import pubsub from 'pubsub-js'```

   3. 接收数据：A组件想接收数据，则在A组件中订阅消息，订阅的<span style="color:red">回调留在A组件自身。</span>

      ```js
      methods(){
        demo(data){......}
      }
      ......
      mounted() {
        this.pid = pubsub.subscribe('xxx',this.demo) //订阅消息
      }
      ```

   4. 提供数据：```pubsub.publish('xxx',数据)```

   5. 最好在beforeDestroy钩子中，用```PubSub.unsubscribe(pid)```去<span style="color:red">取消订阅。</span>

## nextTick

1. 语法：```this.$nextTick(回调函数)```
2. 作用：在下一次 DOM 更新结束后执行其指定的回调。
3. 什么时候用：当改变数据后，要基于更新后的新DOM进行某些操作时，要在nextTick所指定的回调函数中执行。

## Vue封装的过度与动画

1. 作用：在插入、更新或移除 DOM元素时，在合适的时候给元素添加样式类名。

2. 图示：![transition](D:\web\vue\vue-test\16_src_过度与动画\transition.png)

3. 写法：

   1. 准备好样式：

      - 元素进入的样式：
        1. v-enter：进入的起点
        2. v-enter-active：进入过程中
        3. v-enter-to：进入的终点
      - 元素离开的样式：
        1. v-leave：离开的起点
        2. v-leave-active：离开过程中
        3. v-leave-to：离开的终点

   2. 使用```<transition>```包裹要过度的元素，并配置name属性：

      ```vue
      <transition name="hello">
       <h1 v-show="isShow">你好啊！</h1>
      </transition>
      ```

   3. 备注：若有多个元素需要过度，则需要使用：```<transition-group>```，且每个元素都要指定```key```值。

   4. 注意:animate.css是一个动画库

## vue脚手架配置代理

### 方法一

- 在vue.config.js中添加如下的配置:

    ```js
       devServer:{
         proxy:"http://localhost:5000"
       }  
    ```

 说明:

   1. 优点:配置简单,请求资源时直接发给前端(8080)即可
   2. 缺点:不能配置多个代理,不能灵活的控制请求是否走代理.
   3. 工作方式:若是按照上述配置代理,当请求了前端不存在的资源时,那么该请求会转发给服务器(优先匹配前端资源)

### 方法二

- 编写vue.config.js的配置的代理规则:

   ```js
   moudle.export={
      devServer: {
        proxy: {
          '/api': {
            target: 'http://localhost:6000',
            pathRewrite:{"^/api" : ""},//将所有匹配到的/api变成空字符串
            ws: true,//用于支持websocket
            changeOrigin: true//用于控制请求头中的Host值.是真就是被代理服务器的值,是假就是代理服务器的值
            },
            "/demo":{
              target:"http://localhost:5001",
              pathRewrite:{"^/demo":""},
              ws: true,//用于支持websocket
              changeOrigin: true//用于控制请求头中的Host值
             }
        }
      }   
    }
    <!-- 
    changeOrign设置为true,服务器找到的请求头中的host为:localhost:5000
    changeOrign设置为false,服务器找到的请求头中的host为:localhost:8000
    changeOrign默认值为true
    -->
   ```

说明:

   1. 优点:可以配置多个代理,且可以灵活的控制请求是否走代理
   2. 缺点:配置略微繁琐,请求资源时必须加前缀

## 插槽

  1. 作用:让父组件可以向子组件插入html结构,也是一种组件间通信的方式,适用于<span style="color:red">父组件==>子组件</span>
  
  2. 分类:默认插槽,具名插槽,作用域插槽

  3. 使用方式:

   1. 默认插槽:

      ```js
       父组件中:
      <Category>
        <div>html结构</div>
      </Category>
      子组件中:
      <template>
         <div>
          <!--定义插槽-->
            <slot>插槽默认值</slot>
         </div>
      </template>           
      ```

   2. 具名插槽

       ```js
       父组件中:
       <Category>
        <template slot="center">
         <div>html结构</div>
        </template>
        <template v-slot:footer>
         <div>html结构</div>
        </template>
       </Category>
      子组件中:
       <template>
        <div>
         <!--定义插槽-->
        <slot name="center">插槽默认值</slot>
        <slot name="footer">插槽默认值</slot>
        </div>
       </template>           
       ```

   3. 作用域插槽: <span style="color:red">数据在组件自身,但是根据数据生成的结构需要组件的使用者来决定</span>(games数据在Category组件中但是用数据所便利的结构又App决定)  

       ```js
       父组件中：
       <Category>
       <template scope="scopeData">
        <!-- 生成的是ul列表 -->
        <ul>
         <li v-for="g in scopeData.games" :key="g">{{g}}</li>
        </ul>
       </template>
        </Category>

      <Category>
      <template slot-scope="scopeData">
        <!-- 生成的是h4标题 -->
        <h4 v-for="g in scopeData.games" :key="g">{{g}}</h4>
      </template>
      </Category>
            子组件中：
        <template>
        <div>
         <slot :games="games"></slot>
        </div>
       </template>
       <script>
        export default {
         name:'Category',
             props:['title'],
             //数据在子组件自身
             data() {
                 return {
                     games:['红色警戒','穿越火线','劲舞团','超级玛丽']
                 }
             },
         }
      </script>
       ```

## Vuex

### 1.概念

  在Vue中实现集中式状态（数据）管理的一个Vue插件，对vue应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。

### 2.何时使用？

  多个组件需要共享数据时

### 3.搭建vuex环境

1. 创建文件：```src/store/index.js```

   ```js
   //引入Vue核心库
   import Vue from 'vue'
   //引入Vuex
   import Vuex from 'vuex'
   //应用Vuex插件
   Vue.use(Vuex)
   
   //准备actions对象——响应组件中用户的动作
   const actions = {}
   //准备mutations对象——修改state中的数据
   const mutations = {}
   //准备state对象——保存具体的数据
   const state = {}
   
   //创建并暴露store
   export default new Vuex.Store({
    actions,
    mutations,
    state
   })
   ```

2. 在```main.js```中创建vm时传入```store```配置项

   ```js
   ......
   //引入store
   import store from './store'
   ......
   
   //创建vm
   new Vue({
    el:'#app',
    render: h => h(App),
    store
   })
   ```

### 4.基本使用

1. 初始化数据、配置```actions```、配置```mutations```，操作文件```store.js```

   ```js
   //引入Vue核心库
   import Vue from 'vue'
   //引入Vuex
   import Vuex from 'vuex'
   //引用Vuex
   Vue.use(Vuex)
   
   const actions = {
       //响应组件中加的动作
   jia(context,value){
    // console.log('actions中的jia被调用了',miniStore,value)
    context.commit('JIA',value)
    },
   }
   
   const mutations = {
       //执行加
    JIA(state,value){
     // console.log('mutations中的JIA被调用了',state,value)
     state.sum += value
    }
   }
   
   //初始化数据
   const state = {
      sum:0
   }
   
   //创建并暴露store
   export default new Vuex.Store({
    actions,
    mutations,
    state,
   })
   ```

2. 组件中读取vuex中的数据：```$store.state.sum```

3. 组件中修改vuex中的数据：```$store.dispatch('action中的方法名',数据)``` 或 ```$store.commit('mutations中的方法名',数据)```

   >  备注：若没有网络请求或其他业务逻辑，组件中也可以越过actions，即不写```dispatch```，直接编写```commit```

### 5.getters的使用

 1. 概念：当state中的数据需要经过加工后再使用时，可以使用getters加工
 2. 在```store```中追加```getters```配置

 ```js
 ......
 const getters={
    bigSum(state){
      return state.sum*10 
    }
 }
 //创建并暴露
 export default new Vuex.Store({
    ······
    getters
 })
 ```

 3. 组件中读取数据：```$store.getters.bigSum```

### 6.四个map方法

   1. mapState方法:用于帮助我们映射state中的数据为计算属性

       ```js
       computed:{
           //借助mapState生成计算属性,从state中获取属性(对象写法)
           ...mapState({sum:"sum",school:"school",subject:"subject"})
            
           //借助mapState生成计算属性,从state中获取属性(数组写法)
           ...mapState(["sum","school",subject])
       }
       ```

   2. mapGetters:用于帮助我们映射getters中的数据为计算属性

      ```js
        computed:{
          //借助mapGetters生成计算属性,从getters中获取属性(对象写法)
           ...mapGetters({bigSum:"bigSum"})
          //借助mapGetters生成计算属性,从getters中获取属性(数组写法)
           ...mapGetters(["bigSum"])
        } 
      ```

   3. **mapActions方法：**用于帮助我们生成与```actions```对话的方法，即：包含```$store.dispatch(xxx)```的函数

   ```js
   methods:{
       //靠mapActions生成：incrementOdd、incrementWait（对象形式）
       ...mapActions({incrementOdd:'jiaOdd',incrementWait:'jiaWait'})
   
       //靠mapActions生成：incrementOdd、incrementWait（数组形式）
       ...mapActions(['jiaOdd','jiaWait'])
   }
   ```

   1. **mapMutations方法**： 用于帮助我们生成与```mutations```对话的方法，即：包含```$store.commit(xxx)```的函数

   ```js
   methods:{
       //靠mapActions生成：increment、decrement（对象形式）
       ...mapMutations({increment:'JIA',decrement:'JIAN'}),
       
       //靠mapMutations生成：JIA、JIAN（对象形式）
       ...mapMutations(['JIA','JIAN']),
   }
   ```

> 备注：mapActions与mapMutations使用时，若需要传递参数需要：在模板中绑定事件时传递好参数，否则参数是事件对象。

### 7.模块化+命名空间

1. 目的：让代码更好维护，让多种数据分类更加明确。

2. 修改```store.js```

   ```javascript
   const countAbout = {
     namespaced:true,//开启命名空间
     state:{x:1},
     mutations: { ... },
     actions: { ... },
     getters: {
       bigSum(state){
          return state.sum * 10
       }
     }
   }
   
   const personAbout = {
     namespaced:true,//开启命名空间
     state:{ ... },
     mutations: { ... },
     actions: { ... }
   }
   
   const store = new Vuex.Store({
     modules: {
       countAbout,
       personAbout
     }
   })
   ```

3. 开启命名空间后，组件中读取state数据：

   ```js
   //方式一：自己直接读取
   this.$store.state.personAbout.list
   //方式二：借助mapState读取：
   ...mapState('countAbout',['sum','school','subject']),
   ```

4. 开启命名空间后，组件中读取getters数据：

   ```js
   //方式一：自己直接读取
   this.$store.getters['personAbout/firstPersonName']
   //方式二：借助mapGetters读取：
   ...mapGetters('countAbout',['bigSum'])
   ```

5. 开启命名空间后，组件中调用dispatch

   ```js
   //方式一：自己直接dispatch
   this.$store.dispatch('personAbout/addPersonWang',person)
   //方式二：借助mapActions：
   ...mapActions('countAbout',{incrementOdd:'jiaOdd',incrementWait:'jiaWait'})
   ```

6. 开启命名空间后，组件中调用commit

   ```js
   //方式一：自己直接commit
   this.$store.commit('personAbout/ADD_PERSON',person)
   //方式二：借助mapMutations：
   ...mapMutations('countAbout',{increment:'JIA',decrement:'JIAN'})
   ```

## 路由

1. 理解： 一个路由（route）就是一组映射关系（key - value），多个路由需要路由器（router）进行管理。
2. 前端路由：key是路径，value是组件。

### 1.基本使用

1. 安装vue-router，命令：```npm i vue-router```

2. 应用插件：```Vue.use(VueRouter)```

3. 编写router配置项:

   ```js
   //引入VueRouter
   import VueRouter from 'vue-router'
   //引入Luyou 组件
   import About from '../components/About'
   import Home from '../components/Home'
   
   //创建router实例对象，去管理一组一组的路由规则
   const router = new VueRouter({
    routes:[
     {
      path:'/about',
      component:About
     },
     {
      path:'/home',
      component:Home
     }
    ]
   })
   
   //暴露router
   export default router
   ```

4. 实现切换（active-class可配置高亮样式）

   ```vue
   <router-link active-class="active" to="/about">About</router-link>
   ```

5. 指定展示位置

   ```vue
   <router-view></router-view>
   ```

### 2.几个注意点

  1. 路由组件通常存放在```pages```文件夹中,一般组件通常存放在```components```文件夹中
  
  2. 通过切换,"隐藏"了的路由组件,默认是被销毁的,需要的时候再去挂载
  
  3. 每个组件都有自己的```$route```属性,里面存储自己的路由信息
  
  4. 整个应用只有一个router,可以通过组件的```router```获取到

### 3.多级路由

  1. 配置路由规则,使用children配置项

  ```js
  routes: [
    {
      path: "/about",
      component: About
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "news",//此处一定不要写/news
          component: News
        },
        {
          path: "message",//此处一定不要写/message
          component: Message
        }
      ]
    }
  ]
  ```

  2. 跳转(要写完整路径)

   ```js
     <router-link to="/home/news">News<router-link>
   ```

### 4.路由的query参数

  1. 传递参数

   ```js
   <!-- 跳转并携带query参数,to的字符串写法 -->
   <router-link :to="`/home/message/detail?id=${m.id}&tittle=${m.tittle}`">跳转</router-link>

   <!-- 跳转并携带query参数,to的对象写法 -->
   <router-link :to="{path:'/home/message/detail',query:{id:m.id,tittle:m.tittle}}">跳转</router-link>
   ```

  2. 接收参数

   ```js
   $route.query.id
   $route.query.tittle
   ```

### 5.命名路由

1. 作用：可以简化路由的跳转。

2. 如何使用

   1. 给路由命名：

      ```js
      {
      path:'/demo',
      component:Demo,
      children:[
       {
       path:'test',
       component:Test,
       children:[
        {
             name:'hello' //给路由命名
         path:'welcome',
         component:Hello,
        }]
       }]
      }
      ```

   2. 简化跳转

   ```html
   <!--简化前，需要写完整的路径 -->
   <router-link to="/demo/test/welcome">跳转</router-link>
   
   <!--简化后，直接通过名字跳转 -->
   <router-link :to="{name:'hello'}">跳转</router-link>
   
   <!--简化写法配合传递参数 -->
   <router-link
   :to="{
    name:'hello',
    query:{
     id:666,
     title:'你好'}}">跳转</router-link>
   ```

### 6.路由的params参数

   1. 配置路由,声明接收params参数

   ```js
   {
      path: "/home",
      component: Home,
      children: [
        {
          name:"home",
          path: "news",
          component: News
        },
        {
          name:"message",
          path: "message",
          component: Message,
          children:[
            {
              name:"detail",
              path:"detail/:id/:tittle",//使用占位符接收params参数
              component:Detail
            }
          ]
        }
      ]
    }
   ```

   2. 传递参数

      ```js
      <!-- 跳转并携带params参数,to的字符串写法 -->
              <router-link :to="path:/home/message/detail/666/你好">跳转</router-link>
      
      <!-- 跳转并携带params参数,to的字符串写法 -->
              <router-link :to="{path:'/home/message/detail',params:{id:666,tittle:你好}}">跳转</router-link>
      
      ```

   特别注意：路由携带params参数时，若使用to的对象写法，则不能使用path配置项，必须使用name配置！

   3. 接收参数

   ```js
     $route.params.id
     $route.params.tittle
   ```

### 7.路由的props配置

作用：让路由组件更方便的收到参数

```js
{
 name:'xiangqing',
 path:'detail/:id',
 component:Detail,

 //第一种写法：props值为对象，该对象中所有的key-value的组合最终都会通过props传给Detail组件
 // props:{a:900}

 //第二种写法：props值为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给Detail组件 
 // props:true

 //第三种写法：props值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件
 props(route){
   return {
    id:route.query.id,
    title:route.query.title
  }
 }
}
```

### 8.```<router-link>```的replace属性

  1. 作用:控制路由器跳转时操作浏览器历史记录的模式
  
  2. 浏览器的历史记录有两种编入方式: 分别为```push```和```replace```,```push```是追加历史记录,```replace```是替换当前历史记录,路由跳转时,默认为```push```
  
  3. 如何开启```replace```模式```<router-link replace ......></router-link>```

### 9.便程式路由导航

   1. 作用:不借助```<router-link>```实现路由跳转,让路由跳转更加灵活

   2. 基本编码:

      ```js
        //$router的两个API
        this.$router.push({
          name:'detail',
          query:{id:m.id,tittle:m.tittle}
        })
      
        this.$router.replace({
          name:'detail',
          query:{id:m.id,tittle:m.tittle}
        })
      
        this.$router.back()//前进
      
        this.$router.back()//后退
      
        this.$router.go()//可前进也可后退
      ```

### 10.缓存路由组件

   1. 作用:让不展示的路由组件保持挂载,不被销毁

   2. 具体编码:

      ```js
      <keep-alive include="News">
         <router-view></router-view>
      </keep-alive>
      ```

### 11.两个新的生命钩子

   1. 作用:路由组件所独有的两个钩子,用于捕获路由组件的激活状态

   2. 具体名字:

      1. ```activated```路由组件被激活时触发  
      2. ```deactivated```路由组件失活时触发  

### 12.路由守卫

   1. 作用:对路由进行权限控制

   2. 分类:全局守卫,独享守卫,组件内守卫

   3. 全局守卫:

   ```js
   //全局前置路由守卫---初始化的时候被调用,每次路由切换之前被调用
   router.beforeEach((to, from, next) => {
     console.log("前置路由守卫",to,from)
     if (to.meta.isAuth) {//判断是否需要权限
       if (to.path === "/home/news" || to.path === "/home/message") {
         if (localStorage.getItem("school") === "waiguoyu") {
           next()
         } else {
           alert("无权限查看")
         }
       } else {
         next()
       }
     }
   })

  //全局后置路由守卫---初始化的时候被调用,每次路由切换之后被调用
  router.afterEach( route => {
    document.title=route.meta.tittle || "🦁"
  })
  export default router
   ```

   4. 独享守卫

   ```js
   beforeEnter:(to, from, next) => {
              if (to.meta.isAuth) {//判断是否需要权限
                if (to.path === "/home/news" || to.path === "/home/message") {
                  if (localStorage.getItem("school") === "waiguoyu") {
                    next()
                  } else {
                    alert("无权限查看")
                  }
                } else {
                  next()
                }
              }
            }
          }
   ```

5. 组件内守卫:

   ```js
   //进入守卫,通过路由规则,进入该组件
   beforeRouterEnter(to,from,next){},
   //离开守卫,通过路由规则,离开该组件
   beforeRouterLeave(to,from,next){}
   ```

### 13.路由器的两种工作模式

1. 对于一个url来说，什么是hash值？—— #及其后面的内容就是hash值。

2. hash值不会包含在 HTTP 请求中，即：hash值不会带给服务器。

3. hash模式：

   1. 地址中永远带着#号，不美观 。
   2. 若以后将地址通过第三方手机app分享，若app校验严格，则地址会被标记为不合法。
   3. 兼容性较好。

4. history模式：

   1. 地址干净，美观 。
   2. 兼容性和hash模式相比略差。
   3. 应用部署上线时需要后端人员支持，解决刷新页面服务端404的问题。

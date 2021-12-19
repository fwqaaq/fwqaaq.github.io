---
title: vue2的生命周期,内置关系
date: 2021-9-9 23:22:00
author: Jack-zhang
categories: vue
tags:
   - vue2
   - JS
summary:  vue2生命周期,内置关系
---

## vue的生命周期

![vue生命周期](https://www.zyjcould.ltd/img/markdownlifecycle.png)

1. ```beforeCreate```:在实例初始化之后,数据观测和时间配置之前被调用,此时的组件选项还没有被创建,el和data未初始化

2. ```created```:实例已完成以下配置：数据观测、属性和方法的运算，watch/event事件回调，完成了data 数据的初始化，el没有.然而，挂在阶段还没有开始, ```$el```属性目前不可见.此时可以调用```methods```中的方法，改变```data```中的数据，并且修改可以通过vue的响应式绑定体现在页面上，，获取computed中的计算属性等等

> <span style="color:red">注意:这个周期中是没有什么方法来对实例化过程进行拦截的，因此假如有某些数据必须获取才允许进入页面的话，并不适合在这个方法发请求，建议在组件路由钩子beforeRouteEnter中完成</span>

3. ```beforeMounted```挂载之前被调用,相关的```render```函数首次被调用(虚拟DOM),此时data里的数据和模板生成html,el和data初始化完成,但还没有挂载html到页面上

4. ```mounted```:挂载完成,将模板中的html渲染到页面,由于mounted只会执行一次,此时一般做些<span style="color:red">ajax,启动定时器,绑定自定义事件,订阅等操作</span>

5. ```beforeUpdate```:在数据更新之前被调用，发生在虚拟DOM重新渲染和打补丁之前，可以在该钩子中进一步地更改状态，不会触发附加地重渲染过程

6. ```updated```:数据更改会导致地虚拟DOM重新渲染和打补丁就会调用，调用时，组件DOM已经更新，所以可以执行依赖于DOM的操作，然后在大多是情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环，该钩子在服务器端渲染期间不被调用

7. ```beforeDestory```:清除定时器,解绑自定义事件,取消订阅等收尾工作,然而并不会在beforeDestroy操作数据,因为即使操作数据,也不会更新流程,只能用this读到数据

8. ```destroyed```:调用后，所以的事件监听器会被移出，所有的子实例也会被销毁，该钩子在服务器端渲染期间不被调用

## 缓存组件的两个生命钩子```activated和deactivated```

* 思考:当切换不同的组件时，有时会想保持这些组件的状态，以避免反复重渲染导致的性能问题。这时就可以用 \<keep-alive>将其动态组件包裹起来.

>\<keep-alive>包裹的动态组件会被缓存，它是一个抽象组件，它自身不会渲染一个dom元素

* **activated**：在vue对象存活的情况下，进入当前存在activated()函数的页面时，一切到改页面就触发.
  
> <span style="color:red">有的时候我们的单页面在每次切换时需要重新请求数据</span>.由于单页面A切换时只在第一次调用```created,mounted```这些生命钩子,这时就需要使用activated.在切换到组件B，这时组件A的```deactivated```的生命周期函数会被触发；在切换回组件A，组件A的```activated```生命周期函数会被触发.

* **deactivated**:当离开组件A，切到组件B之前，需要对组件A做某些处理，比如清除定时器，这时就需要使用deactivated.

## 路由导航守卫

> 对路由跳转前后进行一些验证

| 值                | 属性             | 描述                                      |
| ----------------- | ---------------- | ----------------------------------------- |
| beforeEach        | 全局             | 初始化的时候被调用,每次路由切换之前被调用 |
| afterEach         | 全局             | 初始化的时候被调用,每次路由切换之后被调用 |
| beforeRouteEnter  | 局部(组件内)     | 在路由进入时执行                          |
| beforeRouteUpdate | 局部(组件内)     | 在路由更新时执行                          |
| beforeRouteLeave  | 局部(组件内)     | 在路由离开时执行                          |
| beforeEnter       | 局部(路由配置中) | 加载到页面之前执行                        |

* **路由守卫参数**

>* ```to :Router```：即将要进入的目标 路由对象
>* ```from :Router```: 当前导航正要离开的路由
>* ```next :Function```: 执行下一步。 需要注意的是一定要调用next，否则路由对应的组件不会进行渲染

   1. ```next()```: 进行下一个路由组件。如果全部钩子执行完了，则导航的状态就是 ```confirmed``` (确认的)。
   2. ```next(false)```: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
   3. ```next('/')``` 或者 ```next({ path: '/' })```: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。可以向 next 传递任意位置对象，且允许设置诸如 ```replace: true、name: 'home'``` 之类的选项以及任何用在 ```router-link 的 to prop 或 router.push``` 中的选项。
   4. next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给```router.onError()``` 注册过的回调。

* <span style="color:red">注意:</span>局部的守卫，是在组件内部或路由配置的内部进行使用，而全局的路由守卫是在路由配置项中去使用的

* ```beforeEach```:接收```to,from,next```.即路由拦截,用来做一些进入页面的限制.比如没有登录，就不能进入某些页面，只有登录了之后才有权限查看某些页面(初始化的时候被调用,每次路由切换之前被调用)
* ```afterEach```:只接受```to,from```.也是路由拦截,不会接受 ```next``` 函数也不会改变导航本身.比如用来清除过期的```token```(初始化的时候被调用,每次路由切换之后被调用)
* ```beforeRouteEnter```:接收```to,from,next```,验证用户登录,vip是否到期,权限验证,消息提示.
  * <span style="color:red">注意: 此时相对应的组件还没有进行渲染,所以无法使用```this```</span>
  * 解决:默认不可以.想要fangwenthis的指向,可以在next这个函数中的参数获取.参数即是实例vm

  ```js
   beforeRouteEnter(to, from, next) {
    if (to.meta.requireAuth) {
      var token = localStorage.getItem("token");
      if (token) {
        next();
      } else {
        next(vm => {
          vm.$router.push({ name: "login", params: { toPath: to.path } });
        });
      }
    } else {
      next();
    }
  }

  ```

* ```beforeRouteLeave```:接收```to,from,next```.用户支付,答题系统,记录历史记录,注销,切换账号.
* ```beforeRouteUpdate```:接收```to,from,next```,在组件没有经历创建和销毁，但是路由发生改变的时候需要执行的生命周期.当页面组件没有发生改变，只是路由变化时，```created()```是不会再次执行，因为这个生命周期只有在组件创建的时候才会调用.
* ```beforeEnter```:接收```to,from,next```,与全局路由配置一样

## 路由的懒加载

> 常用的两种加载方式:**ES中的import**和**vue异步组件**

* 路由懒加载的原因
  * 官方解释:
     1. 当打包构建应用时,js的包会非常大,影响页面加载
     2. 如果我们能把不同路由对应的组件分割成不同的代码块.然后当路由被访问的时候才加载对应组件,这样就更加高效
  * 官方的意思
     1. 首先路由中会定义很多不同的页面
     2. 这个页面打包会在一个js文件中
     3. 然而这就造成页面非常的法,当我们一次性从服务器请求下来这个页面可能需要花费一定的事件,甚至用户的电脑还出现白屏
  * 路由的懒加载:
      1. 路由的懒加载主要就是将路由对应的组件打包成一个个js代码块
      2. 只有在路由被访问到的时候,才加载对应组件

* **未使用路由懒加载**

```js
import Home from "../components/Home"
import About from "../components/About"

Vue.use(VueRouter)

const routes=[
   {
      path:"/home",
      component:Home
   },
   {
      path:"/about",
      component:About
   }
]
```

* **使用ES懒加载**

```js

const routes=[
   {
      path:"/home",
      component:()=>import("../components/Home")
   },
   {
      path:"/about",
      component:()=>import("../components/About")
   }
]
```

* **使用vue异步组件懒加载**

```js
const routes=[
   {
      path:"/home",
      component:resolve=>require(["../components/Home"],resolve)
   },
   {
      path:"/about",
      component:resolve=>require(["../components/About"],resolve)
   }
]
```

## vue中重要的内置关系

![vue生命周期](https://www.zyjcould.ltd/img/markdown6.vue%E7%BB%84%E4%BB%B6%E5%86%85%E7%BD%AE%E5%85%B3%E7%B3%BB.png)

> 1. 一个重要的内置关系:```VueComponent.prototype.__proto__===Vue.prototype```
> 2. 为什么要有这个关系:让<span style="color:red">组件实例对象(vc)可以访问到Vue中的原型上的属性,方法</span>

* 关于VueComponent:
  1. ```element```组件本质是一个名为```VueComponent```的构造函数,且不是程序员定义的,是Vue.extend生成的
  2. 只需要写\<element></element>或者</element>,Vue解析时就会帮助我们创建```element```组件的实例对象,即Vue帮我们执行的:```new VueComponent(options)```
  3. 特别注意:每次调用Vue.extend,返回的都是一个全新的VueComponent!!!
  4. 关于this的指向:
     1. 组件配置中:
        data函数,methods中的函数,computed中的函数  他们的this指向均是[VueComponent实例对象]
     2. new Vue()配置中
        ata函数,methods中的函数,computed中的函数  他们的this指向均是[Vue实例对象]
---
title: VueRouter
date: 2021-09-28 19:03:00
categories: Vue
tags:
   - Vue
   - JavaScript
   - TypeScript
summary:  vueRouter 创建单页应用程序的方式
---

## 动态路由

- 将给定匹配模式的路由映射到同一个组件

> 在 Vue Router 中，我们可以在路径中使用一个动态字段来实现，我们称之为 路径参数

```js
{
  path:"/user/:id",
  component:()=>import("../pages/User.vue")
}
```

- 在`router-link`中进行跳转

```html
<router-link to="/user/123">用户 123</router-link>
```

### 动态路由取值

#### 在 template 中

- 通过 $route.params 获取值

```html
<template>
  <div>
    <h2>用户界面:{{$route.params.id}}</h2>
  </div>
</template>
```

#### 在 setup 中

- 使用用 `vue-router`库给我们提供的一个 hook `useRoute`

```js
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    console.log(route.params.id);
  },
};
```

### 匹配多个值

| 匹配模式            | 匹配路径            | `$route.params`               |
| ------------------- | ------------------- | ----------------------------- |
| /users/:user        | /users/lisi         | `{ user: 'lisi' }`            |
| /users/:user/id/:id | /users/:lisi/id/123 | `{ user: 'lisi', id: '123' }` |

## NotFound 页面

> 对于哪些没有匹配到的路由，可以编写一个动态路由将他们匹配到固定的某个页面

```js
{
  path:"/:pathMatch(.*)",
  component:()=>import("../pages/NotFound.vue")
}
```

- 可以在 `template` 中使用 `$route.params.pathMatch` 获取路径参数
  - 例如：`user/hhh/111`
- 注意在 `/:pathMatch(.*)` 后面又加了一个 `*`，即 `/:pathMatch(.*)*` 时
  - `$route.params.pathMatch` 获取路径参数是一个数组 ["user","hhh","111"]

## 嵌套路由

> 使用嵌套路由配置来表达某些应用程序的 UI 由嵌套多级的组件组成

```js
const routes = [
  {
    path: '/home',
    component: ()=>import("../pages/Home.vue"),
    children: [
      {
        path: '',
        redirect:"/home/product"//重定向
      },
      {
        path: 'product',
        component:component:()=>import("../pages/HomeProduct.vue"),
      },
    ],
  },
]
```

- 以`/`开头的嵌套路径将被视为根路径，这将更好的利用组件嵌套

## \<router-link>

### 代码的页面跳转

| 声明式                   | 程序化             |
| ------------------------ | ------------------ |
| \<router-link :to="..."> | `router.push(...)` |

#### 使用 router.push(...)

- 使用字符串地址`router.push('/users/123')`
- 使用对象地址`router.push({'/users/123'})`
- 使用命名路由并携带 params 参数：

```js
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    router.push({ name: "user", params: { username: "eduardo" } });
  },
};
```

- 携带 query 参数：
  - `router.push({path:'/register',query:{plan:'private'})`

- 使用可重复使用的 params 时，使用 name 属性，或者 path 这样编写`/user/${username}`

### 替换当前位置

> 使用 push 的特点是压入一个新的页面，那么在用户点击返回时，上一个页面还可以回退，但是如果希望当前页面是一个替换操作，那么可以使用`replace`

| 声明式                           | 程序化                |
| -------------------------------- | --------------------- |
| \<router-link :to="..." replace> | `router.replace(...)` |

### custom

> custom 选项防止 \<router-link> 将其内容包装在 \<a> 元素内
>
> 默认情况下，\<router-link> 将呈现其内容包裹在一个 \<a> 元素，即使使用 `v-slot`。使用 `custom`，删除该行为

```html
<router-link to="/home" custom v-slot="{navigate,href,route}">
  <a :href="href" @click="navigate">{{ route.fullPath }}</a>
</router-link>
```

### router-link 中的 v-slot

```html
<router-link
  to="/about"
  custom
  v-slot="{href,route,navigate,isActive,isExactActive}">
  <p @click="navigate">跳转 about</p>
  <div>
    <p>href:{{href}}</p>
    <p>route:{{route}}</p>
    <p>isActive:{{isActive}}</p>
    <p>isExactActive:{{isExactActive}}</p>    
  </div>
</router-link>
```

- `href`解析后的 url
- `route`解析后的规范化的 route 对象
- `navigate`触发导航的函数
- `isActive`是否匹配的状态
- `isExactActive`是否是精准匹配的状态

### 其它 api

> 参考<https://next.router.vuejs.org/api/#aria-current-value>

## router-view

- \<router-view> 公开一个 `v-slot` API，主要是用 \<transition> 和 \<keep-alive> 组件包装你的路由组件

```html
<router-view v-slot="{Component}">
  <transition name="why">
    <component :is="Component"></component>
  </transition>
</router-view>
```

## 动态的添加删除路由

### 添加路由

- 某些情况下我们可能需要动态的来添加路由
  - 如根据用户不同的权限，注册不同的路由
  - 可以使用一个方法 `addRoute`

- 直接添加顶级路由，参数只要传一个动态路由的名称
- 或者是为路由添加子路由，那么还应该传入对应的 name 属性

```js
const about = {
  path: "id",
  component: () => import("../pages/About"),
};

router.addRoute("home", about);
```

- 如果新增加的路由的位置与原有的路由相匹配，那就需要你手动导航与`router.push()`或`router.replace()`以显示新的路线

### 删除路由

- 添加一个 name 相同的路由
- 通过`removeRoute`方法，传入路由的名称
- 通过`addRoute`方法的返回值回调

```js
//添加一个 name 相同的路由
router.addRoute({ path: "/about", name: "about", component: About });
router.addRoute({ path: "/home", name: "about", component: Home });
//通过 removeRoute 方法，传入路由的名称
router.addRoute({ path: "/about", name: "about", component: About });
router.removeRoute("about");
//通过`addRoute`方法的返回值回调
const removeRoute = router.addRoute({
  path: "/about",
  name: "about",
  component: About,
});
removeRoute();
```

### 其他 API

- `router.hasRoute()`检查路由是否存在。
- `router.getRoutes()`获取一个包含所有路由记录的数组

## useLink 和 RouterLink

> Vue Router 将 `RouterLink` 的内部行为公开为 Composition API
> 函数。它提供访问与`v-slot`API 相同的属性

```js
import { RouterLink, useLink } from "vue-router";
export default {
  name: "App",
  props: {
    ...RouterLink.props,
  },
  setup(props) {
    const { route, href, isActive, isExactActive, navigate } = useLink(props);
    return { href, navigate, isActive };
  },
};
```

## 路由守卫

> 路由守卫的触发时机

- 导航被触发。
- 在失活的组件里调用 beforeRouteLeave 守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫 (2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 调用 beforeRouteEnter 守卫中传给 next
  的回调函数，创建好的组件实例会作为回调函数的参数传入。

> Vue router
> 提供的路由守卫主要用于通过重定向或取消路由来保护路由。有多种方法可以连接到路由导航过程:全局，每个路由或组件内

- 接收两个参数
  - to 即将进入的路由 Route 对象
  - from 即将离开的路由 Route 对象

- return 返回值
  - false 取消当前导航
  - 不返回或者 undefined 进行默认导航
  - 返回一个路由地址
    - 可以是一个 string 类型的路径
    - 可以是一个对象，对象中包含`path,query,params`等信息

- 第三个参数`next`在 vue3 中已经不推荐使用

### 全局路由守卫 (beforeEach)

> 用来做一些进入页面的限制。比如没有登录，就不能进入某些页面，只有登录了之后才有权限查看某些页面 (初始化的时候被调用，每次路由切换之前被调用)

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  return false
})
```

### 路由独享守卫 (beforeEnter)

> beforeEnter 守卫只在进入路由时触发不会在 params,query 或 hash 改变时触发

```js
const routes = [
  {
    path: "/users/:id",
    component: UserDetails,
    beforeEnter: (to, from) => {
      return false;
    },
  },
];
```

### 全局后置后卫

> 不会接受返回值也不会改变导航本身。用于分析、更改页面标题、声明页面等辅助功能

```js
router.afterEach((to, from) => {
  //...
})
```

### 组件内守卫

参考 <https://next.router.vuejs.org/zh/guide/advanced/composition-api.html#%E5%AF%BC%E8%88%AA%E5%AE%88%E5%8D%AB>

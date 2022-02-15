---
title: nuxt
date: 2022-02-12 17:21:52
author: Jack-zhang
categories: vue
tags:
   - JS
   - TS
   - vue
summary: nuxt基础
---

>`npx nuxi init nuxt-app`:首先得初始化一个nuxt3的项目

## pages

>Nuxt 会自动将 `Vue Router` 和 `map` 目录集成到应用程序的路由中(pages)

1. \<NuxtWelcome>:nuxt的欢迎页面
2. \<NuxtPage>:展示页面,相当于\<router-view>
3. \<NuxtLink>:导航链接,相当于\<router-link>
4. \<NuxtChild>:嵌套路由中显示子组件

>动态路由:在pages中使用`[]`表示动态的路由

```shell
-| pages/
---| index.vue
---| users-[group]/
-----| [id].vue
```

* 在`index.vue`中,写入动态部分

```vue
<NuxtLink to="/user-admin/1">user-admin/1</NuxtLink>
```

* 在全局也可以拿到动态路由数据

```vue
  <p>{{ $route.params.group }}</p>
  <p>{{ $route.params.id }}</p>
```

* 在script中使用`useRoute()`函数也可以拿到动态路由的值

>嵌套路由:由嵌套多个层深的组件组成(其中嵌套的文件夹parent同级下需要一个`parent.vue`)

```shell
-| pages/
---| parent/
------| child.vue
---| parent.vue
```

* 在`parent.vue`中使用\<NuxtChild/>显示`child.vue`中的内容

```vue
<template>
  <div>
    <h1>parent</h1>
    <NuxtChild />
  </div>
</template>
```

* 依然需要在`index.vue`中使用路由链接

```vue
<NuxtLink to="/parent/child">parent</NuxtLink>
```

## 布局(layouts)

> 在nuxt中自定义的布局框架,可以在整个应用程序中使用.可以将重读的UI提取到这个此文件中

```shell
-| layouts/
---| default.vue
```

* 使用`default.vue`用于应用中的所有页面除了(app.vue).`app.vue`依然会是所有页面的入口

```vue
  <div>
    <h1>默认布局</h1>
    <slot></slot>
  </div>
```

>自定义布局:如果不想在所有页面设置属性,就需要在某个页面设置属性(`layout`).并且不能使用`default.vue`,而应该使用别的,例如`custom.vue`.

* 例如我们自定义一个`custom.vue`之后就可以在有需要的页面使用

```ts
definePageMeta({
  layout: 'custom',
});
```

> 使用插槽:可以对页面进行完全的控制.需要使用\<NuxtLayout>并且`layout:false`

* 需要使用的`layout`的页面(类似于父页面)

```vue
<template>
  hhh
  <NuxtLayout name="custom">
    <template #header>
      <h1>这不好吧</h1>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
```

* `layout`的插槽页面`custom`(类似于子页面)

```vue
<template>
  <div>
    <h1>特殊的页面</h1>
    <slot name="header"></slot>
  </div>
</template>
```

## 组件(components)

> 放在该目录的所有组件可以直接将器导入其它页面或者组件中

```shell
| components/
--| TheHeader.vue
```

```vue
<template>
  <TheHeader></TheHeader>
</template>
```

>如果是嵌套目录,那么组件的名称需要加入文件名称

```shell
-| components/
---| test/
-----| hao.vue
```

```vue
```vue
<template>
  <TheHeader></TheHeader>
</template>
```

* 不需要在`script`中使用import导入,直接可以使用

>懒加载:将将前缀(`Lazy'`)添加到组件的名称中.例如`<LazyTheHeader>`

## 获取数据

>`useFetch`,`useLazyFetch`,`useAsyncData`,`useLazyAsyncData`仅在生命周期或者setup中可以使用

### server

>在nuxt项目的根目录,nuxt会自动读取`server/api`下文件的promise或者JSON数据(后端服务器)

```ts
const todos = [
  { id: 1, title: 'nuxt3', completed: false },
  { id: 2, title: 'vue3', completed: true },
]

export default () => todos
```

### useAsyncData

```ts
const {
  data: Ref<DataT>,
  pending: Ref<boolean>,
  refresh: (force?: boolean) => Promise<void>,
  error?: any
} = useAsyncData(
  key: string,
  fn: () => Object,
  options?: { lazy: boolean, server: boolean }
)
```

> 函数参数

1. `key`:保证请求数据不会重复
2. `fn`:返回值的异步函数
3. `options`:
   1. `lazy`:是否在加载路由后解析异步函数，而不是阻塞导航(默认为false,卡顿现象)
   2. `default()`:一个工厂函数，用于在异步函数解析之前设置数据的默认值 (配合`lazy:true`)
   3. `server`:是否在服务器端获取数据(默认为true),用户可以直接浏览到页面
   4. `transform()`:一个函数，可用于在解析后改变fn结果
   5. `pick`:仅从 fn 结果中选取此数组中的指定键.<span style="color:red">只能适用于对象</span>

> 返回值

1. `data`:传入的异步函数的结果
2. `pending`:指示数据是否仍在提取(配合`lazy:true`,可以写一些加载提示器)
3. `refresh`:可用于强制刷新数据的函数
4. `error`:错误对象

```ts
const { data: todos } = await useAsyncData('todos', () => $fetch('/api/todo'));
```

### useLazyAsyncData

> 此方法仅是将`useAsyncData`中的`lazy`设置为true(异步函数不会阻止导航).这得考虑data为null的情况(或者使用`default`给data设置一个默认值)

### useFetch

>`useFetch`是对`useAsyncData`的包装,自动生成key同时推断响应类型

```ts
const {
  data: Ref<DataT>,
  pending: Ref<boolean>,
  refresh: (force?: boolean) => Promise<void>,
  error?: any
} = useFetch(url: string, options?)
```

* Options:
   1. [`ohmyfetch`](https://github.com/unjs/ohmyfetch)
      * `method`:请求方法
      * `params`:查询参数
      * `headers`:请求标头
      * `baseURL`:请求的基本 URL
   2. `useAsyncData`中的也可以使用

```ts
const { data: todos } = await useFetch('/api/todo',
{pick:["data"],transform(input){
   return input
}});
```

## 状态共享

>一般在`composables`中创建`useState()`

### composables

>只有目录顶层的文件(或任何子目录中的索引文件)才会被认定为可组合的文件

```shell
composables
 | - useFoo.ts
 | - useBar
 | --- supportingFile.ts
 | --- index.ts
```

* 可以直接在该目录下使用useState状态管理(不需要任何导入)

```ts
export const useCounter = () => useState('counter', () => 0);
```

* 在组件中使用,不需要任何导入

```ts
const counter = useCounter()
```

## 插件(plugins)

>可以使用文件名或后缀来仅在服务器端(`.server`)或客户端(`client`)加载插件.

```shell
plugins
 | - myPlugin.ts
 | - myOtherPlugin
 | --- supportingFile.ts
 | --- componentToRegister.vue
 | --- index.ts
```

>创建一个简单的插件

```ts
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      hello: () => 'world',
    },
  };
});
```

>导入插件时会自动加上`$`符号区分

```ts
const { $hello } = useNuxtApp();
console.log($hello());
```

### 按需引入组件库

>全局挂载组件`nuxtApp.vueApp.use`

* `npm i vue-devui`

```ts
import { defineNuxtPlugin } from '#app';
import { Button } from 'vue-devui';
import 'vue-devui/button/style.css';
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Button);
});
```

## [pinia](https://pinia.vuejs.org/ssr/nuxt.html)

* 下载:`npm install pinia @pinia/nuxt`
* 在`nuxt.config.ts`中添加模块,如果不想使用vuex可以将`disableVuex`改成false

```ts
buildModules: [['@pinia/nuxt', { disableVuex: true }]]
```

* 在根目录下新建`store/counter.ts`就可以使用了

```ts
import { defineStore } from 'pinia';

export const useStore = defineStore('counter', {
  state() {
    return {
      count: 0,
    };
  },
});

```

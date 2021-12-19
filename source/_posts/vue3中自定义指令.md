---
title: vue3中自定义指令
date: 2021-09-27 20:43:04
author: Jack-zhang
categories: vue
tags:
   - vue3
   - JS
summary: vue3的自定义指令
---

## 指令

- 使用指令的原因
  - 在Vue中，代码的复用和抽象主要还是通过组件
  - 如果你需要对DOM元素进行底层操作，这个时候就会用到自定义指令
- 自定义指令的两种写法
  - 自定义局部指令:组件中通过 `directives` 选项，只能在当前组件中使用
  - 自定义全局指令:app的 `directive` 方法，可以在任意组件中被使用

### 指令的生命周期

- `created`:在绑定元素的 attribute 或事件监听器被应用之前调用
- `beforeMount`:当指令第一次绑定到元素并且在挂载父组件之前调用
- `mounted`:在绑定元素的父组件被挂载后调用
- `beforeUpdate`:在更新包含组件的 VNode 之前调用
- `updated`:在包含组件的 VNode 及其子组件的 VNode 更新后调用
- `beforeUnmount`:在卸载绑定元素的父组件之前调用
- `unmounted`:当指令与元素解除绑定且父组件已卸载时，只调用一次

### 钩子函数参数

- `el`
  - 指令绑定到的元素。这可用于直接操作 DOM。
- `binding`:一个对象，包含以下属性：
  - `instance`：使用指令的组件实例。
  - `value`：传递给指令的值。例如，在 `v-my-directive="1 + 1"` 中，该值为 `2`。
  - `oldValue`：先前的值，仅在 `beforeUpdate` 和 `updated` 中可用。值是否已更改都可用。
  - `arg`：参数传递给指令 (如果有)。例如在 `v-my-directive:foo` 中，`arg` 为 `"foo"`。
  - `modifiers`：包含修饰符 (如果有) 的对象。例如在 `v-my-directive.foo.bar` 中，修饰符对象为 `{foo: true，bar: true}`。
  - `dir`：一个对象，在注册指令时作为参数传递
- `vnode`
  - 作为 el 参数收到的真实 DOM 元素的蓝图
- `prevNode`
  - 上一个虚拟节点，仅在 `beforeUpdate` 和 `updated` 钩子中可用

### 局部自定义指令

- 在组件选项中使用 `directives` 即可
- 它是一个对象，在对象中编写我们自定义指令的名称(注意:这里不需要加v-)
- 自定义指令有一个生命周期，是在组件挂载后调用的 `mounted`，我们可以在其中完成操作

```js
  export default {
    directives:{
      focus:{
        mounted(el){
          el.focus()
        }
      }
    }
  }
```

### 全局自定义指令

```js
app.directive(
  mounted(el){
    el.focus()
  }
)
```

### 自定义指令

- 可以通过自定义计算属性,方法来完成
- 这里使用自定义指令

- 使用时间格式化的指令`v-format-time`
  - 用到了时间格式化的内库`dayjs`
  - 如果封装了多个指令,可以用插件写一个`index.js`文件引入  

```js
import dayjs from 'dayjs'
export default function(app){
  let formaString="YYYY-MM-DD HH:mm:ss"
  app.directive("format-time",{
    created(el,bindings) {
      if(bindings.value){
        formaString=bindings.value
      }
    },
    mounted(el,bindings) {
      let textContent=el.textContent
      let timetamp=parseInt(textContent)
      if(textContent.length===10){
        timetamp=timetamp*1000
      }
      el.textContent=dayjs(timetamp).format(formaString)
    },
  })
}
```

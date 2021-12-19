---
title: vue的一些小tips
date: 2021-8-24 14:23:00
author: Jack-zhang
categories: vue
tags:
   - vue2
   - JS
summary: 一个简单vue项目的tips介绍,内含router等一些简单的注意.
---



## 路由方面的设置

1. 路由的重定向问题:自动跳转到某页面,<span style="color:red">在路由规则routes中</span>,例:```{path:"/",redirect:"/login"}```

2. 路由重定向父组件复用问题:
  
  ```js
  {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome,
        },
        {
          path: "/users",
          component: Users
        }
      ]
    }
  ```

  >关于重定向父组件复用问题:子组件如果是/welcome,默认带/的是根路径=>/welcome,会连同父组件一起复用.如果子组件是welcome,不带/,默认加载/home/welcome

3. 路由的跳转:```this.$router.push("/home")```从当前页面跳转到/home根页面

## 保持Element-UI菜单栏点击之后的高亮

  ```html
  <!-- 一级菜单 -->
  <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
    <!-- 一级菜单的模板去 -->
    <template slot="title">
      <!-- 图标 -->
      <i :class="iconsObj[item.id]"></i>
      <!-- 文本 -->
      <span>{{item.authName}}</span>
    </template>
    <!-- 二级菜单 -->
    <!-- 传入一个菜单栏的根路径,保持唯一性 -->
    <el-menu-item :index="'/'+i.path"  
                  v-for="i in item.children" :key="i.id"
                  @click="saveNavState('/'+i.path)">
    <template slot="title">
        <!-- 图标 -->
        <i class="el-icon-menu"></i>
        <!-- 文本 -->
        <span>{{i.authName}}</span>
      </template>
    </el-menu-item>
  </el-submenu>

  ```

  ```js
  //组件中

  data(){
    //被激活的链接地址
    activePath:""
  },
  methods:{
    //保存连接的激活状态,将唯一路径标识保存在session中
    saveNavState(activePath){
      sessionStorage.setItem("activePath",activePath)
      this.activePath=activePath
    }, 
  },
  //最重要的就是在创造元素的时候读取到标识 
  created() {
    this.activePath=sessionStorage.getItem("activePath")
  }
  ```
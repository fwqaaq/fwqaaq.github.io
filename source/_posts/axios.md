---
title: 关于axios的使用
date: 2021-09-22 14:59:49
categories: JS
tags: 
   - JS
   - Axios
summary: axios使用以及封装
---
## Axios

> 关于axios:是用promise对ajax的封装,支持promise的API

* 关于axios的特点
  1. 基本promise的异步ajax请求库
  2. 浏览器端/node端都可以使用
  3. 支持请求/响应拦截器
  4. 支持请求取消
  5. 请求/响应数据转换
  6. 批量发送多个请求

 | 方法                   | 描述                                       |
 | ---------------------- | ------------------------------------------ |
 | axios.dafaults.xxx     | 请求的默认全局配置                         |
 | axios.create([config]) | 创建一个新的axios(他没有下面的功能)        |
 | axios.Cannel()         | 用于创建取消请求的错误对象                 |
 | axios.CannelToken()    | 是否创建取消请求的token对象                |
 | axios.isCannel()       | 是否是一个取消请求的错误                   |
 | axios.all()            | 用于批量执行多个异步请求                   |
 | axios.spread()         | 用来指定接受所有成功的数据的回调函数的方法 |

### Axios请求的方法

* 以函数的形式发请求
  * 语法: `axios(config)`,config是一个对象{}
  
  ```js
  axios({
    //请求的地址为:"http://localhost:3000/posts?id=1"
    url:"http://localhost:3000/posts",
    method:"GET",
    params:{
      id:1
    },
  }).then(
    response=>{console.log(response.data)},
    error=>{console.log(error.message)}
  )
  ```

* 以对象的形式发送请求
  * 语法:`axios.get(config)`,config是一个对象{}

>常用的请求

| 方法   | 描述                                                                      |
| ------ | ------------------------------------------------------------------------- |
| get    | GET请求是可以缓存的,且GET请求有长度限制，仅用于请求数据(不修改)           |
| post   | 用于将数据发送到服务器以创建或更新资源(非等幂的),多次调用会产生不同的结果 |
| put    | 用于将数据发送到服务器以创建或更新资源(等幂的),多次调用不会产生不同的结果 |
| delete | 用来删除指定的资源，它会删除URI给出的目标资源的所有当前内容。             |

### 拦截器

![拦截器](拦截器.png)

#### 请求拦截器

* 请求拦截器的作用
  * <span style="color:red">添加加载动画或者将本地的token, 携带在请求头给后台...</span>

* 语法:

```js
axios.interceptors.request.use(
      config=>{
        ...
        return config
      },
      error=>{
        ...
        return Promise.reject(error)
      }
    )

```

#### 响应拦截器

* 响应拦截器的作用
  * <span style="color:red">服务器返回登录状态失效，需要重新登录的时候，跳转到登录页...</span>

* 语法:

```js
axios.interceptors.response.use(
      response=>{
        ...
        return response
      },
      error=>{
        ...
        return Promise.reject(error)
      }
    )
```

### 使用js对axios的二次封装

1. 根据指定配置创建一个新的axios，也就是每个新的axios都有自己的配置
2. 新axios只是没有<span style="color:red">取消请求和批量发请求</span>的方法，其它所有的语法都是一致的
3. 由于项目中有部分接口需要的配置与另一个部分接口需要的配置不太一样
   * 解决：创建2个新的axios，每个都有自己特有的配置，分别应用到不同要求的接口请求中

* 在index.js设置axios的实例

```js
import axios from "axios"

const service = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 8000,
  //设置cors跨域,并设置访问权限,允许跨域携带cookie信息
  /* withCredentials为true的情况下，
  后端要设置Access-Control-Allow-Origin为你的源地址，
  例如http://localhost:8080，不能是*，
  而且还要设置header(‘Access-Control-Allow-Credentials: true’); */
  //如果不是同一个域,在这里就需要设置的源地址就是http://localhost:4000
  withCredentials: false,//默认值false
})
//对于拦截器的设定

export default service
```

* 在axios.js中设置请求的方法

```js
import service from "./index"

export function get(url,params){
  return new Promise((resolve,reject)=>{
    service({
      method:"GET",
      url,
      params
    }).then(
      response=>{
        //console.log("get请求成功")
        resolve(response)
      },
      reason=>{
        //console.log("get请求失败")
        reject(reason)
      }
    )
  }) 
}
```

* 在service.js中配置api接口

```js
import {  get } from "./axios"

export const getUserList=(params)=>{
  return get("/users",params)
}
```

### 使用ts对axios封装

* 拦截器存在的位置:
  1. 全局拦截器,所有请求必须经过
  2. 实例拦截器:在实例中使用的拦截器
  3. 请求拦截器:只有特定的请求中才能拦截

#### 拦截器(interceptors)接口封装

>* 对于实例拦截器和请求拦截器并不是必须的,在这里使用可选链进行封装
>* 由于请求中传入传入的数据并不能确定,接口需要用泛型

```ts
import type { AxiosResponse, AxiosRequestConfig } from 'axios'
export interface RequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (config: T) => T
  responseInterceptorCatch?: (error: any) => any
}
export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>
}
```

#### axios类的封装

```ts
import axios, { AxiosInstance } from 'axios'
import { RequestInterceptors, RequestConfig } from './interceptors'
class Service {
  service: AxiosInstance
  interceptors?: RequestInterceptors
  constructor(config: RequestConfig) {
    //创建axios实例
    this.service = axios.create(config)
    //保存基本信息
    this.interceptors = config.interceptors

    //实例才有的拦截器
    this.service.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.service.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
    //添加所有的实例都有的拦截器
    this.service.interceptors.request.use(
      (config) => {
        console.log('所有的实例都有')
        return config
      },
      (error) => {
        return error
      }
    )
    this.service.interceptors.response.use(
      (res) => {
        const { data } = res
        if (data === '-10001') {
          console.log('失败')
        } else {
          return data
        }
      },
      (error) => {
        if (error.response.status === 404) {
          console.log('404')
        }
        return error
      }
    )
  }

  request<T>(config: RequestConfig<T>): Promise<T> {
    return new Promise((reslove, reject) => {
      //请求拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }
      this.service
        .request<any, T>(config)
        .then((res) => {
          //响应拦截器
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          //数据向下传递
          reslove(res)
        })
        .catch((err) => {
          //错误向下传递
          reject(err)
        })
    })
  }
  get<T>(config: RequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
  post<T>(config: RequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  delete<T>(config: RequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
  patch<T>(config: RequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}

export default Service
```

#### 实例的封装

```ts
import Service from './request/axios'
import { BASE_URL, TIME_OUT } from './request/config'
const service = new Service({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      console.log('qingqiuchengg')
      return config
    },
    requestInterceptorCatch: (error) => {
      return error
    },
    responseInterceptor: (config) => {
      return config
    },
    responseInterceptorCatch: (config) => {
      return config
    }
  }
})

export default service
```

#### 出口文件index.ts

> 我会对各种请求接口统一写入出口文件统一暴露,然后在组件中按需引入

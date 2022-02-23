---
title: Express使用
date: 2021-09-21 22:50:56
author: Jack-zhang
categories: JS
tags:
   - JS
   - node
summary: express
---
## Express基础使用

### nodemon修改完代码自动重启

1. `nodemon`基于Node.js开发的一个第三方命令行工具,
2. 安装`npm i nodemon -g`
3. 使用`nodemon app.js`:可以监视你文件的变化(自动重启服务器)

### 基本使用

* 基本配置

```js
const express = require('express')
  const app = express()
  const port = 3000
  
  app.get('/', (req, res) => res.send('Hello World!'))
  app.listen(port, () => console.log(`Example app listening on port port!`))
```

>路由

* 静态路由

```js
app.get('/', function(req, res){
  res.send('Hello World!')
})
app.get('/', function(req, res){
  res.send('Hello World!')
})
```

* 动态路由

```js
app.post('/admin/:id', (req, res) => {
  let id=req.params["id"]
  res.send(id+'Hello World!')
})
```

* 静态服务

```js
/* 公开指定目录 */
app.use("/public/",express.static("./public"))
```

* `request`参数上的一些属性
  * get上的请求:`req.query`,以对象形式接收query参数
  * post上的请求:`req.body`,拿到表单的数据

### 路由的基本使用

> 问题:当挂在了多张表以后,就会出现后面的路由去前面的路由里空跑

* 解决:当你挂在了多个路由表以后,最好使用app.use()进行分类
  * 用户相关的路由,标识符以/users开头
  * 商品相关的路由以/goods开头
  * `app.use("/users",router1)`
  * `app.use("/goods",router2)`
* `app.use()`
  * 第一个参数选填,默认是"*",我们可以写一个标识符
  * 表示以这个字符串开头的标识符,使用后面挂载的内容
  * 第二个参数就是挂载的内容  

* app:引入路由表

```js
const express = require('express')
const router1=require("./route/users")
const router2=require("./route/goods")
const app = express()
const port = 3000
app.use("/users",router1)
app.use("/goods",router2)
app.listen(port, () => console.log(`Example app listening on port port!`))
})
```

* router:封装路由表

```js
const express=require("express")
const router=express.Router()
router.get("/a",(req,res)=>{
  res.send("laji")
})
router.post("/a",(req,res)=>{
  res.send("haoei")
})
module.exports=router
```

## Express中间件

* 结构图:![中间件](中间件.png)

>中间件:
>>在两个事情中间,给你断开,加入一个内容,加入的这个内容,可以做一些事情,可以继续走下一条路next
>>根据加入位置的不同,叫做不同的名字:

* 全局中间件:`req,res,next`
  1. 所有请求都要经历,直接挂载到app上
  2. `app.use(function(){})`
* 路由级中间件`req,res,next`
  1. 进入路由表,到匹配对应请求表示之间添加的
  2. 只对当前这个路由表生效
  3. `app.use(function(){})`
  * 例如:`express.Router()`
* 路由应用级中间件`req,res,next`
  1. 书写在路由表中
  2. 再匹配到指定路径标识符以后,事件处理函数事件
  3. 只对匹配到的该路由标识符生效
  4. router.get("路径标识符",中间件函数,路由处理函数)
* 全局错误处理中间件`error,req,res,next`
  1. 一般书写在服务的最后
  2. 一般用来返回最终结果
  3. `app.use((error,req,res,next)=>{})`

### 全局错误处理中间件

> 全局错误处理中间件是处理路由产生的错误,所以一定要写在路由表的后面

```js
app.use((error,req,res,next)=>{
  res.send({message:error,code:0,username:req.username})
})
```

### 解析请求体(全局中间件)

* espress对于地址后面的参数做了单独处理
* get形式的参数,req里有query成员=>里面就是解析好的请求参数

* 使用express内置
  * 挂载在服务上,在进入路由之前,解析好请求体
  * 挂载`express.urlencoded()`
  * 挂载以后,会在req里添加一个新的成员叫做body
  * 里面就是所有请求的请求体信息

```js
const express=require("express")
const cors = require('cors')
const testRouter=require("./route/test")
const app=express()
app.use(cors())//解决跨域
app.use(express.urlencoded())//直接挂载一个解析请求体的方式
app.use(express.json())
app.use(testRouter)//路由表一定要在最后写
app.listen(3000,()=>{
  console.log("chenggong")
})
```

* 跨域的最终解决方案,`cors`

### 文件上传(路由应用级中间件)

* 单文件上传
  * 接收文件:在服务器准备一个用来存储文件的文件夹
  * 需要插件帮助
    1. multer  下载  配置  使用multer配置一个接收器
    2. `multer({dest:"存放文件的路径"})`
  * 使用接收器:哪一个路由接收文件,配置在哪一个路由上
    1. 写在路由标识符后面,路由处理函数的前面
    2. 接收器,single("前端上传的文件key")  
* <span style="color:red">注意:会把你的文件存储起来,但是没有后缀,随机命名</span>

```js
//导入multer插件
const multer = require('multer')
//使用multer去生成一个接收器(接收文件存储在指定目录)
const fileUpload=multer({dest:"../uploads"})
router.post("/upload",fileUpload.single("avatar"),(req,res)=>{
  console.log("chi")
  console.log(req.file)
})
```

* 复杂单文件上传(只需在单文件上传的基础上,配置一个仓库信息即可)
  * 生成一个仓库信息

```js
  multer.diskStorage({      
    destitnation:function(){}//设定存储路径
    filename:function(){}//设定文件名称
  })
```

注意:<span style="color:red">返回值:一个仓库信息,使用multer生成一个收集器,接收器里配置一个仓库信息,语法:`multer({storage:仓库信息})`</span>

* 参数
  * req,本次请求信息
  * file,本次请求的文件

```js
//使用multer生成一个仓库信息
const storage=multer.diskStorage({
  destination:function(req,file,callback){
    //callback.回调函数来设定存储路径
    //第一个参数null,表示不要修改的二进制流文件
    callback(null,"../uploads")
  },
  filename:function(req,file,callback){
    //callback.回调函数来设定文件名称
    //从file信息里把后缀名拿出来,自己拼接随机数
    const tem=path.extname(file.originalname)
    callback(null,`avatar_${new Date().getTime()}-${Math.random().toString().slice(2)}+${tem}`)
  }
})
```

* 单名称多文件上传(在复杂单文件基础上改使用方法)
  * `single`方法是专门接收单文件:<span style="color:red">一个名称一个文件</span>
  * `array` 方法是专门接收多文件:<span style="color:red">一个名称多个文件</span>
    * 后面的路由处理函数里面就不能接收`req.file`
      * file只是接收单文件
      * files接收多文件  (以一个数组的形式接收file信息)

```js
router.post("/upload",fileUpload.array("avatar"),(req,res)=>{
  console.log("接收请求信息")
  console.log(req.files)
})
```

* 多名称多文件(在复杂单文件基础上改使用方法)
  * `field` 方法就是专门接收多文件:多个名称配多个文件

```js
fileUpload.fields([
  {name:"avatar"},
  {name:"photo"}
])
```

### cookie&session(全局中间件)

#### cookie

* `cookie-parser` 的使用:专门操作cookie的插件
* 挂载到服务上:会在req上添加一个cookies的成员并且里面有所有的cookie信息.且res上会添加一个叫做cookie的方法

* 设置cookie使用的方法<span style="color:red">挂载到路由的前面
使用</span>
  * 获取cookie,用`req.cookies()`
    * `req.cookies`得到一个对象{},里面是所有的cookie信息
    * 没有cookie得到一个空对象{}  
  * 设置cookie,使用`res.cookies()`
    * 语法:`res.cookie(key,value,{options})`
    * options:里面配置  路径 域名  过期时间
    * `res.cookie("c",300)`,默认会话级别(session)
    * maxAge表示过期时间,会按照毫秒计算

#### session

> `express-session`的插件:专门与express的框架结合生成一个session空间

* 导入
* 挂载到服务上
  * `express-sessiom`会操作cookie,而且自动操作cookie
  * `app.use(session({对session空间的配置}))`
    1. `secret`:加密口令
    2. `saveUninitialized`:未初始化的时候要不要存储内容,默认是true
    3. `resave`:重新存储,一般开城true,表示每一次session修改的时候都会重新存储
    4. `name`:设置cookie的属性
    5. `cookie`:设置cookie的存储配置
* 使用
    > 会在req上添加一个成员叫做session是一个对象空间,我们可以向里面添加一些成员内容.当你第一次存储内容的时候,就已经把内容存进去
  * 解释:`express-session`插件会自动生成一个session id.自动将这个id分成两半,一半放在cookie里面,一半放在服务器的内存里
  * 属于服务器的一般session id是存储在内存中,一旦服务器重启,数据就消失
  * 解决:持久化存储,存储在数据库里,
    * `express-session`有一个配置项叫做store
    * 依赖于第三方插件 connect-mongo

**connect-mongo** : 选用3.2.0的数据库

* 使用`connectMongo` 和`session`关联
* 在配置session的时候配置使用
  * 在session的挂载配置里面添加

  ```js
  store:new MongoStore({
    url:""你的存储位置,
    touchAfter:1000*10z //自动延长过期时间.至少设置一天(不推荐设置)
  })//过期会自动删除
  ```

```js
const express = require('express')
const router=require("./router/router")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const MongoStore=require("connect-mongo")(session)
//关联session
const app = express()
//挂载到服务上
app.use(cookieParser())
//挂载session
app.use(session({//进行配置
  secret:"zhangsan",
  name:"sessionid",
  saveUninitialized:false,
  resave:true,
  cookie:{maxAge:1000*30},
  store:new MongoStore({
    //你存储到mongodb的哪一个位置
    url:"mongodb://localhost:27017/db"
  })
}))
app.use(router)
app.listen(3000, () => console.log(`Example app listening on port port!`))
```

* 注意:
  1. 打开页面就默认登录成功了(默认登录成功)
  2. 在session空间里面有一个数据,表示我登陆成功了
  3. 如果你需要存储,`req.session.name=value`

* 访问session空间
  * 里面如果有这个信息,表示登陆过,就正常显示页面
  * 如果没有之前存储的信息,表示没有登录,或者一半session id是假的
  * 直接跳转回登录页
  * 在这里`req.session.username="张三"`,如果是undefined,回到login
  * 如果`req.session.username==="张三"`表示登陆过

### token凭证(全局中间件)

#### 跨域产生的问题

>浏览器的同源策略导致的问题：不允许JS访问跨域的Cookie，所以我们没办法存取值

* session 持久化存储:一人一半密码,一半在服务器,一半在cookie
* 如果想要持久保持登录状态
  1. 服务器不能变
  2. 可以设置cookie
* session的缺点
  1. 需要保证同一台服务器,不能更换服务器
  2. 保证cookie可以设置,跨域以后cookie不能设置
  3. 容易被伪造

> 解决跨域问题

* 客户端:需要设置`withCredentials` 属性为 true
* 服务端:同时服务端的响应中必须携带 `Access-Control-Allow-Credentials: true` 首部。如果服务端的响应中未携带`Access-Control-Allow-Credentials: true` 首部，浏览器将不会把响应的内容返回给发送者

* 注意规范中提到，<span style="color:red">如果 XMLHttpRequest 请求设置了withCredentials 属性，那么服务器不得设置 Access-Control-Allow-Origin的值为*</span> ，否则浏览器将会抛出`The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*'` 错误

#### token凭证的使用

* 为什么需要token
  1. http无状态
  2. session无法跨服务器
  3. 跨域以后cookie无法使用
  4. token是三段式的加密字符串:第一段和第三段是不可逆加密哈希散列,第二段是base64可逆

* token验证登录
  >三段式加密字符串:header(算法).payload(数据).signature(签名信息)
  >>
  >> * 第一段:头,签证:安全信息验证,你的口令,进行不可逆加密
  >> * 第二段:你要保存的信息:将`header`和`payload`base64编码后进行算法运算得到签名信息
  >> * 第三段:额外信息:不可逆加密
  >>
  >>>  这一段字符串由后端发给前端.在登陆过以后,生成一个token给前端,前端保存这个token如果前端需要登录后查看页面,或者登陆后发送的请求,只要你把token带回来,解密一下

* jwt的使用
  * 下载第三方包:npm i jsonwebtoken
  * 生成:`jwt.sign(保存的信息,口令,参数)`
    * 保存的信息  
    * 口令:加密口令,加密的时候混入信息使用,解密的时候还要这个口令
    * 参数:是一个对象,`{expiresIn:过期事件,单位为秒("1d")}`
  * 解码:`jwt.verify(要解析的token,口令,回调函数)`
    * token:必须是一个指定的token
    * 口令:必须是加密时候的口令
    * 回调函数的形式接收结果  

```js
const result=jwt.sign(usrInfo,"zhangsanfeng",{expiresIn:10})
//console.log(result)

jwt.verify(result,"zhangsanfeng",(error,data)=>{
  if(error){
    console.log(error)
  }
  console.log(data)
})
```

* 验证token:使用`express-jwt`
  * express框架和jwt结合的第三方中间件
  * 下载:npm i express-jwt
  * 使用:注册为中间件:`app.use(expressJWT({配置}).unless({配置}))`
  * 如果要使用express-jet:必须要有一个全局配置错误处理中间件
  * 注意:<span style="color:red">正常的token返回给前端写成 "Bearer "+ token</span>,`Bearer`后面一定要由空格

```js
//注册token验证中间件
app.use(expressJWT({
  //解析口令,需要和加密的时候一致
  secret:"zhangsan",
  //加密方式:SHA256,加密方式在express-jwt里面叫做HS256
  algorithms:["HS256"]
}).unless({
  //不需要验证token的路径标识符
  path:["/login","/banner"]
}))
//错误处理中间件
app.use((err,req,res,next)=>{
  console.log("错误处理中间件")
  console.log(err)
})
```

### 服务端页面渲染

* `express-art-template`插件:专门和express结合的art-template模板引擎

* 注意
  * 使用:`express-art-template`插件的时候(只负责与express结合)
  * 必须下载:`art-template`插件
* 配置:
  * 语法:`app.engine(后缀名,在引擎上配置哪个内容)`
  * 例如:`app.engine("html",require("express-art-template"))`
  * 其中,在这里配置好`express-art-template`,会自动引入`art-template`
* 使用:
  * 在引擎上配置好以后,`express-art-template`,会在res上添加一个方法叫做`render()`
  * 语法:res.render(路径,对象)
    * 例如:`res.render("./login.html",{})` 
  * 路径:默认是服务器根目录(app.js所在目录)下的views文件夹里面的路径
  * a.html-->views/a.html:会自动读取这个匹配的文件
  * 对象:成员,就是在指定文件里面使用的数据`{name:"jack"}`
  * 作用:
    1. 自动取views文件夹里面按照你的路径读取文件
    2. 自动按照 模板引擎 组装好你的页面
    3. 自动把这个拼接好的页面返回给前端

## MVC开发模型

* 结构图:![mvc](mvc.png)
  
>MVC 模式代表 Model-View-Controller（模型-视图-控制器） 模式。这种模式用于应用程序的分层开发。

* `Model`（模型） - 模型代表一个存取数据的对象或 JAVA POJO。它也可以带有逻辑，在数据变化时更新控制器。
* `View`（视图） - 视图代表模型包含的数据的可视化。
* `Controller`（控制器） - 控制器作用于模型和视图上。它控制数据流向模型对象，并在数据变化时更新视图。它使视图与模型分离开

* 举例:![封装一个项目](mvc封装式开发.png)
  * config:配置
  * controllers:路由处理函数控制器
  * db:数据库模型封装
  * middleware:路由中间件的封装
  * model:对数据库操作的封装
  * routes:路由表的封装
  * utils:工具类
  * app:引入

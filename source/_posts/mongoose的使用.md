---
title: mongoose的使用
date: 2021-8-25 16:15:55
author: Jack-zhang
categories: mongodb
tags:
   - mongodb
summary: Mongoose是在node环境中操作MongoDB数据库的一种便捷的封装，一种对象模型工具
---

## 前言

> Mongoose库简而言之就是在node环境中操作MongoDB数据库的一种便捷的封装，一种对象模型工具，类似ORM，Mongoose将数据库中的数据转换为JavaScript对象以供你在应用中使用

1. 下载安装 ```Mongoosenpm i mongoose --save```
2. 在项目中引入mongoose ```const mongoose = require('mongoose');```
3. 连接MongoDB数据库 ```mongoose.connect('mongodb://localhost:27017/数据库名', {useNewUrlParser: true, useUnifiedTopology: true});```
4. 断开数据库的连接(一般不需要) ```mongoose.disconnect()```
5. 监听MongoDB数据库的连接状态
  
- 在mongoose对象里,有一个属性叫做connection,该对象表示的就是数据库的连接
  - 通过监听该对象的状态,可以来监听数据库的连接与断开
    - 数据库连接成功的事件:```mongoose.connction.once("open",function()())```
    - 数据库连接失败的事件:```mongoose.connection.once("close",function()())```

```js
//例:
const mongoose = require('mongoose');
//连接数据库
mongoose.connect('mongodb://localhost:27017/mongoose_test', {useNewUrlParser: true, useUnifiedTopology: true});
//绑定监听
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("绑定成功")
});

//断开数据库连接
mongoose.disconnect()
```

## Schema,Model,Document

### Schema的类型

- String      字符串
- Number      数字
- Date        日期
- Buffer      二进制
- Boolean     布尔值
- Mixed       混合类型
- ObjectId    对象ID
- Array       数组

```js
const mongoose=require("mongoose")
mongoose.connect('mongodb://localhost:27017/mongoose_test', {useNewUrlParser: true, useUnifiedTopology: true});
//绑定监听
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("绑定成功")
});

//创建Schema(模式)对象
//将mongoose.Schema赋值给一个变量
const Schema=mongoose.Schema

const blogSchema = new Schema({
     name:String,
     age:Number,
     gender:{
         type:String,
         default:"female"
     },
    address:String
})

//通过Schema来创建Model
//Model代表的是数据库中的集合,通过Model才能对数据库进行操作
//mongoose.model(modelName,schema)
//modelName就是要映射的集合名  mongoose会自动将单数集合名变成复数
const Blog = mongoose.model('Blog', blogSchema);

```

### Model类型

1. 通过Schema来创建Model
2. Model代表的是数据库中的集合,通过Model才能对数据库进行操作
3. mongoose.model(modelName,schema)
4. modelName就是要映射的集合名  mongoose会自动将单数集合名变成复数

```js
//...省略连接数据库,Schema创建
const Blog = mongoose.model('Blog', blogSchema);

```

### Model类型增删查改数据库

1. Model.create(doc(s),[callback])
  
- 用来创建一个或多个文档并添加到数据库中

>- 参数:
    doc(s)   可以是一个文档对象,也可以是一个文档对象的数组
    callback 当操作完成以后调用的回调数组

```js
//向数据库中插入一个文档
//Blog.creat(e)(doc,function(err){})
Blog.create({
    name:"孙悟空",
    age:10,
    gender:"male",
    address:"花果山"
},function (err) {
    if(!err){
        console.log("插入成功")
    }
})

Blog.create([
    {name:"猪八戒",
        age:100,
        gender:"male",
        address:"高老庄"},
    {name:"唐僧",
        age:90,
        gender:"male",
        address:"大唐"}
],function (err){
    if(!err){
        console.log("插入成功"+arguments)//插入的数据
    }
})
```

2. 查询:

- ```Model.find(conditions,[projection],[options],[callback])```
  - --查询所有符合条件的文档  返回的是一个数组
- ```Model.findById(id,[projection],[options],[callback])```
  - --根据文档的id属性查询文档  总和返回文档对象
- ```Model.findOne(conditions,[projection],[options],[callback])```
  - --查询符合条件的第一个文档  总和返回第一个文档对象

- conditions  查询的条件
- projection  投影:需要获取到的字段
  - 两种方式:{name:1,_id:0}或"name -_id"
- options     查询选项(skip limit)
- callback    回调函数,查询结果会通过回调函数返回

> 注意:<span style="color:red">回调函数必须传,如果不传回调函数,不会查询</span>

```js
Blog.find({},{name:1,_id:0},function (err,docs) {
    if(!err){
        console.log(docs)
    }
})

Blog.findOne({},function (err,doc) {
    if(!err){
        console.log(doc)
    }
})

Blog.findById("60f428da31c79f361cf1c442",function (err,doc) {
    if (!err){
        //通过find()查询的结果,返回的对象,就是Document,文档对象
        //Document对象时Model的实例
        console.log(doc)
    }
})
```

3. 修改

- ```Model.update(conditions,doc,[options],[callback])```

- ```Model.updateMany(conditions,doc,[options],[callback])```
  
- ```Model.updateOne(conditions,doc,[options],[callback])```

- -用来修改一个或多个文档
- conditions  查询的条件
- -doc修改后的对象
- -options 配置参数
- callback 回调函数

```js
//修改唐僧的年龄为20
Blog.updateOne({name:"唐僧"},{$set:{age:20}},function (err) {
    if(!err){
        console.log("修改成功")
    }
})
```

4. 删除

- ```Model.remove(conditions,[callback])```

- ```Model.deleteOne(conditions,[callback])```

- ```Model.deleteMany(conditions,[callback])```

```js
Blog.remove({name:"孙悟空"},function (err) {
    if(!err){
        console.log("删除成功")
    }
})
```

5. 补充```Model.count(conditions,[callback])```---返回的是符合条件的长度

```js
Blog.count({},function (err, count) {
    if(!err){
        console.log(count)
    }
})
```

### Document

1. Document和集合中的文档一一对应,Document是Model的实例通过Model查询的结果都是Document

```js
//创建一个Document
let blo=new Blog({
    name:"金角大王",
    age:"55",
    gender:"male",
    address:"洞"
})
console.log(blo)
```

> 如果想要上面的代码生效,需要执行,document的方法```Model#save([options],[fn])```

```js
blo.save(function (err) {
    if(!err){
        console.log("保存成功")
    }
})
```

2. 可以直接操控回调函数

- ```update(update,[options],[callback])```--修改对象
- ```remove([callback])```--移除对象
- ```get(name)``` --获取文档中的指定属性值
- ```set(name,value)```--设置文档中的指定属性值
- ```id```--获取文档的_id属性
- ```toJSON()```--转换成一个JSON对象
- ```toObject()```---将Document对象转换成一个普通的js对象
  - 注意:<span style="color:red">转换成普通的js对象以后,注意所有的Document对象的方法或属性都不能使用</sapn>
  
```js
Blog.findOne({},function (err,doc) {
    if(!err){
         
        doc.update({$set:{age:28}},function(err){
            if(!err){
                console.log("修改成功")
            }
        })

        doc.remove(function(err){
            if(!err){
                console.log("大师兄再见")
            }
        })
        console.log(doc.get("age"))
        console.log(doc.age)
        doc.set("name","金子")//直接可以写成doc.name="金子"

        let j=JSON.stringify(doc)
        console.log(j)
        let o=doc.toObject()
        delete o.address
        console.log(o._id)
    }
})

```

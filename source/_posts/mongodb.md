---
title: mongodb
date: 2021-8-23 23:42:30
author: Jack-zhang
categories: mongodb
tags:
   - mongodb
summary:  一个简单mongodb使用的介绍,内含CRUD等一些简单的使用.
---

## 1初始化数库可以使用  mongod --dbpath 地址值

## 2基本概念

* 数据库(databases)

* 集合(collection)

* 文档(document)

  * 在MongoDB中,数据库和集合都不需要手动创建,当我们创建文档时,如果文档所在的集合或数据库不存在时,会自动创建数据库和集合

## 3.基础指令

* show dbs/databases    ---显示当前的所有的数据

* use 数据库名   ---进入到指定的数据库中

* db  ---db表示的是当前的数据库

* show collections    ---显示数据库中所有的集合

## 4.数据库的CRUD的操作

### (1)向数据库中插入文档

* db.\<collection>.insert(doc)  ---向集合中插入一个文档  /insertOne()

* db.\<collection>.insert([doc,doc,...])   ---向集合中插入多个文档  /insertMany()

  * 如果没有给文档指定的\__id属性,则数据库会自动为文档添加__id ,该属性用来作为文档的唯一标识

  * \__id我们可以自己指定,如果我们指定了数据库就不会在添加了,如果我们指定__id也必须确保他的唯一性

    * --例子;向test数据库中的stus集合中插入一个新的学生对象:{name:"孙悟空",age:18,gender:"男"};

     ```mongodb
         db.stus.insert({name:"孙悟空",age:18,gender:"男"})
     ```

### (2)查询

1. db.\<collection>.find()   ---查询当前集合中的所有文档

* find()  用来查询集合中所有符合条件阿德文档

* find()  可以接受一个对象作为条件参数

  * {}  表示查询集合中所有的文档,{属性:值}  查询属性是指定值的文档

  * find()返回的是一个数组,可以加索引[]

2. db.\<collection>.findOne()

* 用来查询集合中符合条件的第一个文档

* findOne()返回的是第一个文档对象

* ```db.stus.find().count()```--查询所有文档的数量

### (3)修改

1. db.\<collection>.update(查询条件,新对象)

* update()默认情况下会使用新对象替换旧对象

* update()默认只会修改第一个

  * 如果需要修改指定的属性,而不是要替换需要使用"修改操作符"来完成修改
  
  * $set   可以修改文件中的指定属性
  
  ```js
  例:
      db.stus.update({"_id":ObjectId("60efe2cfa164bbc13d327278")},
      {$set:
       {
        name:"沙和尚",
        address:"流沙河",
       },
       {
        multi:<boolean>//true指修改多个
       }
      })
  ```

  * $unset   可以删除文档中的指定属性

  ```js
  例:
      db.stus.update(
      {"_id":ObjectId("60efe2cfa164bbc13d327278")},
      {
       $unset:{
       address:"流沙河"
      },
      {
       multi:<boolean>//true指删除多个
      }
      })
  ```

* db.\<collection>.updateMany()    ---可以修改多个符合条件的文档

* db.\<collection>.updateOne()      ---修改一个符合条件的文档

### (4)删除

* db.\<collection>.remove()

  * remove()可以根据条件来删除文档,传递的条件和find()一样

  * 默认情况下删除符合条件的所有的文档

  * 第二个参数填true,只删除一个\<justone>,例:```db.stus.remove({name:28},true)```

* db.\<collection>.drop()   ---删除集合
* db.\<collection>.deleteMany()    ---删除多个
* db.\<collection>.deleteOne()   ---删除一个
* db.dropDatabase()  ---删除数据库

注意:一般数据库中的数据不会删除,所以删除的方法很少调用,一般会在数据中添加一个字段,来表示是否会被删除

## 5文档与文档之间的关系

### (1)一对一(one to one)

1. 夫妻关系:--在MongoDB,可以通过内嵌文档的 形式来体现出一对一的关系

```js
db.wifeAngHusband.insert([
 {
   name:"haungrong",
   husband:
   {
      name:"guojing"
   }
 },
 {
   name:"panjinlain",
   husband:
   {
      name:"wudalang"
   }
 },
 {
   name:"zhuzhuxia",
   husband:
   {
       name:"xiaofeifei"
  }
 }
])
```

### (2)一对多(one to many)/(多对一)(many to one)

```js
//一对多  用户(users)  订单(orders)
db.users.insert([{
   username:"swk"
  },{username:"zbj"
  }
])
db.users.find()

db.order.insert({
list:["扑克","漫话"],
users_id:ObjectId("60f14f0ac32c00008c002af5")
})
db.order.find()

//查找用户swk的订单
let user_id=db.users.findOne({username:"swk"})._id
db.order.find({users_id:user_id})
```

### (3)多对多(many to many)

```js
//多对多
db.teachers.insert([
  {name:"hongqigong"},
  {name:"guixianren"},
  {name:"huangyaoshi"}
])
db.teachers.find()


db.stus.insert(
 [
   {
    name:"guojing",
    teach_ids:
    [
      ObjectId("60f159efc32c00008c002afc"),
      ObjectId("60f159efc32c00008c002afe")
    ]
   },
   {
    name:"suiwukong",
    teach_ids:
    [
      ObjectId("60f159efc32c00008c002afc"),
      ObjectId("60f159efc32c00008c002afe"),
      ObjectId("60f159efc32c00008c002afd")
    ]
   }
])

db.stus.find()
```

### 补充:sort与投影

```js
//查询文档时,默认情况下时按照_id的值进行排列(升序)
//sort()可以用来指定文档的排序的规则,sort()需要传递一个对象来指定排序规则  1表示升序   -1表示降序
//limit  skip  sort  可以以任意的顺序进行调用
db.numbers.find().sort({sal:1,empo:-1})

//在查询时可以在第二个参数的位置来设置查询的结果   投影
db.numbers.find({},{enname:1,_id:0,sal:1})
```

## 6.Mongoose

### (1)mongoose为我们提供了几个新的对象

* Schema(模式对象)   定义约束了数据库的文档结构

* Model  作为集合中的所有文档的表示,相当于MongoDB数据库中的集合collection

* Document  表示集合中的具体文档,相当于集合中的一个具体文档

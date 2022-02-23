---
title: 'cookie,session和token'
date: 2022-02-23 15:51:42
categories: config
tags:
   - config
   - HTTP
summary: cookie,session和token的区别
---

> 由于HTTP是无状态的,当关闭网页的时候,服务器并不能意识到还是你来访问的

* 这就涉及到如何让浏览器记住这些信息(例如用户的账号和密码)
   1. 保证密码和账号不易被破解并且完美保存
   2. 保证http无状态的问题,并且在每一次请求中加入这些信息保持登录

* 可以事先每次http请求都自带数据给服务器的技术-->cookie

## Cookie&Session

![cookie](cookie.png)

1. 浏览器发送http请求后,服务器会进行cookie设置.`Set-Cookie`
2. `Cookie`中有`value`和`name`两个重要属性
3. 浏览器会将cookie保存起来,并且在以后的每一个请求自动附上这个Cookie

* 并且打开浏览器就可以看到cookie,并且如果将用户密码等重要信息放在浏览器就很不安全

>Session,浏览器和服务器是在进行会话,然而比较模糊的就是会话时间.因为关闭浏览器的行为可能是不小心的

![session](session.png)

* 所以很多网站会给每个用户的会话设定会话时间(结束会话的时间)和唯一的ID,并且这些session一般都是存储在数据库中的

1. 当使用用户名密码发送到服务器,认证成功后,会创建一个SessionID和会话结束时间,还有其它参数
2. 服务器会将`SessionID和会话结束时间`包含在cookie中发送给浏览器
   * 服务器在发送cookie之前会对这个含有Session ID的cookie进行签名
3. 浏览器会将包含SessionID的Cookie进行保存(并没有保存账号密码)

* 浏览器会利用cookie的特点,每次访问都会带有sessionid,直到有效期失效后会自行删除cookie

>如果有大量用户访问服务器的时候,服务器依旧使用基于cookie的session,就需要存储大量`SessionID`在服务器中.
>
> 如果有多台服务器的情况,服务器中的SessionID还要分配给其它服务器才能保证用户避免再次输入用户名和密码

## JWT(Json Web Token)

![Token](token.png)

1. 用户第一次登录网页,服务器会生成一个JWT,服务器不需要保存JWT,只需要保存**JWT签名的密文**
2. 接着把JWT发送给服务器,浏览器可以以`Cookie`或者`Storage`的形式进行存储

* token验证登录
  >三段式加密字符串:header(算法).payload(数据).signature(签名信息)
  >>
  >> * 第一段:头,签证:安全信息验证,你的口令,进行不可逆加密
  >> * 第二段:你要保存的信息:将`header`和`payload`base64编码后进行算法运算得到签名信息
  >> * 第三段:额外信息:不可逆加密
  >>
  >>>  这一段字符串由后端发给前端.在登陆过以后,生成一个token给前端,前端保存这个token如果前端需要登录后查看页面,或者登陆后发送的请求,只要你把token带回来,解密一下

## 总结

1. Session是由服务器诞生并且保存在服务器中的,由服务器主导
2. Cookie是一种数据载体,把session保存在cookie中,送到客户端中,就可以跟随每个http发送
3. Token诞生在服务器,但保存在浏览器中,可以放在Cookie或者Storage中.持有Token就像持有令牌可以访问服务器

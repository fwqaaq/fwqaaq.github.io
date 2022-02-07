---
title: nginx
date: 2022-01-27 14:49:03
author: Jack-zhang
categories: config
tags:
   - nginx
   - config
summary: nginx的简单应用
---

## 相关知识

> 什么是正向代理
>
> 是一个位于客户端和目标服务器之间的服务器(代理服务器),为了从目标服务器取得内容,客户端向代理服务器发送一个请求并指定目标,然后代理服务器向目标服务器转交请求并将获得的内容返回给客户端.

* 突破访问限制
* 提高访问速度
* 隐藏客户端真实IP

![正向代理](正向代理.png)

>什么是反向代理
>
>是指以代理服务器来接受internet上的连接请求,然后将请求转发给内部网络上的服务器,并将从服务器上得到的结果返回给internet上请求连接的客户端,此时代理服务器对外就表现为一个反向代理服务器

* 隐藏服务器真实IP
* 负载均衡
* 提高访问速度
* 提供安全保障

![反向代理](反向代理.png)

>什么是负载均衡(使用多台服务器提供单一服务)
>
>它的职责是将网络请求,或者其他形式的负载**均摊**到不同的机器上. `避免集群中部分服务器压力过大,而另一些服务器比较空闲的情况`. 通过负载均衡,可以让每台服务器获取到适合自己处理能力的负载. 在为高负载服务器分流的同时,还可以避免资源浪费.

* **动静分离**:为了加快网站的解析速度,可以把动态页面和静态页面由不同的服务器来解析,加快解析速度.降低原来单个服务器的压力

## Nginx配置文件

> 全局,events,http

### nginx命令

1. `nginx -v` 查看nginx版本号
2. `systemctl start nginx`:开启nginx
3. `systemctl stop nginx`:停止nginx
4. `systemctl status nginx`:查看状态
5. `systemctl enable nginx`:开机启动
6. `nginx -s reload`:重新启动nginx

### 全局快

> 全局块:从配置文件到events块之间的内容,主要会设置影响nginx服务器整体运行的配置指令

* `user`:运行用户,最好指定为`root`
* `worker_processes`:nginx服务器处理并发服务的关键配置,他的值越大,可以处理的并发也越多,但是会受到硬件,软件等设备的制约
* `error_log`:错误日志文件所在位置 
* `pid`:pid文件所在的位置

### events

> `events`:影响nginx与用户的网络连接

* `worker_connections`:nginx支持的最大的连接数是多少

> 使用`epoll`模型提高性能

```shell
events {
   use epoll; 
   worker_connections 4096; 
}
```

> 使用`ulimit -a`查看每个进程可以处理的文件数,配置文件里修改为大于1024,也会被限制,需要额外再命令行输`ulimit -n <number>`去修改打开我呢见数限制

### http

#### http全局快

>http全局快配置的指令包括文件引入,MINE-TYPE定义,日志自定义,连接超时时间,单链请求数上限

* `log_format`:日志格式设定
* `access_log`:访问日志的位置
* `sendfile`:支持文件发送下载
* `tcp_nopush`:允许或禁止使用socke的`TCP_CORK`的选项(发送数据包前先缓存数据),此选项仅在使用sendfile的时候使用
* `tcp_nodelay`:是否不将小包组成成大包,提高带宽利用率
* `keepalive_timeout`:连接保持的超时时间,单位秒(s)
* `types_hash_max_size:`用一个散列表来保存`MIME type`与文件扩展名之间的映射,该参数就是指定该散列表桶的大小的.
* `gzip`:是否开启gzip压缩输出
* `include`:文件扩展名与文件类映射表
* `default_type`:默认文件类型

#### server

> 和虚拟主机有关,完全模拟硬件主机.每个http模块苦役包括多个server块,而每个server块就相当于一个虚拟主机

##### server全局快

>最常见的配置就是本虚拟主机的监听配置和本虚拟主机的名称或IP配置

* `listen`:监听地址以及端口
* `server_name`:站点域名,可以有多个,用空格隔开

##### location

>一个server块可以包含多个location块.主要用于nginx服务器接收到的请求字符串,对虚拟主机之外的字符串进行匹配,对特定的请求进行处理

* `/`:域名或者主机IP
* `root`:根目录位置
* `index`:默认的主页文件位置,会从根目录下寻找

```shell
location / {
    root /opt/web/Jack-Zhang-1314.github.io;
    index index.html;
}
```

> 如果设定`/test`,那么root目录会改为`/opt/web/Jack-Zhang-1314.github.io/test`
>
> 主页文件会改为`/opt/web/Jack-Zhang-1314.github.io/test/index.html`

* `location = /uri`:= 开头表示精确匹配,只有完全匹配上才能生效.
* `location ^~ /uri`:^~ 开头对 URL 路径进行前缀匹配,并且在正则之前.
* `location ~ pattern`:~ 开头表示区分大小写的正则匹配.
* `location ~* pattern`:~* 开头表示不区分大小写的正则匹配.
* `location /uri`:不带任何修饰符,也表示前缀匹配,但是在正则匹配之后,如果没有正则命中,命中最长的规则.
* `location /`:通用匹配,任何未匹配到其它 location 的请求都会匹配到,相当于 switch 中的 default.

## 反向代理

>通常将反向代理做为公网访问地址,web服务器是内网,即通过nginx配置外网访问web服务器内网

* 隐藏服务保证内网安全

>通过`proxy_pass`来配置

```conf
server {
  listen       80;
  server_name  www.zhengqing520.com;
  location / { # 访问80端口后的所有路径都转发到 proxy_pass 配置的ip中
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    proxy_pass 127.0.0.1:8080; 
  }
}
```

1. `server_name`服务器地址或绑定域名
2. `proxy_pass`:配置反向代理的ip地址和端口号(url地址需加上http:// 或 `https://`)

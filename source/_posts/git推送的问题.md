---
title: git的一些小问题
date: 2021-8-26 22:14:30
author: Jack-zhang
categories: git
tags:
   - git
summary: 分享一下git上遇到的一些问题,很多东西我也不是很懂,但是亲测有效
---

## 关于ssh连接超时的问题

1. 错误提示:ssh: connect to host github.com port 22: Connection timed out
  
* ISP的问题,至于问什么,我也不知道.

* <span style="color:red">解决方案:将WiFi换成手机热点</span>

## 关于hexo推送github仓库的问题

* repo: <https://github.com/Jack-Zhang-1314/Jack-Zhang-1314.github.io.git>
  1. 连接的地址如果写成https的形式,可能会不出现token凭证连接不上
  2. 放域名的文件名为```CHAME```

* <span style="color:red">解决方案:</span>
  * 将连接方案改成ssh连接:
    * repository: git@github.com:Jack-Zhang-1314/Jack-Zhang-1314.github.io.git
    * 放域名的文件名为```CNAME```

## git推送时出现的问题

> 大多数是由于代理端口号产生的问题

```bash
fatal: unable to access 'https://github.com/Jack-Zhang-1314/demo.git/': OpenSSL SSL_connect: Connection was reset in connection to github.com:443
exit status 128
```

* 找到自己的端口号，然后进行git全局代理

```bash
git config --global http.proxy 127.0.0.1:7890
git config --global https.proxy 127.0.0.1:7890
```

* 如果想取消配置

```bash
git config --global --unset https.proxy 
git config --global --unset https.proxy 
```

* 查看git配置

```bash
git config --global http.proxy #查看git的http代理配置
git config --global https.proxy #查看git的https代理配置
git config --global -l #查看git的所有配置
```

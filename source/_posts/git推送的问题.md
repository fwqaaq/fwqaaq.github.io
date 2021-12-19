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
---
title: iptables
date: 2023-08-22 23:59:55
categories: Linux
tags:
   - Linux
   - Config
summary: iptables 的简单应用
---

## 表

> iptables 是 Linux 下的防火墙，可以用来设置防火墙规则，限制网络访问。
>
> 它由以下四个表组成：filter \< nat \< mangle \< raw，每个表中都含有不同的链

* filter：用来对数据包进行过滤，具体的规则要求决定如何处理一个数据包（对应于 `INPUT`、`FORWARD`、`OUTPUT` 链
* nat：主要用来修改数据包的 IP 地址、端口号信息（对应于 `PREROUTING`、`OUTPUT`、`POSTROUTING` 链
* mangle：主要用来修改数据包的服务类型，生存周期，为数据包设置标记，实现流量整形、策略路由等（对应于 `PREROUTING`、`INPUT`、`FORWARD`、`OUTPUT`、`POSTROUTING` 链
* raw：主要用来决定是否对数据包进行状态跟踪（对应于 `PREROUTING`、`OUTPUT` 链

## 链

![ ](https://media.githubusercontent.com/media/fwqaaq/fwqaaq.github.io/dev/src/picture/iptables.png)

* PREROUTING: 在数据包进行路由选择之前执行
* INPUT: 在数据包进入本地系统后执行（访问防火墙本机地址的数据包
* FORWARD: 通过防火墙转发给其他地址的数据包时执行
* OUTPUT: 在数据包从本地系统发出数据包时执行
* POSTROUTING: 在数据包进行路由选择之后执行

## 规则

* 查看表中的链以及其中的各个规则

```bash
iptables --table filter --list --line-numbers
```

* 拒绝某个请求访问，默认是所有协议，**所有规则都是从上往下进行执行**

```bash
sudo iptables --table filter --append INPUT --source 192.168.50.16 --jump REJECT
```

* 删除某个规则

```bash
# 删除 INPUT 链中的第一条规则
sudo iptables --table filter --delete INPUT 1
```

[jump 参数](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security_guide/sect-security_guide-command_options_for_iptables-iptables_parameter_options)，标准的目标是：`ACCEPT`、`DROP`、`QUEUE`、`RETURN`，当然你也可以指定其他例如 [SNAT、DNAT 等目标](https://book.huihoo.com/iptables-tutorial/c8815.htm)。

* 参考：<https://tinychen.com/20200414-iptables-principle-introduction/>
* 参考：<https://wangchujiang.com/reference/docs/iptables.html>

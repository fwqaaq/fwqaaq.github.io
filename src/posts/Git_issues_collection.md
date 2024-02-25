---
title: Git 问题收集
date: 2024-02-20 13:25:14
categories: Git
tags:
  - Git
summary: 收集一些关于开发中遇到的 Git 问题
---

## Git 问题收集

> [!NOTE]
> 本文档收集一些关于开发中遇到的 Git 问题，以及解决方案。

1. 在帮朋友下载 brew 的时候遇到一个 Git 的问题：RPC failed; curl 92 HTTP/2 stream 5 was not closed cleanly: CANCEL (err 8)
   * 原因可能是这样：I encountered this error when pushing GIT through an ADSL Broadband Wi-Fi network with low signal strength, low stability, and low speed.
   * 解决方式：Then, I was able to push it very successfully when I pushed it into the GIT through a Fibre Broadband Wi-Fi network with greater signal strength, greater stability, and higher speed.
   * 参考：<https://stackoverflow.com/questions/59282476/error-rpc-failed-curl-92-http-2-stream-0-was-not-closed-cleanly-protocol-erro>

2. 有多个 GitHub 账号，如何切换账号的问题：
   * 在原仓库中运行以下命令，一定要设置好 SSH key，不要覆盖原来的 SSH key。

   ```bash
   git config user.name "username"
   git config user.email "email"
   git config core.sshCommand "ssh -i ~/.ssh/id_rsa_xxx"
   ```

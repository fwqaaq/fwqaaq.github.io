---
title: Git 问题收集
date: 2024-02-20 13:25:14
categories: Git
tags:
  - Git
summary: 收集一些关于开发中遇到的 Git 问题
updateAt: 2025-02-23 15:12:58
---

[TOC]

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

3. 提交一个空提交

   ```bash
   git commit --allow-empty -m "empty commit"
   ```

4. Git 提交验证，由于 Git 服务器对提交的作者一般都不会进行身份验证，所以如果使用了别人的身份信息提交代码进行“投毒”是很容易的，所以多数仓库会进行 `ssh` 和 `GPG` 的验证：
   * [`ssh` 签名验证](https://docs.github.com/zh/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key)
   * [`GPG` 签名验证](https://docs.github.com/zh/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)，在 Mac 上使用 PGP 签名可能有问题，具体参考：<https://gist.github.com/Peredery/38d0538dd34381bbd9d13414269a1f27>

5. Git 在提交后，因文件名大小问题进行修改后，由于系统的原因，无法直接修改，可以使用 `git mv` 进行修改：
   * [`git mv` 批量修改脚本](https://github.com/fwqaaq/scripts/blob/main/shell/rename_file.sh)

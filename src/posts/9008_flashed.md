---
title: 9008 刷 Android 16
date: 2025-11-05 09:17:03
categories: chore
tags:
   - Chore
   - Android
summary: 一加 OxygenOS 16 刷机，完全封锁 bootloader 变砖记录
---

[TOC]

## 起因

某天，pig 突然在群里狗叫，Android 16 丝滑的一批，它已经用的飞起了。

![猪言猪语](https://img.fwqaaq.com/AQAEDGsbrDlhVHI.jpg)

当时一直没有找到 oneplus 13T 的刷机包，然后就直接 OTA 更新了，结果更新之后 fastboot 直接被锁死了，不能手动进入 fastboot 模式，只能通过 adb reboot fastboot 进入。但是这是噩梦的开始。

## 刷机过程

> [!TIP]
>
> 9008 模式是高通芯片的紧急恢复模式，可以通过特定工具刷入固件包进行救砖。

![信了某人的邪](https://img.fwqaaq.com/AQADAgxrG6w5YVR9.jpg)

由于国版的 oneplus 刷 oxygenOS 之后，信号和摄像头模块都有问题，所以必须要装入模块包之后才能恢复，由于 pig 说 kernelsu 都支持，我就直接没查使用命令行进入了 fastboot 刷了 15 的 kernelsu 包，结果刷完之后根本没法开机，直接死在 logo 界面。

<video src="https://img.fwqaaq.com/9008_flashed.mp4" height="200px" controls></video>

视频链接：<https://img.fwqaaq.com/9008_flashed.mp4>

由于 fastboot 也直接被锁死了，没法刷回去，只能使用 9008 的救砖包，但是新版本的授权彻底被 oppo 封锁了，根本无法得到 OTP 授权。（具体原因不在这里讨论）

随后 pig 也是直接丢给我一个 9008 救砖包：<https://drive.google.com/file/d/1v-_wIND7vEPYt63cUCDp_P8FaCmws0Ao/view>，让我刷回去，我看了一下应该是安卓 11 的某三方网站的包，但是按照他的尿性我也是不知道能不能用。

所以类似 [Gaprologin](https://www.gaprologin.com/) 这种第三方灰色授权网站也拿不到授权码，最后只能寄回官方售后进行解锁刷机。

![毫无办法](https://img.fwqaaq.com/AQADFgxrG6w5YVR-.jpg)

参考：<https://zhuanlan.zhihu.com/p/13623689140>

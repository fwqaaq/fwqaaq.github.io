---
title: 9008 刷 Android 16
date: 2025-11-05 09:17:03
categories: chore
tags:
   - Chore
   - Android
summary: 一加 OxygenOS 16 刷机，完全封锁 fastboot 变砖记录
updateAt: 2025-11-23 21:35:45
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

## 刷机成功

时隔一个月之后，再次补充完整，这次在 fastboot 完全损毁的情况下，刷入 ABL，成功进入 fastboot 模式，千万小心刷入使用 OTA 升级，很可能会导致 fastboot 不能使用，只能通过 9008 救砖。

9008 救砖，需要官方的 digest 等文件握手成功获取 ACK 信号，才能进入 firehose 模式刷入，但是官方已经封锁了 OTP 授权，无法获取授权码。以下就是根据参考里提供的链接操作的，有问题请看以下参考链接。

1. 进入 9008 模式，包里提供了 3 个文件，分别是 device programmer, sign 以及 digest 这是为了握手使用的，获得 ACK，以进入 firehose 模式刷入。
2. 备份的话都无所谓，如果需要可以进行备份。
3. 难点就是写入分区，包里**必须**提供了 `rawprogram0.xml` 文件，必须是 9008 刷机包。

> BTW any new firmware with the "fix" WILL burn antirollback fuses and kill old firehose
>
> Do not ship newer firmware images and proprietary blobs with lineage please

以上是直接写入 `rawprogram0.xml` 文件可能的问题，似乎是官方为了防止降级刷机而设置的防护措施。所以我一直收到 `NAK` 信号的响应错误。

但是，pig 直接写入 ABL，而不是整个系统，成功进入 fastboot 模式，并没有任何问题，一个月的砖终于解除了。

> [!WARNING]
>
> 不要自己看 GPT 规范尝试写入 ABL 分区，必须使用 9008 固件包提供的 rawprogram 文件。

<video src="https://img.fwqaaq.com/IMG_0953.MOV" height="200px" controls></video>

好了，以后 Pig 就是神了。

参考：<https://zhuanlan.zhihu.com/p/13623689140>、<https://xdaforums.com/t/closed-world-first-free-offline-oppo-oneplus-realme-vip-workaround-in-edl-mode-has-arrived.4769052/>

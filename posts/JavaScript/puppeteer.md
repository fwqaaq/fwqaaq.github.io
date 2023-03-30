---
title: puppeteer
date: 2021-11-30 18:17:28
categories: 爬虫
tags:
   - JS
   - config
   - 爬虫
summary: 使用puppeteer做一个爬虫
---

## 爬取页面或者接口数据

> 页面得是ssr(服务器渲染)`post`,`get`等请求都可以
>
> 使用`axios`库

```js
const axios = require("axios")
const fs = require("fs/promises")
const url = "https://music.163.com/#/song?id=30431367"
axios.get(url, (error, response, body) => {
  fs.writeFile("./bilibili.html", body)
})
```

## Puppeteer简介

>`Puppeteer`是一个`Node`库,它提供了一个高级API来通过DevTools协议控制`Chrome`或`Chromium`.`Puppeteer`默认无头运行,但可以配置为运行完整(非无头)`Chrome`或`Chromium`.

### 使用特点

1. 生成页面的屏幕截图和PDF
2. 抓取SPA(单页应用程序)并生成预渲染内容(即`SSR`(服务器端渲染))
3. 自动化表单提交,UI测试,键盘输入等
4. 创建最新的自动化测试环境使用最新的JavaScript和浏览器功能,直接在最新版本的Chrome中运行您的测试
5. 捕获站点的时间线跟踪以帮助诊断性能问题
6. 测试Chrome扩展

### puppeteer-core

* 当您安装`Puppeteer`时,它会下载保证与API一起使用的最新版本的 `Chromium`
* `puppeteer-core`包,一个默认不下载任何浏览器的`Puppeteer`版本

> 使用`puppeteer-core`需要传`google`所在的浏览器的绝对地址,属性`executablePath`

* 使用**绝对地址**或者使用插件库`carlo`

```js
const puppeteer = require("puppeteer-core");
const findChrome = require("./node_modules/carlo/lib/find_chrome");
(async function () {
  const findChromePath = await findChrome({})
  const executablePath = await findChromePath.executablePath
  const browser = await puppeteer.launch({
    //executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    executablePath,
    headless: false,
    defaultViewport: null,
    args: ["--start-fullscreen"],
    ignoreHTTPSErrors: true
  })
  const page = await browser.newPage();
  await page.goto("https://www.bilibili.com/");
  await page.screenshot({
    path: "./bilibili.png",
    type: "png"
  })
  browser.close()
})();
```

### puppeteer概述

> `Puppeteer`API是分层的,并反映了浏览器结构

1. `Puppeteer`:使用DevTools协议与浏览器通信.
2. `Browser`实例可以拥有多个浏览器上下文.
3. `BrowserContext`实例定义了一个浏览会话并且可以拥有多个页面.
4. `Page`至少有一个框架主框架.可能还有其他框架由iframe或框架标签创建.
5. `Frame`至少有一个执行上下文——默认执行上下文——框架的JavaScript在这里执行.Frame可能具有与扩展相关联的附加执行上下文.
6. `Worker`有一个单一的执行上下文并促进与WebWorkers的交互.

> 参考:<https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteer-vs-puppeteer-core>

## 关于使用

### 使用 connect 连接

> 启动带有所有插件和账号的chrome

查看 cdp 协议，在 settings > Experiments > Protocol Monitor 打开

1. 首先打开chrome的快捷方式,在目标后输入`--remote-debugging-port=9222`.大概是下面这样

   >`"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222`
   >
   >切记exe后面一定要有空格,这种方式也有缺点,可能会有连接不上的时候
   >
   >他的url在:`http://localhost:9222/json/version`,可能打开浏览器两三次才会有连接

   ```js
   const puppeteer = require('puppeteer-core');
   const axios = require("axios");
   (async () => {
     const response = await axios.get("http://localhost:9222/json/version")
     const { webSocketDebuggerUrl } = response.data
     const browser = await puppeteer.connect({
       browserWSEndpoint: webSocketDebuggerUrl,
       defaultViewport: null
     });
     const page = await browser.newPage()
     ...
     await browser.disconnect();
   })();
   ```

2. 一般我们可以使用 cli 命令直接执行，例如在某linux 发行版中

   ```bash
   # --user-data-dir 你也可以指定它数据的目录
   ./chrome --remote-debugging-port=9929
   ```

   * 我们可以自己写一个自动启动脚本

   ```bash
   #!/usr/bin/env sh
   cd /opt/google/chrome/ && ./chrome --add-debugging-port=$1
   ```

   * 一些权限操作

   ```bash
   chmod +x ./chrome.sh
   ln ./chrome.sh /bin/chrome
   ```

   * 使用 `chrome 9929`

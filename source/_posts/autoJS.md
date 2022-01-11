---
title: autoJS
date: 2022-01-03 23:27:15
author: Jack-zhang
categories: 爬虫
tags:
   - JS
   - 爬虫
summary: 自动化脚本
---

## UiSelector

>UiSelector即选择器，用于通过各种条件选取屏幕上的控件(**可以链式调用**),返回的是选择器自身

1. `text(str)`:属性是文本控件上的显示的文字
2. `textContains(str)`:"text需要包含字符串str"的筛选条件
3. `textStartsWith(prefix)`:text需要以prefix开头
4. `textEndsWith(suffix)`:text需要以suffix结束
5. `textMatches(reg)`:text需要满足正则表达式reg
   * 例如`textMatches(/\d+/)`
6. `desc(str)`:desc等于字符串str,其它同**text**
7. `id(resId)`:控件的id属性通常是可以用来确定控件的唯一标识,同**text**
8. `className(str)`:示一个控件的类别,它同**text**
9. `packageName(str)`:表示控件所属界面的应用包名
   * 获取应用的包名:`app.getPackageName("微信")`
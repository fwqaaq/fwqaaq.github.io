---
title: vscode集成go
date: 2021-12-08 22:41:07
categories: GO
tags:
   - config
   - GO
summary: vscode集成go
---

## 配置环境

1. ![安装go插件](GO插件.png)
2. 在控制台配置`go proxy`
   * `go env -w GOPROXY=https://goproxy.cn,direct`
3. ![配置环境](env配置.png)
   * **GO111MODULE**:
      1. 当为on时则使用`Go Modules`,go会忽略`$GOPATH`和`vendor`文件夹,只根据`go.mod`下载依赖
      2. 当为off时则不适用新特性Go Modules支持,它会查找 vendor目录和 $GOPATH来查找依赖关系,也就是继续使用“GOPATH模式”
      3. 当为auto时或未设置时则根据当前项目目录下是否存在 `go.mod`文件或`$GOPATH/src之`外并且其本身包含`go.mod`文件时才会使用新特性`Go Modules`模式(默认值)
   * **GOPATH**:可以这么理解为GO源码目录,在这个目录进行编译,链接最后生成所需要的库,可执行文件
   * **GOROOT**:go语言编译,工具,标准库等的安装路径
   * **GOPROXY**:下载go模块镜像(如果国外的被墙<https://proxy.golang.org/>),
     * 参考:<https://goproxy.cn/>

## 开始下载工具

> 此操作会将所有下载的镜像和缓存保存到`GOPATH`的路径下
>
> 在setting.json中配置`gopath`和`goroot`

```json
"go.autocompleteUnimportedPackages": true,
"go.buildOnSave": "workspace",
"go.lintOnSave": "package",
"go.vetOnSave": "package",
"go.buildTags": "",
"go.buildFlags": [],
"go.lintFlags": [],
"go.vetFlags": [],
"go.coverOnSave": false,
"go.useCodeSnippetsOnFunctionSuggest": false,
"go.goroot": "F:\\go",
"go.gopath": "D:\\GoPath",
"go.gocodeAutoBuild": false
```

1. `ctrl+shift+p`打开命令面板

2. 搜索`go:install/update tools`并且点击后全选

3. 每完成一项就会返回一个成功

![gotools](goTools.png)

![gotools](goTools2.png)

## 启用自动调试

> 下载`GO Autotest`插件开启自动调试,不需要配置`launch.json`文件
>
>`GO111MODULE`一定要是`auto`

![调试](调试.png)

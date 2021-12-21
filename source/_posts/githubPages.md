---
title: githubPages
date: 2021-12-15 18:46:13
author: Jack-zhang
categories: git
tags:
   - git
summary: 使用github部署网站
---

## 使用github部署网站

>可以直接通过master分支直接来馈送网站.而不需要另行创建分支(容易导致冲突)

1. 创建一个`docs`文件夹
2. 需要含有`index.html`入口文件
3. 需要先把项目推到仓库中,然后在设置中进行设置

![创建](createPages.png)

## 使用webhook自动化部署

>强烈建议使用ssh,而不是https

### 设置node环境

* 在官网下载最新版的node:`https://nodejs.org/en/download/`

```shell
wget https://nodejs.org/dist/v16.13.1/node-v16.13.1-linux-x64.tar.xz
```

* 解压

```shell
xz -d node-v9.3.0-linux-x64.tar.xz
tar -xf node-v9.3.0-linux-x64.tar
```

* 配置环境:在`/etc/profile`最后一行加入
* 注意:<span style="color:red">是node所在的路径</span>,我这里就是在`/`目录下

```shell
export PATH=$PATH:/node-v16.13.1-linux-x64/bin
```

* 测试

```shell
npm -v
node -v
```

### 构建服务

> 安装插件(按照自己的想法动手配置)

1. 在目录`\opt`下创建文件夹`webhook`,初始化插件

```shell
npm init -y
npm i -S github-webhook-handler
npm i pm2 -g
```

2. 构建webhook服务

>* `secret`设置必须何github后台的一致
>* 端口也必须和github的后台一致

```js
var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/', secret: 'secret' })
// 上面的 secret 保持和 GitHub 后台设置的一致文章后面会提到。
function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";
  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('gggggggggg')
  })
}).listen(7777)
handler.on('error', function (err) {
  console.error('Error:', err.message)
})
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
    run_cmd('sh', ['./deploy.sh',event.payload.repository.name], function(text){ console.log(text) });
})
```

### github设置

1. 在设置中打开开发者设置`Developer settings`
2. 打开个人访问令牌`Personal access tokens`,生成令牌
3. 打开存储库的设置中的网络钩子`webhooks`
   * `secret`:就是个人访问令牌`Personal access tokens`
   * `url`:端口一定要在安全组开放
   * 可以先看阮一峰的`github actions`:<https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html>
4. 会出现连接不到主机的状况(等待做完以下步骤)

![webhooks](webhooks.png)

### 执行shell脚本

1. 在服务器端生成ssh密钥(ssh存在于`/root/.ssh`文件夹),将公钥`pub`存入`github`中
2. `ssh-keygen -t rsa -C "zyj17715640603@gmail.com"`(自己的账号)
3. 配置`git`:

```shell
git config --gloabl user.name="jack"
git config --gloabl user.email=1553198027@qq.com
```

4. 使用`git clone git@...`克隆仓库

> 在`webhook`目录下创建`deploy.sh`写入以下内容

```shell
#!/bin/bash
# 网站的根目录,用自己的目录。
WEB_PATH='/opt/web/Jack-Zhang-1314.github.io.git'

echo “start deployment”
cd $WEB_PATH
echo “fetching from remote…”

git fetch –all
git reset –hard origin/master
echo “done”
```

>由于linux权限问题,建议先执行`chmod 777 ./deploy.sh`

* 然后运行`webhook.js`

```shell
pm2 start webhook.js
```

### nginx配置

>nginx代理开启网页:<http://mail.zyjcould.ltd/2021/10/30/fu-wu-qi-bu-shu/#toc-heading-8>

* 参考:<http://mail.zyjcould.ltd/2021/10/30/fu-wu-qi-bu-shu/#toc-heading-8>

# 使用 npm

## 关于代理

> 设置本地代理

```shell
# 设置代理
npm config set https-proxy http://127.0.0.1:7890
npm config set proxy http://127.0.0.1:7890
# 删除代理
npm config delete https-proxy
npm config delete proxy
```

>设置 npm 仓库

```shell
npm config set registry=http://registry.npmjs.org
```

---
title: 远程连接
date: 2021-10-21 10:12:33
categories: Config
tags:
   - Config
summary: 远程连接
---

## ssh 连接

1. `windows` 客户端在应用可选项中下载 `Openssh` 的客户端 (客户端一般是自带的) 和服务端，使用 `ssh -V` 查看有没有下载成功
2. 在计算机管理的服务中去开启带有 `openssh` 管理的页面，`Get-Service -Name *ssh*`，查看运行状态（需要在`powershell`中查看）
3. 查看 ssh 是否连接默认的 22 端口 `netstat -an | findstr :22`

   ```shell
   PS C:\Users\15531> netstat -an | findstr :22
     TCP    0.0.0.0:22             0.0.0.0:0              LISTENING
     TCP    [::]:22                [::]:0                 LISTENING
   ```

4. 打开终端，输入 `ipconfig`，可以看到无线局域网适配的 WLAN 的地址。然后就可以使用 ssh 连接了
5. 连接 ssh 的方法有很多（比如 vscode 的 RemoteSSH）

## 远程桌面

> 使用 windows 远程桌面，需要升级到 windows 专业版

- 由于 windows 远程桌面是被阉割的，需要去下载[修复工具](https://github.com/stascorp/rdpwrap/releases)
- 下载完之后，要以管理员身份运行 `install.bat`
- 出现 `Successfully installed` 代表成功

### 局域网

> 如果同在一个局域网就非常的简单

- 一定要在同一个局域网下
  - 在移动端设备下载 `RD Client`，输入 windows 的 ip，身份，密码即可

### frp

> 高性能的反向代理应用，对 web 服务支持根据域名进行路由转发行

#### 服务端配置

- 在服务器中使用 wget 下载 [frp](https://github.com/fatedier/frp/releases)

  ```shell
  wget https://github.com/fatedier/frp/releases/download/v0.38.0/frp_0.38.0_linux_amd64.tar.gz
  # 解压
  tar -zxvf frp_0.22.0_linux_amd64.tar.gz
  # 就不一一详说了
  ```

- 进入到 frp 目录后，输入以下内容
  - server_add: 服务器公网 ip
  - token: 可以改复杂一些和后面的客户端配置保持一致即可

```shell
[common] 
 server_addr = xxx.xxx.xxx.xxx  

 bind_port = 7000


 dashboard_port = 7500


 token = 12345678 


 dashboard_user = admin


 dashboard_pwd = admin
```

- 运行 `./frps -c frps.ini`,发现成功没问题

> 为了保证服务器连接关闭之后，还能继续运行，需要下载 screen（虚拟终端）

```shell
dnf install screen
# 建立起一次会话（frp 是会话的名称）
screen -S frp
# 到frp目录下
./frps -c frps.ini
```

- 产看后台以及进入之前的会话

```shell
screen -ls
# 757017.frp (Attached)：Attached状态，其实代表此虚拟终端，用户正在使用
# 756326.frp (Detached)

# 如果记住之前的会话的名称，使用此命令进入
screen -r frp

# 756326 为 pid，也可以为 name，此命令用于退出 虚拟终端
screen -X -S 756326 quit
```

#### 客户端配置

> windows 端需要和服务端配置相同版本的[frp](ttps://github.com/fatedier/frp/releases/download/v0.38.0/frp_0.38.0_windows_amd64.zip)

- token:同服务端配置 token 保持一致

```ini
[common]
server_addr = xxx.xxx.xxx.xxx 
server_port = 7000
token = 12345678 

[rdp]
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 7001

[smb]
type = tcp
local_ip = 127.0.0.1
local_port = 445
remote_port = 7002
```

> 运行 `.\frpc.exe -c .\frpc.ini` 成功后即可在 `RD Client` 使用远程连接

- 注意：在设置登录账号的时候，密码不是 `pin`，而是你登录账号的 Microsoft 的账号的密码。
- 如果你要开机自启动，需要在 Windows 的 StartUp 中添加 bat 脚本

```bash
:: frp 放置位置
::C:\Users\你的账户\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
:: frp 所在盘符 
e: 
cd 你的 frp 位置
.\frpc.exe -c .\frpc.ini
```

- 以上所有端口都要在服务器中开启

## 安卓投屏到电脑

> 需要下载两个软件 [`scrcpy`](https://github.com/Genymobile/scrcpy/releases) 和 [`platform-tools`](https://developer.android.com/studio/releases/platform-tools)

- 我使用的是可视化：[`scrcpy-gui`](https://github.com/Tomotoes/scrcpy-gui/releases)
  - 如果不使用可视化，可以看原作者地址，有很详细的教程 <https://github.com/Genymobile/scrcpy/releases>

> 下载完成后需要设置系统环境变量，按照自己的下载地址设置

- 测试 adb 是否装好，如下是成功装好

```shell
C:\Users\15531>adb version
Android Debug Bridge version 1.0.41
Version 31.0.3-7562133
Installed as G:\Screen\platform-tools\adb.exe
```

> 配置手机开发人员选项 (各个手机可能不同，以 mi10 举例)

1. 使用以下操作：打开设置 > 更多设置 > 开发者选项 > USB 调试
2. 使用数据线将手机和电脑连接
3. 在 cmd 使用 `scrcpy` 如果成功投屏手机就代表设置成功
4. 然后打开 `scrcpy-GUI` 会出现一个连接的手机设备
5. 如果在同一个局域网下也是可以投屏的

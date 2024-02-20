---
title: linux
date: 2022-01-27 15:59:55
categories: Linux
tags:
   - Linux
   - Config
summary: linux 的简单应用
---

## linux 目录

| 目录            | 解释                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **/bin**        | 存放最常使用的命令                                                                                           |
| **/boot**       | 启动 Linux 时使用的一些核心文件                                                                                |
| **/dev**        | 存放 linux 外部的设备，在 linux 中访问设备的方式和访问文件的方式是相同的                                          |
| **/etc**        | 这个目录用来存放所有的系统管理所需的配置文件和子目录                          |
| **/home**       | 用户的主目录，在 linux 中共每个用户都有一个自己的目录，一般该目录是由用户账号命名 |
| **/lib**        | 这个目录存放系统最基本的动态连接共享库，类似于 windows 的 dll 文件                                                |
| **/lost+found** | 一般情况是空的，非法关机后，就会存放一些文件                                                                   |
| **/media**      | 识别设备 (例如 u 盘等) 识别后，linux 会把识别的设备挂载到这个目录                                                  |
| **/mnt**        | 让用户临时挂别的文件系统，可以将光驱挂载在`/mnt`                                                              |
| **/opt**        | 这是给主机额外安装软件所摆放的                                                                               |
| **/proc**       | 虚拟目录。存放系统内存的映射                                                                                  |
| **/root**       | 系统管理员                                                                    |
| **/run**        | 临时文件系统，存储系统启动依赖的信息.(重启会被删掉)                                                           |
| **/sbin**       | 存放的是使用的系统管理程序                                                                                   |
| **/srv**        | 存放一些服务启动之后需要提取的数据                                                                           |
| **/sys**        | 2.6 之后才有的。该目录安装了 2.6 内核中出现的新的文件系统 sysfs                                                   |
| **/tmp**        | 存放临时文件，用完即删                                                                                        |
| **/usr**        | 用户的很多程序文件都在这个目录下，类似于`program files`                                                       |
| **/usr/bin**    | 系统用户使用的应用程序                                                                                       |
| **/usr/sbin**   | 超级用户使用的比较高级的管理员程序和系统守护程序                                                             |
| **/usr/src**    | 内核源代码默认存放的目录                                                                                     |
| **/var**        | 这个目录存放着不断扩充的东子                                                                                 |

## 常用命令

### 查看文件属性和修改

- 第一个 root 是`属主`,第二个 root 是`属组`

- 关于第一个字符的含义
  1. `-d`:代表是目录
  2. `-`:代表的是文件
  3. `-l`:代表的是链接文档 (`link file`)
  4. `b`:表示为装置文件里面的可供储存的接口设备 (可随机存取的装置)
  5. `c`:表示为装置文件里卖弄的串行端口设备 (键盘，鼠标等一次性读取装置)

- 剩下字符的含义
  1. `r`:表示可读
  2. `w`:表示可写
  3. `x`:代表可执行
  4. `-`:代表没有这个权限

> 修改文件属性

1. **chagrp:更改文件数组**
   - `chgrp [-R] 属组名 文件名`
   - `-R`:递归更改文件属组。放在更改某文件的同时，他目录下的所有文件属性都会更改
2. **chown:更改文件属主，也可以同时更改文件属组**
   - `chown [-R] 属主名 文件名`
   - `chown [-R] 属主名:属组名 文件名`
3. **chmod:更改文件 9 个属性**（最重要）
    - `chmod [-R] xyz 文件或者目录`
    - 两种设置：一种是数字 (常用) 一种是符号
    - 基本权限：`owner/group/others`每个都有自己身份的`read/write/execute`(途中的两个 root 分别就是主和组)
4. 每个字符对应的数字

```shell
r:4   w:2   x:1
chmod 770 filename # rwxrwx---
```

- 例如：`chmod 777 filename`:赋予文件最高权限

### 文件内容查看

- `cat`:从第一行开始显示文件的内容
- `tac`:从最后一行显示文件的内容
- `nl`:现实的时候顺道输出行号
- `more`:一页一页的显示文件内容 (空格代表翻页，enter 代表按行向下翻)
- `less`:与 more 相比，可以往前翻页 (上下键，q 是退出)
  - 查询：`/+查询字符`从头到尾向下查询，`?+查询字符`从尾到头向下查询
- `head`:只有头几行
- `tail`:只有尾几行

> `/etc/sysconfig/network-scripts`:linux 网络配置文件

### linux 链接的概念

- **硬链接**:硬链接相当于指向的是文件实际存储路径。可以使用这种机制建立到一些重要文件，防止误删
- **软链接**:软连接相当于指向文件路径，删除源文件，就访问不了

- 创建链接：`ln`
  1. 硬链接：`ln f1 f2`,创建 1 个 f1 的硬链接
  2. 软链接：`ln -s f1 f3`,s 代表软连接。创建 1 个 f1 的软链接`f3->f1`

> ls -a 有箭头指向的是软连接

### 账号管理

- 以下都需要 root 权限

> 一些云服务器会限制使用 root 或者**密码登录**，这时候我们需要更改它的默认配置

1. 切换到 root 权限中，进入 sshd_config 配置文件中

   ```bash
   sudo -i
   cd /etc/ssh/sshd_config
   ```

2. 修改 sshd_config 配置文件

   ```bash
   # Authentication:
   PermitRootLogin yes //默认为 no，需要开启 root 用户访问改为 yes
   # Change to no to disable tunnelled clear text passwords
   PasswordAuthentication yes //默认为 no，改为 yes 开启密码登陆
   ```

3. 重新开启 sshd 服务

   ```bash
   systemctl restart sshd
   # 或者是 ssh
   # systemctl restart ssh
   ```

4. 在 root 权限下更改 user 的密码

   ```bash
   passwd user
   ```

> 添加用户：`useradd -选项 用户名`

- `-m`：使用者目录。没有则自动建立
- `-c`：指定一段注释性描述
- `-d`  目录：指定用户主目录，如果此目录不存在，则同时使用 `-m` 选项，可以创建主目录
- `-g` 用户组：指定用户所属的用户组
- `-G` 用户组：指定用户所属的附加组
- `-s` Shell：指定用户的登录 Shell
- `-u` 用户号：指定用户的用户号，如果同时有 `-o`，则可以重复使用其它用户的标识号

- **创建用户的本质就是在 `/etc/password` 种写入一个用户的信息**

> 删除指定的用户：userdel 选项 用户名

- `-r`:删除用户的时候将他的目录也一起删掉

> 修改用户：usermod 选项 用户名

- `-m -c -d -g -G -s -u`：这些和以上的选项作用一样

```shell
[root@VM-12-17-centos home]# usermod -d /home/fw1314 fw

# 在/etc/password查看
fw:x:1001:1001::/home/fw1314:/bin/bash
```

#### 加入 sudo 用户组

> Ubuntu, kbuntu, debian, etc

```bash
usermod -a -G sudo user
```

> RedHat, Fedora, CentOS, etc

```bash
usermod -a -G wheel user
```

### 切换用户

1. 切换用户的命令：`su username`(username 是用户名)
2. 从普通的用户切换到 `root`：`su root` 需要输入密码
3. 在终端输入 exit 或者 `ctrl+d` 也可以退回到原来的账号
4. `hostname` 主机名：修改主机名

> - root 给用户设置密码：`passwd 用户名`
> - 普通用户直接输入：`passwd`,修改密码

### 锁定账户

> - `passwd -l` 用户名：将该账户锁定
> - `passwd -d` 用户名：将这个账户密码清空

## 用户组管理

> 每个用户都有一个用户组，系统可以对一个用户组种的所有用户进行集中管理 (例如开发，测试，运维，root 等).不同的 Linux 系统对用户组的规定有所不同
>
> 用户组的管理涉及用户组的添加，修改，删除。组的增加，删除和修改实际上就是对
> `/etc/group` 文件的更新

- 创建一个用户组 `groupadd 组名`
  - 查看 `cat /etc/group`
  - 创建完用户组可以得到一个组的 id `-g id`，如果不指定可以自增

```shell
[root@VM-12-17-centos home]# groupadd fw1314 -g 120
# fw1314:x:120:
```

> 删除用户组 `groupdel 组名`
>
> 修改用户组的权限`groupmod 选项 组名`

- `-g`：修改 id
- `-n`：修改组名

> 修改用户组 (一般直接在创建用户时使用 `-G` 分配组)

- 普通用户 `newgrp 组名`

### 文件的查看

```shell
root:x:0:0:root:/root:/bin/bash
```

- `/etc/password`：用户名:口令 (登录密码，不可见):用户标识符:组标识号:注释性描述:主目录:登录 shell
  - 每一行都代表一个用户，从中可以看出这个用户的主目录在哪，属于哪一个组
  - 密码放在 `/etc/shadow` 中

### 磁盘管理

1. `df`：列出文件系统整体的磁盘使用量 (`-h` 使用十进制表示)
2. `du`：检查当前磁盘空间的使用量
   - `du -sm /*`：检查根目录下所占用的容量

> Mac 或者用 Linux 挂载一些本地磁盘或者文件

- `mount /dev/fw /mnt/fw`：将外部设备 `/dev/fw` 挂载到 `/mnt/fw`，因为外部设备都会在 `/dev/fw` 中
  - `umount`：卸载。`-f`强制卸载

## 进程管理

`ps 选项`:查看系统中正在进行的进程信息

选项 解释 -a 显示当前终端运行的所有进程信息 (当前的进程) -u 以用户的信息显示进程
-x 显示后台运行进程的参数

```shell
A|B #使用A命令的结果来操作B命令
ps -aux # 查看所有的进程
```

- `grep`:查找文件中符合条件的字符串

```shell
ps -aux | grep nginx
```

- **ps -ef**:查看父进程的信息

```shell
ps -ef | grep nginx

# 一般使用目录树结构查看
pstree -pu
```

- **pstree**:以目录树结构查看
  - `-p`:显示父 id
  - `-u`:显示用户组

### 结束进程

- `kill 进程id`:杀掉进程
  - `-9`:强制杀掉进程

```shell
kill -9 873518
```

## 防火墙

1. 查看防火墙状态
   - 查看防火墙状态 `systemctl status firewalld`
   - 开启防火墙 `systemctl start firewalld`
   - 关闭防火墙 `systemctl stop firewalld`
   - 开启防火墙 `service firewalld start`
2. 查看对外开放的端口状态
   - 查询已开放的端口 `netstat  -ntulp | grep 端口号`:可以具体查看某一个端口号
   - 查看想开的端口是否已开：`firewall-cmd --query-port=6379/tcp`
   - 添加指定需要开放的端口：`firewall-cmd --add-port=123/tcp --permanent`
   - 重载入添加的端口：`firewall-cmd --reload`
   - 移除指定端口：`firewall-cmd --permanent --remove-port=123/tcp`
3. 若遇到无法开启
   - 先用：`systemctl unmask firewalld.service`
   - 然后：`systemctl start firewalld.service`

> 由于你开了防火墙的同时，可能还有 docker 服务，会遇到如下错误

```Shell
Error response from daemon: driver failed programming external connectivity on endpoint quirky_allen (4127da7466709fd45695a1fbe98e13c2ac30c2a554e18fb902ef5a03ba308438): (iptables failed: iptables --wait -t nat -A DOCKER -p tcp -d 0/0 --dport 9000 -j DNAT --to-destination 172.17.0.2:80 ! -i docker0: iptables: No chain/target/match by that name.
(exit status 1))
```

- `firewall` 的底层是使用 `iptables` 进行数据过滤，建立在 `iptables` 之上，这可能会与 `Docker` 产生冲突。

当 firewalld 启动或者重启的时候，将会从 iptables 中移除 DOCKER 的规则，从而影响了
Docker 的正常工作。

当你使用的是 Systemd 的时候，firewalld 会在 Docker 之前启动，但是如果你在 `Docker` 启动之后再启 或者重启 `firewalld`，你就需要重启 Docker 进程了

```shell
systemctl restart docker
```

## env

1. `env`:查看所有环境变量

   ```Shell
   env
   ```

2. `export`:查看所有环境变量
   - `export PATH="..."`: 在 PATH 最后添加指定变量 (环境变量)
   - 指定的环境变量立即生效

   ```shell
   source /etc/profile
   ```

   - 如果要删除某个环境变量，首先使用 `echo $PATH` 获取所有环境变量，然后使用
     `export PATH="..."` 来指定不要删除的环境变量 (排除删除的即可)

## scp

> 假设我们有两台主机 A and B，但是我们现在在主机 A 中

1. 如果我们想要将主机 A 的文件拷贝到主机 B

   ```bash
   $scp -r local_folder remote_username@remote_ip:remote_folder
   # 如果已经有对方公钥的情况
   $scp -r local_folder remote_ip:remote_folder
   ```

## curl

> 使用 `curl url` 可以返回对方的响应地址，默认是 get 请求

```bash
curl 'https://s1.hdslb.com/bfs/seed/bplus-common/icon-font/2.1.2/bp-icon-font.css'
```

- 如果需要发送 post 请求，需要 `curl -X -POST url` 来发送，当然也可以将 X 和
  POST 合起来写 `-XPOST`
  - 如果要返回数据，需要添加 -d 标志

```bash
# 添加 json 格式的数据
curl -XPOST url -d '{"fw":"me"}'
```

- 更新数据 `-XPUT`

```bash
curl -XPUT url -d '{"update":"更新数据"}'
```

- 删除数据 `-XDELETE`

> 如果我们需要添加 header 信息，需要使用 `-H` 选项

```bash
# 如果需要多个 header，可以添加多个 -H，例如 -H ... -H ...
curl -XPOST url -H 'Content-Type:application/json' -d '{"fw":"me"}'
```

- 如果我们想要获取到响应的 header 信息，可以使用 `curl -I url`

```bash
curl -I 'https://s1.hdslb.com/bfs/seed/bplus-common/icon-font/2.1.2/bp-icon-font.css'
```

> 如果目标端有资源需要处理，需要使用 `curl -O url`,
> 会将资源直接下载到当前的目标的文件夹中

```bash
curl -O 'https://s1.hdslb.com/bfs/seed/bplus-common/icon-font/2.1.2/bp-icon-font.css'
```

- 当然，如果使用 `-o filename` 就可以修改文件名

```bash
curl -o fw.css 'https://s1.hdslb.com/bfs/seed/bplus-common/icon-font/2.1.2/bp-icon-font.css'
```

- 如果下载大文件，并且想要限制速度，可以使用 `--limit-rate` 速度
  (不设置单位默认是**字节**)

```bash
curl --limit-rate 100k -o fw.css 'https://s1.hdslb.com/bfs/seed/bplus-common/icon-font/2.1.2/bp-icon-font.css'
```

- 如果下载中止（可能是 <kbd>ctrl</kbd>+<kbd>c</kbd>）这时候可以使用 `-C` 其它命令

```bash
#因为这里不需要其他参数，所以 -C 后跟 -
curl -C - -o fw.css 'https://s1.hdslb.com/bfs/seed/bplus-common/icon-font/2.1.2/bp-icon-font.css'
```

> curl 默认不会跟着重定向

- 为了跟着重定向，我们需要使用 `-L`

```bash
curl https://www.bilibili.com -L
```

> 如果想要查看连接的所有信息，需要使用 `-v`

```bash
curl -v https://www.bilibili.com -L
```

- 使用代理去请求（`--proxy`），一般情况下，这个都是需要账户和密码的

```bash
curl --proxy "https://xxx@ip:port" url
```

- 如果是 ftp 协议，需要用户名和密码，那么就可以用小写的 `-u` 来指定

```bash
curl -u user:password -O ftp://server/xxx
```

- 如果上传文件，需要增加 `-T` 后面跟着文件名

```bash
curl -u user:password -T file ftp://server/xxx
```

## alias

设置别名

```bash
alias rm="rm i"
```

取消别名

```bash
unalias rm
```

## 命令历史

查看所有命令历史

```bash
history
```

查看上一条命令

```bash
!!
```

## 快捷键

- ctrl + a 移动到行首
- ctrl + e 移动到行尾
- ctrl + u 删光所有字符
- ctrl + k 删除光标之后到
- ctrl + l 清空屏幕终端的内容

## 文本处理工具

1. grep: 文本过滤工具（模式：pattern）
2. sed: stream editor；文本编辑工具
3. awk: 文本报告生成器（支持格式化文本）

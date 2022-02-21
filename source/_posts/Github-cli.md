---
title: Github-cli
date: 2022-02-21 10:29:42
categories: git
tags:
   - git
summary: 使用gihub-cli对github进行操作
---

## [githubCli](https://cli.github.com/)

>简单来讲,gihub是一个基于可视化的操作存储库.而githubcli就是使用命令操作存储库

* 下载完之后,可能有一系列玄学问题.重启一下可以解决80%

* 使用`gh [cli命令] -help`可以查询使用方法

### gh auth

>githubcli通过帮助您通过基于浏览器的`OAuth`登录GitHub或接受个人访问令牌,此交互式命令可初始化身份验证状态

* `-h,--hostname <string>`:要用于进行身份验证的 GitHub 实例的主机名

* `gh auth login`:授权githubcli登录这个账户
* `gh auth logout`:登出github
* `gh auth refresh`:刷新github账户
* `gh auth status`:查看githubcli登录状态
  * `-t`:显示身份验证令牌

### gh ssh-key

>`gh ssh-key add [<key-file>] [flags]`:将 SSH 密钥添加到您的 GitHub 帐户

* `-t,--title <string>`:新密钥的标题

>`gh ssh-key list`:列出 GitHub 帐户中的 SSH 密钥

### browse

```bash
gh browse [<number> | <path>] [flags]
```

* `-b,--branch <string>`:选择其他分支打开浏览器
* `-c,--commit`:打开上次提交
* `-n,--no-browser`:打印目标URL,不打开浏览器
* `-p,--projects`:开放存储库项目
* `-R,--repo <[HOST/]OWNER/REPO>`:使用 [主机/]所有者/存储库格式选择另一个存储库
* `-s,--settings`:打开存储库设置
* `-w,--wiki`:开放存储库维基

> 如果想要打开其它存储库,需要使用`-R`.如果直接接url,`gh browse url`,如果是相对url会叠加到当前库的url中

* 正确的使用方法是:`gh browse -R Jack-Zhang-1314/JS_Webpack`
* 并且以上的flags是可以叠加的

### [codespace(代码空间)](https://docs.github.com/en/codespaces/getting-started/quickstart)

>代码空间是浏览器中的集成开发环境(IDE).代码空间包括为特定仓库开发所需的一切,其中包括具有语法突出显示和自动完成功能的文本编辑器,终端,调试工具和Git命令,所有这些都集成在GitHub中.您也可以在代码空间中安装`Visual Studio Code`扩展以添加更多功能.

* 代码空间使开发人员更容易加入新公司或开始为开源项目做出贡献. 项目维护员可以配置仓库,以便在为仓库创建代码空间时自动包含项目的依赖项. 减少配置环境所用的时间,可以更快地开始编码.
* 代码空间允许您在云端开发,而不是本地开发. 开发者可以随时随地任何机器(包括平板电脑或 Chromebooks)上参与项目开发,无需维护知识产权的本地副本.

> 目前代码空间只有付费的组织才可以使用.个人和自由组织暂时都不能使用

### gh config

* `gh config get <key> [flags]`:输出指定配置的键
  * `-h,--host <string>`获取主机设置
* `gh config list`:输出所有的配置
* `gh config set <key> <value> [flags]`:使用给定键的值设置配置
  * `-h,--host <string>`获取主机设置

### [Gist](https://gist.github.com/)

>GitHub有一个隐藏得很好的衍生产品github Gist.这是一种更快,更简单的在线共享代码的方式.与Pastebin一样,Gist是一个通过互联网共享文本的工具.但它提供了额外的功能,并且特别得到了Git强大的版本控制的支持

* `gh gist clone <gist> [<directory>] [-- <gitflags>...]`:克隆gist
  * 例如`gh gist clone git@gist.github.com:ea351c91acc4f4b0395c6e6241b866bf.git`

* `gh gist create [<filename>... | -] [flags]`:创建一个gist
  * `-d,--desc <string>`:gist的说明
  * `-f,--filename <string>`:创建gist时传入的文件
  * `-p,--public`:使gist公开,默认是机密的
  * `-w,--web`:创建gist并打开Web浏览器
  * 例如`gh gist create test.md -p -w`

* `gh gist list [flags]`:获取自己的gist
  * `-L,--limit <int>`:要获取的最大数量
  * `--public`:仅显示公共gist
  * `--secret`:仅显示秘密的gist

* `gh gist delete {<id> | <url>}`:删除gist

* `gh gist edit {<id> | <url>} [<filename>] [flags]`:编辑gist
  * `-a,--add <string>`:将新文件添加到gist
  * `-d,--desc <string>`:gist的新描述
  * `-f,--filename <string>`:选择要编辑的文件
  * 例如:`gh gist edit ea351c91acc4f4b0395c6e6241b866bf -f test.md`

* `gh gist view [<id> | <url>] [flags]`:显示gist
  * `-f,--filename <string>`:显示gist中的单个文件
  * `--files`:从gist中列出文件名,不显示其他内容  
  * `-r,--raw`:打印原始内容而不是渲染之后的gist(例如md)
  * `-w,--web`:在浏览器中打开要点
  * 例如:`gh gist view ea351c91acc4f4b0395c6e6241b866bf --files`

### gh repo

>`gh repo archive [<repository>] [flags]`存档仓库.`-y`跳过确认

* 存档仓库：您可以存档仓库，将其设为对所有用户只读，并且指出不再主动维护它。 您也可以取消存档已经存档的仓库。
* 在仓库存档后，便无法添加或删除协作者或团队。 具有仓库访问权限的贡献者只能对项目复刻或标星。
* 当仓库存档后，其议题、拉取请求、代码、标签、重要事件、项目、wiki、版本、提交、标记、分支、反应和注解都会变成只读。 要更改存档的仓库，必须先对仓库取消存档

>`gh repo clone <repository>`克隆仓库

* 在本地克隆 GitHub 存储库

>`gh repo create [<name>] [flags]`:创建存储库

* `-c,--clone`:将新存储库克隆到当前目录
* `-d,--description <string>`:存储库的描述
* `--private`:将新存储库设为私有
* `--public`:公开新存储库
* `--push`:将本地提交推送到新存储库
* `-r,--remote <string>`:指定新存储库的远程名称
* `-s,--source <string>`:指定要用作源的本地存储库的路径
* `-g,--gitignore <string>`:为存储库指定 gitignore 模板
* `-h,--homepage <URL>`:存储库主页网址
* `--disable-issues`:禁用新存储库中的问题
* `--disable-wiki`:在新存储库中禁用 wiki
* `--internal`:将新存储库设为内部存储库
* `-l,--license <string>`:为存储库指定开源许可证
* `-t,--team <name>`:要授予访问权限的组织团队的名称
* `-p,--template <repository>`基于模板存储库创建新存储库

1. 使用交互的方式创建存储库`gh repo create`
2. 使用非交互的方式创建
   * 直接创建远程仓库`--public --private --internal --clone`
   * 将本地仓库推到新的远程仓库`--source--push`

> `gh repo list [<owner>] [flags]`列出用户或组织拥有的存储库

* `-l,--language <string>`:按主要编码语言筛选
* `-L,--limit <int>`:要列出的存储库的最大数量
* `--archived`:仅显示已存档的存储库
* `--no-archived`:省略已存档的存储库
* `--private`:仅显示私有仓库
* `--public`:仅显示公共存储库
* `--fork`:仅显示fork
* `--source`:仅显示非分叉
* `-q,--jq <expression>`:使用 jq 表达式筛选 JSON 输出
* `--json <fields>`:输出具有指定字段的 JSON
* `-t,--template <string>`:使用 Go 模板设置 JSON 输出的格式
* `--topic <string>`:按主题筛选

>`gh repo view [<repository>] [flags]`:显示 GitHub 存储库的描述和自述文件.如果没有参数,显示当前仓库的

* [-b,--branch <string> | -q,--jq <expression> | -t,--template <string> | -w,--web]

>`gh repo deploy-key`,部署密钥

* `-R,--repo <[HOST/]OWNER/REPO>`:选择其它的仓库或者主机,使用者
  * `gh repo deploy-key add <key-file> [flags]`:增加密钥
    * `-w,--allow-write`:允许密钥的写入访问权限
    * `-t,--title <string>`:新密钥的标题
  * `gh repo deploy-key delete <key-id>`:删除密钥
  * `gh repo deploy-key list`:查看所有密钥

> `gh repo delete [<repository>] [flags]`删除存储库

* `--confirm`,确认删除,不带提示

>`gh repo rename [<new-name>] [flags]`重新命名仓库名称

* [-y,--confirm | -R,--repo <[HOST/]OWNER/REPO>]

>`gh repo edit [<repository>] [flags]`:编辑存储库

* `--add-topic <strings>`添加存储库主题
* `--remove-topic <strings>`:删除存储库主题
* `--visibility <string>`:将存储库的可见性更改为 {`public`、`private`、`internal`}
* `--allow-forking`允许fork组织存储库
* `--default-branch <name>`:设置存储库的默认分支名称
* `--delete-branch-on-merge`:合并拉取请求时删除头分支
* `-d,--description <string>`:存储库的描述
* `--enable-issues`:在存储库中启用问题
* `-h,--homepage <URL>`:设置存储库主页网址
* `--enable-auto-merge`:启用自动合并功能
* `--enable-merge-commit`:通过合并提交启用合并拉取请求
* `--enable-rebase-merge`:拉取请求存在合并冲突,会重新定位合并冲突
* `--enable-squash-merge`:拉取请求的提交将压缩到单个提交中
* `--enable-wiki`:在存储库中启用 wiki
* `--enable-projects`:在存储库中启用项目
* `--template`:使存储库可用作模板存储库

>`gh repo fork [<repository>] [-- <gitflags>...] [flags]`:创建存储库的分支

* `--clone`:克隆到本地 {true|false}
* `--fork-name <string>`:指定分叉存储库的名称
* `--org <string>`:在组织中创建分支
* `--remote`:为分叉添加远程 {true|false}
* `--remote-name <string>`:指定新的远程仓库名称

### gh issue

* `-R,--repo <[HOST/]OWNER/REPO>`使用 [主机/]所有者/存储库格式选择另一个存储库

>`gh issue list [flags]`:列出和筛选此存储库中的问题

* `-a,--assignee <string>`:按回答问题的受让人(assignee)
* `-A,--author <string>`:按问题的作者筛选
* `-l,--label <strings>`:按标签筛选
* `-L,--limit <int>`:要获取的最大问题数
* `--mention <string>`:按提及筛选
* `-m,--milestone <number>`:按里程碑编号或"标题"筛选
* `-S,--search <query>`:查询的搜索问题
* `-s,--state <string>`:按状态筛选`{open|closed|all}`
* \[-t,--template <string> | -q,--jq <expression> | --json <fields>]:输出格式
* `-w,--web`:打开浏览器以列出问题

>`gh issue view {<number> | <url>} [flags]`:显示有关问题的标题、正文和其他信息。

* `-c,--comments`:查看问题评论
* \[-q,--jq <expression>|--json <fields> |-t,--template <string>]:输出格式
* `-w,--web`:在浏览器中打开问题

>`gh issue create [flags]`创建新问题

* `-a,--assignee <login>`:通过登录名分配人员。使用"@me"进行自我分配。
* `-b,--body <string>`:提供问题的内容。否则将提示一个。
* `-F,--body-file <file>`:从文件中读取正文文本（使用"-"从标准输入读取）
* `-l,--label <name>`:按名称添加标签
* `-m,--milestone <name>`:按名称将问题添加到里程碑
* `-p,--project <name>`:按名称将问题添加到项目
* `--recover <string>`:从失败的创建运行中恢复输入
* `-t,--title <string>`:提供标题。否则将提示一个。
* `-w,--web`:打开浏览器以创建问题

```bash
gh issue create -t "测试" -b "问题的内容" -a "@me" -w
```

* 将标题设置为测试,添加内容,受让人是我自己,在浏览器打开

>`gh issue edit {<number> | <url>} [flags]`:编辑问题

* `[-t | -b | -F | -m]`:与create一样
* `--add-assignee <login>`:通过登录名添加分配的用户。使用"@me"来分配自己。
* `--add-label <name>`:按名称添加标签
* `--add-project <name>`按名称将问题添加到项目
* `--remove-assignee <login>`:通过登录名删除分配的用户。使用"@me"取消分配自己。
* `--remove-label <name>`:按名称删除标签
* `--remove-project <name>`:按名称从项目中删除问题

> `gh issue delete {<number> | <url>}`删除问题
>
> `gh issue close {<number> | <url>}`关闭问题
>
>`gh issue reopen {<number> | <url>}`:重新打开问题

...

>`gh issue comment {<number> | <url>} [flags]`创建新问题评论

* `-b,--body <string>`提供正文。否则将提示一个。
* `-F,--body-file <file>`:从文件中读取正文文本（使用"-"从标准输入读取）
* `-e,--editor`:使用编辑器添加正文
* `-w,--web`:在浏览器中添加正文

>`gh issue status [flags]`:问题状态

* \[-t,--template <string> | -q,--jq <expression> | --json <fields>]:输出格式

>`gh issue transfer {<number> | <url>} <destination-repo>`将问题转到另一个库

### gh pr

* `-R,--repo <[HOST/]OWNER/REPO>`使用 [主机/]所有者/存储库格式选择另一个存储库

> gh pr list [flags]

* `[-a | -A | -L | -l | -S | -s | --json | -q | -t | -w]`查看issue
* `-B,--base <string>`:按基本分支筛选
* `-d,--draft`:按草稿状态筛选
* `-H,--head <string>`:按头分支筛选

>`gh pr view [<number> | <url> | <branch>] [flags]`:显示有关拉取请求的标题、正文和其他信息

* `[ --json | -q | -t ]`:输出格式
* `-c,--comments`:查看拉取请求注释

>`gh pr status [flags]`:查看拉取请求的状态

* `[ --json | -q | -t ]`:输出格式

>`gh pr close {<number> | <url> | <branch>} [flags]`:关闭pr

* `-d,--delete-branch`:关闭后删除本地和远程分支

>`gh pr reopen {<number> | <url> | <branch>}`:重新打开和拉取请求

...

>`gh pr checkout {<number> | <url> | <branch>} [flags]`:在git中拉取请求到本地

* `-b,--branch <string>`:远程分支要使用的本地分支名称(默认是主分支)

>`gh pr review [<number> | <url> | <branch>] [flags]`:审阅当前的拉取请求

* `-a,--approve`:批准拉取请求
* `-b,--body <string>`:指定审阅的正文
* `-F,--body-file <file>`:从文件中读取正文文本
* `-c,--comment`:对拉取请求发表评论
* `-r,--request-changes`:请求对拉取请求进行更改

>`gh pr comment [<number> | <url> | <branch>] [flags]`:创建新的 PR 注释(评论)

* `-b,--body <string>`:提供正文。否则将提示一个。
* `-F,--body-file <file>`:从文件中读取正文文本（使用"-"从标准输入读取）
* `-e,--editor`:使用编辑器添加正文
* `-w,--web`:打开浏览器

>`gh pr ready [<number> | <url> | <branch>]`:将拉取请求标记为已就绪(可供审核)

...

>`gh pr merge [<number> | <url> | <branch>] [flags]`:在 GitHub 上合并拉取请求

* `--admin`:使用管理员权限合并不符合要求的拉取请求
* `--auto`:仅在满足必要要求后自动合并
* `-b,--body <text>`:合并提交的正文文本
* `-F,--body-file <file>`:从文件中读取正文文本（使用"-"从标准输入读取）
* `-d,--delete-branch`:合并后删除本地和远程分支
* `--disable-auto`:禁用此拉取请求的自动合并
* `-m,--merge`:将提交与基本分支合并
* `-r,--rebase`:将提交重新定位到基础分支
* `-s,--squash`:将提交压缩到一个提交中，然后将其合并到基础分支中
* `-t,--subject <text>`:合并提交的主题文本

> `gh pr create [flags]`:创建一个pr

* [-a | -b | -F | -l | -m | -P | -t | -w]

* `-B,--base <branch>`:要将代码合并到其中的分支
* `-d,--draft`:将拉取请求标记为草稿
* `-f,--fill`:不要提示标题/正文，只使用提交信息
* `-H,--head <branch>`:包含拉取请求提交的分支（默认值：当前分支）
* `--no-maintainer-edit`:禁用维护者修改拉取请求的功能
* `--recover <string>`:从失败的创建运行中恢复输入
* `-r,--reviewer <handle>`:按句柄请求人员或团队进行审核

>`gh pr diff [<number> | <url> | <branch>] [flags]`

`--color <string>`:在差异输出中使用颜色：{always|never|auto}
`--patch`:以补丁格式显示差异

>`gh pr edit [<number> | <url> | <branch>] [flags]`:编辑拉取请求。

--add-assignee <login>| --remove-assignee <login> | --add-label <name> | --remove-label <name> | --add-reviewer <login> | --remove-reviewer <login> | --add-project <name> | --remove-project <name> | -b,--body <string> | -F,--body-file <file> | -m,--milestone <name> | -t,--title <string>

* `-B,--base <branch>`:更改此拉取请求的基本分支

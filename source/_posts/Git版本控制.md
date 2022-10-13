---
title: Git版本控制
date: 2021-10-09 00:17:11
author: Jack-zhang
categories: git
tags:
   - git
summary: 使用git进行代码的版本控制
---

## 初始化

- `git config --global user.name "jack"`
- `git config --global user.email "1553198027@qq.com"`
- 检查配置信息 `git config --list`
- `git init` 生成仓库

> 生成 ssh 密钥

```bash
# 使用的是 rsa 密钥
ssh-keygen -t rsa
```

### 区域

>工作区,暂存区,版本库

### git基本命令

#### 创建工作目录 对工作目录进行修改

- `git add ./`(下面的属于解释)
  1. git hash-object -w 文件名(修改了多少个工作目录中的文件 此命令就要被执行多少次)
  2. git update-index...
- `git commit -m "注释内容"`(下面的属于解释)
  1. git write-tree
  2. git commit-tree

#### git暂存区命令

| `git init`          | 初始化仓库                           |
| ------------------- | ------------------------------------ |
| `git status`        | 查看本地工作区信息                   |
| `git diff`          | 查看还有哪些文件没有暂存             |
| `git diff --staged` | 查看哪些修改已经被暂存,还没有提交    |
| `git add ./`        | 提交所有变化                         |
| `git add –u`        | 提交被修改和被删除文件(不包括新文件) |
| `git add –A`        | 提交所有变化                         |
| `git ls-files -s`   | 查看暂存区存储状况                   |

#### 更改文件与提交

| `git rm 文件名`            | 删除工作目录中的对应文件 再将修改添加到暂存区     |
| -------------------------- | ------------------------------------------------- |
| `git mv 原文件名 新文件名` | 将工作目录中的文件进行重命名 再将修改添加到暂存区 |
| `git commit`               | 在文本中编辑注释                                  |
| `git commit -a`            | 跳过暂存区提交                                    |
| `git commit -m 注释`       | 将暂存区提交到版本库                              |
| `git commit -a -m 注释`    | 跳过暂存区提交编辑注释                            |
| `git commit –amend 注释`   | (原来提交基础上提交,不是新的提交)                 |

#### git版本查看

| `git log`                                    | 带有完全键很多信息的版本查看,如作者 |
| -------------------------------------------- | ----------------------------------- |
| `git log --oneline`                          | 只有部分键,部分信息的版本查看       |
| `git log --prety=oneline`                    | 查看提交的历史记录                  |
| `git log --oneline --decorate --graph --all` | 查看项目分叉历史                    |
| `git config --global alias.别名`             | "git后的命令"配置别名               |
| `git log -1`                                 | 后面加数字,显示最近的几次提交       |

### git分支

| `git branch`               | 显示分支列表                     |
| -------------------------- | -------------------------------- |
| `git branch 分支名`        | 创建分支                         |
| `git checkout 分支名`      | 切换分支                         |
| `git branch -D 分支名`     | 强制删除分支                     |
| `git branch -d branchname` | 普通删除分支                     |
| `git merge branchname`     | 合并分支                         |
| `git reflog –-date=local`  | 查看当前分支是基于哪个分支建立的 |
  
- 快进合并:分支在一条线上,不会产生冲突
- 典型合并:分支不在同一条线上,有机会产生冲突
- 解决冲突:打开冲突的文件 进行修改add commit

#### 切换分支

> 在切换分支时,如果当前分支上有<span style="color:red">未暂存的修改(第一次)或者有未提交的的暂存(第一次)</span>分支可以切换成功,但这种操作可能污染其它分支

#### 区域的的更改

- 工作区
  - 如何撤回自己在工作目录中的修改(git checkout --filename)
  - git restore 文件名
- 暂存区
  - 如何撤回自己的暂存:(git reset HEAD fileman)
  - git restore --staged 文件名
- 版本库
  - 如何撤回自己的提交
  - 1.注释写错了重新给用户一次机会该注释`git commit --amend`

#### 版本回退(revert和resert)

> `git log`
>>`git reflog`只要是HEAD有变化,那么`git reflog`就会记录下来

1. `git revert`是用一次新的commit来回滚之前的commit,`git reset`是直接删除指定的commit.
2. `git reset` 是把HEAD**向后移动**了一下,而`git revert`是HEAD**继续前进**
3. 新的commit的内容和要revert的内容正好相反,能够抵消要被revert的内容

>参数:

1. **--soft**:重置HEAD到另外一个commit,但也到此为止 , 所有变更都集中到暂存区,工作区
2. **--hard**:危险操作,所有变更全部丢失,不管本地仓,暂存区,工作区
3. **--mixed**:所有变更保存到工作区,本地仓,暂存区都丢失(默认参数)

##### resert

- `HEAD~`指针跟一个整数,指的是你要回退几次提交
   1. `git reset --soft HEAD~  (--amend)`:只动HEAD(带着分支一起移动)
   2. `git reset [--mixed] HEAD~`动HEAD(带着分支一起移动),动了暂存区
   3. `git reset --hard HEAD~`动HEAD(带着分支一起移动),动了暂存区 动了工作目录(<span style="color:red">需要谨慎</span>)

##### revert

1. `git revert HEAD`:撤销前一次的commit
2. `git revert HEAD^`:撤销前前一次的commit
3. `git revert commit-id`:撤销指定版本的提交

>`-n`或者`–no-commit`,应用这个参数会让revert改动只限于本地仓库,而不自动进行commit

#### 远程分支

1. `git remote –v`:查看远程版本库信息
2. `git remote show origin`:查看远程仓库的信息
3. `git remote set-url origin git@...`:更改远程仓库地址(ssh)
4. `git remote add origin git@...`:增加远程仓库地址(ssh)

> `git branch -r`:查看远程分支

- `git branch -a`:查看所有分支
- `git branch -vv`:查看本地的分支对应远程的分支

> `git fetch <远程主机> <分支名>`:取回远程主机的分支

- 例如`git fetch origin master`:取回origin的master分支

- `git fetch --prune`:删除本地有而远程没有的分支或者一些多余的`commit`
  - `git remote prune`:也可以使用这个

- `git fetch -v`:查看远程分支的信息

>合并远程分支

- `git rebase` 和`git merge`的区别是`git rebase`形成的是一条线,会把你当前的几个commit,放到最新commit的后面(所以rebase并没有执行合并操作).`git merge` 会把公共分支和你当前的commit按照提交时间合并在一起,形成一个新的 commit 提交,<span style="color:red">注意不要在公共分支使用rebase</span>

- `git merge origin/master`:合并某个分支到当前分支
  - **merge**:遇见冲突后会直接停止,等待手动解决冲突并重新提交 commit 后,才能再次 merge
- `git rebase origin/master`:将一个分支的修改合并到当前分支
  - **rebase**:遇见冲突后会暂停当前操作,开发者可以选择手动解决冲突,然后 `git rebase --continue` 继续,或者`--skip`跳过(当前分支的修改会直接覆盖目标分支的冲突部分)

>`git pull`:用于从远程获取代码并合并到本地分支

- 可以看作这两个的简写:`git fetch`和 `git merge FETCH_HEAD`
- `git pull -v`:同时显示拉取信息

1. 更新操作:
   - `git pull`
   - `git pull origin`
2. `git pull origin master:bro`:将远程仓库origin的master分支拉取与本地的bro分支合并

#### 分支注意

- 在切换的时候一定要保证当前分支是干净的！！！
  - 允许切换分支:
    1. 分支上所有的内容处于已提交的状态
    2. (避免)分支上所有的内容是处于初始化创建 处于未跟踪状态
    3. (避免)分支上的内容是初始化创建 第一次处于已暂存状态
  - 不允许切分支:
    - 分支上所有的内容处于已修改的状态 或 第二次以后的已暂存状态

- 在分支上的工作做到一半时 如果有切换分支的需求,我们应该将先有的工作存储起来
  - `git stash`:会将当前分支上的工作推到一个栈中
- 分支切换:进行其它工作 完成其它工作 切回原分支
  - `git stash apply`:将栈顶的工作内容还原 但不让任何内容出栈
  - `git stash drop`:取出栈顶的工作内容后 就应该将其删除(出栈)
  - `git stash pop`=`git stash apply+git stash drop`
  - `git stash list`:查看存储

## tag

> git可以对某个版本打上标签(tag),表示本版本为发行版

| 命令               | 解释               |
| ------------------ | ------------------ |
| git tag            | 查看所有标签       |
| git tag -l 1.*.*   | 打印符合检索的标签 |
| git checkout 1.0.0 | 查看对应标签的状态 |
| git show v1.4      | 完整标签的信息     |

> 创建本地标签

1. 针对特定commit版本SHA创建标签
   - `git tag -a v1.0.0 (0c3b62d) -m "message"`
   - `-a`:创建附注标签
   - \<哈希值>:特定commit版本SHA
   - `-m`:附注
   - 都是可选的
2. 创建轻量标签
   - `git tag v1.0.0`

> 推送标签到远程仓库

1. 发送所有`git push origin --tags`
2. 指定版本发送`git push origin 1.0.0`

> 删除本地标签`git tag -d v1.0.0`
>
> 删除远程仓库对应的标签`git push origin --delete v1.0.0`

---
title: git回滚与撤销
date: 2022-04-30 20:12:52
author: Jack-zhang
categories: git
tags:
   - git
summary: 使用git进行代码的版本控制
---

## 撤销

1. 存在工作目录.代码并没有提交到暂存区(没有进行`git add`操作).在工作树中修改

   ```bash
   # 需要撤销的文件或者 .(当前目录)
   git checkout <filname>
   ```

2. 代码提交到暂存区(进行了`git add`),但是想要撤销提交

   ```bash
   # 需要从暂存区撤销的提交
   git reset HEAD <filename>
   ```

3. 代码已经提交(`git commit`)
   * 已经进行多次提交,但是在最后一次修改后,不再产生新的提交

   ```bash
   # 注释名为最后一次的
   git commit --amend -m "最后一次的注释"
   ```

>在 `git 2.3` 版本之后可以使用 restore 来执行 1,2 的操作

   ```bash
   # 撤销工作区文件修改, 不包括新建文件
   git restore README.md # 一个文件
   git restore README.md README2.md # 多个文件
   git restore . # 当前全部文件
   
   # 从暂存区回到工作区
   git restore --staged README.md
   ```

> 如果想撤销到其中某次commit

* 这些操作分别是对**工作目录**,**暂存区**,**当前HEAD**的位置的改变
* `git reset [--hard|soft|mixed|merge|keep] [commit|HEAD]`
  1. `--hard`:重设当前`HEAD`位置.并将之前commit以来的**工作区目录**和**暂存区**的改变都丢弃
     * 彻底回退到某一个版本.本地所欲的源码也会变为上一个版本的内容
     * 例如`git reset --hard HEAD~1`:将代码回退到前一次提交,并且将之前的所有改变丢弃
  2. `--soft`:只重设当前`HEAD`位置.所有更改的文件会回到**工作区目录**和**暂存区**
     * `git status`可以查看回退的状态.只是回退了提交的信息,不会回退提交的内容.
  3. `--mixed`:重设当前`HEAD`位置和**暂存区**位置.但是不会重设**工作区**的内容
     * `git status`:查看回退的状态.已经回退到初始状态(没有使用`git add`之前)
     * 例如`git reset --mixed HEAD~1`:将代码回退到上一次提交.提交内容保留在工作区

## 回滚

>如果已经使用`git push`,推送到远程仓库中.对已经提交到远程仓库的还原操作叫回滚

1. 撤销本地仓库的提交
   * `revert`:放弃指定提交的修改,会生成一次新的提交,并且以前的历史记录都在
     * 例如:`git revert HEAD~1`.将代码回滚到上一次的提交,但是不会销毁之前提交,并且生成一个新的提交
   * `reset`:是指将HEAD指针指到指定提交,历史记录中不会出现放弃的提交记录(会销毁之前的提交)
2. 对远程仓库的提交进行回滚(撤销远程仓库的提交)
   * 需要强制将本地回退的代码推到远程仓库,进行回滚操作
   * `git push origin 本地分支 --force-with-lease`
   * `--force-with-lease`并不会像`--force`强制将代码覆盖
     * 如果远端有其他人推送了新的提交,那么推送将被拒绝,并且和`--force`参数时的拒绝是一样的
     * 如果远端没有其他人推送,会直接进行强制推送(**回滚**)

> 如果没有其他人推送提交时

```bash
git reset --hard HEAD~1
git push origin 本地分支 --force-with-lease
```

> 当遇到其他人推送新的提交时(产生冲突),需要使用`git fetch`

* 在`git fetch`之后需要合并fetch下的分支.需要考虑使用`rebase`和`merge`情况
  * `rebase`会将分支合并到一个分支,不会保留被合并分支的提交记录.保证主分支的纯粹
    * ![ ](/git/rebase.png)
  * `merge`会将分支合并到一个分支,会保留被合并分支的提交记录
    * ![ ](/git/merge.png)
* 在开发中尽量选择rebase合并分支,来保证主分支的清晰
* 继续推送以达到回滚的效果

### merge和rebase

* `rebase`:下游分支更新上游分支内容的时候使用
* `merge`:上游分支合并下游分支内容的时候使用
* `git pull origin dev --rebase`更新当前分支的内容时一定要使用`--rebase`参数

>例如现有上游分支`master`,基于`master`分支拉出来一个开发分支`dev`,在`dev`上开发了一段时间后要把`master`分支提交的新内容更新到 `dev`分支
>
>此时切换到`dev`分支,使用`git rebase master`等`dev`分支开发完成了之后,要合并到上游分支`master`上的时候,切换到`master`分支,使用`git merge dev`

### 撤销回退

![ ](/git/resetback.png)

> 如果在回退的时候回退过了怎么办

1. 使用`git reflog`找到当前的提交记录的`commit`值(hash值)

   ```bash
   bf75e3e (HEAD -> dev, upstream/master, origin/test, origin/master, origin/dev, origin/HEAD) HEAD@{0}: reset: moving to HEAD~1
   e87c01a HEAD@{1}: reset: moving to HEAD~4
   ```

2. `git checkout bf75e3e`.检出需要撤销到某一版本的提交
3. `git checkout -b mer`为需要找回的版本创建新分支
4. `git branch dev`&&`git rebase mer`切换分支并且合并分支
5. `git push origin dev --force-with-lease`.强制推送到远程仓库,完成撤销的回退

## 修改提交的历史记录

> git 提供了针对一系列修改历史记录的操作

```bash
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#  d, drop = remove commit
```

操作 | 信息
---|---
pick | 使用此提交，保持原样。
reword | 使用此提交，但编辑提交消息。
edit | 使用此提交，但停下来让你编辑文件或进行其他操作。
squash | 将此提交合并到前一个提交中，并将提交消息合并为一条。
fixup | 类似于 squash，但忽略此提交的提交消息。
exec | 运行一个命令，将 rest of the line 作为命令参数。
drop | 删除此提交，从历史记录中完全删除。
break | 在这里停止（稍后使用 git rebase --continue 继续重新设置基准）
label \<label> | 为当前提交添加一个标签。
reset \<label> | 将 HEAD 重置为标签所指向的提交

### 压缩提交(squash commits)

> `squash commits`指将多个提交合并成一个提交。`git rebase` 进入交互模式（`-i`），常用的命令

```bash
git rebase --interactive | -i HEAD~[N]
# Or
git rebase --interactive | -i commit_hash_start commit_hash_end
```

>使用 `commit_hash` 进行提交压缩

* 注意:<span style="color:red">需要去取合并的提交记录的前一次</span>,例如从 commit2,commit3,commit4,commit5,commit6有五次提交记录,我们需要合并commit3,commit4,commit5,commit6 那么开始的提交 id 应该是 commit2 的 hash

1. 需要回退的范围

   ```bash
   git rebase -i 
   # 将除了最新的提交的 pick 都改成 squash(s)
   pick 4646e9c fw3
   pick a0868c5 fw4
   pick 911da7f fw5
   pick 5c2e562 fw6
   
   # Rebase 4073aa6..5c2e562 onto 4073aa6 (4 commands)
   #
   # Commands:

   >>>>>>>>>>>>>>>>
   pick 4646e9c fw3
   s a0868c5 fw4
   s 911da7f fw5
   s 5c2e562 fw6
   ```

2. 显示所有的提交信息,有需要的可以更改,如果是使用的 squash,这些信息会合并到上一个信息中

   ```bash
   # This is the 1st commit message:

   fw3
   
   # This is the commit message #2:
   
   fw4
   
   # This is the commit message #3:
   
   fw5
   
   # This is the commit message #4:
   
   fw6
   ```

3. 压缩这些提交信息
   * `((d466032...))`,这时候会进入到一个检出的提交中,这时候需要合并到主分支

   ```bash
   git checkout -b dev
   git checkout main
   git rebase dev
   git branch -D dev
   ```

![ ](/git/squashcommit.png)

> 指定压缩的次数 如 `HEAD~3`(压缩前三次提交信息)

```bash
git rebase -i HEAD~3
#...
```

* 注意:这时候 `HEAD指针` 并不会进入游离态

## stash

>`git stash`将工作副本暂时搁置到到一个栈(提交越迟,越早弹出,即索引越小)中,以便切换分支处理其他内容

* `git stash`:如果当前分支中的内容处于已暂存的状态(`git add .`)
  * `git stash -u`:如果当前分支未暂存,则需要添加`--include-untracked`
  * **注意:**一些基础配置文件不能暂存,需要立刻提交,如`.gitignore`等

  ```.gitignore
  *.js
  ```

  * 如果此时`.gitignore`没有提交,这时候忽略`.js`结尾的文件并不会起作用,`.js`结尾的文件会和`.gitignore`一起被搁置到**栈**中(但是此时切换分支忽略文件依然会被切换到另一个分支)
* `git stash save "message"`:如果需要搁置多个内容到栈中,则可以使用`message`来命名
  * 同样,如果没有暂存则需要使用`git stash save "message" -u`

>重新应用搁置栈中的工作副本

1. `git stash apply stash@{index}`:重新应用搁置栈中的工作副本,但是不会删除当前栈中暂存的状态
   * `git stash drop stash@{index}`:删除某个栈中的工工作副本,需要使用索引

   ```bash
   git stash drop stash@{0}
   ```

2. `git stash pop`:弹出最后一次提交到栈中的工作副本,并且同时删除栈中的工作副本
   * 或者直接指定需要应用的版本,与`apply`相同

   ```bash
   # index指索引号,索引越小,离栈顶越近
    git stash ( pop | apply ) --index index
   # 或者直接使用 stash@{index}
    git stash ( pop | apply ) stash@{index}
   ```

> 清理栈中的内容

1. `git stash clear`:将栈中的所有内容清理
2. `git stash drop`:清理指定版本

>查看存储差异(需要暂存之后才可以比较:`git add .`)

1. `git stash show`:查看存储的摘要
2. `git stash show -p`:查看存储的完整差异(-p=--patch)

>从stash中创建分支

```bash
git stash branch <name> stash@{1}
```

* 在此分支的基础上:创建一个叫做\<name>的分支,同时删除`stash{1}`的存储.此时指针不会指向原来分支,而是会指向\<name>分支
* 如果在最新版本中遇到冲突时,这将会很有用
  * 例如你搁置了该文件的更改到栈中,但是之后并没有理会,继续在该文件中做更改,这是就可以使用此方法

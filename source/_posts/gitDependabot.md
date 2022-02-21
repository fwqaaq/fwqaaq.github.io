---
title: gitDependabot
date: 2022-02-11 16:46:29
categories: git
tags:
   - git
summary: 使用dependabot对github的依赖进行更新
---

>`dependabot`会在您的 GitHub 仓库自动创建一个 PR 来更新依赖文件，并说明依赖更新内容，用户自己选择是否 `merge` 该 PR

* 使用,仅需要在`.github`文件夹下写入配置文件`dependabot.yml`

## [dependabot](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/configuration-options-for-dependency-updates#about-the-dependabotyml-file)

```yml
# dependabot.yml file with
# customized schedule for version updates

version: 2
updates:
  # Keep npm dependencies up to date
  - package-ecosystem: "npm"
    directory: "/"
    # Check the npm registry for updates at 2am UTC
    schedule:
      interval: "daily"
      time: "02:00"
```

1. `version`:版本号

### 必须选项

1. `package-ecosystem`:使用的包管理器,像`docker`,`npm`,`pip`等等
2. `directory`:项目的根目录.使用`/`相当于检查除git action之外的所有目录
3. `schedule`:每个包管理器定义检查新版本的频率
   * `interval`:更新的频率
      * daily——在每个工作日运行，周一至周五。
      * weekly——每周运行一次。默认情况下，这是在星期一。要修改它，请使用schedule.day.
      * monthly——每月运行一次。这是一个月的第一天
   * `time`:指定的每天更新时间
      * `time: "02:00"`:每天两点更新
   * `day`:指定每周的更新时间
      * monday
      * tuesday
      * wednesday
      * thursday
      * friday
      * saturday
      * sunday

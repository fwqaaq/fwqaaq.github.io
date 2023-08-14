---
title: Github Action 技巧查询
date: 2023-08-14 10:05:00
categories: Git
tags:
   - Git
   - Github
summary: Github Action 一些重要内容的查询
---

## [Github Action 上下文](https://docs.github.com/zh/actions/learn-github-actions/contexts#about-contexts)

* [secrets](https://docs.github.com/zh/actions/learn-github-actions/contexts#secrets-context) 上下文中的 `secrets.GITHUB_TOKEN` 用于身份验证

### [设置环境变量](https://docs.github.com/zh/actions/learn-github-actions/contexts#secrets-context)

除了通过 [`env:` 字段](https://docs.github.com/zh/actions/learn-github-actions/variables#为单个工作流定义环境变量)来直接指定环境变量，还可以在工作流运行期间使用 [`set-env`](https://docs.github.com/zh/actions/using-workflows/workflow-commands-for-github-actions#setting-an-environment-variable) 命令来设置环境变量。

```bash
echo "{environment_variable_name}={value}" >> "$GITHUB_ENV"
```

### [保留 job 的输出](https://docs.github.com/zh/actions/using-workflows/workflow-commands-for-github-actions#setting-an-output-parameter)

输出也是有两种方式（但是这两种方式都是要 job/step 的 `id`）：

1. 直接使用 [`GITHUB_OUTPUT`](https://docs.github.com/zh/actions/using-workflows/workflow-commands-for-github-actions#setting-an-output-parameter) 来获取，但是这种方式只能在终端中使用
2. 使用 [`output:` 字段](https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs)，这种方式可以用于任何类型的输出，该字段在不同的 job 之间可以共享输出，但是需要 `needs` 指定顺序。

可以查询这个比较简单的[示例](https://github.com/Borber/seam/blob/defa7bf79dc97fefa0521655828e98a5bd2d2a38/.github/workflows/release_gui.yml#L12-L30)，以下仅展示一部分：

```yaml
  create_release:
    runs-on: ubuntu-latest
    outputs:
      changes: ${{ steps.changelog_reader.outputs.changes }}
      version: ${{ steps.changelog_reader.outputs.VERSION }}
    steps:
      - uses: actions/checkout@v3
      - name: Get version number
        id: get_version
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          echo "VERSION=${VERSION/v_gui\./}" >> $GITHUB_ENV
      - name: Changelog Reader
        id: changelog_reader
        uses: mindsers/changelog-reader-action@v2.2.2
        with:
          path: './crates/cli/CHANGELOG.md'
          version: ${{ steps.get_version.outputs.version }}
```

之后我们指定该 job，然后使用 `${{ needs.create_release.outputs.changes }}` 方式来访问。

## [矩阵策略](https://docs.github.com/zh/actions/using-jobs/using-a-matrix-for-your-jobs#using-a-matrix-strategy)

在 matrix 你可以指定不同平台，不同版本之间的组合，进行多个 job 的执行。

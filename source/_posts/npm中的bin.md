---
title: npm中的bin
date: 2022-04-16 14:54:05
categories: config
tags: 
   - JS
   - npm
   - config
summary: 使用npm写一个自己的cli
---

## bin

> bin文件是一个二进制的脚本文件

* 一般文件内会有以下的字样等等,这就是平时运行的脚本文件的解释程序(`Shebang`)
  * `#!/usr/bin/env node`这段话的意思就是启用node进行脚本的解释程序
  * `#!/bin/sh`:使用sh进行脚本的执行程序
  * 并且在windows中同样可以使用(windows会忽略shengban,会根据程序的脚本名来指定运行的解释程序)

* 可以查看一下typescript中的脚本配置

   ```json  
    "bin": {
        "tsc": "./bin/tsc",
        "tsserver": "./bin/tsserver"
    },
   ```

1. 创建一个node的项目并且创建一个bin目录(用于存放脚本文件)

   ```bash
   .
   ├── bin
   │   └── vli.js
   ├── index.js
   └── package.json
   ```

2. 在`package.json`配置bin字段,用于打包生成脚本命令

   ```json
   "bin": {
     "v-vli":"./bin/vli.js"
   }
   ```

3. 在脚本文件中写入需要的命令`vli.js`

   ```js
   #!/usr/bin/env node
   function run (argv) {
       if (argv[0] === '-v' || argv[0] === '--version') {
           console.log('  version is 0.0.1');
       } else if (argv[0] === '-h' || argv[0] === '--help') {
           console.log('  usage:\n');
           console.log('  -v --version [show version]');
       }
   }
   run(process.argv.slice(2));
   ```

4. 打成全局包才可以使用该命令,打成全局包的命令`npm install . -g`或者`npm link`
5. 使用`v-cli -v`就可以查看输出的脚本命令了

## npm link

>`npm link`将npm模块链接到对应的运行项目中去,方便地对模块进行调试和测试

1. 如果他是一个`bin`(二进制文件):他会被链接到全局的`{prefix}/bin`目录(node的全局目录)下,生成一个脚本文件,供全局使用
2. 如果他是一个`lib`(库文件),他会被连接到`{prefix}/lib/node_modules/<package>`(node的全局目录),生成一个链接文件
3. 一个文件项目中可能包含多个bin文件,一般通常只有一个lib文件

* 通过`npm config get prefix`命令获取到prefix的值

>`npm unlink <package>`:解除链接

1. 如果是bin文件,解除的是bin配置的脚本名称,而不是项目的包名
   * 例如上面的脚本`npm unlink v-vli`.将全局的`v-vli`脚本移除
2. 如果是`lib`文件,他本质就是一个软链接,直接移除项目的包名
   * `npm unlink <package>`:将lib下的全局链接移除

>例子:例如需要开发一个module模块,并且在本地example项目中需要使用module包

1. 在`module`中使用`npm link`被链接到全局的lib目录下
2. 在`example`项目中使用`npm link module`后,此项目会软链接到`example/node_modules`
3. 这种软链接的形式,在module的修改同样会同步到`example/modules`中的软链接部分

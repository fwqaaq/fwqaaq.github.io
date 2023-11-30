---
date: 2023-11-30 15:43:05
title: PGP
categories: Config
tags:
  - Config
summary: PGP 来加密邮件服务
---

## MAC 上配置 PGP 密钥

请参考：<https://gist.github.com/Peredery/38d0538dd34381bbd9d13414269a1f27>

## PGP

> 一个 GPG（GNU Privacy Guard）密钥实际上是一对密钥，它们由以下几部分组成：

1. 私钥（Private Key）：私钥是您保密的密钥部分，用于解密收到的信息和对您的信息进行数字签名。只有密钥的拥有者应该访问私钥。
2. 公钥（Public Key）：公钥是可以公开分享的密钥部分，用于加密发送给私钥拥有者的信息和验证其签名。任何人都可以使用公钥来加密信息，但只有对应的私钥可以解密这些信息。
3. 用户 ID（User ID）：每个 GPG 密钥都与至少一个用户 ID 关联。用户 ID 通常包含名字和电子邮件地址，用于识别密钥的拥有者。
4. 数字签名（Digital Signatures）：密钥可以被其他密钥的拥有者用其私钥签名。这些签名用于建立信任网络，表明签名者信任密钥的合法性。
5. 信任度（Trust Level）：信任度表明了密钥拥有者对密钥的信任程度。它是一个用于评估密钥可靠性的机制。
6. 到期日期（Expiration Date）（可选）：密钥可以设置一个到期日期，超过这个日期密钥将不再有效。这是一个安全特性，用于防止丢失或被遗忘的密钥无限期地存在。
7. 其他元数据：如创建日期、密钥算法（如 RSA、ElGamal）、密钥长度（如 2048 位）、指纹（一种用于唯一识别公钥的较长的哈希值）等。

### **生成密钥**

```bash
gpg --full-generate-key
```

### **查看信息**

> 查看公钥信息

```bash
gpg --list-keys
gpg --list-keys --keyid-format LONG
```

公钥的完整格式如下：

```txt
pub   rsa3072/1E4C46XX01BEA325 2023-05-10 [SC]
      5F0E8C2DC8305C37DDBB83C51E4C46DD01BEA325
uid                 [ultimate] XCF (XY) <xxxx@gmail.com>
sub   rsa3072/E626729XHJC37E8C 2023-05-10 [E]
```

1. `pub`：这表示一个“公钥”（public key）的记录。
   * `rsa3072` 表明密钥使用的是 RSA 加密算法，且密钥长度为 3072 位。
   * 1E4C46XX01BEA325：这是公钥的短格式 ID。这是一个识别公钥的独特序列。
   * 2023-05-10 [SC]：这个日期是密钥创建的日期。[SC] 表示这个密钥有**签名**（Sign）和**证书**（Certificate）功能。它可以用于签名其他数据和密钥。
   * 5F0E8C2DC8305C37DDBB83C51E4C46DD01BEA325：这是公钥的指纹，是公钥的一个更长、更具体的识别符。指纹是通过对密钥的某些部分应用哈希算法生成的。
2. `uid`：uid 代表“用户标识符”（User ID）。这通常包含用户的名字和电子邮件地址，用于标识公钥的拥有者。
   * [ultimate] 表示这个密钥的信任等级是最高的，意味着您对这个密钥的控制是完全的。
   * fwqaaq (FW) <fwqaaq@gmail.com> 是与这个密钥关联的具体用户信息，包括姓名、昵称和电子邮件地址。
3. `sub`：这表示一个“子密钥”（subkey）的记录。子密钥通常用于加密数据，而主密钥（pub）用于签名和验证。

> 查看私钥信息

```bash
gpg --list-secret-keys
gpg --list-secret-keys --keyid-format LONG
```

> 查看特定密钥的信息

```bash
gpg --list-sigs [key-id]
gpg --list-secret-sigs [key-id]
```

> 查看指纹

```bash
gpg --fingerprint [key-id]
```

### GPG 密钥服务器

> 设置 keyserver：在 `~/.gnupg/gpg.conf` 中添加：

```txt
keyserver hkp://keys.openpgp.org
keyserver hkp://keyserver.ubuntu.com
```

> 上传公钥

```bash
# 使用默认的 keyserver
gpg --keyserver --send-keys [key-id]
# 使用指定的 keyserver
gpg --keyserver hkp://keys.openpgp.org --send-keys [key-id]
```

### 导入/导出

> 导出公钥/私钥

```bash
# 导出公钥
gpg --export -a [email/ID] > mypublickey.asc
# 导出私钥
gpg --export-secret-keys -a [email/ID] > myprivatekey.asc
```

> 导入公钥/私钥

```bash
# 导入公钥
gpg --import mypublickey.asc
# 导入私钥
gpg --allow-secret-key-import --import myprivatekey.asc
```

### 签名和加密

> 签名/验证文件

* 签名文件：将内容和签名一起保存到新创建的文件中

```bash
gpg [-u email/ID] --sign [file]
```

* 创建单独的签名文件：单独保存签名，而不是将签名和内容保存到同一个文件中

```bash
gpg [-u email/ID] --detach-sign [file]
```

* 验证签名：验证文件的签名是否有效，只有当签名是分离的时候，才需要源文件

```bash
gpg --verify [sign_file] [file]
```

> 加密/解密文件

使用接收者的公钥加密文件，email/ID 是接收者的邮箱或 ID，需要接收者的私钥才能解密。

```bash
gpg --encrypt --recipient [email/ID] [file]
```

解密文件：

```bash
gpg --decrypt [file]
```

#### 签名对方的公钥

1. 导入对方的公钥：在签名之前，您需要有对方的公钥在您的密钥环中。如果还没有，需要先导入他们的公钥。

   ```bash
   # 导入公钥
   gpg [--keyserver] --recv-keys [email/ID]
   ```

2. 确认密钥：在签名之前，您应当验证这把公钥确实属于您想签名的个人。这通常涉及到通过某种方式（例如面对面会议、视频通话或其他可靠通道）核对公钥的指纹。
3. 签名密钥：使用 `gpg [-u email/ID] --sign-key [email/ID]` 来签名公钥，`-u` 用于指定使用哪个密钥签名。
4. 上传签名后的密钥：签名后，可以选择将更新后的公钥上传到密钥服务器，以便他人也可以看到对该密钥的信任。（**将对方的公钥上传**）

   ```bash
   gpg [--keyserver url] --send-keys [email/ID]
   ```

> 查看签名

* 从密钥服务器获取公钥签名

```bash
gpg --recv-keys [email/ID]
```

* 查看公钥签名

```bash
gpg --list-sigs [ID]
gpg --check-sigs [ID]
```

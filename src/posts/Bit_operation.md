---
title: 位运算
date: 2023-08-01 04:05:03
categories: Algorithm
tags:
   - Rust
   - Algorithm
summary: 位运算通用技巧
---

1. 一个数字除以 2

   ```rust
   println!("result: {}", 11 >> 2);
   ```

2. 一个数字乘以 2

   ```rust
   println!("result: {}", 11 << 2);
   ```

3. 快速球 2 的 n 次幂

   ```rust
   println!("result: {}", 1 << 10);
   ```

4. 判断奇偶

   ```rust
   println!("result: {}", 12 & 1 == 0);
   ```

5. 交换两个元素

   ```rust
   let (mut a, mut  b) = (10, 20);
   a ^= b;
   b ^= a;
   a ^= b;
   ```

6. 快速求余（仅当除数是 2 的 n 次幂）

   ```rust
    let (c, x) = (1 << 10, 676433);
    println!("r1: {}, r2: {}", x % c, x & (c - 1));
   ```

7. 获取某个二进制的第 k 位

   ```rust
   let x = 190;
   println!("res: {}", x >> 3 & 1);
   ```

8. 将二进制的第 k 位设置为 1

   ```rust
   let x = 190;
   println!("res: {}", x | (1 << 6));
   ```

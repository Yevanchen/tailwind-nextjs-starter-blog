---
title: "sub-agent 与归并"
date: "2025-07-29T15:51:11.412Z"
lastmod: "2025-07-29T15:52:12.032Z"
draft: false
summary: ""
authors: ["Admin"]
slug: "subagent-"
tags: []
---
根据信息负载量去判断是否要分出子 agent，信息负载量目前没法计算只能评估，可以交给 AI 来评估，提供一个基础原则，如果信息负载量太大，那就分而治之，如果还是大那就继续分，分到最后成一个 Prompt 就能搞定的大小就可以停止了。这个就像是 agent 时代的快速排序，归并排序，forkjoin 算法。应该看看 autogpt 是怎么做的，有没有办法评估一个 Prompt 执行他所需要的信息负载量。比如造个抖音一定大于写个请求百度地址的接口，这是颗粒度的区别
![](https://raw.githubusercontent.com/Yevanchen/images/main/myblog/20250729235144261.png)
---
title: "Workspace as a Collaborative AI Environment"
date: "2025-07-17T07:37:55.087Z"
lastmod: "2025-07-17T07:49:12.828Z"
draft: false
summary: ""
authors: ["Admin"]
slug: "workspace-as-a-collaborative-ai-environment"
tags: ["#协作"]
---
# Workspace = 人 + 工具集（多凭据）+ 多 Script

AI infra 不仅仅是组织内有一个方便构建llm app的产线，更是团队愿意一起使用的 AI 工具，这并不是产线制作出来的webapp聚合页

事实上我们每个人都会孤立的花20$去买 OpenAI 的服务，但这并不是团队协作的最终形式

Workspace 的核心是人和人与人之间的关系。它不再是一个孤立的单人工具，而是一个为团队协作而生的环境。
Workspace 拥有一个共享的、可扩展的工具库。但每个工具的使用凭据是个人化的。 

## 凭据

工具发现 vs. 工具授权: 这是两个解耦的概念。
Workspace 内的所有成员都能看到“团队工具箱”里有哪些可用的工具（例如，一个已安装的 Linear 插件）。

我们很烦在使用 AI 解决问题或者构建 app 过程中的授权，所以这个应该是一个众包的工作 工具集（被安装）这个过程会越来越简单，后入职公司的人加入这个空间理论上就可以使用某个 workspace 里已经安装的工具，有一些授权是公共授权，有一些授是个人授权

当然我们也可以为：可以对 Workspace 可用的“工具槽位数量”或“高级工具”收费

## script 共享

另外每个人会有单独的个人 script 库，但是还有一个公有空间共享与复用: Scripts 在 Workspace 内是共享的（遵循基本的权限设置），鼓励团队成员互相学习、引用和“Fork”。


## 个人都有自己的 Supervisor Session

Supervisor 是私人的“驾驶舱”:
右侧的 Supervisor UI 是每个用户个人的、私密的交互空间。我的聊天历史、我的临时上下文（附件）、我的思考过程，都只属于我。
这极大地保护了用户的隐私，让他们可以放心地在 Supervisor 中进行探索和实验，而不用担心被同事“围观”。


## 未决之事
如何实现协作结果的分享？如运行结果分享给团队 
Agent 的最后一步是调用 @飞书工具，将报告发送到团队群聊。
我在 Supervisor 的结果卡片上点击一个“分享到...”的按钮。
Agent 调用 @create_doc 工具，在团队共享空间而非我的个人空间下创建一份报告文档。

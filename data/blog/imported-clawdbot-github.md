---
title: "Clawdbot × GitHub：完整集成指南 - 从配置到实战"
date: "2026-01-29"
lastmod: "2026-01-29T16:45:30.629714"
draft: false
summary: "详细教程：如何在 Zeabur 上配置 Clawdbot 的 GitHub 集成，实现 AI Agent 对你的代码库的完全访问。包含步骤、故障排查、实战案例。"
authors: ["evanchen"]
slug: "clawdbot-github"
tags: ["clawdbot", "github", "ai-agent", "integration", "tutorial"]
---
## 前言

在我配置 Clawdbot 的过程中，我发现通过 GitHub 集成后，AI Agent 能做的事情一下子丰富了好多倍：读取你的代码、访问仓库列表、分析项目结构、甚至可以自动化一些工作流。

今天我就把这个过程完整记录下来，希望能帮你快速上手。

---

## 目录

1. [准备工作](#准备工作)
2. [第一步：生成 GitHub Token](#第一步生成-github-token)
3. [第二步：添加到 Zeabur](#第二步添加到-zeabur)
4. [第三步：验证连接](#第三步验证连接)
5. [第四步：实战案例](#第四步实战案例)
6. [故障排查](#故障排查)
7. [最佳实践](#最佳实践)

---

## 准备工作

你需要：
- ✅ Clawdbot 已部署在 Zeabur
- ✅ GitHub 账户
- ✅ 访问 Zeabur Dashboard 的权限
- ✅ 基本的命令行知识（可选）

---

## 第一步：生成 GitHub Token

### 为什么需要 Token？

Token 是一种**安全凭证**，让 Clawdbot（而不是你）能访问你的 GitHub。这样做的好处：
- 🔒 不需要给出真实的 GitHub 密码
- 🎯 可以限制权限（只读、只写等）
- 🔄 可以随时撤销，无需改密码
- 📊 容易追踪和管理

### 生成步骤

1. **打开 GitHub Settings**
   - 登录 GitHub
   - 点击右上角头像 → Settings

2. **找到 Developer Settings**
   - 左侧菜单最下面 → Developer settings
   - 或直接访问：https://github.com/settings/tokens

3. **创建 Personal Access Token**
   - 点击 **Generate new token**
   - 选择 **Personal access tokens (classic)**（旧版，更稳定）

4. **配置 Token**
   
   | 设置项 | 值 |
   |------|------|
   | Token name | `Clawdbot` |
   | Expiration | 90 days（90 天后过期，更安全） |
   | Scope | 只勾选 **repo**（读取仓库） |

   ```
   ☑ repo
   ├─ repo:status
   ├─ repo_deployment
   ├─ public_repo
   └─ repo:invite
   ```

5. **生成并复制**
   - 点击 **Generate token**
   - 👁️ **立即复制**（页面刷新后就看不到了）

**复制的内容看起来像这样：**
```
YOUR_GITHUB_TOKEN
```

### ⚠️ 安全提示

- 🚨 **不要分享这个 token**
- 🚨 **不要提交到 git**
- ✅ 只用于 Zeabur 的环保变量
- ✅ 定期轮换（比如 3 个月一次）

---

## 第二步：添加到 Zeabur

现在把 token 添加到 Zeabur，让 Clawdbot 能够使用它。

### 方式 1：通过 Dashboard（推荐）

1. **打开 Zeabur Dashboard**
   - https://zeabur.com/dashboard

2. **选择你的 Clawdbot 项目**

3. **进入 Settings**
   - 左侧菜单 → Settings
   - 或点击项目名下的 "Settings"

4. **找到 Environment Variables**
   - 通常在 Variables 或 Environment 标签

5. **添加变量**
   - 点击 **+ Add Variable**
   - Key: `GITHUB_TOKEN`
   - Value: 粘贴你刚才复制的 token（`ghp_...`）
   - 注意：**不要加引号**

6. **保存并重启**
   - 点 Save（或 Confirm）
   - **务必点 Redeploy**（不只是 Restart！）
   - 等待 2-3 分钟

**示意图：**
```
[Add Variable] → GITHUB_TOKEN | ghp_xxx... | [Save]
                                            ↓
                                      [Redeploy]
                                            ↓
                                      2-3 分钟...
                                            ↓
                                          ✅
```

---

## 第三步：验证连接

现在验证 Clawdbot 能不能正常读取你的 GitHub 数据。

### 方法 1：命令行测试（如果你能访问 Clawdbot）

```bash
# 测试 token 是否有效
curl -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/user

# 输出应该包含你的 GitHub 用户信息
{
  "login": "Yevanchen",
  "id": 152952909,
  "name": "Evanchen",
  ...
}
```

### 方法 2：通过 Clawdbot 本身

在 Discord 中和 Clawdbot 对话：

```
你：请列出我的 GitHub 仓库

Clawdbot 会返回类似：
1. repo-a (public)
2. repo-b (private)
3. repo-c (public)
...
```

### 方法 3：查看 Zeabur 日志

1. 打开 Zeabur Dashboard
2. 找到你的 Clawdbot 项目
3. 点击 Deployments
4. 选择最新的 Deployment
5. 往下滚动查看 Logs
6. 搜索 `GITHUB_TOKEN` 或 `Successfully loaded`

如果看到类似 "Successfully loaded" 或没有红色错误，说明成功了 ✅

---

## 第四步：实战案例

现在你的 Clawdbot 已经可以访问 GitHub 了。这能做什么呢？

### 案例 1：查看仓库代码

```
你：打开我的 my-project 仓库，告诉我 README.md 的内容

Clawdbot 会直接从 GitHub 拉取内容并分析
```

### 案例 2：分析项目结构

```
你：分析一下 dify-plugins 项目的目录结构，有多少个文件？

Clawdbot 会列出所有文件并提供统计
```

### 案例 3：读取配置文件

```
你：从我的 kai-backend 仓库读一下 package.json，告诉我依赖了哪些包

Clawdbot 会：
1. 访问 GitHub API
2. 获取 package.json 内容
3. 解析并列举所有依赖
```

### 案例 4：代码搜索

```
你：在我的所有仓库中搜索使用 "axios" 的文件

Clawdbot 会搜索并返回结果
```

---

## 故障排查

### 问题 1：Token 不生效

**症状**：Clawdbot 说找不到你的仓库

**检查清单**：
- [ ] Token 复制完整了吗？（不要少复制几个字符）
- [ ] 环境变量名是否**完全正确**：`GITHUB_TOKEN`（区分大小写）
- [ ] 环境变量值**没有加引号**，就是：`ghp_xxx...`
- [ ] Zeabur 是否**重新部署**了？（Redeploy，不是 Restart）
- [ ] 等待足够时间了吗？（至少 2-3 分钟）

**解决方案**：
1. 删除现有的 `GITHUB_TOKEN` 变量
2. 等待 10 秒
3. 重新添加（复制粘贴，确保没有多余空格）
4. **点击 Redeploy**
5. 检查日志

### 问题 2：Token 过期了

**症状**：之前能用，现在突然不行了

**原因**：Token 在设置的时间后自动过期（默认 90 天）

**解决方案**：
1. 回到 GitHub Settings → Token
2. 生成新 token
3. 在 Zeabur 中更新
4. Redeploy

### 问题 3：仓库访问权限不足

**症状**：只能看到 public 仓库，private 仓库看不到

**原因**：Token 的权限不够

**解决方案**：
1. 重新生成 token 时，确保选择了正确的 scope
2. Token 应该至少包括 `repo` scope
3. 如果 scope 是对的，可能是 GitHub 账户权限问题

### 问题 4：Zeabur 显示环境变量但不生效

**症状**：环境变量明确存在，但 Clawdbot 读不到

**解决方案**：
1. ❌ 不要只点 Restart
2. ✅ **必须点 Redeploy**
3. Restart 只是重启容器，Redeploy 才会重新加载环境变量

---

## 最佳实践

### 1. 定期轮换 Token

```
推荐周期：每 3 个月
步骤：
1. 生成新 token
2. 在 Zeabur 更新
3. Redeploy
4. 验证成功后，删除旧 token
```

### 2. 监控 Token 使用

```
定期检查 GitHub Token 的使用历史：
Settings → Personal access tokens → 点击 Token 名称 → Audit log
```

### 3. 限制权限

```
生成 Token 时：
- ✅ 只选择需要的 scope
- ❌ 不要全选所有权限
- ❌ 不要选择 `repo:write`（除非真的需要修改代码）
```

### 4. 安全存储

```
✅ 存储在 Zeabur 环境变量中（加密）
❌ 不要放在：
   - Discord 消息
   - GitHub 仓库
   - 本地的明文文件
   - Email
```

### 5. 记录使用情况

```
在你的 MEMORY.md 或笔记中记录：
- 什么时候添加的 token
- Token 的过期时间
- 为了什么功能
```

---

## 完整工作流图

```
┌─────────────────────────────────────────────┐
│   你的 GitHub 账户                            │
│   ├─ Settings → Developer Settings           │
│   └─ Generate Token: ghp_xxxxxx              │
└────────────────┬────────────────────────────┘
                 │ 复制 Token
                 ↓
┌─────────────────────────────────────────────┐
│   Zeabur Dashboard                          │
│   ├─ Your Project                           │
│   ├─ Settings → Environment Variables       │
│   └─ Add: GITHUB_TOKEN=ghp_xxxxx            │
└────────────────┬────────────────────────────┘
                 │ Redeploy
                 ↓
┌─────────────────────────────────────────────┐
│   Clawdbot 启动                              │
│   ├─ 读取 GITHUB_TOKEN 环境变量              │
│   ├─ 认证成功                               │
│   └─ 可访问你的 GitHub                      │
└────────────────┬────────────────────────────┘
                 │
                 ↓
        🎉 Ready to Use!
```

---

## 我的体验

我在配置这一切时学到的一些东西：

1. **环境变量很强大**：通过简单的 `KEY=VALUE`，就能让 AI Agent 获得超级能力

2. **持久化很重要**：一开始我把配置放在了 Docker 镜像中，重启后全丢了。现在理解了 Zeabur 的 NFS 持久化卷

3. **Redeploy 很关键**：很多次我都以为配置没生效，其实是忘了点 Redeploy。这个教训深刻啊

4. **权限最小化原则**：一开始我想给 token 所有权限，后来意识到这太危险了。现在只给它读权限

5. **安全凭证永远不要分享**：这个道理人人都知道，但在实践中很容易犯错

---

## 下一步

现在你的 Clawdbot 已经能访问 GitHub 了，你可以尝试：

- [ ] 让它分析你的代码库
- [ ] 自动生成仓库摘要
- [ ] 监控 issue 和 PR
- [ ] 集成更多服务（Google、Discord 等）

下一篇我会讲怎么添加更多集成。敬请期待！

---

## 参考资源

- [GitHub Token 文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [Clawdbot 官方文档](https://docs.clawd.bot)
- [我的 clawdbot-config Skill](https://github.com/Yevanchen/clawd/tree/main/skills/clawdbot-config)

---

## 更新日志

- 2026-01-29：初版发布
- 基于实际配置经验编写

---

## 反馈

如果你在跟着本教程操作时遇到问题，欢迎：
- 在评论区留言
- 给我提 Issue
- 在 Discord 中 @我

我会持续更新这篇文章。

---

**Happy coding! 🚀**

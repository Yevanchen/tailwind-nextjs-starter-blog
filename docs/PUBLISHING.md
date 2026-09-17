# 发布与编辑文章

文章是 `data/blog/` 下的 Markdown 文件（`.md`；历史 `.mdx` 也按 Markdown 解析，不执行 JSX）。不再使用在线编辑器、CRUD API、Firebase 或任何写入密钥。

1. 从 `main` 新建分支，在 `data/blog/` 新增或修改文件。
2. 创建 PR；`Blog CI` 检查 frontmatter、重复地址、Markdown 渲染、类型和静态构建。
3. 预览并合并到 `main`，Cloudflare Git 集成自动构建和发布。线上内容仅来自仓库。
4. 删除文章同样通过删除文件的 PR。修改现有文章时保留 `slug`，避免破坏历史链接。

```yaml
---
title: "文章标题"
date: "2026-09-17"
slug: "my-new-post"
summary: "一两句话说明本文内容。"
tags: ["产品", "AI"]
draft: false
---
```

正文支持标题、列表、引用、表格、代码高亮、脚注和图片。使用 `##` / `###` 建立层级；标题超过两个自动出现目录。原始 HTML 与 JSX 不执行。图片推荐放在 `public/static/images/`，正文用 `/static/images/文件名.png` 引用。

`draft: true` 的文章不会进入静态路由、首页、归档、搜索、RSS 或 sitemap。新文章省略 `slug` 时使用文件名；旧文章的特殊路径已明确写入 frontmatter。`/blog/editor` 与 `/editor` 已移除并返回 404。

## 本地验证

使用 Node 22 和 npm：`npm ci`，然后 `npm run dev`。提交前运行 `npm run check`。`npm run build` 生成 `out/`，无运行时数据库或 Node 服务。

## Cloudflare

目标账户：`cyefan2@gmail.com`。Cloudflare Workers 的 Git 集成关联本仓库：生产分支 `main`，构建命令 `npm run check`，部署命令 `npx wrangler deploy`。非生产分支可用 `npx wrangler versions upload` 生成预览。

`SITE_URL` 必须设为实际生产地址（无结尾斜杠），用于 canonical、RSS 和 sitemap。`wrangler.jsonc` 只部署静态 `out/` 目录，未知路由使用真正的 404。所有检查通过后再部署；失败不会发布新版本。GitHub CI 单独运行同一套检查，不需要 Cloudflare 密钥。

Zeabur 的 `chenyefan.zeabur.app` 是平台域名，不能直接当作 Cloudflare 自定义域名使用。先验证 Cloudflare 新地址，再分享新链接或绑定自己控制的域名。

## 回滚

文章或代码有问题时通过 revert PR 回退提交；紧急情况下从 Cloudflare 部署历史回滚上一版本。旧站和 Firebase 原始数据未被此次代码迁移删除，迁移成功前保留作为回退点。

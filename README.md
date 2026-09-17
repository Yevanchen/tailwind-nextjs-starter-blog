# 沉梦昂志 · Evanchen 的博客

个人博客，使用 Next.js 静态导出和 Markdown-it，部署到 Cloudflare。文章和站点代码均通过 GitHub PR 维护，合并 `main` 后由 Cloudflare Git 集成发布。

- [文章发布流程](docs/PUBLISHING.md)
- [迁移清单与回滚说明](docs/MIGRATION.md)
- Node 22；`npm ci` → `npm run dev`
- 验证：`npm run check`；静态构建：`npm run build` → `out/`
- 部署前将 `SITE_URL` 设置为实际 Cloudflare 生产地址。

保留浅色/深色主题、中文文章目录、标题/标签搜索、代码高亮、RSS、sitemap 和历史文章路径。没有 Firebase、在线文章编辑器、增删改 API 或运行时服务器。

基于 [Tailwind Nextjs Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog)，保留原 MIT LICENSE。

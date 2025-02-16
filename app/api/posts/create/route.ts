import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { title, date, tags, content } = await req.json()

    // 创建文件名（使用标题生成 slug）
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')

    // 创建 frontmatter
    const frontmatter = `---
title: '${title}'
date: '${date}'
tags: [${tags.map((tag) => `'${tag}'`).join(', ')}]
draft: false
summary: ''
---

`

    // 完整的文章内容
    const fullContent = frontmatter + content

    // 确保目录存在
    const postsDir = path.join(process.cwd(), 'data/blog')
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true })
    }

    // 写入文件
    const filePath = path.join(postsDir, `${slug}.mdx`)
    fs.writeFileSync(filePath, fullContent)

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Error saving post:', error)
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 })
  }
} 
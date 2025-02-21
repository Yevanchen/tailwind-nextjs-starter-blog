import { NextResponse } from 'next/server'
import { createOrUpdateFile } from '@/lib/github'

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
layout: 'PostLayout'
images: []
authors: ['default']
---

`

    // 完整的文章内容
    const fullContent = frontmatter + content

    // 文件路径
    const filePath = `data/blog/${slug}.mdx`

    // 提交到 GitHub
    await createOrUpdateFile(
      filePath,
      fullContent,
      `feat(blog): add new post - ${title}`
    )

    // 返回成功响应，包含文章路径
    return NextResponse.json({
      success: true,
      slug,
      path: `/blog/${slug}`,
      message: '文章已成功保存到 GitHub',
    })
  } catch (error) {
    console.error('保存文章时出错:', error)
    return NextResponse.json(
      { error: '保存文章失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}

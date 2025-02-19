import { NextResponse } from 'next/server'
import fs from 'fs/promises'
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
layout: 'PostLayout'
images: []
authors: ['default']
---

`

    // 完整的文章内容
    const fullContent = frontmatter + content

    // 文件路径
    const filePath = path.join(process.cwd(), 'data/blog', `${slug}.mdx`)

    // 本地保存文件
    await fs.writeFile(filePath, fullContent, 'utf-8')
    console.log(`文章已保存到: ${filePath}`)

    // 返回成功响应，包含文章路径
    return NextResponse.json({
      success: true,
      slug,
      path: `/blog/${slug}`,
      message: '文章已成功保存到本地',
    })
  } catch (error) {
    console.error('保存文章时出错:', error)
    return NextResponse.json(
      { error: '保存文章失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}

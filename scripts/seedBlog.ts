import { setBlogWithId } from '../lib/blogService'

const seedBlogs = async () => {
  const testBlog = {
    title: '测试博客',
    date: new Date().toISOString(),
    tags: ['测试', 'Firebase'],
    draft: true,
    summary: '这是一篇测试博客，用于测试 Firebase 集成',
    content: '# 测试博客\n\n这是博客内容...',
    slug: 'test-blog',
    fileName: 'test-blog.mdx',
    authors: ['Admin'],
    lastmod: new Date().toISOString(),
  }

  try {
    const result = await setBlogWithId('177nrRXhsl1VMYTIOg1T', testBlog)
    console.log('测试博客创建成功:', result)
  } catch (error) {
    console.error('创建测试博客失败:', error)
  }
}

// 运行种子脚本
seedBlogs()

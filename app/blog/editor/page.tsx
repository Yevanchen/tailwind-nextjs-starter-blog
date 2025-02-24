'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import SectionContainer from '@/components/SectionContainer'
import { addBlog } from '@/lib/blogService'
import { nanoid } from 'nanoid'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function EditorPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [date] = useState(new Date().toISOString())
  const [summary, setSummary] = useState('')

  const handleSave = async () => {
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')

      const fileName = `${slug}.mdx`

      const blogData = {
        title,
        date,
        tags: tags.split(',').map((tag) => tag.trim()),
        draft: false,
        summary,
        content,
        slug,
        fileName,
        authors: ['Admin'], // 这里可以根据实际需求修改
        lastmod: new Date().toISOString(),
      }

      await addBlog(blogData)
      alert('博客保存成功！')
      router.push('/blog')
    } catch (error) {
      console.error('保存博客失败:', error)
      alert('保存博客时出错：' + error.message)
    }
  }

  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            创建新文章
          </h1>
        </div>

        <div className="space-y-4 py-8">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              标题
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              标签 (用逗号分隔)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
              placeholder="next-js, tailwind, guide"
            />
          </div>

          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              摘要
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              内容
            </label>
            <div className="mt-1" data-color-mode="auto">
              <MDEditor value={content} onChange={(val) => setContent(val || '')} height={500} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              保存文章
            </button>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}

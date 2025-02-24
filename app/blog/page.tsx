'use client'

import { useEffect, useState } from 'react'
import { Blog } from '@/types/blog'
import { getAllBlogs, subscribeToBlogChanges, deleteBlog } from '@/lib/blogService'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import formatDate from '@/lib/utils/formatDate'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    // 初始加载博客
    const loadBlogs = async () => {
      try {
        const data = await getAllBlogs()
        setBlogs(data)
      } catch (error) {
        console.error('加载博客失败:', error)
      }
    }
    loadBlogs()

    // 订阅实时更新
    const unsubscribe = subscribeToBlogChanges((updatedBlogs) => {
      setBlogs(updatedBlogs)
    })

    // 清理订阅
    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id)
      // 不需要手动更新状态，因为实时监听会自动更新
    } catch (error) {
      console.error('删除博客失败:', error)
    }
  }

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              博客列表
            </h1>
            <Link
              href="/blog/editor"
              className="rounded bg-primary-500 px-4 py-2 font-bold text-white hover:bg-primary-600"
            >
              新建博客
            </Link>
          </div>
        </div>
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id} className="py-4">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                <div>
                  <p className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    {formatDate(blog.date)}
                  </p>
                </div>
                <div className="space-y-3 xl:col-span-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="text-gray-900 dark:text-gray-100"
                        >
                          {blog.title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap">
                        {blog.tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 transition-colors hover:text-red-700"
                    >
                      删除
                    </button>
                  </div>
                  <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                    {blog.summary}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

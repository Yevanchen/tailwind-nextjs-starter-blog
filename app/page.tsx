'use client'

import { useEffect, useState } from 'react'
import { Blog } from '@/types/blog'
import { getAllBlogs, subscribeToBlogChanges } from '@/lib/blogService'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import formatDate from '@/lib/utils/formatDate'
import SectionContainer from '@/components/SectionContainer'

export default function HomePage() {
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

  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">很高兴你能来</p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {blogs.map((blog) => (
            <li key={blog.id} className="py-12">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      {formatDate(blog.date)}
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold leading-8 tracking-tight">
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="text-gray-900 dark:text-gray-100"
                          >
                            {blog.title}
                          </Link>
                        </h2>
                        <div className="flex flex-wrap">
                          {blog.tags.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {blog.summary}
                      </div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label={`Read "${blog.title}"`}
                      >
                        阅读更多 &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center pb-8 pt-4">
        <Link
          href="/blog"
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
        >
          查看所有文章 &rarr;
        </Link>
      </div>
    </SectionContainer>
  )
}

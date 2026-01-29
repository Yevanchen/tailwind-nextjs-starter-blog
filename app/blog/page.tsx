'use client'

import { useEffect, useState } from 'react'
import { Blog } from '@/types/blog'
import { getAllBlogs, subscribeToBlogChanges, deleteBlog } from '@/lib/blogService'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import formatDate from '@/lib/utils/formatDate'
import LoginModal from '@/components/LoginModal'
import useAuthStore from '@/lib/auth'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    type: 'delete' | 'create'
    id?: string
  } | null>(null)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

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
    if (!isAuthenticated) {
      setPendingAction({ type: 'delete', id })
      setIsLoginModalOpen(true)
      return
    }
    try {
      await deleteBlog(id)
    } catch (error) {
      console.error('删除博客失败:', error)
    }
  }

  const handleCreate = () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'create' })
      setIsLoginModalOpen(true)
      return
    }
    window.location.href = '/blog/editor'
  }

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false)
    if (isAuthenticated && pendingAction) {
      if (pendingAction.type === 'delete' && pendingAction.id) {
        handleDelete(pendingAction.id)
      } else if (pendingAction.type === 'create') {
        window.location.href = '/blog/editor'
      }
    }
    setPendingAction(null)
  }

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              博客列表
            </h1>
            <button
              onClick={handleCreate}
              className="rounded bg-primary-500 px-4 py-2 font-bold text-white hover:bg-primary-600"
            >
              新建博客
            </button>
          </div>
        </div>
        <ul>
          {blogs.map((blog) => {
            // 检查 slug 是否有效
            const isValidSlug = blog.slug && blog.slug.trim() !== ''
            
            return (
              <li key={blog.id} className="py-4">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <div>
                    <p className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      {blog.date ? formatDate(blog.date) : '暂无日期'}
                    </p>
                  </div>
                  <div className="space-y-3 xl:col-span-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold leading-8 tracking-tight">
                          {isValidSlug ? (
                            <Link
                              href={`/blog/${blog.slug}`}
                              className="text-gray-900 dark:text-gray-100 hover:text-primary-500"
                            >
                              {blog.title}
                            </Link>
                          ) : (
                            <span className="cursor-not-allowed text-gray-400 line-through dark:text-gray-600">
                              {blog.title}
                              <span className="ml-2 text-xs text-red-500"> (❌ Slug 无效，无法访问)</span>
                            </span>
                          )}
                        </h3>
                        <div className="flex flex-wrap">
                          {blog.tags?.map((tag) => <Tag key={tag} text={tag} />)}
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
            )
          })}
        </ul>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </>
  )
}

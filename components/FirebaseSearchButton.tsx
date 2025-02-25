'use client'

import { useState, useRef, useEffect } from 'react'
import { searchBlogs } from '@/lib/blogService'
import Link from './Link'
import type { Blog } from '@/types/blog'

const FirebaseSearchButton = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // 处理搜索
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const results = await searchBlogs(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 实时搜索，输入时自动搜索
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // 当输入长度大于1时自动搜索
    if (value.length > 1) {
      const debounce = setTimeout(() => {
        handleSearch()
      }, 300)

      return () => clearTimeout(debounce)
    }
  }

  // 按下回车键时搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 打开模态框时聚焦搜索输入框
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // 点击外部关闭模态框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
        setSearchResults([])
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // ESC 键关闭模态框
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setSearchQuery('')
        setSearchResults([])
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen])

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="focus:outline-none" aria-label="Search">
        {children}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] backdrop-blur-sm transition-all duration-300 ease-in-out">
          <div
            ref={modalRef}
            className="w-full max-w-2xl overflow-hidden rounded-xl bg-white/90 shadow-2xl ring-1 ring-gray-200 backdrop-blur-lg dark:bg-gray-800/90 dark:ring-gray-700"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div className="relative flex items-center border-b border-gray-200 dark:border-gray-700">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="搜索博客..."
                className="w-full bg-transparent py-4 pl-12 pr-4 text-lg outline-none placeholder:text-gray-400 dark:text-white"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSearchResults([])
                    searchInputRef.current?.focus()
                  }}
                  className="absolute right-4 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">搜索中...</span>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                    {searchResults.map((blog) => (
                      <li
                        key={blog.id}
                        className="transition-colors duration-100 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="block p-4"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex flex-col">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {blog.title}
                            </div>
                            {blog.summary && (
                              <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                {blog.summary}
                              </p>
                            )}
                            {blog.tags && blog.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {blog.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : searchQuery.length > 1 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-300 dark:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">没有找到相关博客</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">输入关键词开始搜索</p>
                  </div>
                )}
              </div>
            )}

            <style jsx global>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  )
}

export default FirebaseSearchButton

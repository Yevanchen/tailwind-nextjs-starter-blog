'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold">出错了</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">加载项目时发生错误，请尝试刷新页面。</p>
      <button
        onClick={reset}
        className="rounded-md bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600"
      >
        重试
      </button>
    </div>
  )
}

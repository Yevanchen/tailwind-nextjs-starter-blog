import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold">页面未找到</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">抱歉，您请求的项目页面不存在。</p>
      <Link
        href="/"
        className="rounded-md bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600"
      >
        返回首页
      </Link>
    </div>
  )
}

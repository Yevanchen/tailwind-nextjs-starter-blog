export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">加载项目中...</p>
    </div>
  )
}

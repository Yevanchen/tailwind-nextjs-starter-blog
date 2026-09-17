import BlogArchive from '@/components/BlogArchive'
import { getListedPosts, postSummary } from '@/lib/posts.mjs'
export default function BlogPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">THE ARCHIVE</p>
        <h1>所有文章</h1>
        <p>一些观察，一些实践，还有尚未完成的思考。</p>
      </header>
      <BlogArchive posts={getListedPosts().map(postSummary)} />
    </>
  )
}

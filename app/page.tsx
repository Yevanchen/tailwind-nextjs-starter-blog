import Link from 'next/link'
import PostList from '@/components/PostList'
import { getListedPosts, postSummary } from '@/lib/posts.mjs'
export default function HomePage() {
  const posts = getListedPosts()
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">EVANCHEN · NOTES & IDEAS</p>
        <h1>思考，记录，然后继续。</h1>
        <p>关于产品、AI 与生活。很高兴你能来。</p>
      </header>
      <div className="section-label">
        <h2>最近的文字</h2>
        <span>{posts.length} 篇文章</span>
      </div>
      <PostList posts={posts.slice(0, 8).map(postSummary)} />
      <Link href="/blog/" className="archive-link">
        浏览所有文章 <span aria-hidden="true">→</span>
      </Link>
    </>
  )
}

'use client'
import { useState } from 'react'
import PostList, { PostSummary } from './PostList'
export default function BlogArchive({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState('')
  const term = query.trim().toLocaleLowerCase()
  const filtered = posts.filter((post) =>
    [post.title, post.summary, ...post.tags].join(' ').toLocaleLowerCase().includes(term)
  )
  return (
    <>
      <div className="archive-tools">
        <label htmlFor="blog-search" className="sr-only">
          搜索文章标题、摘要或标签
        </label>
        <input
          id="blog-search"
          type="search"
          placeholder="搜索文章标题、摘要或标签…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p role="status">{filtered.length} 篇文章</p>
      </div>
      <PostList posts={filtered} />
      {!filtered.length && <p className="py-12">没有找到相关文章，试试其他关键词。</p>}
    </>
  )
}

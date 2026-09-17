import Link from 'next/link'
import { postUrl } from '@/lib/urls'

export type PostSummary = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  minutes: number
}
export default function PostList({ posts }: { posts: PostSummary[] }) {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <article className="post-row">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Shanghai',
              })}
            </time>
            <div>
              <h2>
                <Link href={postUrl(post.slug)}>{post.title}</Link>
              </h2>
              {post.summary && <p>{post.summary}</p>}
              <div className="post-meta">
                <span>{post.minutes} 分钟阅读</span>
                {post.tags.slice(0, 4).map((tag) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}/`}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPosts, getListedPosts, getPost, renderMarkdown, postUrl } from '@/lib/posts.mjs'
import site from '@/data/siteMetadata'

type Props = { params: { slug: string[] } }
export const dynamicParams = false
export const generateStaticParams = () => getPosts().map((post) => ({ slug: post.slug.split('/') }))
export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(decodeURIComponent(params.slug.join('/')))
  if (!post) return {}
  const url = `${site.siteUrl}${postUrl(post.canonicalSlug || post.slug)}`
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastmod || post.date,
      authors: [site.author],
    },
  }
}
export default function PostPage({ params }: Props) {
  const post = getPost(decodeURIComponent(params.slug.join('/')))
  if (!post) notFound()
  const { html, headings } = renderMarkdown(post.content)
  const posts = getListedPosts()
  const index = posts.findIndex((item) => item.slug === post.slug)
  const adjacent = [posts[index - 1], posts[index + 1]].filter(Boolean)
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    description: post.summary,
    author: { '@type': 'Person', name: site.author },
    url: `${site.siteUrl}${postUrl(post.canonicalSlug || post.slug)}`,
  }
  return (
    <article className="reading-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}
      />
      <header className="article-header">
        <Link href="/blog/" className="back-link">
          ← 所有文章
        </Link>
        <div className="post-meta">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'Asia/Shanghai',
            })}
          </time>
          <span>{post.minutes} 分钟阅读</span>
          <span>{site.author}</span>
        </div>
        <h1>{post.title}</h1>
        {post.summary && <p className="article-summary">{post.summary}</p>}
        <div className="post-meta">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}/`}>
              {tag}
            </Link>
          ))}
        </div>
      </header>
      {headings.length > 2 && (
        <details className="article-toc" open={headings.length <= 8}>
          <summary>文章目录</summary>
          <nav aria-label="文章目录">
            <ol>
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: `${Math.max(0, heading.level - 2)}rem` }}
                >
                  <a href={`#${heading.id}`}>{heading.title}</a>
                </li>
              ))}
            </ol>
          </nav>
        </details>
      )}
      {post.content.trim() ? (
        <div
          className="article-body prose prose-lg dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="empty-note">这篇笔记原本没有正文，暂时保留标题与日期。</p>
      )}
      <footer className="article-footer">
        <a
          href={`${site.siteRepo}/edit/main/${post.file.split('/').map(encodeURIComponent).join('/')}`}
        >
          在 GitHub 上编辑这篇文章 ↗
        </a>
        <Link href="/blog/">返回所有文章</Link>
      </footer>
      {adjacent.length > 0 && (
        <nav className="related-posts" aria-label="相邻文章">
          <h2>继续阅读</h2>
          {adjacent.map((item) => (
            <Link key={item.slug} href={postUrl(item.slug)}>
              {item.title} →
            </Link>
          ))}
        </nav>
      )}
    </article>
  )
}

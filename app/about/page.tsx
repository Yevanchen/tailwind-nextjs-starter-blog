import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { renderMarkdown } from '@/lib/posts.mjs'
import { genPageMetadata } from '../seo'
export const metadata = genPageMetadata({ title: '关于我' })
export default function About() {
  const { data, content } = matter(
    fs.readFileSync(path.join(process.cwd(), 'data/authors/default.mdx'), 'utf8')
  )
  const { html } = renderMarkdown(content)
  return (
    <article className="reading-page">
      <header className="page-intro">
        <p className="eyebrow">ABOUT</p>
        <h1>{data.name}</h1>
        <p>{data.occupation}</p>
      </header>
      <div
        className="article-body prose prose-lg dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}

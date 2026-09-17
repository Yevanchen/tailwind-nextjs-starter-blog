import Link from 'next/link'
import { getListedPosts } from '@/lib/posts.mjs'
export default function Tags() {
  const tags = [...new Set(getListedPosts().flatMap((post) => post.tags))].sort()
  return (
    <>
      <header className="page-intro">
        <h1>标签</h1>
      </header>
      <ul className="flex flex-wrap gap-5">
        {tags.map((tag) => (
          <li key={tag}>
            <Link href={`/tags/${encodeURIComponent(tag)}/`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

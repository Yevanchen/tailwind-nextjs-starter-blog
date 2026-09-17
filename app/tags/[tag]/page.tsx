import { getListedPosts, postSummary } from '@/lib/posts.mjs'
import PostList from '@/components/PostList'
export const dynamicParams = false
export const generateStaticParams = () =>
  [...new Set(getListedPosts().flatMap((post) => post.tags))].map((tag) => ({ tag }))
export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">TOPIC</p>
        <h1>{tag}</h1>
      </header>
      <PostList
        posts={getListedPosts()
          .filter((post) => post.tags.includes(tag))
          .map(postSummary)}
      />
    </>
  )
}

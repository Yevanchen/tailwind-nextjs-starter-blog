// This file is used for server-side static generation
import { allBlogs } from 'contentlayer/generated'

const POSTS_PER_PAGE = 5

export async function generateStaticParams() {
  try {
    const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
    const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))
    return paths
  } catch (error) {
    console.error('Error generating static params:', error)
    // Return at least the first page as fallback
    return [{ page: '1' }]
  }
}

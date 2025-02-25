'use client'

import ListLayout from '@/layouts/ListLayoutWithTags'
import { useState, useEffect } from 'react'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

// Client-side only imports
const POSTS_PER_PAGE = 5

export default function Page({ params }: { params: { page: string } }) {
  const [posts, setPosts] = useState<CoreContent<Blog>[]>([])
  const [initialDisplayPosts, setInitialDisplayPosts] = useState<CoreContent<Blog>[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  })

  useEffect(() => {
    // Dynamically import content on the client side
    const loadContent = async () => {
      try {
        // Dynamic import for client-side only
        const { allCoreContent, sortPosts } = await import('pliny/utils/contentlayer')
        const { allBlogs } = await import('contentlayer/generated')

        const allPosts = allCoreContent(sortPosts(allBlogs))
        const pageNumber = parseInt(params.page as string)
        const displayPosts = allPosts.slice(
          POSTS_PER_PAGE * (pageNumber - 1),
          POSTS_PER_PAGE * pageNumber
        )

        setPosts(allPosts)
        setInitialDisplayPosts(displayPosts)
        setPagination({
          currentPage: pageNumber,
          totalPages: Math.ceil(allPosts.length / POSTS_PER_PAGE),
        })
      } catch (error) {
        console.error('Error loading blog content:', error)
      }
    }

    loadContent()
  }, [params.page])

  const handleDelete = async (postId: string): Promise<void> => {
    console.log('Delete not implemented for static pages', postId)
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
      onDelete={handleDelete}
    />
  )
}

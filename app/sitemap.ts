import type { MetadataRoute } from 'next'
import { getListedPosts, postUrl } from '@/lib/posts.mjs'
import site from '@/data/siteMetadata'
export const dynamic = 'force-static'
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getListedPosts()
  return [
    ...['', 'blog/', 'about/', 'projects/', 'tags/'].map((route) => ({
      url: `${site.siteUrl}/${route}`,
    })),
    ...posts.map((post) => ({
      url: `${site.siteUrl}${postUrl(post.slug)}`,
      lastModified: post.lastmod || post.date,
    })),
  ]
}

import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Blog as FirebaseBlog } from '@/types/blog'
import { serialize } from 'next-mdx-remote/serialize'
import { getBlogBySlug } from '@/lib/blogService'

// 创建一个客户端组件来包装MDXRemote
import dynamic from 'next/dynamic'

const MDXRemoteClient = dynamic(() => import('@/components/MDXRemoteClient'), { ssr: false })

const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

interface BlogProps {
  params: {
    slug: string[]
  }
}

export async function generateMetadata({ params }: BlogProps): Promise<Metadata> {
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)

  if (!post) {
    // 尝试从Firebase获取博客元数据
    try {
      const blogData = await getBlogBySlug(slug)

      if (!blogData) {
        return {
          title: 'Blog Not Found',
        }
      }

      return {
        title: blogData.title,
        description: blogData.summary,
        openGraph: {
          title: blogData.title,
          description: blogData.summary,
          url: `${siteMetadata.siteUrl}/blog/${slug}`,
          siteName: siteMetadata.title,
          locale: 'en_US',
          type: 'article',
          publishedTime: blogData.date,
          modifiedTime: blogData.lastmod || blogData.date,
          images: [],
          authors: blogData.authors
            ?.map((author) => `${siteMetadata.siteUrl}/author/${author}`)
            .filter(Boolean) as string[],
        },
        twitter: {
          card: 'summary_large_image',
          title: blogData.title,
          description: blogData.summary,
          images: [],
        },
      }
    } catch (error) {
      console.error('获取Firebase博客元数据失败:', error)
      return {
        title: 'Blog Not Found',
      }
    }
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = post.authors || ['default']
  const authorDetails = authors.map((author) => {
    const authorResults = allAuthors.find((a) => a.slug === author)
    return coreContent(authorResults as Authors)
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: post.images || [],
      authors: authorDetails
        .map((author) => {
          if (author?.name) {
            return `${siteMetadata.siteUrl}/author/${author.slug}`
          }
          return null
        })
        .filter(Boolean) as string[],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: post.images || [],
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allBlogs.map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export default async function Page({ params }: BlogProps) {
  const slug = decodeURI(params.slug.join('/'))

  // 首先尝试从静态内容获取博客
  const post = allBlogs.find((p) => p.slug === slug)

  if (post) {
    const mainContent = coreContent(post)
    const authorList = post.authors || ['default']
    const authorDetails = authorList.map((author) => {
      const authorResults = allAuthors.find((a) => a.slug === author)
      return coreContent(authorResults as Authors)
    })
    const layoutType = post.layout || 'PostLayout'
    const Layout = layouts[layoutType] || PostLayout

    return (
      // @ts-ignore - 类型定义问题，实际上PostLayout接受authorDetails属性
      <Layout content={mainContent} authorDetails={authorDetails} next={undefined} prev={undefined}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    )
  }

  // 如果静态内容中没有找到，尝试从Firebase获取
  try {
    // 使用新的getBlogBySlug函数获取博客数据
    const blogData = await getBlogBySlug(slug)

    if (!blogData) {
      console.log(`未找到slug为${slug}的博客`)
      return notFound()
    }

    // 处理作者信息
    const authorList = blogData.authors || ['default']
    const authorDetails = authorList.map((author) => {
      const authorResults = allAuthors.find((a) => a.slug === author)
      return authorResults
        ? coreContent(authorResults as Authors)
        : ({
            name: author,
            slug: author,
            avatar: '/static/images/avatar.png',
          } as CoreContent<Authors>)
    })

    // 将Markdown内容转换为MDX
    const mdxSource = await serialize(blogData.content || '')

    // 创建与contentlayer格式兼容的内容对象
    const mainContent = {
      title: blogData.title,
      date: blogData.date || new Date().toISOString(),
      tags: blogData.tags || [],
      lastmod: blogData.lastmod,
      draft: blogData.draft,
      summary: blogData.summary,
      slug: blogData.slug || '',
      path: `/blog/${blogData.slug}`,
      readingTime: { text: '5 min read', minutes: 5, time: 300000, words: 1000 },
      images: [],
      toc: '[]',
      type: 'Blog' as const,
      filePath: `content/blog/${blogData.fileName || 'dynamic-content.mdx'}`,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blogData.title,
        datePublished: blogData.date,
        dateModified: blogData.lastmod || blogData.date,
        description: blogData.summary,
        image: [],
        url: `${siteMetadata.siteUrl}/blog/${blogData.slug}`,
        author: authorList.map((author) => ({
          '@type': 'Person',
          name: author,
        })),
      },
    } as CoreContent<Blog>

    // 使用默认布局
    const Layout = PostLayout

    return (
      // @ts-ignore - 类型定义问题，实际上PostLayout接受authorDetails属性
      <Layout content={mainContent} authorDetails={authorDetails} next={undefined} prev={undefined}>
        <MDXRemoteClient source={mdxSource} />
      </Layout>
    )
  } catch (error) {
    console.error('获取Firebase博客数据失败:', error)
    return notFound()
  }
}

export interface Blog {
  id: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  summary: string
  content: string
  slug: string
  fileName: string
  lastmod?: string
  authors?: string[]
}

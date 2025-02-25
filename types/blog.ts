export interface Blog {
  id: string
  title: string
  slug?: string
  date?: string
  tags?: string[]
  summary?: string
  content?: string
  author?: string
  // 添加其他可能需要的字段
}

import { useMemo } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

// 基础样式配置
const baseHeadingStyles = {
  h1: 'text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl',
  h2: 'text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl',
  h3: 'text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl',
}

const baseTextStyles = {
  text: 'text-lg leading-relaxed text-gray-700 dark:text-gray-300',
  emphasis: 'italic text-gray-700 dark:text-gray-300',
  strong: 'font-semibold text-gray-900 dark:text-gray-100',
  inlineCode: 'rounded bg-gray-100 px-1 py-0.5 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
}

// 自定义组件工厂函数
const createHeadingComponent = (level: keyof typeof baseHeadingStyles) => {
  const Tag = level
  const HeadingComponent = ({ children, ...props }: React.ComponentProps<typeof Tag>) => (
    <Tag className={baseHeadingStyles[level]} {...props}>
      {children}
    </Tag>
  )
  HeadingComponent.displayName = `Heading${level.toUpperCase()}`
  return HeadingComponent
}

// MDX 组件配置
export const components: MDXComponents = {
  // 核心组件
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,

  // 标题组件
  h1: createHeadingComponent('h1'),
  h2: createHeadingComponent('h2'),
  h3: createHeadingComponent('h3'),

  // 文本组件
  p: ({ children, ...props }) => (
    <p className={baseTextStyles.text} {...props}>
      {children}
    </p>
  ),
  em: ({ children, ...props }) => (
    <em className={baseTextStyles.emphasis} {...props}>
      {children}
    </em>
  ),
  strong: ({ children, ...props }) => (
    <strong className={baseTextStyles.strong} {...props}>
      {children}
    </strong>
  ),
  code: ({ children, ...props }) => (
    <code className={baseTextStyles.inlineCode} {...props}>
      {children}
    </code>
  ),

  // 列表组件
  ul: ({ children, ...props }) => (
    <ul className="my-6 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-6 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="mt-2" {...props}>
      {children}
    </li>
  ),

  // 块级组件
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-primary-500 bg-gray-50 p-4 dark:border-primary-400 dark:bg-gray-900"
      {...props}
    >
      <div className="text-lg italic text-gray-700 dark:text-gray-300">{children}</div>
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,

  // 自定义组件
  Alert: ({ children, type = 'info' }) => {
    const styles = {
      info: 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200',
      warning:
        'bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200',
      error: 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/50 dark:text-red-200',
    }
    return (
      <div className={`my-4 rounded-lg border-l-4 p-4 ${styles[type as keyof typeof styles]}`}>
        {children}
      </div>
    )
  },
}

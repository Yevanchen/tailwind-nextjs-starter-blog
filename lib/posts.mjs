import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import footnote from 'markdown-it-footnote'
import taskLists from 'markdown-it-task-lists'
import hljs from 'highlight.js'

export const blogDirectory = path.join(process.cwd(), 'data/blog')
export const postUrl = (slug) => `/blog/${slug.split('/').map(encodeURIComponent).join('/')}/`

export function readPosts(directory = blogDirectory) {
  const files = fs
    .readdirSync(directory, { recursive: true })
    .filter((file) => /\.mdx?$/.test(String(file)))
  const slugs = new Set()
  return files
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'))
      const slug = data.slug || String(file).replace(/\.mdx?$/, '')
      if (
        !data.title ||
        typeof data.title !== 'string' ||
        !data.date ||
        !Number.isFinite(Date.parse(data.date))
      ) {
        throw new Error(`Missing title or invalid date: ${file}`)
      }
      if (
        typeof slug !== 'string' ||
        slug !== slug.trim() ||
        /[?#\\%\x00-\x1f]/.test(slug) ||
        slug.split('/').some((s) => !s || s === '.' || s === '..') ||
        ['editor', 'page'].includes(slug.split('/')[0])
      ) {
        throw new Error(`Invalid or reserved slug: ${file}`)
      }
      if (slugs.has(slug)) throw new Error(`Duplicate slug: ${slug}`)
      slugs.add(slug)
      if (
        data.tags &&
        (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string'))
      )
        throw new Error(`Invalid tags: ${file}`)
      if (data.draft !== undefined && typeof data.draft !== 'boolean')
        throw new Error(`Invalid draft: ${file}`)
      if (data.lastmod && !Number.isFinite(Date.parse(data.lastmod)))
        throw new Error(`Invalid lastmod: ${file}`)
      const plain = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\s*[-*+] \[[ xX]\]\s*/gm, '')
        .replace(/[#*_>`]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      const cjk = (content.match(/[\u3400-\u9fff]/g) || []).length
      const words = content
        .replace(/[\u3400-\u9fff]/g, '')
        .split(/\s+/)
        .filter(Boolean).length
      return {
        slug,
        title: data.title,
        date: new Date(data.date).toISOString(),
        lastmod: data.lastmod ? new Date(data.lastmod).toISOString() : undefined,
        summary: data.summary || plain.slice(0, 120),
        tags: [
          ...new Set(
            (data.tags || []).map((tag) => tag.trim().replace(/^#+/, '').trim()).filter(Boolean)
          ),
        ],
        draft: data.draft === true,
        unlisted: data.unlisted === true,
        canonicalSlug: data.canonicalSlug,
        content,
        file: `data/blog/${String(file).replaceAll('\\', '/')}`,
        minutes: Math.max(1, Math.ceil(cjk / 350 + words / 220)),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export const getPosts = () => readPosts().filter((post) => !post.draft)
export const getListedPosts = () => getPosts().filter((post) => !post.unlisted)
export const getPost = (slug) => getPosts().find((post) => post.slug === slug)
/** @param {ReturnType<typeof readPosts>[number]} post */
export const postSummary = ({ content, ...post }) => post

export function renderMarkdown(source) {
  const headings = []
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight(code, language) {
      return language && hljs.getLanguage(language)
        ? hljs.highlight(code, { language, ignoreIllegals: true }).value
        : ''
    },
  })
    .use(footnote)
    .use(taskLists)
    .use(anchor, {
      level: [1, 2, 3, 4],
      slugify: (text) =>
        text
          .trim()
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s-]/gu, '')
          .replace(/\s+/g, '-') || 'section',
      callback(token, info) {
        headings.push({ id: info.slug, title: info.title, level: Number(token.tag.slice(1)) })
      },
    })
  md.renderer.rules.table_open = () =>
    '<div class="table-scroll" role="region" aria-label="文章表格" tabindex="0"><table>'
  md.renderer.rules.table_close = () => '</table></div>'
  const defaultImage = md.renderer.rules.image
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet('loading', 'lazy')
    tokens[idx].attrSet('decoding', 'async')
    return defaultImage(tokens, idx, options, env, self)
  }
  return { html: md.render(source), headings }
}

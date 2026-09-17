import { getListedPosts, postUrl } from '@/lib/posts.mjs'
import site from '@/data/siteMetadata'
export const dynamic = 'force-static'
const escape = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!
  )
export function GET() {
  const items = getListedPosts()
    .map(
      (post) =>
        `<item><title>${escape(post.title)}</title><link>${escape(site.siteUrl + postUrl(post.slug))}</link><guid>${escape(site.siteUrl + postUrl(post.slug))}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description>${escape(post.summary)}</description></item>`
    )
    .join('')
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(site.title)}</title><link>${site.siteUrl}</link><description>${escape(site.description)}</description><language>zh-CN</language>${items}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }
  )
}

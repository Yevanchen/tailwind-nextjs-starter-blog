export const postUrl = (slug: string) =>
  `/blog/${slug.split('/').map(encodeURIComponent).join('/')}/`

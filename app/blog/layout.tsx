import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}

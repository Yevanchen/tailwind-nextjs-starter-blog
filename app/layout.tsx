import 'css/tailwind.css'
import 'highlight.js/styles/github-dark.css'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import site from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.title,
    locale: 'zh_CN',
    type: 'website',
  },
  alternates: { types: { 'application/rss+xml': `${site.siteUrl}/feed.xml` } },
  icons: { icon: '/static/favicons/logo.png', apple: '/static/favicons/logo.png' },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProviders>
          <a href="#main-content" className="skip-link">
            跳到正文
          </a>
          <SectionContainer>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}

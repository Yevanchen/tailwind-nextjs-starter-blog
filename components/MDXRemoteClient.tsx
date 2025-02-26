'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { components } from '@/components/MDXComponents'

interface MDXRemoteClientProps {
  source: MDXRemoteSerializeResult
}

export default function MDXRemoteClient({ source }: MDXRemoteClientProps) {
  return <MDXRemote {...source} components={components} />
}

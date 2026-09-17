import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import matter from 'gray-matter'
import { getPosts, readPosts, renderMarkdown, postUrl } from '../lib/posts.mjs'

test('all posts render; Chinese and space-containing slugs round-trip', () => {
  for (const post of getPosts()) {
    assert.doesNotThrow(() => renderMarkdown(post.content), post.slug)
    assert.equal(decodeURIComponent(postUrl(post.slug).slice(6, -1)), post.slug)
  }
})

test('Markdown preserves headings, tables, code and images without running HTML', () => {
  const { html, headings } = renderMarkdown(
    '## 标题\n\n## 标题\n\n| A | B |\n|---|---|\n|1|2|\n\n```js\nconst a = 1 < 2\n```\n\n![说明](https://example.com/image.png)\n\n<script>alert(1)</script>\n\n[x](javascript:alert(1))'
  )
  assert.equal(headings.length, 2)
  assert.equal(headings[0].id, '标题')
  assert.notEqual(headings[0].id, headings[1].id)
  assert.match(html, /table-scroll/)
  assert.match(html, /hljs-keyword/)
  assert.match(html, /loading="lazy"/)
  assert.match(html, /alt="说明"/)
  assert.doesNotMatch(html, /<script>|href="javascript:/)
})

test('footnotes and nested lists render readably', () => {
  const { html } = renderMarkdown('文字[^1]\n\n- 第一层\n  - 第二层\n\n[^1]: 注释')
  assert.match(html, /footnote/)
  assert.equal((html.match(/<ul>/g) || []).length, 2)
})

test('invalid metadata, traversal paths and duplicate routes fail the build', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-content-'))
  try {
    const file = path.join(dir, 'test.md')
    const fixture = (data) =>
      matter.stringify('body', { title: 'Test', date: '2026-09-17', ...data })
    for (const data of [
      { date: 'invalid' },
      { slug: '../secret' },
      { slug: 'editor' },
      { slug: 'a%2fb' },
      { draft: 'false' },
      { tags: [3] },
    ]) {
      fs.writeFileSync(file, fixture(data))
      assert.throws(() => readPosts(dir))
    }
    fs.writeFileSync(file, fixture({ slug: 'same' }))
    fs.writeFileSync(path.join(dir, 'other.md'), fixture({ slug: 'same' }))
    assert.throws(() => readPosts(dir), /Duplicate slug/)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

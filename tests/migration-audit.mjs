import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { readPosts, getPosts } from '../lib/posts.mjs'

test('all migrated documents preserve content and usable historical URLs', () => {
  const manifest = JSON.parse(fs.readFileSync('data/migration-manifest.json', 'utf8'))
  const posts = readPosts()
  assert.equal(manifest.length, 36)
  for (const entry of manifest) {
    const post = posts.find((p) => p.file === entry.file)
    assert.ok(post, entry.file)
    assert.equal(post.slug, entry.originalSlug || 'daily-progress')
    assert.equal(
      createHash('sha256').update(post.content).digest('hex'),
      entry.migratedContentSha256 || entry.contentSha256
    )
  }
  assert.equal(new Set(posts.map((p) => p.slug)).size, posts.length)
  assert.ok(getPosts().every((p) => !p.draft))
})

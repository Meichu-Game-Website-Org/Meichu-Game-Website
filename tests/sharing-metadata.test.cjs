const assert = require('node:assert/strict')
const { test } = require('node:test')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')

test('sharing metadata separates editions, implemented routes and safe detail identifiers', async () => {
  const { EDITIONS, sharingMetadata } = await import('../packages/services/src/metadata.mjs')
  for (const [year, edition] of Object.entries(EDITIONS)) {
    for (const route of ['', ...edition.routes, 'game/mens-basketball', 'news/42']) {
      const pathname = `/${year}/${route}`
      const meta = sharingMetadata(`${pathname}?tracking=<script>#section`)
      assert.equal(meta.url, `https://meichu.games${pathname}`)
      assert.ok(meta.title.includes(`${edition.name}梅竹`))
      assert.ok(meta.image.endsWith(`/${year}.png`))
      assert.equal(sharingMetadata(`${pathname}${route ? '/' : ''}`).url, meta.url)
    }
  }
  for (const route of ['/20260/', '/2027/', '//evil.test', '/2026/news', '/2019/history',
    '/2026/game/<img>', '/2026/game/%22%3E', '/2026/news/abc', '/2026/game/a/b']) {
    assert.equal(sharingMetadata(route), null, route)
  }
  assert.equal(sharingMetadata('/2026/game/%62asketball').url, 'https://meichu.games/2026/game/basketball')
  assert.equal(sharingMetadata('/2026/game/%zz'), null)
})

test('sharing HTML escapes text and creates distinct static routes and private detail templates', async () => {
  const { sharingPages, sharingHead, replaceSharingHead } = await import('../scripts/lib/sharing-html.mjs')
  const { sharingMetadata, SHARE_URL_PLACEHOLDER } = await import('../packages/services/src/metadata.mjs')
  const pages = sharingPages([2019, 2023, 2025, 2026])
  assert.ok(pages.some(page => page.file === '2023/course/index.html'))
  assert.ok(!pages.some(page => page.file === '2025/news/index.html'))
  assert.ok(!pages.some(page => page.file === '2019/history/index.html'))
  for (const page of pages.filter(page => page.path.includes('/_'))) {
    assert.equal(page.metadata.url, SHARE_URL_PLACEHOLDER)
  }
  const meta = { ...sharingMetadata('/2026/'), title: 'Title $& </title><script>alert("x")</script>', description: '" onmouseover="bad' }
  const html = sharingHead(meta)
  assert.ok(!html.includes('<script>'))
  assert.ok(html.includes('&lt;/title&gt;'))
  assert.ok(html.includes('&quot; onmouseover=&quot;bad'))
  const replaced = replaceSharingHead('<html lang="en"><head><!-- sharing:start -->old<!-- sharing:end --><script src="/assets/hashed.js"></script></head>', meta)
  assert.ok(replaced.includes('<html lang="zh-Hant">'))
  assert.ok(replaced.includes('Title $&amp; &lt;/title&gt;'))
  assert.ok(replaced.includes('<script src="/assets/hashed.js"></script>'))
})

test('every committed sharing image is a complete 1200 × 630 PNG smaller than 5 MB', () => {
  for (let year = 2019; year <= 2026; year++) {
    const app = year === 2026 ? 'site-2026' : 'old-site'
    const bytes = readFileSync(path.join(root, `apps/${app}/public/sharing/${year}.png`))
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
    assert.equal(bytes.readUInt32BE(16), 1200)
    assert.equal(bytes.readUInt32BE(20), 630)
    assert.ok(bytes.length < 5_000_000)
  }
})

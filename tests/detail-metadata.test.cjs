const assert = require('node:assert/strict')
const { test, before } = require('node:test')
let parseDetailRoute, detailMetadata, summarizeText, sharingHead
before(async () => {
  ;({ parseDetailRoute, detailMetadata, summarizeText } = await import('../packages/services/src/detail-metadata.mjs'))
  ;({ sharingHead } = await import('../scripts/lib/sharing-html.mjs'))
})

test('detail routes bind public identifiers to the correct fixed API and canonical year', () => {
  for (const [year, yearId] of [[2019, 1], [2020, 2], [2021, 53], [2022, 54], [2023, 55], [2024, 56], [2025, 57], [2026, 58]]) {
    const game = parseDetailRoute(`/${year}/game/women-table-tennis/?tracking=evil`)
    assert.equal(game.yearId, yearId)
    assert.equal(game.path, `/${year}/game/women-table-tennis`)
    assert.equal(game.apiPath, `/api/game/slug/women-table-tennis?year_id=${yearId}`)
    const news = parseDetailRoute(`/${year}/news/%30%30%34%32`)
    assert.equal(news.key, '42')
    assert.equal(news.apiPath, '/api/news/42')
    assert.equal(news.path, `/${year}/news/42`)
  }
  for (const value of ['/2027/news/1', '//evil.test/2026/news/1', '/2026/news/0', '/2026/news/-1', '/2026/news/9007199254740992',
    '/2026/news/1/extra', '/2026/game/%2fhost', '/2026/game/%zz', '/2026/game/%3Ctag%3E', `/2026/game/${'a'.repeat(101)}`, null]) {
    assert.equal(parseDetailRoute(value), null, String(value))
  }
})

test('every news item gets its own bounded description and versioned PNG when no usable image exists', () => {
  const base = { id: 42, year_id: 58, title: '開賽公告', content: '<p>第一段 &amp; 第二段</p><script>hidden()</script><p>報名資訊</p>', files: [] }
  const meta = detailMetadata('/2026/news/42', base)
  assert.equal(meta.title, '開賽公告 | 丙午梅竹')
  assert.equal(meta.contentTitle, '開賽公告')
  assert.equal(meta.description, '第一段 & 第二段 報名資訊')
  assert.equal(meta.type, 'article')
  assert.equal(meta.contentType, 'news')
  assert.match(meta.image, /^https:\/\/meichu\.games\/og\/2026\/news\/42\.png\?v=[0-9a-f]{8}$/)
  assert.equal(meta.imageWidth, 1200)
  assert.equal(meta.imageHeight, 630)
  assert.equal(meta.imageType, 'image/png')
  const next = detailMetadata('/2026/news/43', { ...base, id: 43, title: '延期公告', content: '改期至明日。' })
  assert.notEqual(next.image, meta.image)
  assert.notEqual(next.title, meta.title)
  assert.notEqual(next.description, meta.description)
  assert.notEqual(detailMetadata('/2026/news/42', { ...base, content: '新的內容' }).revision, meta.revision)
  assert.notEqual(detailMetadata('/2026/news/42', { ...base, updated_at: '2026-11-08' }).revision, meta.revision)
})

test('API image URLs are first-party raster uploads and never invent dimensions or mime types', () => {
  const news = { id: 42, title: '公告', content: '內容' }
  for (const file of ['/images/1769957081_jpg', '/uploads/poster.png', 'https://meichu.games/images/notice.jpeg']) {
    const meta = detailMetadata('/2026/news/42', { ...news, files: [file] })
    assert.equal(meta.image, new URL(file, 'https://meichu.games').href)
    assert.equal(meta.imageType, null)
    assert.equal(meta.imageWidth, null)
    assert.equal(meta.imageHeight, null)
    const html = sharingHead(meta)
    assert.ok(!html.includes('og:image:width'))
    assert.ok(!html.includes('og:image:height'))
    assert.ok(!html.includes('og:image:type'))
  }
  for (const photo of ['javascript:bad()', 'data:image/png;base64,bad', 'https://evil.test/image.png', 'http://meichu.games/image.png',
    'https://meichu.games@evil.test/image.png', 'https://user:secret@meichu.games/image.png', '/images/vector.svg', '/images/document.pdf', '/images/a.png#fragment', null]) {
    assert.match(detailMetadata('/2026/news/42', { ...news, photo }).image, /\/og\/2026\/news\/42\.png\?v=/)
  }
})

test('declared identity mismatches never receive a fabricated preview', () => {
  const news = { id: 42, year_id: 58, title: '公告', content: '內容' }
  assert.equal(detailMetadata('/2025/news/42', news), null)
  assert.equal(detailMetadata('/2026/news/43', news), null)
  assert.equal(detailMetadata('/2026/news/42', { ...news, id: [42] }), null)
  assert.equal(detailMetadata('/2026/news/42', { ...news, id: { toString: 'invalid' } }), null)
  assert.equal(detailMetadata('/2026/news/42', { ...news, year_id: { toString: 'invalid' } }), null)
  assert.equal(detailMetadata('/2026/news/42', { ...news, year: { year: { toString: 'invalid' } } }), null)
  assert.equal(detailMetadata('/2026/news/42', { ...news, year: { year: 2025 } }), null)
  assert.equal(detailMetadata('/2026/news/42', null), null)
  assert.equal(detailMetadata('/2026/news/42', {}), null)
  const game = { name: '籃球', year_id: 58, item: { slug: 'basketball' }, photo: '/images/game_jpg' }
  assert.equal(detailMetadata('/2026/game/wrong', game), null)
  assert.equal(detailMetadata('/2025/game/basketball', game), null)
  assert.equal(detailMetadata({ path: '/2026/game/basketball', year: '2025', apiPath: 'https://evil.test' }, game).year, '2026')
  assert.equal(detailMetadata('/2026/game/basketball', game).image, 'https://meichu.games/images/game_jpg')
})

test('game summaries use the actual schedule, venue and state without fabricated zero scores', () => {
  const game = { name: '籃球正式賽', item: { slug: 'basketball' }, year_id: 58,
    date: '2026-03-07', time: '16:00', location: '清華體育館', status: 'nonstrt', score_nthu: 0, score_nctu: 0 }
  const initial = detailMetadata('/2026/game/basketball', game)
  assert.match(initial.description, /2026-03-07 · 16:00 · 清華體育館 · 尚未開始/)
  assert.ok(!initial.description.includes('0：0'))
  for (const bad of [null, '', ' ', '\t', -1, Infinity, 'NaN', '0x10', {}, false]) {
    const description = detailMetadata('/2026/game/basketball', { ...game, status: 'running', score_nthu: bad }).description
    assert.ok(!description.includes('：'), String(bad))
  }
  assert.match(detailMetadata('/2026/game/basketball', { ...game, status: 'running' }).description, /清華 0：0 陽明交大/)
  assert.match(detailMetadata('/2026/game/basketball', { ...game, status: 'nthu', score_nthu: '02', score_nctu: '1' }).description, /清華 2：1 陽明交大/)
  assert.ok(!detailMetadata('/2026/game/basketball', { ...game, type_of: 'agenda', status: 'end' }).description.includes('0：0'))
  for (const slug of ['opening', 'closing']) {
    const description = detailMetadata(`/2026/game/${slug}`, { ...game, item: { slug }, status: 'end' }).description
    assert.ok(!description.includes('0：0'))
    assert.match(description, /2026-03-07 · 16:00 · 清華體育館 · 已結束/)
  }
})

test('summaries and output HTML remain bounded text, including markup and malformed entities', () => {
  assert.equal(summarizeText('2 < 3<br>與 &lt;strong&gt;說明&lt;/strong&gt;<!-- hidden -->'), '2 < 3 與 說明')
  assert.equal(summarizeText('<style>bad</style>內容<script>hidden'), '內容')
  assert.equal(summarizeText('&#0; &#x110000; &#xD800; &#x4E2D;'), '中')
  const meta = detailMetadata('/2026/news/42', { id: 42, title: '</title><img src=x onerror="bad">', content: '中文'.repeat(30000) })
  assert.ok(Array.from(meta.description).length <= 180)
  const html = sharingHead(meta)
  assert.ok(!html.includes('<img'))
  assert.ok(html.includes('&lt;/title&gt;'))
})

test('unknown and malformed game statuses cannot coerce objects or expose prototype properties', () => {
  const game = { name: '籃球正式賽', item: { slug: 'basketball' }, year_id: 58,
    date: '2026-03-07', time: '16:00', location: '清華體育館', score_nthu: 0, score_nctu: 0 }
  for (const status of [undefined, null, false, 1, [], ['running'], {}, { toString: 'invalid' },
    'unknown', 'constructor', '__proto__', 'toString', 'hasOwnProperty']) {
    assert.equal(detailMetadata('/2026/game/basketball', { ...game, status }).description,
      '2026-03-07 · 16:00 · 清華體育館')
  }
})

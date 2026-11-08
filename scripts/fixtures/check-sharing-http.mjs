import assert from 'node:assert/strict'

// Test-only checks piped into Node inside the application container. Keeping
// both origins on the internal Docker network requires no published ports.
const origin = 'http://127.0.0.1'
const apiOrigin = 'http://api-fixture:8099'

const request = async (path, options = {}) => fetch(new URL(path, origin), {
  redirect: 'manual', signal: AbortSignal.timeout(8000), ...options
})
for (const [path, location] of [['/', '/2026/'], ['/2026', '/2026/'], ['/?from=smoke', '/2026/?from=smoke']]) {
  const response = await request(path)
  assert.equal(response.status, 308, path)
  assert.equal(response.headers.get('location'), location, path)
}

const current = await request('/2026/')
const archive = await request('/2025/')
assert.equal(current.status, 200)
assert.equal(archive.status, 200)
const currentHtml = await current.text()
const archiveHtml = await archive.text()
assert.notEqual(currentHtml, archiveHtml, 'the two apps must have separate entry points')

const crawler = { 'user-agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' }
const imageCache = new Map()
const attributes = tag => Object.fromEntries([...tag.matchAll(/([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
  .map(([, name, doubleQuoted, singleQuoted]) => [name, doubleQuoted ?? singleQuoted]))
async function assertSharing(path, year, expectedPath = path, headers = {}, expected = {}) {
  const response = await request(path, { headers: { ...crawler, ...headers } })
  assert.equal(response.status, 200, path)
  assert.match(response.headers.get('content-type'), /^text\/html/, path)
  const html = await response.text()
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]
  assert.ok(head, `${path}: metadata must be in the original HTML head`)
  const tags = [...head.matchAll(/<meta\s[^>]*>/gi)].map(match => attributes(match[0]))
  const meta = key => {
    const matches = tags.filter(tag => tag.property === key || tag.name === key)
    assert.equal(matches.length, 1, `${path}: exactly one ${key}`)
    assert.ok(matches[0].content, `${path}: ${key} must not be empty`)
    return matches[0].content
  }
  const canonicals = [...head.matchAll(/<link\s[^>]*>/gi)].map(match => attributes(match[0])).filter(tag => tag.rel === 'canonical')
  assert.equal(canonicals.length, 1, `${path}: one canonical link`)
  assert.equal(canonicals[0].href, `https://meichu.games${expectedPath}`, path)
  assert.equal(meta('og:url'), canonicals[0].href, path)
  assert.ok(meta('og:title').length > 0)
  assert.ok(meta('og:site_name').includes(String(year)), `${path}: sharing metadata must identify its year`)
  assert.ok(meta('og:description').length > 0)
  if (expected.title) assert.ok(meta('og:title').includes(expected.title), `${path}: resource title`)
  if (expected.description) assert.ok(meta('og:description').includes(expected.description), `${path}: resource description`)
  assert.equal(meta('twitter:card'), 'summary_large_image')
  assert.equal(meta('twitter:image'), meta('og:image'))
  assert.ok(meta('og:image:alt').length > 0)
  assert.equal(meta('og:image:type'), 'image/png')
  assert.equal(meta('og:image:width'), '1200')
  assert.equal(meta('og:image:height'), '630')
  assert.ok(!html.includes('__MEICHU_SHARE_URL__'), `${path}: unresolved sharing URL`)

  const image = new URL(meta('og:image'))
  assert.equal(image.origin, 'https://meichu.games')
  if (expected.dynamic) assert.match(image.pathname, new RegExp(`^/og/${year}/(?:game|news)/[A-Za-z0-9_-]+\\.png$`))
  else assert.equal(image.pathname, year === 2026 ? '/2026/sharing/2026.png' : `/sharing/${year}.png`)
  const imagePath = image.pathname + image.search
  if (!imageCache.has(imagePath)) {
    const imageResponse = await request(imagePath, { headers: crawler })
    assert.equal(imageResponse.status, 200, image.pathname)
    assert.match(imageResponse.headers.get('content-type'), /^image\/png/, image.pathname)
    const bytes = Buffer.from(await imageResponse.arrayBuffer())
    assert.deepEqual(bytes.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    assert.equal(bytes.readUInt32BE(16), 1200, image.pathname)
    assert.equal(bytes.readUInt32BE(20), 630, image.pathname)
    assert.ok(bytes.length < 5 * 1024 * 1024, `${image.pathname}: image exceeds card size limit`)
    imageCache.set(imagePath, bytes)
  }
  return { html, imagePath, bytes: imageCache.get(imagePath), meta }
}

for (const year of [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]) {
  const staticRoutes = ['', 'game', 'about']
  if (year !== 2019) staticRoutes.push('history')
  if (year <= 2024) staticRoutes.push('news')
  if (year === 2023 || year === 2024) staticRoutes.push('course')
  for (const route of staticRoutes) await assertSharing(`/${year}/${route}`, year)
  const cards = []
  for (const [route, title, description] of [
    ['game/smoke', `${year} 籃球賽 smoke`, `${year} 運動場`],
    ['game/other', `${year} 籃球賽 other`, `${year} 運動場`],
    [`news/${year * 100 + 1}`, `${year} 公告 1`, `${year} 第 1 則公告`],
    [`news/${year * 100 + 2}`, `${year} 公告 2`, `${year} 第 2 則公告`]
  ]) {
    cards.push(await assertSharing(`/${year}/${route}`, year, `/${year}/${route}`, {
      cookie: `meichu-year=${year === 2026 ? 2025 : 2026}`,
      referer: `${origin}/${year === 2026 ? 2025 : 2026}/`,
      authorization: 'Bearer smoke-only-not-a-real-credential'
    }, { dynamic: true, title, description }))
  }
  assert.equal(new Set(cards.map(card => card.imagePath)).size, 4, 'each resource has its own image URL')
  assert.notDeepEqual(cards[0].bytes, cards[1].bytes, 'different games render different cards')
  assert.notDeepEqual(cards[2].bytes, cards[3].bytes, 'different news render different cards')
}

// Canonical metadata uses only a validated route, regardless of host/query input.
const marker = 'meichu-sharing-injection-probe'
const query = `?probe=%22%3E%3Cscript%3E${marker}%3C%2Fscript%3E&next=https://attacker.invalid`
const detail = await assertSharing(`/2026/game/smoke/${query}`, 2026, '/2026/game/smoke', { host: 'attacker.invalid' }, { dynamic: true })
assert.ok(!detail.html.includes(marker), 'query parameters must not be reflected into HTML')
await assertSharing('/2025/news/202501/?from=share', 2025, '/2025/news/202501', {}, { dynamic: true })
await assertSharing('/2026/game/%73moke', 2026, '/2026/game/smoke', {}, { dynamic: true })
for (const route of [`game/%22%3E${marker}`, `news/1%22${marker}`, `game/%2522${marker}`]) {
  const { html } = await assertSharing(`/2026/${route}`, 2026, '/2026/')
  assert.ok(!html.includes(marker), 'unsafe encoded paths must not be reflected into HTML')
}

// Cache keys ignore client queries/credentials, while different records remain
// distinct. The internal fixture network cannot contact production services.
const headers = { cookie: 'session=smoke-only', authorization: 'Bearer smoke-only' }
const repeated = await request('/2026/game/smoke?year_id=1&origin=http://attacker.invalid', { headers })
assert.equal(repeated.status, 200)
assert.equal(repeated.headers.get('x-meichu-sharing'), 'fresh')
assert.equal(await repeated.text(), detail.html, 'browser and crawler receive identical HTML for the same record')
await Promise.all(Array.from({ length: 6 }, () => request('/2026/game/burst').then(response => {
  assert.equal(response.status, 200)
})))
const seen = await fetch(`${apiOrigin}/__requests`).then(response => response.json())
assert.equal(seen.counts['/api/game/slug/smoke?year_id=58'], 1, 'same resource is fetched once despite hostile queries')
assert.equal(seen.counts['/api/game/slug/burst?year_id=58'], 1, 'concurrent requests share one API request')
assert.ok(seen.requests.every(item => !item.cookie && !item.authorization), 'browser credentials must not reach the API')
assert.ok(seen.requests.every(item => /^\/api\/(news\/[0-9]+|game\/slug\/[A-Za-z0-9_-]+\?year_id=[0-9]+)$/.test(item.path)))

for (const path of ['/2026/game/missing', '/2026/news/999']) {
  const response = await request(path)
  assert.equal(response.status, 404, path)
  assert.match(response.headers.get('x-robots-tag'), /noindex/)
  assert.match(response.headers.get('cache-control'), /no-store/)
  assert.ok((await response.text()).includes('id="app"'), 'missing content retains the SPA shell')
}
for (const key of ['unavailable', 'redirect', 'slow']) {
  const response = await request(`/2026/game/${key}`)
  assert.equal(response.status, 503, key)
  assert.equal(response.headers.get('x-meichu-sharing'), 'fallback', key)
  assert.match(response.headers.get('cache-control'), /no-store/)
  assert.ok(!(await response.text()).includes('__MEICHU_SHARE_URL__'))
  const imageResponse = await request(`/og/2026/game/${key}.png`)
  assert.equal(imageResponse.status, 503, key)
}
const photo = await request('/2026/game/photo').then(response => response.text())
assert.match(photo, /property="og:image" content="https:\/\/meichu\.games\/uploads\/game-photo\.png"/)
assert.ok(!photo.includes('property="og:image:width"'), 'upstream images must not invent dimensions')
const head = await request('/2026/game/smoke', { method: 'HEAD' })
assert.equal(head.status, 200)
assert.equal(await head.text(), '')
const post = await request('/2026/game/smoke', { method: 'POST' })
assert.equal(post.status, 405)
assert.match(post.headers.get('allow'), /GET.*HEAD/)
const imageHead = await request(detail.imagePath, { method: 'HEAD' })
assert.equal(imageHead.status, 200)
assert.match(imageHead.headers.get('content-type'), /^image\/png/)
assert.equal(await imageHead.text(), '')
assert.ok(imageHead.headers.get('etag'), 'generated images have a cache validator')
const notModified = await request(detail.imagePath, { headers: { 'if-none-match': imageHead.headers.get('etag') } })
assert.equal(notModified.status, 304)
assert.equal(await notModified.text(), '')

const checkedAssets = new Set()
for (const [html, prefix] of [[currentHtml, '/2026/'], [archiveHtml, '/']]) {
  const assets = [...html.matchAll(/(?:src|href|data-src)=["']([^"']+)["']/g)]
    .map(match => match[1]).filter(value => value.startsWith('/') && !value.startsWith('//'))
  assert.ok(assets.some(value => value.endsWith('.js')), `${prefix} JavaScript entry is missing`)
  for (const asset of assets) {
    assert.ok(asset.startsWith(prefix), `${prefix} contains asset outside its namespace: ${asset}`)
    if (checkedAssets.has(asset)) continue
    checkedAssets.add(asset)
    const response = await request(asset)
    assert.equal(response.status, 200, asset)
    assert.ok(!response.headers.get('content-type')?.includes('text/html'), `${asset} served HTML`)
    if (!asset.endsWith('.css')) continue
    const css = await response.text()
    for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
      if (/^(data:|https?:|\/\/|#)/.test(match[1])) continue
      const url = new URL(match[1], new URL(asset, origin))
      const fontOrImage = await request(url.pathname)
      assert.equal(fontOrImage.status, 200, url.pathname)
      assert.ok(!fontOrImage.headers.get('content-type')?.includes('text/html'), `${url.pathname} served HTML`)
    }
  }
}

for (const path of ['/2018/', '/2027/', '/2099/', '/20260/', '/2026wrong/', '/missing', '/assets/missing.js', '/2026/assets/missing.js', '/sharing/missing.png', '/2026/sharing/missing.png', '/2025/_game/index.html', '/2026/_news/index.html', '/og/2099/news/1.png', '/og/2026/news/no-id.png', '/og/2026/game/missing.png']) {
  assert.equal((await request(path)).status, 404, path)
}

console.log('Container HTTP checks passed: both apps, dynamic OG HTML/PNG for 8 years, safe API requests, cache isolation, failures and method handling')

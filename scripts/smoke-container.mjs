import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('../', import.meta.url))
const args = process.argv.slice(2)
if (args.length && (args.length !== 2 || args[0] !== '--image')) {
  throw new Error('Usage: node scripts/smoke-container.mjs [--image IMAGE]')
}
const image = args[1] || `meichu-website:smoke-${process.pid}`
const docker = (args, options = {}) => execFileSync('docker', args, {
  cwd: root,
  encoding: 'utf8',
  ...options
})

if (!args.length) {
  docker(['build', '--file', 'apps/old-site/Dockerfile', '--tag', image, '.'], { stdio: 'inherit' })
}

let container
try {
  container = docker(['run', '--detach', '--rm', '--publish', '127.0.0.1::80', image]).trim()
  assert.match(container, /^[a-f0-9]{64}$/)
  const port = docker(['port', container, '80/tcp']).trim()
  assert.match(port, /^127\.0\.0\.1:\d+$/)
  const origin = `http://${port}`

  let ready = false
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${origin}/healthz`, { signal: AbortSignal.timeout(1000) })
      if (response.ok && await response.text() === 'ok\n') {
        ready = true
        break
      }
    } catch { /* Wait for nginx to finish starting. */ }
    await delay(250)
  }
  assert.ok(ready, 'nginx health endpoint did not become ready')
  // Exercise the same executable and URL used by Docker's HEALTHCHECK.
  docker(['exec', container, 'wget', '-q', '-O', '/dev/null', 'http://127.0.0.1/healthz'])

  const request = async (path, options = {}) => fetch(new URL(path, origin), {
    redirect: 'manual', signal: AbortSignal.timeout(5000), ...options
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
  async function assertSharing(path, year, expectedPath = path, headers = {}) {
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
    assert.equal(meta('twitter:card'), 'summary_large_image')
    assert.equal(meta('twitter:image'), meta('og:image'))
    assert.ok(meta('og:image:alt').length > 0)
    assert.equal(meta('og:image:type'), 'image/png')
    assert.equal(meta('og:image:width'), '1200')
    assert.equal(meta('og:image:height'), '630')
    assert.ok(!html.includes('__MEICHU_SHARE_URL__'), `${path}: unresolved sharing URL`)

    const image = new URL(meta('og:image'))
    assert.equal(image.origin, 'https://meichu.games')
    assert.equal(image.pathname, year === 2026 ? '/2026/sharing/2026.png' : `/sharing/${year}.png`)
    if (!imageCache.has(image.pathname)) {
      const imageResponse = await request(image.pathname, { headers: crawler })
      assert.equal(imageResponse.status, 200, image.pathname)
      assert.match(imageResponse.headers.get('content-type'), /^image\/png/, image.pathname)
      const bytes = Buffer.from(await imageResponse.arrayBuffer())
      assert.deepEqual(bytes.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      assert.equal(bytes.readUInt32BE(16), 1200, image.pathname)
      assert.equal(bytes.readUInt32BE(20), 630, image.pathname)
      assert.ok(bytes.length < 5 * 1024 * 1024, `${image.pathname}: image exceeds card size limit`)
      imageCache.set(image.pathname, true)
    }
    return html
  }

  for (const year of [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]) {
    const staticRoutes = ['', 'game', 'about']
    if (year !== 2019) staticRoutes.push('history')
    if (year <= 2024) staticRoutes.push('news')
    if (year === 2023 || year === 2024) staticRoutes.push('course')
    for (const route of staticRoutes) await assertSharing(`/${year}/${route}`, year)
    for (const route of ['game/smoke', 'news/1']) {
      await assertSharing(`/${year}/${route}`, year, `/${year}/${route}`, {
        cookie: `meichu-year=${year === 2026 ? 2025 : 2026}`,
        referer: `${origin}/${year === 2026 ? 2025 : 2026}/`
      })
    }
  }

  // Canonical metadata uses only a validated route, regardless of host/query input.
  const marker = 'meichu-sharing-injection-probe'
  const query = `?probe=%22%3E%3Cscript%3E${marker}%3C%2Fscript%3E&next=https://attacker.invalid`
  const detail = await assertSharing(`/2026/game/smoke/${query}`, 2026, '/2026/game/smoke', { host: 'attacker.invalid' })
  assert.ok(!detail.includes(marker), 'query parameters must not be reflected into HTML')
  await assertSharing('/2025/news/123/?from=share', 2025, '/2025/news/123')
  await assertSharing('/2026/game/%73moke', 2026, '/2026/game/smoke')
  for (const route of [`game/%22%3E${marker}`, `news/1%22${marker}`, `game/%2522${marker}`]) {
    const html = await assertSharing(`/2026/${route}`, 2026, '/2026/')
    assert.ok(!html.includes(marker), 'unsafe encoded paths must not be reflected into HTML')
  }

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

  for (const path of ['/2018/', '/2027/', '/2099/', '/20260/', '/2026wrong/', '/missing', '/assets/missing.js', '/2026/assets/missing.js', '/sharing/missing.png', '/2026/sharing/missing.png', '/2025/_game/index.html', '/2026/_news/index.html']) {
    assert.equal((await request(path)).status, 404, path)
  }
  console.log(`Container HTTP smoke passed: both apps, 8 years of crawler metadata and images, safe detail URLs, redirects, assets and 404s (${image})`)
} catch (error) {
  if (container) {
    try { docker(['logs', container], { stdio: 'inherit' }) } catch { /* Preserve the original failure. */ }
  }
  throw error
} finally {
  if (container) {
    try { docker(['rm', '--force', container]) } catch (error) {
      // --rm may already have removed a container that failed during startup.
      if (!String(error.stderr).includes('No such container')) throw error
    }
  }
}

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

  for (const path of ['/2026/game/smoke', '/2026/news/1', '/2026/about']) {
    const response = await request(path, { headers: { cookie: 'meichu-year=2025', referer: `${origin}/2025/` } })
    assert.equal(response.status, 200, path)
    assert.equal(await response.text(), currentHtml, path)
  }
  for (const year of [2019, 2020, 2021, 2022, 2023, 2024, 2025]) {
    const path = `/${year}/game/smoke`
    const response = await request(path, { headers: { cookie: 'meichu-year=2026', referer: `${origin}/2026/` } })
    assert.equal(response.status, 200, path)
    assert.equal(await response.text(), archiveHtml, path)
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

  for (const path of ['/2018/', '/2027/', '/2099/', '/20260/', '/2026wrong/', '/missing', '/assets/missing.js', '/2026/assets/missing.js']) {
    assert.equal((await request(path)).status, 404, path)
  }
  console.log(`Container HTTP smoke passed: both apps, 7 archive years, redirects, assets and 404s (${image})`)
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

const assert = require('node:assert/strict')
const { test, before, after } = require('node:test')
const { createServer } = require('node:http')
const { readFile, stat } = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require('playwright')

let browser, server, origin
before(async () => {
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      const current = pathname.startsWith('/2026/')
      const directory = path.resolve(`apps/${current ? 'site-2026' : 'old-site'}/dist`)
      let relative = current ? pathname.slice('/2026/'.length) : pathname.slice(1)
      if (/^(?:20\d\d\/)?game\/[A-Za-z0-9_-]+$/.test(relative)) relative = relative.replace(/game\/[^/]+$/, '_game')
      if (/^(?:20\d\d\/)?news\/[0-9]+$/.test(relative)) relative = relative.replace(/news\/[^/]+$/, '_news')
      let file = path.resolve(directory, relative)
      if (file !== directory && !file.startsWith(directory + path.sep)) throw new Error('Invalid path')
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
      const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' }[path.extname(file)] || 'application/octet-stream'
      response.setHeader('Content-Type', type)
      response.end(await readFile(file))
    } catch { response.writeHead(404).end() }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, headless: true })
})
after(async () => {
  await browser?.close()
  if (server) await new Promise(resolve => server.close(resolve))
})

test('all static edition routes expose complete sharing metadata without JavaScript', async t => {
  const { sharingPages } = await import('../../scripts/lib/sharing-html.mjs')
  const context = await browser.newContext({ javaScriptEnabled: false })
  t.after(() => context.close())
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort())
  const page = await context.newPage()
  for (const entry of sharingPages([2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]).filter(entry => !entry.path.includes('/_'))) {
    const response = await page.goto(origin + entry.path)
    assert.equal(response.status(), 200, entry.path)
    assert.equal(await page.title(), entry.metadata.title)
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-Hant')
    for (const [selector, attribute, expected] of [
      ['meta[property="og:title"]', 'content', entry.metadata.title],
      ['meta[property="og:url"]', 'content', entry.metadata.url],
      ['link[rel="canonical"]', 'href', entry.metadata.url],
      ['meta[property="og:image"]', 'content', entry.metadata.image],
      ['meta[name="twitter:card"]', 'content', 'summary_large_image'],
      ['meta[name="description"]', 'content', entry.metadata.description]
    ]) {
      assert.equal(await page.locator(selector).count(), 1, `${entry.path}: ${selector}`)
      assert.equal(await page.locator(selector).getAttribute(attribute), expected)
    }
    assert.equal(await page.locator('#app').innerHTML(), '', 'No JS-rendered metadata is needed')
  }
})

test('2026 metadata follows async API text and SPA navigation without HTML injection', async t => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  t.after(() => context.close())
  const title = '測試公告 </title><img src=x onerror="window.injected=true">'
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (url.pathname === '/api/news/42') return route.fulfill({ json: { news: { id: 42, title, content: '<p>公告內容</p>', created_at: '2026-03-01', files: [], org: '測試' } } })
    if (url.pathname.startsWith('/api/')) return route.fulfill({ json: { news: [], games: [], options: [], items: [], archives: [] } })
    return route.fulfill({ body: '' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${origin}/2026/news/%34%32?tracking=ignored`)
  await page.waitForFunction(expected => document.title === expected, `${title} | 丙午梅竹`)
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), `${title} | 丙午梅竹`)
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://meichu.games/2026/news/42')
  assert.equal(await page.locator('head img').count(), 0)
  assert.equal(await page.evaluate(() => window.injected), undefined)
  await page.locator('a[href="/2026/game"]:visible').first().click()
  await page.waitForFunction(() => document.title === '賽事列表 | 丙午梅竹')
  assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), 'https://meichu.games/2026/game')
  assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute('content'), '賽事列表 | 丙午梅竹')
  assert.equal(await page.locator('meta[property="og:title"]').count(), 1)
  await page.goto(`${origin}/2026/game/missing`)
  await page.waitForFunction(() => document.title === '賽事資訊 | 丙午梅竹')
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), '賽事資訊 | 丙午梅竹', 'Fallback titles do not repeat the parent edition suffix')
  assert.deepEqual(errors, [])
})

const assert = require('node:assert/strict')
const { test, before, after } = require('node:test')
const { createServer } = require('node:http')
const { readFile, stat, readdir } = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require('playwright')

const directory = path.resolve('apps/old-site/dist')
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' }
let browser, server, origin

before(async () => {
  server = createServer(async (request, response) => {
    try {
      const relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\/+/, '')
      let file = path.resolve(directory, relative)
      if (!file.startsWith(directory + path.sep)) file = path.join(directory, 'index.html')
      const info = await stat(file).catch(() => null)
      if (!info?.isFile() && !path.extname(relative)) file = path.join(directory, 'index.html')
      response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
      response.end(await readFile(file))
    } catch { response.writeHead(404).end('Not found') }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined })
})

after(async () => {
  if (browser) await browser.close()
  if (server) await new Promise(resolve => server.close(resolve))
})

test('legacy build: stylesheet images and shared fonts resolve to emitted files', async () => {
  const assets = path.join(directory, 'assets')
  let references = 0
  for (const file of await readdir(assets)) {
    if (!file.endsWith('.css')) continue
    const css = await readFile(path.join(assets, file), 'utf8')
    for (const match of css.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
      const url = match[2]
      if (/^(data:|https?:|#)/.test(url)) continue
      const asset = new URL(url, `${origin}/assets/${file}`)
      assert.equal(asset.origin, origin)
      const emitted = path.join(directory, decodeURIComponent(asset.pathname))
      assert.ok((await stat(emitted)).isFile(), `${file}: ${url} must exist`)
      references++
    }
  }
  assert.ok(references > 10, 'Check real archive image and font references')
})

test('legacy build: entry HTML includes emitted SystemJS entry and polyfills', async () => {
  const html = await readFile(path.join(directory, 'index.html'), 'utf8')
  for (const [id, attribute] of [['vite-legacy-polyfill', 'src'], ['vite-legacy-entry', 'data-src']]) {
    const script = html.match(new RegExp(`<script\\b[^>]*id="${id}"[^>]*>`))?.[0]
    assert.ok(script, `${id} script must be present`)
    assert.match(script, /\bnomodule\b/)
    const source = script.match(new RegExp(`\\s${attribute}="([^"]+)"`))?.[1]
    assert.ok(source, `${id} must point to an emitted asset`)
    const code = await readFile(path.join(directory, source), 'utf8')
    assert.ok(code.length > 1000)
    if (id === 'vite-legacy-entry') assert.match(code, /System\.register\(/)
  }
})

const archiveCases = [2019, 2020, 2021, 2022, 2023, 2024, 2025].map(year => ({ year, legacy: false }))
// One lazy-loaded archive and the eagerly loaded newest archive exercise both paths.
archiveCases.push({ year: 2020, legacy: true }, { year: 2025, legacy: true })
for (const { year, legacy } of archiveCases) {
  test(`${year}${legacy ? ' legacy fallback' : ''}: archived game deep links load their Vue components and assets`, async t => {
    const context = await browser.newContext()
    t.after(() => context.close())
    await context.addInitScript(legacy => {
      // Isolate the archive from its external animation CDN during the build smoke test.
      window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) }
      // The fallback must restore Promise via its generated polyfill, not Chromium.
      if (legacy) window.Promise = undefined
    }, legacy)
    await context.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.origin === origin) {
        if (legacy && route.request().isNavigationRequest()) {
          // Chromium supports modules: explicitly load only the generated nomodule path.
          // This validates fallback behavior without claiming to emulate an IE engine.
          const response = await route.fetch()
          const html = (await response.text())
            .replace(/<script\b(?=[^>]*\btype="module")[^>]*>[\s\S]*?<\/script>/g, '')
            .replace(/<link\b(?=[^>]*\brel="modulepreload")[^>]*>/g, '')
            .replace(/\snomodule\b/g, '')
          return route.fulfill({ response, body: html })
        }
        return route.continue()
      }
      if (url.origin === 'https://meichu.games' && url.pathname.startsWith('/api/')) {
        const game = { id: 1, name: '建置回歸賽事', item: { slug: 'build-test' }, type_of: 'official', status: 'nonstrt', date: `${year}-03-06`, time: '10:00', location: '測試場地', photo: null, score_nctu: 0, score_nthu: 0, team_nctu: null, team_nthu: null, news: [] }
        const body = url.pathname.startsWith('/api/game/slug/') ? { game } : { games: [], options: [], archives: [], items: [] }
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
      }
      return route.fulfill({ status: 200, body: '' })
    })
    const page = await context.newPage()
    const errors = []
    const failedAssets = []
    const scripts = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => {
      if (new URL(response.url()).origin === origin && response.status() >= 400) failedAssets.push(response.url())
      if (new URL(response.url()).origin === origin && response.request().resourceType() === 'script') scripts.push(new URL(response.url()).pathname)
    })
    await page.goto(`${origin}/${year}/game/build-test`)
    await page.getByText('建置回歸賽事', { exact: true }).first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    assert.match(await page.locator('body').getAttribute('class'), new RegExp(`meichu${year}`))
    assert.deepEqual(errors, [], 'No unhandled archive errors')
    assert.deepEqual(failedAssets, [], 'No missing chunks, stylesheet assets, or images')
    if (legacy) {
      assert.ok(scripts.some(url => /polyfills-legacy-.*\.js$/.test(url)))
      assert.ok(scripts.some(url => /index-legacy-.*\.js$/.test(url)))
      assert.ok(scripts.every(url => /-legacy-.*\.js$/.test(url)), 'Do not execute modern entry or chunks')
      assert.equal(await page.evaluate(() => typeof window.Promise), 'function')
      assert.equal(await page.evaluate(() => typeof window.System.import), 'function')
    }
  })
}

test('Vue 3 archive metadata follows async news and clears on cross-year navigation', async t => {
  const context = await browser.newContext()
  t.after(() => context.close())
  await context.addInitScript(() => {
    window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) }
  })
  const title = '公告 <img src=x onerror="window.metaInjected=true">'
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (url.origin === 'https://meichu.games' && url.pathname.startsWith('/api/')) {
      const data = { news: [{ id: 1, type_of: 'game', title: '公告一', created_at: '2020-03-01', org: '測試' }], games: [], options: [], archives: [], items: [] }
      if (url.pathname === '/api/news/1') return route.fulfill({ json: { news: { id: 1, title, content: '內文', created_at: '2020-03-01', files: [], org: '測試' } } })
      return route.fulfill({ json: data })
    }
    return route.fulfill({ status: 200, body: '' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${origin}/2020/news`)
  await page.getByRole('link', { name: '公告一', exact: true }).waitFor()
  await page.getByRole('link', { name: '公告一', exact: true }).click()
  await page.getByRole('heading', { name: title, exact: true }).waitFor()
  await page.waitForFunction(expected => document.title === expected, `${title} | 庚子梅竹`)
  assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'), '/favicon2020.png')
  assert.equal(await page.evaluate(() => window.metaInjected), undefined)
  await page.getByRole('link', { name: '己亥梅竹', exact: true }).last().click()
  await page.waitForURL('**/2019/')
  await page.waitForFunction(() => document.title === '己亥梅竹 | 2019 Meichu Games')
  assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'), '/favicon2019.ico')
  assert.equal(await page.locator('head img').count(), 0)
  assert.deepEqual(errors, [])
})

test('Vue 3 archive named slots and cached home survive route changes', async t => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  t.after(() => context.close())
  await context.addInitScript(() => {
    window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) }
  })
  let scoreRequests = 0
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (url.origin === 'https://meichu.games' && url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/game' && url.searchParams.get('year_id') === '57') scoreRequests++
      return route.fulfill({ json: { news: [{ id: 1, title: '測試具名插槽公告', type_of: 'game', created_at: '2019-03-01' }], games: [], options: [], archives: [], items: [] } })
    }
    return route.fulfill({ status: 200, body: '' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${origin}/2019/news`)
  await page.getByRole('heading', { name: /所有消息/ }).waitFor()
  await page.getByRole('link', { name: '測試具名插槽公告', exact: true }).waitFor()
  await page.goto(`${origin}/2025/`)
  await page.getByText('正式賽當前積點').waitFor()
  await page.waitForFunction(() => document.title === '乙巳梅竹 | 2025 Meichu Games')
  await page.evaluate(() => { window.archivePageIdentity = document.querySelector('.home') })
  // These same named routes are used by both responsive navigation variants.
  const listResponse = page.waitForResponse(response => new URL(response.url()).pathname === '/api/game')
  await page.evaluate(() => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push({ name: 'game-list-2025' }))
  await listResponse
  await page.waitForURL('**/2025/game')
  await page.waitForFunction(() => document.title === '賽事列表 | 乙巳梅竹')
  const beforeReturn = scoreRequests
  await page.evaluate(() => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push({ name: 'index-2025' }))
  await page.waitForURL('**/2025/')
  await page.waitForFunction(() => document.title === '乙巳梅竹 | 2025 Meichu Games')
  assert.equal(await page.evaluate(() => document.querySelector('.home') === window.archivePageIdentity), true)
  assert.equal(scoreRequests, beforeReturn, 'Cached home is not remounted when returning from another route')
  assert.deepEqual(errors, [])
})

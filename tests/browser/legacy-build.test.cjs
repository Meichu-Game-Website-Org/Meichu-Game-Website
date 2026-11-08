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

for (const year of [2019, 2020, 2021, 2022, 2023, 2024, 2025]) {
  test(`${year}: archived game deep links load their Vue components and assets`, async t => {
    const context = await browser.newContext()
    t.after(() => context.close())
    await context.addInitScript(() => {
      // Isolate the archive from its external animation CDN during the build smoke test.
      window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) }
    })
    await context.route('**/*', async route => {
      const url = new URL(route.request().url())
      if (url.origin === origin) return route.continue()
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
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => {
      if (new URL(response.url()).origin === origin && response.status() >= 400) failedAssets.push(response.url())
    })
    await page.goto(`${origin}/${year}/game/build-test`)
    await page.getByText('建置回歸賽事', { exact: true }).first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    assert.match(await page.locator('body').getAttribute('class'), new RegExp(`meichu${year}`))
    assert.deepEqual(errors, [], 'No unhandled archive errors')
    assert.deepEqual(failedAssets, [], 'No missing chunks, stylesheet assets, or images')
  })
}

const assert = require('node:assert/strict')
const { test, before, after } = require('node:test')
const { createServer } = require('node:http')
const { readFile, stat } = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require('playwright')

const directory = path.resolve('apps/old-site/dist')
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' }
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

async function pageWithFixtures(t, options = []) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  t.after(() => context.close())
  await context.addInitScript(() => {
    window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) }
  })
  const requests = []
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin === origin) {
      if (url.pathname.startsWith('/archive-fixtures/')) return route.fulfill({
        contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200"><rect width="600" height="200" fill="#b8dfe8"/></svg>'
      })
      return route.continue()
    }
    if (url.origin === 'https://meichu.games' && url.pathname.startsWith('/api/')) {
      requests.push(url)
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ options, games: [], news: [], archives: [], items: [] }) })
    }
    return route.fulfill({ status: 200, body: '' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  return { page, errors, requests }
}

for (const [year, yearId] of [[2020, '2'], [2021, '53']]) {
  for (const links of [undefined, ['https://example.org/activity']]) {
    test(`${year}: homepage images remain visible with ${links ? 'a shorter' : 'no'} banner link list`, async t => {
      const options = [{ key: 'banners', value: ['/archive-fixtures/first.svg', '/archive-fixtures/second.svg'] }]
      if (links) options.push({ key: 'banner-links', value: links })
      const { page, errors, requests } = await pageWithFixtures(t, options)
      await page.goto(`${origin}/${year}/`)
      await page.locator('img[src="/archive-fixtures/second.svg"]').waitFor({ state: 'visible' })
      const images = page.locator('img[src^="/archive-fixtures/"]')
      assert.equal(await images.count(), 2)
      assert.equal(await images.first().evaluate(image => image.closest('a')?.getAttribute('href') || null), links?.[0] || null)
      assert.equal(await images.last().evaluate(image => Boolean(image.closest('a'))), false)
      await page.waitForFunction(() => [...document.querySelectorAll('img[src^="/archive-fixtures/"]')].every(image => image.complete && image.naturalWidth > 0))
      const bannerRequest = requests.find(url => url.pathname === '/api/option')
      assert.equal(bannerRequest?.searchParams.get('year_id'), yearId)
      assert.deepEqual(errors, [])
    })
  }
}

for (const year of [2019, 2022, 2023, 2024, 2025]) {
  test(`${year}: static homepage loads without an unused options request`, async t => {
    const { page, errors, requests } = await pageWithFixtures(t)
    await page.goto(`${origin}/${year}/`, { waitUntil: 'networkidle' })
    assert.match(await page.locator('body').getAttribute('class'), new RegExp(`meichu${year}`))
    assert.ok(await page.locator('#app img').count() > 0)
    assert.equal(requests.filter(url => url.pathname === '/api/option').length, 0)
    if (year >= 2022) {
      const gamesRequest = requests.find(url => url.pathname === '/api/game')
      assert.equal(gamesRequest?.searchParams.get('year_id'), String(year - 1968))
    }
    assert.deepEqual(errors, [])
  })
}

for (const [year, name] of [[2023, '癸卯'], [2024, '甲辰']]) {
  test(`${year}: course page title does not need a news response`, async t => {
    const { page, errors } = await pageWithFixtures(t)
    await page.goto(`${origin}/${year}/course`)
    await page.waitForFunction(title => document.title === title, `賽程 | ${name}梅竹`)
    await page.locator('.Courses').waitFor({ state: 'visible' })
    assert.deepEqual(errors, [])
  })
}

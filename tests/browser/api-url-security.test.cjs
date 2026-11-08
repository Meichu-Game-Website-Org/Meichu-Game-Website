const assert = require('node:assert/strict')
const { test, before, after } = require('node:test')
const { createServer } = require('node:http')
const { readFile, stat } = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require('playwright')

const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' }
let browser, servers, origins

async function serve(directory, mount) {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      if (!pathname.startsWith(mount)) return response.writeHead(404).end()
      let file = path.resolve(directory, pathname.slice(mount.length))
      if (!file.startsWith(directory + path.sep) || !(await stat(file).catch(() => null))?.isFile()) file = path.join(directory, 'index.html')
      response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
      response.end(await readFile(file))
    } catch { response.writeHead(404).end() }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  return { server, origin: `http://127.0.0.1:${server.address().port}` }
}

before(async () => {
  servers = await Promise.all([
    serve(path.resolve('apps/old-site/dist'), '/'),
    serve(path.resolve('apps/site-2026/dist'), '/2026/')
  ])
  origins = servers.map(entry => entry.origin)
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined })
})

after(async () => {
  await browser?.close()
  await Promise.all((servers || []).map(({ server }) => new Promise(resolve => server.close(resolve))))
})

for (const year of [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]) {
  test(`${year}: API URLs cannot execute scripts; safe media, links and attachments remain usable`, async t => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } })
    t.after(() => context.close())
    await context.addInitScript(() => { window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) } })
    let safe = false
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (origins.includes(url.origin)) return route.continue()
      if (url.origin === 'https://meichu.games' && url.pathname === '/uploads/team.svg') {
        return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="blue"/></svg>' })
      }
      if (url.origin === 'https://player.example') return route.fulfill({ contentType: 'text/html', body: '<p>Safe stream fixture</p>' })
      if (url.origin !== 'https://meichu.games' || !url.pathname.startsWith('/api/')) return route.fulfill({ body: '' })
      const team = { name: 'Team', photo: '/uploads/team.svg', intro: 'Team description', link_website: safe ? 'https://example.org/team' : 'java\tscript:void(window.__unsafeLink=true)' }
      const game = {
        id: 1, name: 'URL security fixture', item: { slug: 'url-security' }, type_of: 'official', status: 'nonstrt',
        date: `${year}-03-06`, time: '10:00', location: 'Fixture location', location_url: safe ? '/maps' : 'javascript:void(window.__unsafeLink=true)',
        photo: '/uploads/team.svg', score_nctu: 0, score_nthu: 0, score_old_nctu: 0, score_old_nthu: 0, score_old_draw: 0,
        team_nctu: team, team_nthu: null, is_live: true,
        live_url: safe ? 'https://player.example/embed/fixture' : 'javascript:void(parent.__unsafeFrame=true)',
        news: [{ id: 1, title: 'Fixture article', type_of: 'link', link: safe ? '/articles/fixture' : 'javascript:void(window.__unsafeLink=true)' }]
      }
      const news = { id: 1, title: 'URL news fixture', content: 'Plain text news', link: 'javascript:void(window.__unsafeLink=true)', files: ['data:text/html,<script>parent.__unsafeFrame=true</script>', '/uploads/notice.pdf'] }
      const body = url.pathname.startsWith('/api/game/slug/') ? { game }
        : url.pathname.startsWith('/api/news/') ? { news }
        : { games: [], news: [], options: [], archives: [], items: [] }
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) })
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const origin = origins[year === 2026 ? 1 : 0]
    await page.goto(`${origin}/${year}/game/url-security`)
    await page.getByRole('heading', { name: 'URL security fixture', exact: true }).waitFor()
    assert.equal(await page.locator('iframe').count(), 0, 'Unsafe stream sources never create an executable frame')
    const article = page.locator('a').filter({ hasText: /^\s*Fixture article\s*$/ })
    assert.equal(await article.getAttribute('href'), null)
    await article.click()
    assert.deepEqual(await page.evaluate(() => [Boolean(window.__unsafeFrame), Boolean(window.__unsafeLink)]), [false, false])
    assert.equal(await page.locator('a[href^="javascript:"], a[href^="data:"]').count(), 0)

    safe = true
    await page.reload()
    await page.getByRole('heading', { name: 'URL security fixture', exact: true }).waitFor()
    await page.frameLocator('iframe').getByText('Safe stream fixture').waitFor()
    assert.equal(await page.locator('iframe').getAttribute('src'), 'https://player.example/embed/fixture')
    assert.equal(await article.getAttribute('href'), 'https://meichu.games/articles/fixture')
    assert.equal(await page.locator('a[href="https://example.org/team"]').count(), 1)
    await page.waitForFunction(() => [...document.querySelectorAll('img[src="https://meichu.games/uploads/team.svg"]')].some(image => image.complete && image.naturalWidth > 0))

    await page.goto(`${origin}/${year}/news/1`)
    await page.getByRole('heading', { name: 'URL news fixture', exact: true }).waitFor()
    assert.equal(await page.locator('a[href="https://meichu.games/uploads/notice.pdf"]').count(), 1)
    assert.equal(await page.locator('a[href^="javascript:"], a[href^="data:"]').count(), 0)
    assert.deepEqual(await page.evaluate(() => [Boolean(window.__unsafeFrame), Boolean(window.__unsafeLink)]), [false, false])
    assert.deepEqual(errors, [])
  })
}

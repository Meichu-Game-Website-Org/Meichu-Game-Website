const assert = require('node:assert/strict')
const { test, before, after } = require('node:test')
const { createServer } = require('node:http')
const { readFile, stat, mkdir } = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const { chromium } = require('playwright')

const directory = path.resolve('apps/old-site/dist')
const screenshots = path.join(os.tmpdir(), 'meichu-data-round2-screenshots')
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' }
const game = {
  id: 1, name: '復原後的測試賽事', slug: 'men-basketball', item: { slug: 'men-basketball' }, status: 'nctu', type_of: 'official',
  date: '2025-02-28', time: '10:00', photo: '/images/test-game.svg', score_nctu: '3', score_nthu: '1',
  score_old_nctu: 1, score_old_nthu: 1, score_old_draw: 0,
  team_nctu: { name: '測試交大隊伍', photo: '/images/test-team.svg' }, team_nthu: null, news: []
}
const news = { id: 1, title: '復原後的測試公告', content: '測試公告內文', files: [] }
const bodies = {
  '/api/game': { games: [game] }, '/api/game/slug/men-basketball': { game }, '/api/news/1': { news }, '/api/news': { news: [news] },
  '/api/option': { options: [{ key: 'about-meichu', value: '復原後的梅竹介紹' }, { key: 'meichu-history', value: '復原後的梅竹歷史' }] },
  '/api/archive/full': { archives: [{ year: { year: 2025, outcome: 'nctu', score_nctu: 7, score_nthu: 3 }, archive: [] }], items: [] }
}
let browser, server, origin

before(async () => {
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      let file = path.resolve(directory, pathname.replace(/^\/+/, ''))
      if (!file.startsWith(directory + path.sep)) file = path.join(directory, 'index.html')
      if (!(await stat(file).catch(() => null))?.isFile() && !path.extname(pathname)) file = path.join(directory, 'index.html')
      response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
      response.end(await readFile(file))
    } catch { response.writeHead(404).end() }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined })
})

after(async () => {
  await browser?.close()
  if (server) await new Promise(resolve => server.close(resolve))
})

async function fixture(t, handler, width = 390) {
  const context = await browser.newContext({ viewport: { width, height: 844 } })
  t.after(() => context.close())
  await context.addInitScript(() => {
    window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) }
    window.hasPlayedIndexAnime = true
  })
  const requests = []
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (url.origin === 'https://meichu.games' && url.pathname.startsWith('/api/')) {
      requests.push(url)
      if (handler && await handler(route, url)) return
      return json(route, bodies[url.pathname] || {})
    }
    if (url.pathname.startsWith('/images/test-')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="purple"/></svg>' })
    return route.fulfill({ body: '' })
  })
  const page = await context.newPage()
  page.setDefaultTimeout(8000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  t.after(() => assert.deepEqual(errors, [], 'No unhandled page errors'))
  return { page, requests }
}

function json(route, body, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }).then(() => true)
}

const cases = [
  ['game list', '/game', '/api/game', 'text=復原後的測試賽事', '目前尚無賽事。'],
  ['game details', '/game/men-basketball', '/api/game/slug/men-basketball', 'text=復原後的測試賽事', '找不到這場賽事。'],
  ['news details', '/news/1', '/api/news/1', 'text=測試公告內文', '找不到這則公告。'],
  ['about', '/about', '/api/option', 'text=復原後的梅竹介紹', '目前尚無簡介資料。'],
  ['news list', '/news', '/api/news', 'text=復原後的測試公告', '目前尚無消息。'],
  ['history', '/history', '/api/archive/full', '.history-table', '目前尚無歷史紀錄。']
]
for (let year = 2019; year <= 2025; year++) {
  for (const [name, routePath, apiPath, visible] of cases) {
    if ((year === 2019 && name === 'history') || (year === 2025 && name === 'news list')) continue
    test(`${year} ${name}: failed API can be retried without reloading`, async t => {
      let failure = true
      const { page, requests } = await fixture(t, (route, url) => url.pathname === apiPath && failure ? json(route, {}, 503) : false)
      await page.goto(`${origin}/${year}${routePath}`)
      await page.getByRole('alert').first().waitFor().catch(async error => {
        t.diagnostic(JSON.stringify({ requests: requests.map(url => url.pathname), body: (await page.locator('body').innerText()).slice(0,500) }))
        throw error
      })
      assert.equal(await page.locator('[aria-busy="true"]').count(), 0)
      if (name === 'about' && [2022, 2025].includes(year)) {
        await mkdir(screenshots, { recursive: true })
        await page.screenshot({ path: path.join(screenshots, `${year}-about-error-mobile.png`), animations: 'disabled' })
      }
      failure = false
      await page.getByRole('button', { name: '重新載入', exact: true }).first().click()
      await page.locator(visible).filter({ visible: true }).first().waitFor()
      assert.equal(await page.getByRole('alert').count(), 0)
      if (year === 2020 && name === 'about') assert.ok(requests.filter(url => url.pathname === apiPath).every(url => url.searchParams.get('year_id') === '2'))
      if (year === 2025 && name === 'about') assert.equal(requests.filter(url => url.pathname === apiPath).length, 2, 'One request per initial load/retry shared by both responsive views')
      if (name === 'game details') {
        const photo = page.locator('img[src="https://meichu.games/images/test-team.svg"]')
        await photo.waitFor()
        await photo.evaluate(image => image.decode())
        assert.equal(await photo.evaluate(image => image.complete && image.naturalWidth > 0), true)
      }
    })
  }
}

test('2025 current score hides failed and empty data, while a valid zero remains visible', async t => {
  let mode = 'error'
  const { page } = await fixture(t, (route, url) => url.pathname === '/api/game'
    ? json(route, mode === 'error' ? {} : { games: mode === 'empty' ? [] : [{ ...game, status: 'nonstrt' }] }, mode === 'error' ? 503 : 200) : false)
  await page.goto(`${origin}/2025/`)
  await page.getByRole('alert').waitFor()
  assert.equal(await page.locator('.curr-score__score').count(), 0)
  mode = 'zero'
  await page.getByRole('button', { name: '重新載入' }).click()
  await page.locator('.curr-score__score').waitFor()
  assert.deepEqual(await page.locator('.score__score .left, .score__score .right').allTextContents(), ['0', '0'])
  mode = 'empty'
  await page.reload()
  await page.getByText('目前尚無正式賽積點資料。', { exact: true }).waitFor()
  assert.equal(await page.locator('.curr-score__score').count(), 0)
})

test('2025 about desktop shares one request and retains the existing contact information', async t => {
  const { page, requests } = await fixture(t, null, 1440)
  await page.goto(`${origin}/2025/about`)
  await page.locator('.desktop-about').getByText('復原後的梅竹介紹').waitFor()
  assert.equal(requests.filter(url => url.pathname === '/api/option').length, 1)
  await page.locator('.desktop-about').getByText('主辦單位 / 梅竹籌備委員會').waitFor()
  await mkdir(screenshots, { recursive: true })
  await page.screenshot({ path: path.join(screenshots, 'about-desktop.png'), animations: 'disabled' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.mobile-about').getByText('主辦單位 / 梅竹籌備委員會').waitFor()
  await page.screenshot({ path: path.join(screenshots, 'about-mobile.png'), animations: 'disabled' })
})

test('archived game route reuse keeps the latest detail after a delayed old response', async t => {
  let release
  const held = new Promise(resolve => { release = resolve })
  let oldRequested
  const oldStarted = new Promise(resolve => { oldRequested = resolve })
  const { page } = await fixture(t, async (route, url) => {
    if (url.pathname === '/api/game/slug/old') {
      oldRequested()
      await held
      return json(route, { game: { ...game, name: '較舊賽事' } })
    }
    if (url.pathname === '/api/game/slug/new') return json(route, { game: { ...game, name: '較新賽事' } })
    return false
  })
  await page.goto(`${origin}/2024/game/old`)
  await oldStarted
  await page.evaluate(() => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push('/2024/game/new'))
  await page.getByRole('heading', { name: '較新賽事', exact: true }).waitFor()
  const oldResponse = page.waitForResponse(response => response.url().includes('/api/game/slug/old'))
  release()
  await oldResponse
  await page.waitForTimeout(50)
  assert.equal(await page.locator('.game__name').textContent(), '較新賽事')
})

const assert = require('node:assert/strict')
const { test, before, after } = require('node:test')
const { createServer } = require('node:http')
const { readFile, stat, mkdir } = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const { chromium } = require('playwright')

const directory = path.resolve('apps/site-2026/dist')
const game = {
  id: 1, name: '測試賽事', item: { slug: 'test-game' }, type_of: 'official', status: 'running',
  date: '2026-03-16', time: '10:00', location: '測試場地', photo: null,
  score_nctu: 0, score_nthu: 2, team_nctu: null, team_nthu: null, news: []
}
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' }
let server, browser, origin, base

before(async () => {
  const html = await readFile(path.join(directory, 'index.html'), 'utf8')
  // Also runs after the separate routing fix prefixes the app with /2026/.
  base = html.includes('src="/2026/') ? '/2026/' : '/'
  server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      const relative = (pathname.startsWith(base) ? pathname.slice(base.length) : pathname).replace(/^\/+/, '')
      let file = path.resolve(directory, relative)
      const info = file.startsWith(directory + path.sep) ? await stat(file).catch(() => null) : null
      if (!info || !info.isFile()) file = path.join(directory, 'index.html')
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
      res.end(await readFile(file))
    } catch { res.statusCode = 500; res.end('Test server error') }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined })
})
after(async () => {
  if (browser) await browser.close()
  if (server) await new Promise(resolve => server.close(resolve))
})

function json(route, body) {
  return route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) }).then(() => true)
}
async function pageFor(t, width, handler) {
  const context = await browser.newContext({ viewport: { width, height: 960 } })
  await context.addInitScript(() => { window.hasPlayedIndexAnime = true })
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (url.origin === 'https://meichu.games' && url.pathname.startsWith('/api/')) {
      if (handler && await handler(route, url)) return
      return json(route, url.pathname === '/api/game' ? { games: [game] }
        : url.pathname.startsWith('/api/game/slug/') ? { game }
        : url.pathname === '/api/option' ? { options: [] } : { archives: [], items: [] })
    }
    return route.fulfill({ status: 200, body: '' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  t.after(async () => { await context.close(); assert.deepEqual(errors, [], 'No unhandled page errors') })
  return page
}
async function push(page, target) {
  await page.evaluate(target => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push(target), target)
}
async function screenshot(page, name) {
  const folder = path.join(os.tmpdir(), 'meichu-scores-screenshots')
  await mkdir(folder, { recursive: true })
  await page.screenshot({ path: path.join(folder, name + '.png'), animations: 'disabled' })
}

for (const width of [390, 1440]) {
  test(`${width}px: postponed and undated games remain in the chronological schedule`, async t => {
    const games = [
      { ...game, id: 2, name: '延賽晚場', item: { slug: 'late' }, time: '10:00' },
      { ...game, id: 3, name: '待定賽事', item: { slug: 'undated' }, date: null, time: null },
      { ...game, id: 1, name: '首日賽事', item: { slug: 'first' }, date: '2026-03-06', status: 'draw', score_nctu: 1, score_nthu: 1 },
      { ...game, id: 4, name: '延賽早場', item: { slug: 'early' }, time: '9:00' }
    ]
    const page = await pageFor(t, width, (route, url) => url.pathname === '/api/game' ? json(route, { games }) : false)
    await page.goto(origin + base + 'game')
    await page.getByRole('heading', { name: '日期待定', exact: true }).waitFor()
    assert.deepEqual(await page.locator('.game-day').allTextContents(), ['2026/03/06（五）', '2026/03/16（一）', '日期待定'])
    assert.deepEqual(await page.locator('.game-item__title').allTextContents(), ['首日賽事', '延賽早場', '延賽晚場', '待定賽事'])
    assert.match(await page.locator('.game-item__score').nth(1).textContent(), /陽明交大 0 : 2 清大/)
    await page.getByRole('link', { name: '查看延賽早場賽事詳情', exact: true }).focus()
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), '查看延賽早場賽事詳情')
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    await screenshot(page, `schedule-${width}`)
  })

  test(`${width}px: game details distinguish live, final, pending and missing scores`, async t => {
    const cases = {
      running: [0, 2, '0', '2', ''], pause: [3, 2, '3', '2', ''], draw: [0, 0, '0', '0', ''],
      nctu: [5, 4, '5', '4', ''], nthu: [2, 3, '2', '3', ''],
      end: [null, 1, '—', '1', '比分資料未完整提供'],
      nonstrt: [0, 0, '—', '—', '尚未開始'], preparation: [0, 0, '—', '—', '尚未開始']
    }
    const page = await pageFor(t, width, (route, url) => {
      if (!url.pathname.startsWith('/api/game/slug/')) return false
      const status = url.pathname.split('/').pop()
      return json(route, { game: { ...game, status, score_nctu: cases[status][0], score_nthu: cases[status][1] } })
    })
    for (const [status, values] of Object.entries(cases)) {
      await page.goto(origin + base + 'game/' + status)
      await page.locator('.game__scores').waitFor()
      assert.deepEqual(await page.locator('.game__scores__value').allTextContents(), values.slice(2, 4))
      assert.equal(await page.locator('.game__score-note').count(), values[4] ? 1 : 0)
      if (values[4]) assert.equal(await page.locator('.game__score-note').textContent(), values[4])
      const score = await page.locator('.game__scores').boundingBox()
      const board = await page.locator('.game__scoreboard').boundingBox()
      assert.ok(score.x >= board.x && score.x + score.width <= board.x + board.width + 1)
      assert.ok(score.y >= board.y && score.y + score.height <= board.y + board.height + 1)
      if (status === 'running') await screenshot(page, `scoreboard-${width}`)
    }
  })
}

for (const width of [390, 1440]) {
test(`${width}px: score refresh is manual or throttled on return, with one in-flight request and an update time`, async t => {
  let calls = 0, status = 'nthu', release, pending = null
  const page = await pageFor(t, width, async (route, url) => {
    if (url.pathname !== '/api/game') return false
    calls++
    if (pending) await pending
    return json(route, { games: [{ ...game, status }] })
  })
  await page.goto(origin + base)
  await page.getByRole('img', { name: '清華大學 1 點，陽明交通大學 0 點', exact: true }).waitFor()
  assert.equal(calls, 1, 'created and activated share the initial request')
  assert.ok(Number.isFinite(Date.parse(await page.locator('.curr-score time').getAttribute('datetime'))))
  status = 'nctu'
  pending = new Promise(resolve => { release = resolve })
  await page.getByRole('button', { name: '更新積點', exact: true }).click()
  const updating = page.getByRole('button', { name: '更新中…', exact: true })
  await updating.waitFor()
  assert.equal(await updating.isDisabled(), true)
  assert.equal(await page.locator('.score-number-svg').count(), 0, 'loading does not show a stale score as current')
  assert.equal(calls, 2)
  release()
  pending = null
  await page.getByRole('img', { name: '清華大學 0 點，陽明交通大學 1 點', exact: true }).waitFor()
  await push(page, '/about')
  await page.getByText('目前尚無介紹內容。', { exact: true }).filter({ visible: true }).first().waitFor()
  await push(page, '/')
  await page.getByRole('img', { name: '清華大學 0 點，陽明交通大學 1 點', exact: true }).waitFor()
  assert.equal(calls, 2, 'a rapid return does not create another API request')
  await page.evaluate(() => { const now = Date.now; Date.now = () => now() + 16000 })
  status = 'draw'
  await push(page, '/about')
  await push(page, '/')
  await page.getByRole('img', { name: '清華大學 0.5 點，陽明交通大學 0.5 點', exact: true }).waitFor()
  assert.equal(calls, 3, 'return after the cooldown refreshes the kept-alive score')
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
  const folder = path.join(os.tmpdir(), 'meichu-scores-screenshots')
  await mkdir(folder, { recursive: true })
  await page.locator('.curr-score').screenshot({ path: path.join(folder, `current-score-refresh-${width}.png`), animations: 'disabled' })
})
}

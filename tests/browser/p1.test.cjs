const assert = require('node:assert/strict')
const { test, before, after } = require('node:test')
const { createServer } = require('node:http')
const { readFile, stat, mkdir } = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const { chromium } = require('playwright')

const game = {
  id: 1, name: '測試賽事', item: { slug: 'test-game' }, type_of: 'official', status: 'nonstrt',
  date: '2026-03-06', time: '10:00', location: '測試場地', photo: null,
  score_nctu: 0, score_nthu: 0, score_old_nctu: 1, score_old_nthu: 1, score_old_draw: 0,
  team_nctu: null, team_nthu: null, news: []
}
const news = { id: 1, title: '測試公告', content: '第一行公告內容\n第二行公告內容', org: '梅竹籌委', files: ['https://files.example/notice.pdf'] }
const options = { options: [{ key: 'about-meichu', value: '梅竹介紹測試' }, { key: 'meichu-history', value: '梅竹歷史測試' }] }
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' }
let browser, origins, servers

async function serve(directory) {
  const server = createServer(async (req, res) => {
    try {
      const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '')
      let file = path.resolve(directory, relative)
      if (!file.startsWith(directory + path.sep)) file = path.join(directory, 'index.html')
      const info = await stat(file).catch(() => null)
      if (!info || !info.isFile()) file = path.join(directory, 'index.html')
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
      res.end(await readFile(file))
    } catch (error) { res.statusCode = 500; res.end('Test server error') }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  return { server, origin: `http://127.0.0.1:${server.address().port}` }
}

before(async () => {
  servers = await Promise.all(['apps/site-2026/dist', 'apps/old-site/dist'].map(dir => serve(path.resolve(dir))))
  origins = { 2026: servers[0].origin, 2025: servers[1].origin }
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined })
})
after(async () => {
  if (browser) await browser.close()
  await Promise.all((servers || []).map(({ server }) => new Promise(resolve => server.close(resolve))))
})

async function fixture(t, handler, width = 1440) {
  const context = await browser.newContext({ viewport: { width, height: 960 } })
  await context.addInitScript(() => { window.hasPlayedIndexAnime = true })
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (Object.values(origins).includes(url.origin)) return route.continue()
    if (url.origin === 'https://meichu.games' && url.pathname.startsWith('/api/')) {
      if (handler && await handler(route, url)) return
      const body = url.pathname === '/api/game' ? { games: [game] }
        : url.pathname.startsWith('/api/game/slug/') ? { game }
        : url.pathname.startsWith('/api/news/') ? { news }
        : url.pathname === '/api/option' ? options : { archives: [], items: [] }
      return json(route, body)
    }
    return route.fulfill({ status: 200, body: '' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  t.after(async () => { await context.close(); assert.deepEqual(errors, [], 'No unhandled page errors') })
  return page
}
function json(route, body, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }).then(() => true)
}
async function visible(page, selector) { await page.locator(selector).first().waitFor({ state: 'visible' }) }
async function push(page, target) {
  await page.evaluate(target => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push(target), target)
}
async function shot(page, name) {
  const directory = process.env.P1_SCREENSHOTS || path.join(os.tmpdir(), 'meichu-p1-screenshots')
  await mkdir(directory, { recursive: true })
  await page.screenshot({ path: path.join(directory, name + '.png'), animations: 'disabled' })
}

for (const year of [2026, 2025]) {
  test(`${year}: all internal announcement types resolve in-year; external articles remain links`, async t => {
    const announcements = ['game', 'activity', 'other', 'news', 'link'].map((type_of, index) => ({ id: index + 1, title: `公告${type_of}`, type_of, link: `https://news.example/${index + 1}` }))
    const page = await fixture(t, (route, url) => url.pathname.startsWith('/api/game/slug/') ? json(route, { game: { ...game, news: announcements } }) : false)
    await page.goto(origins[year] + (year === 2025 ? '/2025' : '') + '/game/test-game')
    for (const type of ['game', 'activity', 'other']) {
      const link = page.getByRole('link', { name: `公告${type}`, exact: true })
      await link.waitFor()
      assert.match(await link.getAttribute('href'), new RegExp(`^${year === 2025 ? '/2025' : ''}/news/`))
    }
    for (const type of ['news', 'link']) assert.match(await page.getByRole('link', { name: `公告${type}`, exact: true }).getAttribute('href'), /^https:\/\/news.example\//)
    await page.getByRole('link', { name: '公告game', exact: true }).click()
    await page.getByRole('heading', { name: news.title, exact: true }).waitFor()
    assert.match(page.url(), new RegExp(`${year === 2025 ? '/2025' : ''}/news/1$`))
    assert.equal(await page.locator('.news-content').textContent(), news.content)
    assert.equal(await page.getByRole('link', { name: '附件 1（另開視窗）' }).getAttribute('href'), news.files[0])
    await page.getByRole('link', { name: '返回賽事列表' }).waitFor()
    if (year === 2026) {
      await shot(page, 'news-desktop')
      await page.setViewportSize({ width: 390, height: 844 })
      await shot(page, 'news-mobile')
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    }
  })
}

for (const [name, status] of [['404', 404], ['503', 503], ['offline', 0], ['malformed', 200], ['timeout', -1]]) {
  test(`game list: ${name} ends loading and a retry recovers`, { timeout: 25000 }, async t => {
    let failure = true
    const page = await fixture(t, async (route, url) => {
      if (url.pathname !== '/api/game') return false
      if (!failure) return json(route, { games: [game] })
      if (status === 0) { await route.abort('failed'); return true }
      if (status === -1) return true // Leave the XHR unanswered so the real 10-second timeout fires.
      return json(route, {}, status)
    })
    await page.goto(origins[2026] + '/game')
    await page.getByRole('alert').waitFor({ timeout: 15000 })
    assert.equal(await page.locator('.game-row').count(), 0)
    assert.equal(await page.locator('[aria-busy="true"]').count(), 0)
    if (name === 'timeout') assert.match(await page.getByRole('alert').textContent(), /逾時/)
    if (name === '503') await shot(page, 'game-error-desktop')
    failure = false
    await page.getByRole('button', { name: '重新載入', exact: true }).click()
    await visible(page, '.game-item')
    assert.equal(await page.getByRole('alert').count(), 0)
  })
}

test('scores hide unavailable values, distinguish empty from valid zero, and recover', async t => {
  let response = 'failure'
  const page = await fixture(t, (route, url) => url.pathname === '/api/game'
    ? json(route, response === 'failure' ? {} : { games: response === 'empty' ? [] : [game] }, response === 'failure' ? 503 : 200) : false)
  await page.goto(origins[2026])
  await page.getByRole('alert').waitFor()
  assert.equal(await page.locator('.score-number-svg').count(), 0)
  response = 'zero'
  await page.getByRole('button', { name: '重新載入', exact: true }).click()
  await visible(page, '.score-number-svg')
  assert.deepEqual(await page.locator('.score-number-svg text').allTextContents(), ['0', '0', '0', '0'])
  response = 'empty'
  await page.reload()
  await page.getByText('目前尚無正式賽積點資料。', { exact: true }).waitFor()
  assert.equal(await page.locator('.score-number-svg').count(), 0)
})

for (const width of [1440, 390]) {
  test(`About at ${width}px: one shared request, retry, and readable recovered content`, async t => {
    let failure = true, calls = 0
    const page = await fixture(t, (route, url) => {
      if (url.pathname !== '/api/option') return false
      calls++
      return json(route, failure ? {} : options, failure ? 503 : 200)
    }, width)
    await page.goto(origins[2026] + '/about')
    const section = page.locator(width === 390 ? '.mobile-about' : '.desktop-about')
    await section.getByRole('alert').first().waitFor()
    assert.equal(calls, 1)
    failure = false
    await section.getByRole('button', { name: '重新載入', exact: true }).first().click()
    await section.getByText('梅竹介紹測試', { exact: true }).waitFor()
    assert.equal(calls, 2)
  })
}

for (const [target, endpoint, bad, good, success] of [
  ['/history', '/api/archive/full', { archives: [{}], items: [] }, { archives: [], items: [] }, '目前尚無歷史紀錄。'],
  ['/news/1', '/api/news/1', { news: {} }, { news }, news.title],
  ['/game/test-game', '/api/game/slug/test-game', { game: {} }, { game }, game.name]
]) {
  test(`${target}: incomplete response is recoverable`, async t => {
    let failure = true
    const page = await fixture(t, (route, url) => url.pathname === endpoint ? json(route, failure ? bad : good) : false)
    await page.goto(origins[2026] + target)
    await page.getByRole('alert').waitFor()
    failure = false
    await page.getByRole('button', { name: '重新載入', exact: true }).click()
    await page.getByText(success, { exact: true }).first().waitFor()
  })
}

for (const type of ['game', 'news']) {
  for (const staleFailure of [false, true]) {
    test(`${type}: reused route ignores a late ${staleFailure ? 'error' : 'response'}`, async t => {
      let release, started
      const began = new Promise(resolve => { started = resolve })
      const pending = new Promise(resolve => { release = resolve })
      const endpoint = type === 'game' ? '/api/game/slug/' : '/api/news/'
      const payload = title => type === 'game' ? { game: { ...game, name: title } } : { news: { ...news, title } }
      const page = await fixture(t, async (route, url) => {
        if (!url.pathname.startsWith(endpoint)) return false
        if (url.pathname.endsWith('/slow')) { started(); await pending; return json(route, payload('舊資料'), staleFailure ? 503 : 200) }
        return json(route, payload('新資料'))
      })
      await page.goto(origins[2026] + `/${type}/fast`)
      await page.getByRole('heading', { name: '新資料', exact: true }).waitFor()
      await push(page, `/${type}/slow`)
      await began
      assert.equal(await page.getByRole('heading', { name: '新資料', exact: true }).count(), 0)
      await push(page, `/${type}/fast`)
      await page.getByRole('heading', { name: '新資料', exact: true }).waitFor()
      release()
      await page.waitForTimeout(200)
      assert.equal(await page.getByRole('heading', { name: '新資料', exact: true }).count(), 1)
      assert.equal(await page.getByRole('heading', { name: '舊資料', exact: true }).count(), 0)
      assert.equal(await page.getByRole('alert').count(), 0)
    })
  }
}

for (const [target, endpoint, body, message] of [
  ['/game', '/api/game', { games: [] }, '目前尚無賽事。'],
  ['/about', '/api/option', { options: [] }, '目前尚無介紹內容。'],
  ['/game/test-game', '/api/game/slug/test-game', { game: null }, '找不到這場賽事。'],
  ['/news/1', '/api/news/1', { news: null }, '找不到這則公告。']
]) {
  test(`${target}: empty responses show an explicit empty state`, async t => {
    const page = await fixture(t, (route, url) => url.pathname === endpoint ? json(route, body) : false)
    await page.goto(origins[2026] + target)
    await page.getByText(message, { exact: true }).filter({ visible: true }).first().waitFor()
    assert.equal(await page.locator('[aria-busy="true"]').count(), 0)
    assert.equal(await page.getByRole('alert').count(), 0)
  })
}

test('scores never show default zero while the first request is pending', async t => {
  let release, started
  const pending = new Promise(resolve => { release = resolve })
  const began = new Promise(resolve => { started = resolve })
  const page = await fixture(t, async (route, url) => {
    if (url.pathname !== '/api/game') return false
    started()
    await pending
    return json(route, { games: [{ ...game, status: 'nthu' }] })
  })
  await page.goto(origins[2026])
  await began
  assert.equal(await page.locator('.score-number-svg').count(), 0)
  await page.getByText('資料載入中…', { exact: true }).waitFor()
  release()
  await visible(page, '.score-number-svg')
  assert.deepEqual(await page.locator('.score-number-svg text').allTextContents(), ['1', '1', '0', '0'])
})

const assert = require('node:assert/strict')
const { test } = require('node:test')
const { mkdtemp, writeFile, rm } = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const { chromium } = require('playwright')
const { createDevelopmentServer } = require('../../dev-proxy.js')

const game = {
  id: 1, name: '跨年份測試賽事', item: { slug: 'billiard' }, type_of: 'official', status: 'nonstrt',
  date: '2026-03-06', time: '10:00', location: '測試場地', photo: null,
  score_nctu: 0, score_nthu: 0, score_old_nctu: 0, score_old_nthu: 0, score_old_draw: 0,
  team_nctu: { name: '交大', photo: null }, team_nthu: { name: '清大', photo: null },
  news: [{ id: 1, title: '跨年份測試公告', type_of: 'game' }]
}

async function eventually(predicate, message) {
  const deadline = Date.now() + 10000
  while (!predicate() && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 25))
  assert.ok(predicate(), message)
}

test('one proxy isolates archive/current/future tabs and forwards each Vite HMR channel', { timeout: 60000 }, async t => {
  const { createServer } = await import('vite')
  const viteServers = []
  let browser, context, proxy
  const futureRoot = await mkdtemp(path.join(os.tmpdir(), 'meichu-future-site-'))
  t.after(async () => {
    if (context) await context.close()
    if (browser) await browser.close()
    if (proxy) await new Promise(resolve => proxy.close(resolve))
    await Promise.all(viteServers.map(server => server.close()))
    await rm(futureRoot, { recursive: true, force: true })
  })
  await writeFile(path.join(futureRoot, 'index.html'), '<button id="load">load future chunk</button><p id="result">2027 fixture</p><script type="module" src="/main.js"></script>')
  await writeFile(path.join(futureRoot, 'main.js'), "document.querySelector('#load').onclick = async () => { const { text } = await import('./lazy.js'); document.querySelector('#result').textContent = text }")
  await writeFile(path.join(futureRoot, 'lazy.js'), "export const text = 'future lazy chunk loaded'")
  const definitions = [
    { root: path.resolve('apps/old-site'), configFile: path.resolve('apps/old-site/vite.config.mjs') },
    { root: path.resolve('apps/site-2026'), configFile: path.resolve('apps/site-2026/vite.config.js') },
    { root: futureRoot, configFile: false, base: '/2027/' }
  ]
  for (const definition of definitions) {
    const server = await createServer({ ...definition, logLevel: 'silent', server: { host: '127.0.0.1', port: 0, strictPort: false } })
    viteServers.push(server)
    await server.listen()
  }
  const targets = viteServers.map(server => `http://127.0.0.1:${server.httpServer.address().port}`)
  proxy = createDevelopmentServer({ legacyTarget: targets[0], sites: new Map([['2026', targets[1]], ['2027', targets[2]]]) })
  await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${proxy.address().port}`
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined })
  context = await browser.newContext()
  await context.addInitScript(() => {
    window.hasPlayedIndexAnime = true
    window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) }
  })
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (url.origin === 'https://meichu.games' && url.pathname.startsWith('/api/')) {
      const body = url.pathname === '/api/game' ? { games: [game] }
        : url.pathname.startsWith('/api/game/slug/') ? { game }
        : url.pathname.startsWith('/api/news/') ? { news: { id: 1, title: '跨年份測試公告', content: '測試內容', files: [] } }
        : url.pathname === '/api/option' ? { options: [] } : { archives: [], items: [] }
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) })
    }
    return route.fulfill({ body: '' })
  })
  const records = await Promise.all([0, 1, 2].map(async () => {
    const page = await context.newPage()
    const record = { page, errors: [], sockets: [], messages: [] }
    page.on('pageerror', error => record.errors.push(error.message))
    page.on('websocket', socket => {
      record.sockets.push(socket.url())
      socket.on('framereceived', ({ payload }) => {
        try { record.messages.push(JSON.parse(String(payload))) } catch { /* Ignore non-JSON ping frames. */ }
      })
    })
    return record
  }))
  await Promise.all(records.map(({ page }, index) => page.goto(origin + ['/2025/game', '/2026/game/routing-game', '/2027/'][index])))
  await records[0].page.getByText(game.name, { exact: true }).first().waitFor()
  await records[1].page.getByText(game.name, { exact: true }).first().waitFor()
  await records[2].page.getByText('2027 fixture', { exact: true }).waitFor()

  // A cookie left by the previous proxy cannot redirect any tab's subsequent chunks.
  await context.addCookies([{ name: 'meichu-year', value: '2027', url: origin }])
  await records[0].page.goto(origin + '/2020/game')
  await records[0].page.getByText(game.name, { exact: true }).first().waitFor()
  await records[1].page.getByRole('link', { name: '跨年份測試公告', exact: true }).click()
  await records[1].page.getByRole('heading', { name: '跨年份測試公告', exact: true }).waitFor()
  assert.equal(new URL(records[1].page.url()).pathname, '/2026/news/1')
  await records[1].page.reload()
  await records[1].page.getByRole('heading', { name: '跨年份測試公告', exact: true }).waitFor()
  await records[2].page.getByRole('button', { name: 'load future chunk' }).click()
  await records[2].page.getByText('future lazy chunk loaded', { exact: true }).waitFor()

  for (const [index, record] of records.entries()) {
    await eventually(() => record.messages.some(message => message.type === 'connected'), `site ${index} HMR connected`)
    const prefix = ['/', '/2026/', '/2027/'][index]
    assert.ok(record.sockets.every(url => new URL(url).origin === origin.replace('http:', 'ws:') && new URL(url).pathname === prefix), 'HMR stays on the same proxy origin and year')
    viteServers[index].ws.send({ type: 'custom', event: 'routing-check', data: index })
    await eventually(() => record.messages.some(message => message.event === 'routing-check' && message.data === index), `site ${index} receives its HMR frame`)
    assert.deepEqual(record.errors, [])
  }
  assert.equal(await records[1].page.locator('link[rel="icon"]').first().evaluate(node => node.href), origin + '/2026/2026-favicon.svg')
  assert.equal((await context.request.get(origin + '/2026/2026-favicon.svg')).status(), 200)
  for (const invalid of ['/20260/', '/2028/', '/unknown']) {
    assert.equal((await context.request.get(origin + invalid)).status(), 404)
  }
  const home = await context.request.get(origin + '/?source=home', { maxRedirects: 0 })
  assert.equal(home.status(), 302)
  assert.equal(home.headers().location, '/2026/?source=home')
  assert.equal(home.headers()['set-cookie'], undefined)
})

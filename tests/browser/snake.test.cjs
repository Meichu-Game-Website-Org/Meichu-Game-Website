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
      const pathname = new URL(request.url, 'http://localhost').pathname
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

test('Snake mounts after SPA navigation, accepts focused controls and stops when leaving', async t => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  t.after(() => context.close())
  await context.addInitScript(() => {
    window.skrollr = { init: () => ({ isMobile: () => true, destroy() {} }) }
    window.snakePaints = []
    const fillText = CanvasRenderingContext2D.prototype.fillText
    CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
      if (this.canvas.id === 'render-target') window.snakePaints.push(text)
      return fillText.call(this, text, ...args)
    }
    // The game must tolerate browsers that reject optional audio playback.
    HTMLMediaElement.prototype.play = () => Promise.reject(new Error('Audio unavailable in test'))
  })
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (url.pathname.startsWith('/api/')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ games: [], options: [], archives: [], items: [] }) })
    return route.fulfill({ body: '' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${origin}/2025/game`)
  await page.locator('.desktop-nav').getByRole('link', { name: '首頁', exact: true }).first().click()
  const canvas = page.locator('#render-target')
  await canvas.waitFor()
  await page.waitForFunction(() => window.snakePaints.includes('Press Enter to start.'))
  await canvas.focus()
  await page.waitForTimeout(550)
  await page.keyboard.press('Enter', { delay: 40 })
  await page.waitForFunction(() => window.snakePaints.at(-1)?.startsWith('Score:'))
  await page.keyboard.press('p', { delay: 40 })
  await page.waitForFunction(() => window.snakePaints.at(-1) === 'Press Enter to continue.')
  await page.keyboard.press('Tab')
  assert.equal(await canvas.evaluate(element => element === document.activeElement), false, 'Keyboard focus can leave the game')
  await page.locator('.desktop-nav').getByRole('link', { name: '賽事', exact: true }).first().click()
  await canvas.waitFor({ state: 'detached' })
  const painted = await page.evaluate(() => window.snakePaints.length)
  await page.waitForTimeout(100)
  assert.equal(await page.evaluate(() => window.snakePaints.length), painted, 'No orphan animation draws after deactivation')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(50)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.waitForTimeout(100)
  assert.equal(await page.evaluate(() => window.snakePaints.length), painted, 'Resizing away from the cached homepage must not restart its hidden game')
  await page.locator('.desktop-nav').getByRole('link', { name: '首頁', exact: true }).first().click()
  await canvas.waitFor()
  await page.waitForFunction(before => window.snakePaints.length > before && window.snakePaints.at(-1) === 'Press Enter to start.', painted)
  assert.equal(await canvas.count(), 1)
  await page.setViewportSize({ width: 390, height: 844 })
  await canvas.waitFor({ state: 'detached' })
  const beforeResize = await page.evaluate(() => window.snakePaints.length)
  await page.waitForTimeout(100)
  assert.equal(await page.evaluate(() => window.snakePaints.length), beforeResize, 'Resize teardown stops animation')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await canvas.waitFor()
  await page.waitForFunction(before => window.snakePaints.length > before && window.snakePaints.at(-1) === 'Press Enter to start.', beforeResize)
  assert.equal(await canvas.count(), 1)
  assert.equal(await page.evaluate(() => 'Application' in window || 'KeyboardController' in window || 'ctrApplication' in window), false)
  assert.deepEqual(errors, [])
})

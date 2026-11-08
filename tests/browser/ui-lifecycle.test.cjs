const assert = require('node:assert/strict')
const { test, before, after } = require('node:test')
const { createServer } = require('node:http')
const { readFile, stat, mkdir } = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require('playwright')

const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' }
let browser, origins
const servers = []

async function serve(directory, mount) {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      if (!pathname.startsWith(mount)) { response.writeHead(404).end(); return }
      let file = path.resolve(directory, pathname.slice(mount.length))
      if (!file.startsWith(directory + path.sep) || !(await stat(file).catch(() => null))?.isFile()) file = path.join(directory, 'index.html')
      response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
      response.end(await readFile(file))
    } catch { response.writeHead(500).end('Test server error') }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  servers.push(server)
  return `http://127.0.0.1:${server.address().port}`
}

before(async () => {
  const root = process.env.UI_DIST_ROOT || process.cwd()
  origins = { old: await serve(path.join(root, 'apps/old-site/dist'), '/'), current: await serve(path.join(root, 'apps/site-2026/dist'), '/2026/') }
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined })
})
after(async () => {
  await browser?.close()
  await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve))))
})

async function fixture(t, width = 1440, playAnimation = false) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  if (!playAnimation) await context.addInitScript(() => { window.hasPlayedIndexAnime = true })
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (Object.values(origins).includes(url.origin)) return route.continue()
    if (url.pathname.startsWith('/api/')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify({
      games: [], news: [], items: [], archives: [], options: [
        { key: 'about-meichu', value: '梅竹介紹內容。'.repeat(100) },
        { key: 'meichu-history', value: '梅竹歷史內容。' }
      ]
    }) })
    return route.fulfill({ body: '' })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  t.after(async () => { await context.close(); assert.deepEqual(errors, [], 'No unhandled page errors') })
  return page
}

async function shot(page, name) {
  if (!process.env.UI_SCREENSHOTS) return
  await mkdir(process.env.UI_SCREENSHOTS, { recursive: true })
  await page.screenshot({ path: path.join(process.env.UI_SCREENSHOTS, name + '.png'), animations: 'disabled' })
}

for (const width of [390, 1440]) {
  test(`2026: leaving the ${width}px intro releases page scrolling and cancels the animation`, async t => {
    const page = await fixture(t, width, true)
    await page.goto(origins.current + '/2026/about')
    await page.locator('.about-section:visible').first().waitFor()
    // Begin the intro with real navigation, then use the browser Back button while it is active.
    if (width === 390) {
      await page.locator('.mobile-header__toggle').click()
      await page.locator('.mobile-nav').getByRole('link', { name: '首頁', exact: true }).click()
    } else {
      await page.locator('.desktop-nav').getByRole('link', { name: '首頁', exact: true }).click()
    }
    await page.locator(width === 390 ? '.index-anime-mobile' : '.index-anime').waitFor()
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden')
    await page.goBack()
    await page.locator('.about-section:visible').first().waitFor()
    assert.equal(await page.evaluate(() => document.body.style.overflow), '', 'Cached intro must release its body scroll lock immediately')
    assert.equal(await page.evaluate(() => window.hasPlayedIndexAnime), true)
    await page.goForward()
    await page.locator('.home').waitFor()
    await page.locator('.index-anime, .index-anime-mobile').waitFor({ state: 'detached' })
  })
}

test('2026: Escape ends the intro and restores the existing overflow value', async t => {
  const page = await fixture(t, 1440, true)
  await page.goto(origins.current + '/2026/game')
  await page.evaluate(() => { document.body.style.overflow = 'auto' })
  await page.locator('.desktop-nav').getByRole('link', { name: '首頁', exact: true }).click()
  await page.locator('.index-anime').waitFor()
  await page.keyboard.press('Escape')
  await page.locator('.index-anime').waitFor({ state: 'detached' })
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'auto')
})


test('2026: Escape from the closed mobile menu reaches the intro', async t => {
  const page = await fixture(t, 390, true)
  await page.goto(origins.current + '/2026/about')
  await page.locator('.mobile-header__toggle').click()
  await page.locator('.mobile-nav').getByRole('link', { name: '首頁', exact: true }).click()
  await page.locator('.index-anime-mobile').waitFor()
  assert.equal(await page.locator('.mobile-header__toggle').getAttribute('aria-expanded'), 'false')
  await page.keyboard.press('Escape')
  assert.equal(await page.evaluate(() => window.hasPlayedIndexAnime), true, 'Closed navigation must not swallow the intro Escape key')
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')
})

for (const width of [390, 1440]) {
test(`2026: late clicks on the fading ${width}px intro cannot restart its timer`, async t => {
  const page = await fixture(t, width, true)
  await page.addInitScript(() => {
    const originalTimeout = window.setTimeout.bind(window)
    window.lateIntroTimers = []
    window.setTimeout = (callback, delay, ...args) => {
      if (window.hasPlayedIndexAnime && [40, 400, 500, 800, 1000, 1200, 1500].includes(delay)) window.lateIntroTimers.push(delay)
      return originalTimeout(callback, delay, ...args)
    }
  })
  await page.goto(origins.current + '/2026/')
  const animation = page.locator(width === 390 ? '.index-anime-mobile' : '.index-anime')
  await animation.waitFor()
  await page.keyboard.press('Escape')
  // A CSS leaving transition retains the old DOM and its event listeners briefly.
  await animation.dispatchEvent('click')
  assert.deepEqual(await page.evaluate(() => window.lateIntroTimers), [], 'Finishing must remain final even while leaving DOM can receive events')
})
}

async function textContrast(locator) {
  return locator.evaluate(async element => {
    await Promise.allSettled(element.getAnimations().map(animation => animation.finished))
    const rgba = value => value.match(/[\d.]+/g).map(Number)
    const composite = (front, back) => front.slice(0, 3).map((value, index) => value * (front[3] ?? 1) + back[index] * (1 - (front[3] ?? 1)))
    const ancestors = []
    for (let node = element; node; node = node.parentElement) ancestors.unshift(node)
    const background = ancestors.reduce((color, node) => composite(rgba(getComputedStyle(node).backgroundColor), color), [255, 255, 255])
    const foreground = composite(rgba(getComputedStyle(element).color), background)
    const luminance = color => color.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
    const a = luminance(foreground), b = luminance(background)
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  })
}

for (const year of [2020, 2021, 2022, 2023, 2024, 2025, 2026]) {
  test(`${year}: mobile navigation supports keyboard opening, Escape and selecting the current route`, async t => {
    const page = await fixture(t, 390)
    await page.goto((year === 2026 ? origins.current : origins.old) + `/${year}/game`)
    const toggle = page.locator('.mobile-header__toggle')
    await toggle.waitFor()
    assert.equal(await toggle.evaluate(element => element.tagName), 'BUTTON')
    await toggle.focus()
    await page.keyboard.press('Enter')
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true')
    if (year >= 2025) await shot(page, `menu-${year}-390`)
    const navId = await toggle.getAttribute('aria-controls')
    const navigation = page.locator(`#${navId}`)
    await navigation.locator('a').first().focus()
    await page.keyboard.press('Escape')
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false')
    assert.equal(await toggle.evaluate(element => element === document.activeElement), true)
    await page.keyboard.press('Space')
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true')
    await navigation.locator(`a[href="/${year}/game"]`).click()
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false', 'Choosing the current route also dismisses the menu')
  })
}

for (const width of [800, 1440]) {
  test(`2026: About tabs select and focus content using the keyboard at ${width}px`, async t => {
    const page = await fixture(t, width)
    await page.goto(origins.current + '/2026/about')
    const section = page.locator('.about-section:visible')
    const first = section.getByRole('tab', { name: '丙午梅竹', exact: true })
    const history = section.getByRole('tab', { name: '梅竹賽歷史', exact: true })
    await first.waitFor()
    const inactiveContrast = await textContrast(history)
    assert.ok(inactiveContrast >= 4.5, 'The inactive tab label remains readable')
    await history.hover()
    const hoverContrast = await textContrast(history)
    assert.ok(hoverContrast >= 4.5, 'Hover does not reduce tab text contrast')
    t.diagnostic(`Tab text contrast: inactive ${inactiveContrast.toFixed(2)}:1, hover ${hoverContrast.toFixed(2)}:1`)
    await first.focus()
    await page.keyboard.press('ArrowRight')
    assert.equal(await history.getAttribute('aria-selected'), 'true')
    assert.equal(await history.evaluate(element => element === document.activeElement), true)
    assert.match(await section.getByRole('tabpanel').textContent(), /梅竹歷史內容/)
    await page.keyboard.press('Home')
    assert.equal(await first.getAttribute('aria-selected'), 'true')
    assert.match(await section.getByRole('tabpanel').textContent(), /梅竹介紹內容/)
    await page.mouse.move(0, 0)
    await textContrast(history)
    await first.scrollIntoViewIfNeeded()
    await shot(page, `about-${width}`)
    const ids = await page.locator('[role="tab"], [role="tabpanel"]').evaluateAll(elements => elements.map(element => element.id))
    assert.equal(new Set(ids).size, ids.length, 'Tab and panel ARIA IDs are unique')
  })
}

test('2026: homepage cover follows CSS viewport changes without reloading', async t => {
  const page = await fixture(t, 390)
  await page.goto(origins.current + '/2026/')
  await page.locator('.home').waitFor()
  const image = page.locator('.cover img')
  assert.equal(await image.isVisible(), false)
  await shot(page, 'home-390')
  for (const width of [800, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await image.waitFor({ state: 'visible' })
    assert.equal(await image.evaluate(element => element.complete && element.naturalWidth > 0), true)
    if (width === 1440) await shot(page, 'home-1440')
  }
  await page.setViewportSize({ width: 390, height: 900 })
  await image.waitFor({ state: 'hidden' })
})


test('2026: mobile About content remains visible without desktop tabs', async t => {
  const page = await fixture(t, 390)
  await page.goto(origins.current + '/2026/about')
  await page.locator('.mobile-about .about-section').first().waitFor()
  assert.equal(await page.getByRole('tab').count(), 0)
  await shot(page, 'about-390')
})

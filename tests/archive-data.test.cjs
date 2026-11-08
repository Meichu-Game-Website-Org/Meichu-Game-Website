const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const vm = require('node:vm')
const { test, before } = require('node:test')

const root = path.resolve(__dirname, '..')
let banners
before(async () => {
  banners = await import(pathToFileURL(path.join(root, 'apps/old-site/src/utils/banners.mjs')))
})

function component(year, page, dependencies = {}) {
  const filename = path.join(root, `apps/old-site/src/pages/${year}/${page}.vue`)
  const source = readFileSync(filename, 'utf8')
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*$/gm, '')
    .replace('export default', 'globalThis.component =')
  const stub = {}
  const context = {
    GameList: stub, GameListPage: stub, NewsPanel: stub, CurrScore: stub, Snake: stub,
    window: { innerWidth: 1440, scrollTo() {} }, ...banners, ...dependencies
  }
  vm.runInNewContext(script, context, { filename })
  return context.component
}

for (const [year, yearId] of [[2020, 2], [2021, 53]]) {
  test(`${year}: optional banner links never hide or crash image banners`, async () => {
    let request
    const options = component(year, 'IndexPage', {
      OptionApi: { fetchOptions: async params => {
        request = params
        return { options: [{ key: 'banners', value: ['/first.png', '/second.png'] }] }
      } }
    })
    const state = options.data()
    await options.methods.fetch.call(state)
    assert.equal(request.year_id, yearId)
    assert.deepEqual(Array.from(request.data), ['banners', 'banner-links'])
    const noLinks = options.computed.bannerList.call(state)
    assert.equal(noLinks.length, 2)
    assert.equal(noLinks[0].image_url, '/first.png')
    assert.ok(!noLinks[0].url)
    state.options['banner-links'] = ['https://example.org/event']
    const shortLinks = options.computed.bannerList.call(state)
    assert.equal(shortLinks[0].url, 'https://example.org/event')
    assert.equal(shortLinks[1].image_url, '/second.png')
    assert.ok(!shortLinks[1].url)
  })

  test(`${year}: failed optional banner requests settle without an unhandled rejection`, async () => {
    const options = component(year, 'IndexPage', {
      OptionApi: { fetchOptions: async () => { throw new Error('offline') } }
    })
    const state = options.data()
    await options.methods.fetch.call(state)
    assert.deepEqual(Array.from(options.computed.bannerList.call(state)), [])
  })
}

for (const year of [2019, 2022, 2023, 2024, 2025]) {
  test(`${year}: static homepage does not request unused banner options`, async () => {
    let requests = 0
    const options = component(year, 'IndexPage', {
      OptionApi: { fetchOptions: async () => { requests++; return { options: [] } } }
    })
    const state = options.data?.() || {}
    for (const [name, method] of Object.entries(options.methods || {})) state[name] = method.bind(state)
    await options.created?.call(state)
    await Promise.resolve()
    assert.equal(requests, 0)
  })
}

for (const [year, name] of [[2023, '癸卯'], [2024, '甲辰']]) {
  test(`${year}: static course metadata does not access a missing news record`, () => {
    const options = component(year, 'CoursePage')
    const info = typeof options.metaInfo === 'function' ? options.metaInfo.call({}) : options.metaInfo
    assert.equal(info.title, '賽程')
    assert.equal(info.titleTemplate, `%s | ${name}梅竹`)
  })
}

test('banner records retain image/link alignment and tolerate missing or malformed optional fields', () => {
  assert.deepEqual(banners.createBannerList(banners.readBannerOptions(null)), [])
  assert.deepEqual(banners.createBannerList({ banners: '/not-an-array.png' }), [])
  const options = banners.readBannerOptions({ options: [
    null,
    { key: '__proto__', value: ['unsafe'] },
    { key: 'banners', value: ['', '/second.png', null, '/fourth.png'] },
    { key: 'banner-links', value: ['unused', ' https://example.org/second ', 'unused', 42] }
  ] })
  assert.deepEqual(banners.createBannerList(options), [
    { image_url: '/second.png', url: 'https://example.org/second' },
    { image_url: '/fourth.png', url: '' }
  ])
})

test('2025: viewport tracking stops while cached and refreshes when activated again', () => {
  const listeners = new Map()
  const window = {
    innerWidth: 1440,
    addEventListener: (event, callback) => listeners.set(event, callback),
    removeEventListener: (event, callback) => {
      assert.equal(listeners.get(event), callback)
      listeners.delete(event)
    }
  }
  const options = component(2025, 'IndexPage', { window })
  const state = options.data()
  state.updateViewport = options.methods.updateViewport.bind(state)
  options.created.call(state)
  options.mounted.call(state)
  options.activated.call(state)
  assert.equal(state.isDesktop, true)
  window.innerWidth = 390
  listeners.get('resize')()
  assert.equal(state.isDesktop, false)
  window.innerWidth = 1440
  listeners.get('resize')()
  assert.equal(state.isDesktop, true)
  options.deactivated.call(state)
  assert.equal(listeners.size, 0)
  window.innerWidth = 390
  assert.equal(state.isDesktop, true, 'A cached page does not mount or remove its game during viewport changes')
  options.activated.call(state)
  assert.equal(state.isDesktop, false, 'Returning to the page reads the current viewport')
  assert.equal(listeners.size, 1)
  window.innerWidth = 1440
  listeners.get('resize')()
  assert.equal(state.isDesktop, true, 'Viewport tracking resumes on the active page')
  options.beforeUnmount.call(state)
  assert.equal(listeners.size, 0)
})

test('2025: viewport tracking also works without KeepAlive and stops on unmount', () => {
  const window = new EventTarget()
  window.innerWidth = 1440
  const options = component(2025, 'IndexPage', { window })
  const state = options.data()
  state.updateViewport = options.methods.updateViewport.bind(state)
  options.created.call(state)
  options.mounted.call(state)
  assert.equal(state.isDesktop, true)
  window.innerWidth = 390
  window.dispatchEvent(new Event('resize'))
  assert.equal(state.isDesktop, false)
  options.beforeUnmount.call(state)
  window.innerWidth = 1440
  window.dispatchEvent(new Event('resize'))
  assert.equal(state.isDesktop, false)
})

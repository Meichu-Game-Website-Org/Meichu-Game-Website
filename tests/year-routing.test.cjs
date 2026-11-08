const assert = require('node:assert/strict')
const test = require('node:test')
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')
const { createDevelopmentServer, discoverSites, routeRequest } = require('../dev-proxy.js')

const routes = {
  sites: new Map([['2026', 'http://127.0.0.1:22026'], ['2027', 'http://127.0.0.1:22027']]),
  publicFiles: new Set(['/favicon2025.png']), legacyTarget: 'http://127.0.0.1:3030'
}

test('home and canonical year URLs redirect with their query string', () => {
  assert.deepEqual(routeRequest('/?from=home', routes), { status: 302, location: '/2026/?from=home' })
  assert.deepEqual(routeRequest('/2026?from=link', routes), { status: 308, location: '/2026/?from=link' })
})

test('only registered new years and known archive years select an upstream', () => {
  for (const year of ['2026', '2027']) {
    assert.equal(routeRequest(`/${year}/assets/app.js?v=1`, routes).target, routes.sites.get(year))
    assert.equal(routeRequest(`/${year}/?token=hmr`, routes, true).target, routes.sites.get(year))
  }
  assert.equal(routeRequest('/2025/game/example', routes).target, routes.legacyTarget)
  assert.equal(routeRequest('/assets/archive.js', routes).target, routes.legacyTarget)
  assert.equal(routeRequest('/favicon2025.png', routes).target, routes.legacyTarget)
  assert.equal(routeRequest('/?token=hmr', routes, true).target, routes.legacyTarget)
  for (const invalid of ['/2018/', '/2028/', '/20260/', '/02026/', '/2026other', '/unknown']) {
    assert.deepEqual(routeRequest(invalid, routes), { status: 404 }, invalid)
    assert.deepEqual(routeRequest(invalid, routes, true), { status: 404 }, invalid)
  }
  assert.deepEqual(routeRequest('//attacker.invalid/2026', routes), { status: 400 })
})

test('workspace discovery ignores missing apps and names that merely begin with a year', t => {
  const directory = mkdtempSync(path.join(tmpdir(), 'meichu-routing-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  for (const name of ['site-2026', 'site-2027', 'site-20260', 'site-2028-preview', 'site-2029']) {
    mkdirSync(path.join(directory, name))
    if (name !== 'site-2029') writeFileSync(path.join(directory, name, 'package.json'), '{}')
  }
  assert.deepEqual([...discoverSites(directory).keys()].sort(), ['2026', '2027'])
})

test('cookies and cross-year referrers cannot change an asset target or strip its prefix', () => {
  const received = []
  const server = createDevelopmentServer({ ...routes, proxy: {
    web(req, _res, options) { received.push([req.url, options.target]) }, on() {}, close() {}
  } })
  const response = { writeHead() { assert.fail('Asset request should be proxied') }, end() {} }
  for (const url of ['/2026/assets/app.js', '/2027/assets/app.js', '/assets/archive.js']) {
    server.emit('request', { url, headers: { cookie: 'meichu-year=2027', referer: 'http://localhost/2025/' } }, response)
  }
  assert.deepEqual(received, [
    ['/2026/assets/app.js', routes.sites.get('2026')],
    ['/2027/assets/app.js', routes.sites.get('2027')],
    ['/assets/archive.js', routes.legacyTarget]
  ])
})

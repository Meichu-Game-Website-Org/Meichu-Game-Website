const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { test } = require('node:test')
const vm = require('node:vm')

const { createDevelopmentServer } = require('../dev-proxy.js')

for (const url of ['/2025/game', '/2026/game']) {
  test(`${url}: an unavailable upstream terminates with 502`, () => {
    const server = createDevelopmentServer({ proxy: {
      web(req, res, options, callback) { callback(new Error('ECONNREFUSED'), req, res) },
      on() {}, close() {}
    } })
    const response = {
      status: null, ended: false,
      writeHead(status) { this.status = status },
      end(body) { this.ended = true; this.body = body }
    }
    server.emit('request', { url, headers: {} }, response)
    assert.equal(response.status, 502)
    assert.equal(response.ended, true)
  })
}

test('legacy navigation works with and without the 2021 scroll wrapper', () => {
  const source = readFileSync(require.resolve('../apps/old-site/src/router.js'), 'utf8')
    .replace(/^import .*$/gm, '')
    .replace('export default router', 'globalThis.router = router')
  let wrapper = null
  const dependencies = {
    createRouter: options => options,
    createWebHistory: base => ({ base }),
    axios: { defaults: {} },
    document: { getElementById: () => wrapper }
  }
  for (const match of readFileSync(require.resolve('../apps/old-site/src/router.js'), 'utf8').matchAll(/^import (\w+) from '@\/pages/gm)) dependencies[match[1]] = {}
  vm.runInNewContext(source, dependencies)
  assert.equal(dependencies.router.history.base, '/')
  assert.doesNotThrow(() => dependencies.router.scrollBehavior({}, {}, null))
  wrapper = { scrollTop: 500 }
  dependencies.router.scrollBehavior({}, {}, null)
  assert.equal(wrapper.scrollTop, 0)
})

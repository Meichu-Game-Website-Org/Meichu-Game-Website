const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { test } = require('node:test')
const vm = require('node:vm')

function proxyRequest(url) {
  let handler
  const proxy = {
    web(req, res, options, callback) { callback(new Error('ECONNREFUSED')) },
    on() {}
  }
  vm.runInNewContext(readFileSync(require.resolve('../dev-proxy.js'), 'utf8'), {
    require(name) {
      if (name === 'http') return { createServer(fn) { handler = fn; return { listen() {} } } }
      if (name === 'http-proxy') return { createProxyServer: () => proxy }
      throw new Error(`Unexpected import: ${name}`)
    },
    console: { log() {}, error() {} }
  })
  const response = {
    status: null, ended: false,
    setHeader() {},
    writeHead(status) { this.status = status },
    end(body) { this.ended = true; this.body = body }
  }
  handler({ url, headers: {} }, response)
  return response
}

for (const path of ['/2025/game', '/2026/game']) {
  test(`${path}: an unavailable upstream terminates with 502`, () => {
    const response = proxyRequest(path)
    assert.equal(response.status, 502)
    assert.equal(response.ended, true)
  })
}

test('legacy navigation works with and without the 2021 scroll wrapper', () => {
  const source = readFileSync(require.resolve('../apps/old-site/src/router.js'), 'utf8')
    .replace(/^import .*$/gm, '')
    .replace('export default router', 'globalThis.router = router')
  let wrapper = null
  const dependencies = { VueRouter: function (options) { return options }, axios: { defaults: {} }, document: { getElementById: () => wrapper } }
  for (const match of readFileSync(require.resolve('../apps/old-site/src/router.js'), 'utf8').matchAll(/^import (\w+) from '@\/pages/gm)) dependencies[match[1]] = {}
  vm.runInNewContext(source, dependencies)
  assert.doesNotThrow(() => dependencies.router.scrollBehavior({}, {}, null))
  wrapper = { scrollTop: 500 }
  dependencies.router.scrollBehavior({}, {}, null)
  assert.equal(wrapper.scrollTop, 0)
})

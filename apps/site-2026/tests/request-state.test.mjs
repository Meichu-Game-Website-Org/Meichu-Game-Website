import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { createResource, loadResource, invalidateResource } from '../../../packages/services/src/resource.js'
import { readGame, readGames, readNews, readArchives, readOptions } from '../../../packages/services/src/content.js'

function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

for (const [name, error, message] of [
  ['404', { response: { status: 404 } }, /找不到/],
  ['503', { response: { status: 503 } }, /暫時無法取得/],
  ['offline', new Error('Network Error'), /檢查網路/],
  ['timeout', { code: 'ECONNABORTED' }, /逾時/],
  ['malformed', { code: 'INVALID_RESPONSE' }, /資料暫時無法讀取/]
]) {
  test(`${name}: failed loads end, hide old data, and recover after retry`, async () => {
    const state = createResource()
    await loadResource(state, async () => 'old data')
    const pending = deferred()
    const work = loadResource(state, () => pending.promise)
    assert.equal(state.status, 'loading')
    assert.equal(state.data, null)
    pending.reject(error)
    await work
    assert.equal(state.status, 'error')
    assert.match(state.error, message)
    await loadResource(state, async () => 'recovered')
    assert.equal(state.status, 'success')
    assert.equal(state.data, 'recovered')
    assert.equal(state.error, '')
  })
}

test('empty data has a distinct state; a successful zero is not empty', async () => {
  const state = createResource()
  await loadResource(state, async () => [], data => !data.length)
  assert.equal(state.status, 'empty')
  await loadResource(state, async () => 0)
  assert.equal(state.status, 'success')
})

for (const outcome of ['resolve', 'reject']) {
  test(`a stale ${outcome} cannot replace a newer route or its state`, async () => {
    const state = createResource()
    const first = deferred(), second = deferred()
    const oldWork = loadResource(state, () => first.promise)
    const newWork = loadResource(state, () => second.promise)
    second.resolve('new route')
    await newWork
    first[outcome](outcome === 'resolve' ? 'old route' : new Error('old failure'))
    await oldWork
    assert.equal(state.data, 'new route')
    assert.equal(state.status, 'success')
    assert.equal(state.error, '')
  })
}

test('leaving a component invalidates its pending response', async () => {
  const state = createResource(), pending = deferred()
  const work = loadResource(state, () => pending.promise)
  invalidateResource(state)
  pending.resolve('unmounted')
  await work
  assert.equal(state.data, null)
})

for (const [name, parse, malformed] of [
  ['game list', readGames, {}],
  ['game row', readGames, [null]],
  ['game detail', readGame, {}],
  ['missing game slug', readGames, [{ item: { slug: '' }, status: 'nonstrt' }]],
  ['news detail', readNews, { title: 'missing body' }],
  ['news attachments', readNews, { title: 'title', content: 'body', files: {} }],
  ['archives', readArchives, { archives: [{}], items: [] }],
  ['options', readOptions, { options: [{ key: 'about-meichu', value: {} }] }]
]) {
  test(`${name}: malformed data is caught as a recoverable error`, async () => {
    const state = createResource()
    await loadResource(state, async () => parse(malformed))
    assert.equal(state.status, 'error')
    assert.equal(state.data, null)
  })
}

test('optional news attachments and empty records remain valid', () => {
  assert.deepEqual(readNews({ title: '公告', content: '內文' }).files, [])
  assert.equal(readNews(null), null)
  assert.equal(readGame(null), null)
  assert.deepEqual(readArchives({ archives: [], items: [] }), { archives: [], items: [] })
  assert.deepEqual(readOptions({ options: [] }), {})
})

test('shared API client limits waiting and retains cross-origin credentials', () => {
  const require = createRequire(import.meta.url)
  const source = readFileSync(new URL('../../../packages/services/src/client.js', import.meta.url), 'utf8')
    .replace("import axios from 'axios'", '')
    .replace('export const REQUEST_TIMEOUT', 'const REQUEST_TIMEOUT')
    .replace('export default', 'globalThis.client =')
  const context = { axios: require('axios') }
  vm.runInNewContext(source, context)
  assert.equal(context.client.defaults.timeout, 10000)
  assert.equal(context.client.defaults.withCredentials, true)
})

const assert = require('node:assert/strict')
const { test } = require('node:test')
const { component } = require('./helpers/archive-components.cjs')

const game = { id: 1, name: '測試賽事', status: 'nctu', type_of: 'official', item: { slug: 'men-basketball' }, team_nctu: null, team_nthu: null }
const news = { id: 1, title: '測試公告', content: '公告內文', files: [] }
const options = { options: [{ key: 'about-meichu', value: '梅竹介紹' }] }
const archives = { archives: [{ year: { year: 2025 }, archive: [] }], items: [] }
const cases = []
for (let year = 2019; year <= 2025; year++) {
  cases.push([`pages/${year}/GameShowPage`, 'GameApi', 'fetchGameBySlug', game, null, {}])
  cases.push([year <= 2020 ? `pages/${year}/GameListPage` : `components/${year}/GameList`, 'GameApi', 'fetchAllGames', [game], [], {}])
  cases.push([`pages/${year}/NewsShowPage`, 'NewsApi', 'fetchNews', news, null, {}])
  cases.push([`pages/${year}/AboutPage`, 'OptionApi', 'fetchOptions', options, { options: [] }, {}])
  if (year > 2019) cases.push([`pages/${year}/HistoryPage`, 'HistoryApi', 'fetchFullArchives', archives, { archives: [], items: [] }, {}])
  if (year < 2025) cases.push([`components/${year}/NewsPanel`, 'NewsApi', 'fetchAllNews', { news: [news] }, { news: [] }, {}])
}
cases.push(['components/2025/CurrScore', 'GameApi', 'fetchAllGames', [game], [], {}])

for (const [file, api, method, valid, empty, malformed] of cases) {
  test(`${file}: failure, empty and malformed data settle and retry recovers`, async () => {
    let value = new Error('offline')
    const { state } = await component(`apps/old-site/src/${file}.vue`, {
      [api]: { [method]: async () => { if (value instanceof Error) throw value; return structuredClone(value) } }
    })
    await state.fetch()
    assert.equal(state.resource.status, 'error')
    assert.match(state.resource.error, /重新載入/)
    value = empty
    await state.fetch()
    assert.equal(state.resource.status, 'empty')
    value = malformed
    await state.fetch()
    assert.equal(state.resource.status, 'error')
    value = valid
    await state.fetch()
    assert.equal(state.resource.status, 'success')
    assert.equal(state.resource.error, '')
  })
}

function deferred() {
  let resolve
  const promise = new Promise(done => { resolve = done })
  return { promise, resolve }
}

for (let year = 2019; year <= 2025; year++) {
  test(`${year}: route reuse ignores an older game result and unmount cancels updates`, async () => {
    const first = deferred(), second = deferred(), third = deferred()
    const pending = { first, second, third }
    const { options, state, resource } = await component(`apps/old-site/src/pages/${year}/GameShowPage.vue`, {
      GameApi: { fetchGameBySlug: slug => pending[slug].promise }
    })
    const changeSlug = slug => {
      state.$route.params.slug = slug
      options.watch['$route.params.slug'].handler.call(state)
    }
    changeSlug('first')
    await Promise.resolve()
    changeSlug('second')
    second.resolve({ ...game, name: '較新的賽事' })
    await new Promise(resolve => setImmediate(resolve))
    first.resolve({ ...game, name: '較舊的賽事' })
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(state.game.name, '較新的賽事')
    changeSlug('third')
    resource.resourceMixin.beforeUnmount.call(state)
    third.resolve({ ...game, name: '卸載後的賽事' })
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(state.resource.data, null)
  })
}

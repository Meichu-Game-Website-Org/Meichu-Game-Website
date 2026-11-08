import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { parse } from 'vue/compiler-sfc'

const root = new URL('../../../', import.meta.url)
const stub = { render: () => null }

// Load the existing Options API component with isolated API/child-component stubs.
function component(path, dependencies = {}) {
  const source = readFileSync(new URL(path, root), 'utf8')
  const { descriptor } = parse(source)
  const script = descriptor.script.content.replace(/^import .*$/gm, '')
    .replace('export default', 'globalThis.component =')
  const context = {
    URL, moment: stub, GAME_STATUS: {}, YEAR_ID: 58,
    GameItem: stub, Loading: stub, Scoreboard: stub,
    TeamCard: stub, GameHistory: stub, BackToGameListBtn: stub,
    ...dependencies
  }
  vm.runInNewContext(script, context, { filename: path })
  return { options: context.component }
}

for (const year of [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]) {
  const path = year === 2026 ? 'site-2026/src/components/GameItem.vue'
    : `old-site/src/components/${year}/GameItem.vue`
  test(`${year}: a completed draw displays its score`, () => {
    const { options } = component(`apps/${path}`)
    assert.equal(options.methods.isShowScore('draw'), true)
    assert.equal(options.methods.isShowScore('nctu'), true)
    assert.equal(options.methods.isShowScore('nthu'), true)
    assert.equal(options.methods.isShowScore('nonstrt'), false)
  })
}

for (const year of [2025, 2026]) {
  const path = year === 2026 ? 'apps/site-2026/src/pages/GameShowPage.vue'
    : 'apps/old-site/src/pages/2025/GameShowPage.vue'
  for (const [name, teams] of [
    ['no teams', { team_nctu: null, team_nthu: null }],
    ['one team', { team_nctu: null, team_nthu: { photo: '/uploads/team.png' } }],
    ['absolute photos', { team_nctu: { photo: 'https://images.example/team.png' }, team_nthu: { photo: null } }]
  ]) {
    test(`${year}: game details handle ${name}`, async () => {
      const game = { name: 'Opening', ...structuredClone(teams) }
      const { options } = component(path, {
        GameApi: { fetchGameBySlug: async () => game }
      })
      const state = { slug: 'opening', game: {} }
      await options.methods.fetch.call(state)
      assert.equal(state.game.name, 'Opening')
      for (const key of ['team_nctu', 'team_nthu']) {
        const photo = teams[key]?.photo
        assert.equal(state.game[key]?.photo, photo ? new URL(photo, 'https://meichu.games').href : photo)
      }
    })
  }
}

for (const year of [2022, 2023, 2024]) {
  test(`${year}: history loading does not access an undefined console instance`, async () => {
    const { options } = component(`apps/old-site/src/pages/${year}/HistoryPage.vue`, {
      HistoryApi: { fetchFullArchives: async () => ({ archives: [], items: [] }) }
    })
    const state = { archiveList: [], itemList: [] }
    assert.doesNotThrow(() => options.methods.fetch.call(state))
    await Promise.resolve()
    assert.equal(state.archiveList.length, 0)
  })
}

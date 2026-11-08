const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')

function component(file, dependencies) {
  const source = readFileSync(path.resolve(__dirname, '..', file), 'utf8')
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*$/gm, '').replace('export default', 'globalThis.component =')
  const context = { GameItem: {}, Loading: {}, ...dependencies }
  vm.runInNewContext(script, context)
  return context.component
}

test('2020 about page requests the 2020 introduction instead of 2019', async () => {
  let requestedYear
  const options = component('apps/old-site/src/pages/2020/AboutPage.vue', {
    OptionApi: { fetchOptions: async params => {
      requestedYear = params.year_id
      return { options: [{ key: 'about-meichu', value: '庚子梅竹賽' }] }
    } }
  })
  const state = options.data()
  await options.methods.fetch.call(state)
  await Promise.resolve()
  assert.equal(requestedYear, 2)
})

test('2025 game cards retain normalized API image URLs and missing images', async () => {
  const photos = ['https://meichu.games/images/game.jpg', 'https://images.example/game.jpg', null]
  const games = photos.map((photo, id) => ({ id, photo, item: { slug: `game-${id}` }, status: 'end' }))
  const options = component('apps/old-site/src/components/2025/GameList.vue', {
    GameApi: { fetchAllGames: async () => games }
  })
  const state = options.data()
  await options.methods.fetch.call(state)
  await Promise.resolve()
  assert.deepEqual(Object.values(state.games).map(game => game.photo), photos)
})

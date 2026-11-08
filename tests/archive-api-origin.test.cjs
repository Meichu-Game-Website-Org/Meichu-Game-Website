const assert = require('node:assert/strict')
const { test } = require('node:test')
const { component } = require('./helpers/archive-components.cjs')

test('2020 about page requests the 2020 introduction instead of 2019', async () => {
  let requestedYear
  const { state } = await component('apps/old-site/src/pages/2020/AboutPage.vue', {
    OptionApi: { fetchOptions: async params => {
      requestedYear = params.year_id
      return { options: [{ key: 'about-meichu', value: '庚子梅竹賽' }] }
    } }
  })
  await state.fetch()
  assert.equal(requestedYear, 2)
})

test('2025 game cards retain normalized API image URLs and missing images', async () => {
  const photos = ['https://meichu.games/images/game.jpg', 'https://images.example/game.jpg', null]
  const games = photos.map((photo, id) => ({ id, photo, item: { slug: `game-${id}` }, status: 'end' }))
  const { state } = await component('apps/old-site/src/components/2025/GameList.vue', {
    GameApi: { fetchAllGames: async () => games }
  })
  await state.fetch()
  assert.deepEqual(Object.values(state.games).map(game => game.photo), photos)
})

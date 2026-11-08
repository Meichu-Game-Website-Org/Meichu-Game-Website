const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { test, before } = require('node:test')
const path = require('node:path')
const vm = require('node:vm')

let urls, content, banners
before(async () => {
  urls = await import('../packages/services/src/urls.js')
  content = await import('../packages/services/src/content.js')
  banners = await import('../apps/old-site/src/utils/banners.mjs')
})

const unsafe = [
  'javascript:alert(1)', ' JaVaScRiPt:alert(1) ', 'java\tscript:alert(1)',
  'java\nscript:alert(1)', '\u0000javascript:alert(1)',
  'data:text/html,<script>alert(1)</script>', 'vbscript:alert(1)',
  'file:///etc/passwd', 'blob:https://meichu.games/test', 'http://[', '', ' ', null, {}, 42
]

test('API URL policy rejects executable protocols and resolves only web URLs', () => {
  for (const value of unsafe) assert.equal(urls.safeHttpUrl(value), null, JSON.stringify(value))
  for (const [value, expected] of [
    ['/uploads/team.png', 'https://meichu.games/uploads/team.png'],
    ['uploads/team.png', 'https://meichu.games/uploads/team.png'],
    ['//images.example/team.png', 'https://images.example/team.png'],
    [' https://example.org/a?q=1#photo ', 'https://example.org/a?q=1#photo'],
    ['http://example.org/live', 'http://example.org/live']
  ]) assert.equal(urls.safeHttpUrl(value), expected)
})

test('URL cleanup covers nested game fields without mutating or stripping unrelated content', () => {
  const game = {
    name: '<text, not HTML>', is_live: true, live_url: unsafe[0],
    location_url: unsafe[2], photo: '/uploads/game.png',
    team_nctu: { name: 'NCTU', photo: '/uploads/team.png', link_facebook: unsafe[3], link_instagram: 'https://instagram.com/example', link_website: unsafe[5] },
    team_nthu: null,
    news: [{ id: 1, title: 'Notice', content: '<ordinary text>', link: unsafe[0], files: [unsafe[5], '/uploads/notice.pdf'] }]
  }
  const original = structuredClone(game)
  const result = urls.sanitizeGameUrls(game)
  assert.equal(result.is_live, false)
  assert.equal(result.live_url, null)
  assert.equal(result.location_url, null)
  assert.equal(result.photo, 'https://meichu.games/uploads/game.png')
  assert.equal(result.team_nctu.photo, 'https://meichu.games/uploads/team.png')
  assert.equal(result.team_nctu.link_facebook, null)
  assert.equal(result.team_nctu.link_website, null)
  assert.equal(result.team_nctu.link_instagram, 'https://instagram.com/example')
  assert.equal(result.news[0].link, null)
  assert.deepEqual(result.news[0].files, ['https://meichu.games/uploads/notice.pdf'])
  assert.equal(result.name, game.name)
  assert.equal(result.news[0].content, game.news[0].content)
  assert.deepEqual(game, original)
  assert.equal(urls.sanitizeGameUrls({ name: 'no source', is_live: true }).is_live, false)
  assert.equal(urls.sanitizeGameUrls({ is_live: true, live_url: 'https://www.youtube.com/embed/test' }).is_live, true)
})

test('banner cleanup preserves paired positions and drops unsafe images or destinations', () => {
  const data = { options: [
    { key: 'banners', value: [unsafe[0], '/good.png', '/unlinked.png'] },
    { key: 'banner-links', value: ['https://wrong.example', '/good-page', unsafe[5]] },
    { key: 'about-meichu', value: 'leave other options unchanged' }
  ] }
  const safe = urls.sanitizeOptionUrls(data)
  assert.equal(safe.options[0].value[0], null)
  assert.equal(safe.options[2], data.options[2])
  assert.deepEqual(banners.createBannerList(banners.readBannerOptions(safe)), [
    { image_url: 'https://meichu.games/good.png', url: 'https://meichu.games/good-page' },
    { image_url: 'https://meichu.games/unlinked.png', url: '' }
  ])
})

function service(name, response) {
  const filename = path.join(__dirname, '../packages/services/src/api', name + '.js')
  const source = readFileSync(filename, 'utf8').replace(/^import .*$/gm, '').replace('export default', 'globalThis.api =')
  const context = { ...urls, API_PATH: 'https://meichu.games/api', client: { get: async () => ({ data: response }) } }
  vm.runInNewContext(source, context, { filename })
  return context.api
}

test('every game and news service entry point sanitizes legacy callers before rendering', async () => {
  const game = { name: 'Test', live_url: unsafe[0], is_live: true, news: [{ id: 1, title: 'Notice', link: unsafe[0] }] }
  const gameApi = service('Game', { game, games: [game] })
  for (const result of [await gameApi.fetchGame(1), await gameApi.fetchGameBySlug('test', {}), ...(await gameApi.fetchAllGames({}))]) {
    assert.equal(result.live_url, null)
    assert.equal(result.is_live, false)
    assert.equal(result.news[0].link, null)
  }
  const news = { title: 'Notice', content: 'Text', link: unsafe[0], files: ['/safe.pdf', unsafe[5]] }
  const newsApi = service('News', { news })
  assert.equal((await newsApi.fetchNews(1)).link, null)
  const newsList = await service('News', { news: [news], pagination: { page: 2 } }).fetchAllNews({})
  assert.equal(newsList.news[0].link, null)
  assert.deepEqual(newsList.news[0].files, ['https://meichu.games/safe.pdf'])
  assert.equal(newsList.pagination.page, 2)
  const options = await service('Option', { options: [{ key: 'banner-links', value: [unsafe[0], '/safe'] }] }).fetchOptions({})
  assert.deepEqual(Array.from(options.options[0].value), [null, 'https://meichu.games/safe'])
})

test('direct content readers enforce the same safe URL boundary', () => {
  assert.equal(content.readGame({ name: 'Test', is_live: true, live_url: unsafe[0] }).live_url, null)
  assert.equal(content.readGames([{ name: 'Test', item: { slug: 'test' }, status: 'nonstrt', photo: unsafe[5] }])[0].photo, null)
  const news = content.readNews({ title: 'Notice', content: 'Text', link: unsafe[0], files: [unsafe[5], '/safe.pdf'] })
  assert.equal(news.link, null)
  assert.deepEqual(news.files, ['https://meichu.games/safe.pdf'])
})

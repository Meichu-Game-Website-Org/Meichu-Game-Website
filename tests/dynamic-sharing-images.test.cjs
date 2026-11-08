const assert = require('node:assert/strict')
const { test, before } = require('node:test')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { mkdtemp, mkdir, copyFile, rm } = require('node:fs/promises')
const os = require('node:os')

const root = path.resolve(__dirname, '..')
let createCardRenderer, wrapCardText, renderCard
const metadata = {
  year: '2026', contentType: 'news', contentTitle: '梅竹賽事場地異動公告',
  title: '梅竹賽事場地異動公告 | 丙午梅竹', description: '因應場地狀況調整比賽時間，請參賽同學確認最新賽程與入場資訊。'
}
function pngSize(bytes) {
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)]
}

before(async () => {
  ;({ createCardRenderer, wrapCardText } = await import(pathToFileURL(path.join(root, 'apps/sharing-server/src/render-card.mjs'))))
  renderCard = await createCardRenderer({ assetRoot: root })
})

test('each announcement or game gets a deterministic, bounded PNG using its own text', () => {
  const news = renderCard(metadata)
  const game = renderCard({ ...metadata, contentType: 'game', contentTitle: '男子籃球', description: '2026-03-06 19:00 · 清華體育館 · 進行中 · 清華 62：58 陽明交大' })
  const other = renderCard({ ...metadata, contentTitle: '頒獎典禮與入場說明' })
  assert.deepEqual(pngSize(news), [1200, 630])
  assert.deepEqual(pngSize(game), [1200, 630])
  assert.ok(news.length < 2 * 1024 * 1024)
  assert.deepEqual(renderCard(metadata), news)
  assert.notDeepEqual(other, news)
  assert.notDeepEqual(game, news)
})

test('all eight editions have readable local brand artwork and valid output', () => {
  for (let year = 2019; year <= 2026; year++) assert.deepEqual(pngSize(renderCard({ ...metadata, year })), [1200, 630])
})

test('unsupported routes fail closed and API image/path fields never select files or remote inputs', () => {
  assert.throws(() => renderCard({ ...metadata, year: '../../2026' }), /Unsupported/)
  assert.throws(() => renderCard({ ...metadata, year: '2027' }), /Unsupported/)
  assert.throws(() => renderCard({ ...metadata, contentType: 'other' }), /Unsupported/)
  assert.throws(() => renderCard(null), /Unsupported/)
  assert.deepEqual(renderCard({ ...metadata, image: 'https://untrusted.example/picture.svg', fontFiles: ['/missing'], assetRoot: '/missing' }), renderCard(metadata))
})

test('API text is bounded and XML is text, while emoji does not produce unsupported glyph boxes', () => {
  const plain = renderCard({ ...metadata, contentTitle: '梅竹公告', description: '請注意賽程' })
  const emoji = renderCard({ ...metadata, contentTitle: '🔥梅竹公告🏀', description: '請注意賽程🇹🇼' })
  assert.deepEqual(plain, emoji)
  const invalidXml = renderCard({ ...metadata, contentTitle: '梅竹\ufffe\uffff\ud800公告', description: '請注意賽程' })
  assert.deepEqual(plain, invalidXml)
  const hostile = renderCard({ ...metadata, contentTitle: '</text><svg width="99999999">& "活動"', description: '<image href="file:///not-a-real-file" />'.repeat(10000) })
  assert.deepEqual(pngSize(hostile), [1200, 630])
  assert.ok(hostile.length < 2 * 1024 * 1024)
  const long = renderCard({ ...metadata, contentTitle: '梅竹賽事異動說明'.repeat(10000), description: 'W'.repeat(1000000) })
  assert.deepEqual(pngSize(long), [1200, 630])
  assert.equal(wrapCardText('梅竹賽事異動說明'.repeat(50), 11.4, 3).length, 3)
  assert.match(wrapCardText('W'.repeat(100), 11.4, 3).at(-1), /…$/)
  assert.throws(() => wrapCardText('梅竹', 0, 3), /Invalid/)
  assert.throws(() => wrapCardText('梅竹', 11.4, Infinity), /Invalid/)
  assert.deepEqual(wrapCardText('Meichu Games Championship', 11.4, 3), ['Meichu Games', 'Championship'])
})

test('deployed assets use the same fixed font and PNG paths, with clear startup errors for missing files', async t => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'meichu-card-assets-'))
  t.after(() => rm(temporary, { recursive: true, force: true }))
  await mkdir(path.join(temporary, '2026/sharing'), { recursive: true })
  await mkdir(path.join(temporary, 'sharing'), { recursive: true })
  for (let year = 2019; year <= 2026; year++) {
    await copyFile(path.join(root, 'apps', year === 2026 ? 'site-2026' : 'old-site', 'public/sharing', `${year}.png`), path.join(temporary, year === 2026 ? '2026/sharing' : 'sharing', `${year}.png`))
  }
  const deployed = await createCardRenderer({ assetRoot: root, distRoot: temporary })
  assert.deepEqual(deployed(metadata), renderCard(metadata))
  await assert.rejects(createCardRenderer({ assetRoot: temporary }), /ENOENT/)
})

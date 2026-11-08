import assert from 'node:assert/strict'
import { test } from 'node:test'
import { gameScore, groupGames, gameDateLabel } from '../src/game-display.js'

for (const status of ['running', 'pause', 'nctu', 'nthu', 'draw', 'end']) {
  test(`${status}: individual scores preserve a real zero and numeric API strings`, () => {
    assert.deepEqual(gameScore({ status, score_nctu: 0, score_nthu: '2' }), { nctu: '0', nthu: '2', note: '' })
  })
}

test('unstarted and unavailable scores never become a fabricated zero', () => {
  for (const status of ['nonstrt', 'preparation']) {
    assert.deepEqual(gameScore({ status, score_nctu: 0, score_nthu: 0 }), { nctu: '—', nthu: '—', note: '尚未開始' })
  }
  for (const value of [null, undefined, '', ' ', NaN, Infinity, -1, false]) {
    assert.deepEqual(gameScore({ status: 'end', score_nctu: value, score_nthu: 0 }), { nctu: '—', nthu: '0', note: '比分資料未完整提供' })
  }
  assert.equal(gameScore({ status: 'end', type_of: 'agenda' }).note, '非計分活動')
})

test('schedule groups every valid game including postponed and undated games without mutating the input', () => {
  const games = [
    { name: '延賽晚場', date: '2026-03-16', time: '10:00' },
    { name: '待定日期', date: null, time: '' },
    { name: '首日', date: '2026-03-06', time: '11:00' },
    { name: '延賽早場', date: '2026-03-16', time: '9:00' },
    { name: '延賽待定時間', date: '2026-03-16', time: null },
    { name: '不合法日期', date: '2026-02-30', time: '' }
  ]
  const original = structuredClone(games)
  const groups = groupGames(games)
  assert.deepEqual(groups.map(group => group.date), ['2026-03-06', '2026-03-16', ''])
  assert.deepEqual(groups[1].games.map(game => game.name), ['延賽早場', '延賽晚場', '延賽待定時間'])
  assert.equal(groups[2].label, '日期待定')
  assert.equal(groups.flatMap(group => group.games).length, games.length)
  assert.deepEqual(games, original)
})

test('schedule date labels are calendar based and independent of the browser timezone', () => {
  assert.equal(gameDateLabel('2026-03-16'), '2026/03/16（一）')
  assert.equal(gameDateLabel('2028-02-29'), '2028/02/29（二）')
  assert.equal(gameDateLabel('2026-02-29'), '日期待定')
})

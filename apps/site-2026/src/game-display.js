const SCORE_STATUSES = new Set(['running', 'pause', 'nctu', 'nthu', 'draw', 'end'])
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export const SCORE_REFRESH_INTERVAL = 15000

function scoreValue(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null
  if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/.test(value.trim())) return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? String(number) : null
}

export function gameScore(game) {
  if (game.type_of === 'agenda') return { nctu: '—', nthu: '—', note: '非計分活動' }
  if (!SCORE_STATUSES.has(game.status)) {
    return { nctu: '—', nthu: '—', note: ['nonstrt', 'preparation'].includes(game.status) ? '尚未開始' : '尚無比分資料' }
  }
  const nctu = scoreValue(game.score_nctu)
  const nthu = scoreValue(game.score_nthu)
  return { nctu: nctu ?? '—', nthu: nthu ?? '—', note: nctu == null || nthu == null ? '比分資料未完整提供' : '' }
}

function calendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null
}

export function gameDateLabel(value) {
  const date = calendarDate(value)
  return date ? `${value.replaceAll('-', '/')}（${WEEKDAYS[date.getUTCDay()]}）` : '日期待定'
}

function timeOrder(value) {
  const match = typeof value === 'string' && /^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/.exec(value)
  return match && Number(match[1]) < 24 ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3] || 0) : Infinity
}

export function groupGames(games) {
  const groups = new Map()
  for (const game of games) {
    const key = calendarDate(game.date) ? game.date : ''
    if (!groups.has(key)) groups.set(key, { date: key, label: gameDateLabel(key), games: [] })
    groups.get(key).games.push(game)
  }
  return [...groups.values()].sort((a, b) => (a.date || 'z').localeCompare(b.date || 'z')).map(group => ({
    ...group,
    games: group.games.sort((a, b) => timeOrder(a.time) - timeOrder(b.time) || String(a.name || '').localeCompare(String(b.name || '')))
  }))
}

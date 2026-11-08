import { EDITIONS, SITE_ORIGIN, sharingMetadata } from './metadata.mjs'

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key)
const YEAR_IDS = Object.freeze({ 2019: 1, 2020: 2, 2021: 53, 2022: 54, 2023: 55, 2024: 56, 2025: 57, 2026: 58 })
const STATUSES = Object.freeze({ nonstrt: '尚未開始', preparation: '尚未開始', running: '進行中', pause: '暫停', nctu: '陽明交大獲勝', nthu: '清華獲勝', draw: '平手', end: '已結束' })

export function parseDetailRoute(pathname) {
  if (typeof pathname !== 'string' || pathname.length > 1024) return null
  let path
  try { path = decodeURIComponent(pathname.split(/[?#]/, 1)[0]) } catch { return null }
  const match = /^\/(2019|202[0-6])\/(game|news)\/([A-Za-z0-9_-]{1,100})\/?$/.exec(path)
  if (!match) return null
  const [, year, type] = match
  let key = match[3]
  if (type === 'news') {
    if (!/^[0-9]{1,15}$/.test(key) || Number(key) < 1) return null
    key = String(Number(key))
  }
  path = `/${year}/${type}/${key}`
  const yearId = YEAR_IDS[year]
  return { year, type, key, path, yearId,
    apiPath: type === 'game' ? `/api/game/slug/${key}?year_id=${yearId}` : `/api/news/${key}` }
}

function trimText(value, limit) {
  if (typeof value !== 'string') return ''
  const text = value.slice(0, 20000)
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')
    .replace(/[\u200b\u200e\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, '')
    .replace(/\s+/g, ' ').trim()
  const characters = Array.from(text)
  return characters.length > limit ? characters.slice(0, limit - 1).join('') + '…' : text
}

// API article content may contain markup. Strip tags without a DOM/HTML parser,
// then expose only bounded text to both HTML escaping and the PNG renderer.
export function summarizeText(value, limit = 180) {
  if (typeof value !== 'string') return ''
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…' }
  const source = value.slice(0, 20000).replace(/&(#x[0-9a-f]{1,6}|#[0-9]{1,7}|[a-z]{2,8});/gi, (entity, key) => {
    if (key[0] !== '#') return entities[key.toLowerCase()] ?? entity
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1))
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : ' '
  })
  const lower = source.toLowerCase()
  let text = ''
  for (let index = 0; index < source.length;) {
    if (source.startsWith('<!--', index)) {
      const end = source.indexOf('-->', index + 4)
      if (end < 0) break
      index = end + 3
      continue
    }
    const tag = source[index] === '<' && /^<\s*(\/?)\s*([a-z][a-z0-9:-]{0,30})(?:\s|\/?>)/i.exec(source.slice(index, index + 64))
    if (tag) {
      const end = source.indexOf('>', index + tag[0].length - 1)
      if (end < 0) break
      if (!tag[1] && ['script', 'style'].includes(tag[2].toLowerCase())) {
        const close = lower.indexOf(`</${tag[2].toLowerCase()}`, end + 1)
        if (close < 0) break
        index = close
      } else index = end + 1
      text += ' '
    } else text += source[index++]
  }
  return trimText(text, limit)
}

function matchesIdentity(route, resource) {
  if (!record(resource)) return false
  if (resource.year_id != null && String(resource.year_id) !== String(route.yearId)) return false
  if (record(resource.year) && resource.year.year != null && String(resource.year.year) !== route.year) return false
  if (route.type === 'news') return own(resource, 'id') && /^(?:[1-9][0-9]{0,14})$/.test(String(resource.id)) &&
    ['number', 'string'].includes(typeof resource.id) && String(Number(resource.id)) === route.key
  const slug = record(resource.item) ? resource.item.slug : resource.slug
  return typeof slug === 'string' && slug === route.key
}

function sourceImage(value) {
  if (typeof value !== 'string' || value.length > 2048 || /[\u0000-\u0020\u007f]/.test(value)) return null
  try {
    const url = new URL(value, SITE_ORIGIN)
    if (url.origin !== SITE_ORIGIN || url.username || url.password || url.hash) return null
    // The API's uploaded files use both .jpg and timestamp_jpg names. Reject
    // HTML/SVG/documents and arbitrary external hosts as preview image sources.
    if (!/(?:[._](?:jpe?g|png|webp|gif))$/i.test(url.pathname)) return null
    return url.href
  } catch { return null }
}

function revisionFor(value) {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index++) hash = Math.imul(hash ^ value.charCodeAt(index), 0x01000193)
  // Cache revision only: this is not a token, signature or authorization check.
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function gameDescription(game, year) {
  const details = [trimText(game.date, 24), trimText(game.time, 16), trimText(game.location, 90)]
  if (STATUSES[game.status]) details.push(game.status === 'nctu' && Number(year) < 2021 ? '交通大學獲勝' : STATUSES[game.status])
  const score = value => (typeof value === 'number' || typeof value === 'string') && /^\d+(?:\.\d+)?$/.test(String(value).trim()) &&
    Number.isFinite(Number(value)) && Number(value) >= 0 ? String(Number(value)) : null
  const nthu = score(game.score_nthu), nctu = score(game.score_nctu)
  const isScored = game.type_of !== 'agenda' && !['opening', 'closing'].includes(game.item?.slug)
  if (isScored && ['running', 'pause', 'nctu', 'nthu', 'draw', 'end'].includes(game.status) && nthu !== null && nctu !== null) {
    details.push(`清華 ${nthu}：${nctu} ${Number(year) < 2021 ? '交大' : '陽明交大'}`)
  }
  const extra = summarizeText(game.description || game.info_entry || game.info_rule, 120)
  if (extra) details.push(extra)
  return trimText(details.filter(Boolean).join(' · '), 180)
}

export function detailMetadata(routeOrPath, resource) {
  const route = typeof routeOrPath === 'string' ? parseDetailRoute(routeOrPath) : parseDetailRoute(routeOrPath?.path)
  if (!route || !matchesIdentity(route, resource)) return null
  const titleText = trimText(route.type === 'news' ? resource.title : resource.name, 180)
  if (!titleText) return null
  const base = sharingMetadata(route.path)
  const title = `${titleText} | ${EDITIONS[route.year].name}梅竹`
  const summary = route.type === 'news'
    ? summarizeText(resource.content || resource.description)
    : gameDescription(resource, route.year)
  const description = summary || `${titleText} — ${route.year} ${EDITIONS[route.year].name}梅竹${route.type === 'news' ? '公告' : '賽事資訊'}。`
  const candidates = [resource.photo, resource.image, resource.image_url, resource.cover_image]
  if (route.type === 'news' && Array.isArray(resource.files)) candidates.push(...resource.files.slice(0, 50))
  const original = candidates.map(sourceImage).find(Boolean)
  const revision = revisionFor(JSON.stringify([route.path, title, description, original || '', trimText(resource.updated_at, 80)]))
  return { ...base, title, contentTitle: titleText, titleTemplate: '%s', description, type: route.type === 'news' ? 'article' : 'website',
    contentType: route.type, resourceKey: route.key, revision,
    image: original || `${SITE_ORIGIN}/og/${route.year}/${route.type}/${route.key}.png?v=${revision}`,
    imageAlt: `${titleText} — ${route.year} ${EDITIONS[route.year].name}梅竹`,
    imageType: original ? null : 'image/png', imageWidth: original ? null : 1200, imageHeight: original ? null : 630 }
}

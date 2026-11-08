import { createServer } from 'node:http'

// Test-only API: mounted read-only into a separate container on a Docker
// internal network. It cannot reach production and is never copied into runtime.
const counts = new Map()
const requests = []
const yearId = year => year === 2019 ? 1 : year === 2020 ? 2 : year - 1968
const yearFromId = id => id === 1 ? 2019 : id === 2 ? 2020 : id + 1968
const json = (response, status, body) => {
  response.writeHead(status, { 'content-type': 'application/json' })
  response.end(JSON.stringify(body))
}

createServer((request, response) => {
  const url = new URL(request.url, 'http://api-fixture:8099')
  if (url.pathname === '/healthz') return response.end('ok\n')
  if (url.pathname === '/__requests') return json(response, 200, { requests, counts: Object.fromEntries(counts) })
  const key = url.pathname + url.search
  counts.set(key, (counts.get(key) || 0) + 1)
  requests.push({ path: key, cookie: request.headers.cookie || null, authorization: request.headers.authorization || null })
  const match = /^\/api\/game\/slug\/([A-Za-z0-9_-]+)$/.exec(url.pathname)
  if (match) {
    const slug = match[1]
    const year = yearFromId(Number(url.searchParams.get('year_id')))
    if (!Number.isInteger(year) || year < 2019 || year > 2026) return json(response, 400, {})
    if (slug === 'missing') return json(response, 404, {})
    if (slug === 'unavailable') return json(response, 503, {})
    if (slug === 'redirect') {
      response.writeHead(302, { location: 'https://should-never-be-contacted.invalid/api/game' })
      return response.end()
    }
    if (slug === 'slow') {
      const timer = setTimeout(() => json(response, 503, {}), 10000)
      response.on('close', () => clearTimeout(timer))
      return
    }
    return json(response, 200, { game: {
      id: year * 100 + 1, year_id: yearId(year), year: { year }, item: { slug },
      name: `${year} 籃球賽 ${slug}`, date: `${year}-03-06`, time: '10:00',
      location: `${year} 運動場`, status: 'nonstrt', type_of: 'official',
      photo: slug === 'photo' ? '/uploads/game-photo.png' : null,
      news: [], team_nctu: null, team_nthu: null
    } })
  }
  const news = /^\/api\/news\/([0-9]+)$/.exec(url.pathname)
  if (news) {
    const id = Number(news[1])
    const year = Math.floor(id / 100)
    if (year < 2019 || year > 2026) return json(response, 404, {})
    const number = id % 100
    return json(response, 200, { news: {
      id, year_id: yearId(year), year: { year }, title: `${year} 公告 ${number}：開賽通知`,
      content: `${year} 第 ${number} 則公告的獨立摘要。\n請留意當日賽事資訊。`,
      created_at: `${year}-03-01T12:00:00+08:00`, files: [], type_of: 'game'
    } })
  }
  json(response, 404, {})
}).listen(8099, '0.0.0.0')

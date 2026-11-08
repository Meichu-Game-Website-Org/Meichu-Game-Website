const DEFAULT_ORIGIN = 'https://meichu.games'

export class UpstreamError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

export function parseApiOrigin(value = DEFAULT_ORIGIN) {
  const url = new URL(value)
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SHARING_API_ORIGIN must be an HTTP(S) origin without credentials, path or query')
  }
  return url.origin
}

// This receives an already validated shared route, never a URL from a request.
export function apiUrlForRoute(route, origin = DEFAULT_ORIGIN) {
  const yearId = { 2019: 1, 2020: 2, 2021: 53, 2022: 54, 2023: 55, 2024: 56, 2025: 57, 2026: 58 }[route?.year]
  if (!yearId || !['game', 'news'].includes(route.type) || typeof route.key !== 'string' ||
      !(route.type === 'game' ? /^[A-Za-z0-9_-]{1,100}$/ : /^[1-9][0-9]{0,14}$/).test(route.key)) {
    throw new UpstreamError('INVALID_ROUTE')
  }
  const path = route.type === 'game'
    ? `/api/game/slug/${route.key}?year_id=${yearId}` : `/api/news/${route.key}`
  return new URL(path, parseApiOrigin(origin)).href
}

export function createApiClient({ origin = DEFAULT_ORIGIN, fetchImpl = fetch,
  timeoutMs = 2500, maxBytes = 512 * 1024 } = {}) {
  const apiOrigin = parseApiOrigin(origin)
  return async route => {
    const url = apiUrlForRoute(route, apiOrigin)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    let reader
    try {
      const response = await fetchImpl(url, {
        method: 'GET', redirect: 'error', credentials: 'omit',
        headers: { accept: 'application/json' }, signal: controller.signal
      })
      if (response.status === 404) {
        await response.body?.cancel()
        return null
      }
      if (!response.ok) throw new UpstreamError('UPSTREAM_STATUS')
      const type = response.headers.get('content-type') || ''
      if (!/^application\/(?:[a-z0-9.+-]+\+)?json\b/i.test(type)) throw new UpstreamError('UPSTREAM_CONTENT_TYPE')
      const length = Number(response.headers.get('content-length'))
      if (Number.isFinite(length) && length > maxBytes) throw new UpstreamError('UPSTREAM_TOO_LARGE')
      if (!response.body) throw new UpstreamError('UPSTREAM_BODY')
      reader = response.body.getReader()
      const chunks = []
      let size = 0
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > maxBytes) throw new UpstreamError('UPSTREAM_TOO_LARGE')
        chunks.push(value)
      }
      const data = JSON.parse(Buffer.concat(chunks, size).toString('utf8'))
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new UpstreamError('UPSTREAM_SHAPE')
      const resource = data[route.type]
      if (resource == null) return null
      if (typeof resource !== 'object' || Array.isArray(resource)) throw new UpstreamError('UPSTREAM_SHAPE')
      return resource
    } catch (error) {
      const aborted = controller.signal.aborted
      controller.abort()
      if (error instanceof UpstreamError) throw error
      throw new UpstreamError(aborted ? 'UPSTREAM_UNAVAILABLE' : 'UPSTREAM_BODY')
    } finally {
      clearTimeout(timer)
      await reader?.cancel().catch(() => {})
    }
  }
}

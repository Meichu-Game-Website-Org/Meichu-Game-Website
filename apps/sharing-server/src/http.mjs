import { createServer } from 'node:http'
import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { apiUrlForRoute } from './api-client.mjs'
import { createMetadataCache, createImageCache } from './cache.mjs'

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
const digest = value => createHash('sha256').update(value).digest('hex')

export async function readTemplates(root) {
  const templates = new Map()
  for (const year of YEARS) {
    for (const type of ['game', 'news']) {
      const filename = resolve(root, String(year), `_${type}`, 'index.html')
      if ((await stat(filename)).size > 1024 * 1024) throw new Error('Sharing template is too large')
      const html = await readFile(filename, 'utf8')
      if (!html.includes('<!-- sharing:start -->') || !html.includes('<!-- sharing:end -->')) throw new Error('Sharing template markers are missing')
      templates.set(`${year}/${type}`, html)
    }
  }
  return templates
}

export function parseRequestTarget(target, parseRoute) {
  if (typeof target !== 'string' || target.length > 2048 || !target.startsWith('/') ||
      target.startsWith('//') || target.includes('#')) return null
  const pathname = target.split('?', 1)[0]
  const image = /^\/og\/(2019|202[0-6])\/(game|news)\/([^/]+)\.png$/.exec(pathname)
  const detailPath = image ? `/${image[1]}/${image[2]}/${image[3]}` : pathname
  const route = parseRoute(detailPath)
  if (!route) return null
  try { apiUrlForRoute(route) } catch { return null }
  if (route.path !== `/${route.year}/${route.type}/${route.key}`) return null
  return { route, image: Boolean(image) }
}

export function createSharingServer({ templates, parseRoute, mapMetadata, genericMetadata,
  replaceHead, loadResource, renderImage, now = Date.now, cacheOptions = {}, imageCacheOptions = {} }) {
  const metadataCache = createMetadataCache({
    ...cacheOptions, now,
    load: async route => {
      const resource = await loadResource(route)
      return resource == null ? null : mapMetadata(route, resource)
    }
  })
  const images = createImageCache(imageCacheOptions)
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const response = (req, res, status, body, contentType, cacheControl = 'no-store', headers = {}) => {
    const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body)
    const etag = `"${digest(bytes)}"`
    const base = { 'content-type': contentType, 'cache-control': cacheControl,
      'x-content-type-options': 'nosniff', ...headers }
    if (status === 200 && cacheControl !== 'no-store') {
      base.etag = etag
      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304, base)
        res.end()
        return
      }
    }
    res.writeHead(status, { ...base, 'content-length': bytes.length })
    res.end(req.method === 'HEAD' ? undefined : bytes)
  }
  const server = createServer({ maxHeaderSize: 8192, requestTimeout: 10000,
    headersTimeout: 5000, keepAliveTimeout: 5000 }, async (req, res) => {
    try {
      if (!['GET', 'HEAD'].includes(req.method)) {
        response(req, res, 405, 'Method not allowed\n', 'text/plain; charset=utf-8', 'no-store', { allow: 'GET, HEAD', connection: 'close' })
        req.resume()
        return
      }
      if (req.headers['transfer-encoding'] || Number(req.headers['content-length']) > 0) {
        response(req, res, 400, 'Request body is not supported\n', 'text/plain; charset=utf-8', 'no-store', { connection: 'close' })
        req.resume()
        return
      }
      if (req.url === '/healthz' || req.url?.startsWith('/healthz?')) {
        response(req, res, 200, 'ok\n', 'text/plain; charset=utf-8')
        return
      }
      const target = parseRequestTarget(req.url, parseRoute)
      if (!target) { response(req, res, 404, 'Not found\n', 'text/plain; charset=utf-8'); return }
      const { route, image } = target
      const result = await metadataCache.get(route)
      if (res.destroyed) return
      if (image) {
        if (!result.metadata) {
          response(req, res, result.kind === 'missing' ? 404 : 503, 'Image unavailable\n', 'text/plain; charset=utf-8', 'no-store', { 'retry-after': '5' })
          return
        }
        // The complete trusted metadata determines the key, not a user-supplied version.
        const key = `${route.path}:${digest(JSON.stringify(result.metadata))}`
        let png = images.get(key)
        if (!png) {
          png = renderImage(result.metadata)
          if (!Buffer.isBuffer(png) || png.length > 4 * 1024 * 1024 || !png.subarray(0, 8).equals(pngSignature)) throw new Error('Invalid rendered image')
          images.set(key, png)
        }
        response(req, res, 200, png, 'image/png', result.kind === 'stale' ? 'public, max-age=30' : 'public, max-age=120', { 'x-meichu-sharing': result.kind })
        return
      }
      const template = templates.get(`${route.year}/${route.type}`)
      if (!template) throw new Error('Sharing template is missing')
      const fallback = genericMetadata(route.path)
      const metadata = result.metadata || fallback
      const html = replaceHead(template, metadata)
      const missing = result.kind === 'missing'
      const temporary = result.kind === 'unavailable'
      const headers = { 'x-meichu-sharing': temporary ? 'fallback' : result.kind }
      if (missing) headers['x-robots-tag'] = 'noindex'
      if (temporary) headers['retry-after'] = '5'
      const cacheControl = missing || temporary ? 'no-store'
        : result.kind === 'stale' ? 'public, max-age=30' : 'public, max-age=60'
      response(req, res, missing ? 404 : temporary ? 503 : 200, html, 'text/html; charset=utf-8', cacheControl, headers)
    } catch {
      // Keep per-request mapper/render errors away from the process supervisor.
      if (!res.headersSent && !res.destroyed) response(req, res, 503, 'Sharing preview temporarily unavailable\n', 'text/plain; charset=utf-8', 'no-store', { 'retry-after': '5' })
      else res.destroy()
    }
  })
  server.maxConnections = 256
  server.maxRequestsPerSocket = 100
  server.on('clientError', (_error, socket) => {
    if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n')
  })
  return server
}

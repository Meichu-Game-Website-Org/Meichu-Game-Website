const http = require('node:http')
const path = require('node:path')
const { readdirSync, existsSync } = require('node:fs')
const httpProxy = require('http-proxy')

const ARCHIVE_YEARS = new Set(['2019', '2020', '2021', '2022', '2023', '2024', '2025'])
const LEGACY_MODULE_PATHS = ['/assets/', '/src/', '/node_modules/', '/@vite/', '/@fs/', '/@id/']

function discoverSites(appsDirectory = path.join(__dirname, 'apps')) {
  return new Map(readdirSync(appsDirectory, { withFileTypes: true }).flatMap(entry => {
    const match = entry.name.match(/^site-(\d{4})$/)
    if (!entry.isDirectory() || !match || Number(match[1]) < 2026 ||
      !existsSync(path.join(appsDirectory, entry.name, 'package.json'))) return []
    return [[match[1], `http://127.0.0.1:${20000 + Number(match[1])}`]]
  }))
}

function discoverPublicFiles(directory = path.join(__dirname, 'apps/old-site/public'), prefix = '') {
  return new Set(readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = `${prefix}/${entry.name}`
    return entry.isDirectory() ? [...discoverPublicFiles(path.join(directory, entry.name), name)] : [name]
  }))
}

function routeRequest(url, { sites, publicFiles, legacyTarget, defaultYear = '2026' }, websocket = false) {
  // Only the URL path selects an upstream. Cookies and Referer never affect it.
  if (!url.startsWith('/') || url.startsWith('//')) return { status: 400 }
  const pathname = url.split('?')[0]
  const search = url.slice(pathname.length)
  if (pathname === '/') {
    if (websocket) return { target: legacyTarget }
    return sites.has(defaultYear) ? { status: 302, location: `/${defaultYear}/${search}` } : { status: 404 }
  }
  const match = pathname.match(/^\/(\d+)(?:\/|$)/)
  if (match) {
    const year = match[1]
    if (sites.has(year)) {
      if (pathname === `/${year}` && !websocket) return { status: 308, location: `/${year}/${search}` }
      return { target: sites.get(year) }
    }
    return ARCHIVE_YEARS.has(year) ? { target: legacyTarget } : { status: 404 }
  }
  if (LEGACY_MODULE_PATHS.some(prefix => pathname.startsWith(prefix)) || publicFiles.has(pathname)) {
    return { target: legacyTarget }
  }
  return { status: 404 }
}

function unavailable(_error, _req, response) {
  if (response.destroyed) return
  if (typeof response.writeHead === 'function') {
    if (response.headersSent) return response.destroy()
    response.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Bad Gateway: The selected development site is not running.')
  } else {
    response.end('HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\nContent-Length: 0\r\n\r\n')
  }
}

function createDevelopmentServer({
  sites = discoverSites(), publicFiles = discoverPublicFiles(),
  legacyTarget = 'http://127.0.0.1:3030', defaultYear = '2026',
  proxy = httpProxy.createProxyServer({})
} = {}) {
  const routes = { sites, publicFiles, legacyTarget, defaultYear }
  const server = http.createServer((req, res) => {
    const route = routeRequest(req.url, routes)
    if (!route.target) {
      res.writeHead(route.status, route.location ? { Location: route.location } : { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end(route.location ? '' : 'Not found')
      return
    }
    // Vite base and router history base include the year; preserve it for HTTP and HMR.
    proxy.web(req, res, { target: route.target }, unavailable)
  })
  server.on('upgrade', (req, socket, head) => {
    const route = routeRequest(req.url, routes, true)
    if (!route.target) {
      socket.end(`HTTP/1.1 ${route.status} Not Found\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
      return
    }
    proxy.ws(req, socket, head, { target: route.target }, unavailable)
  })
  proxy.on('error', unavailable)
  server.on('close', () => proxy.close())
  return server
}

if (require.main === module) {
  const server = createDevelopmentServer()
  server.listen(8080, '127.0.0.1', () => console.log('Proxy server running on http://localhost:8080'))
}

module.exports = { createDevelopmentServer, discoverSites, routeRequest }

const { readFileSync } = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const vm = require('node:vm')

const root = path.resolve(__dirname, '../..')

async function component(file, dependencies = {}) {
  const resource = await import(pathToFileURL(path.join(root, 'packages/services/src/resource.js')))
  const content = await import(pathToFileURL(path.join(root, 'packages/services/src/content.js')))
  const helpers = { ...resource, ...content, RequestState: {} }
  const helperSource = readFileSync(path.join(root, 'apps/old-site/src/utils/archive-resource.js'), 'utf8')
    .replace(/^import .*$/gm, '').replace(/export const (\w+) =/g, 'globalThis.$1 =').replace(/export function (\w+)/g, 'function $1')
  vm.runInNewContext(helperSource, helpers)
  const source = readFileSync(path.join(root, file), 'utf8')
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
  const imports = {}
  for (const match of script.matchAll(/^import (\w+) from /gm)) imports[match[1]] = {}
  const context = { ...imports, ...helpers, URL, GAME_STATUS: {}, NEWS_TYPE_OF: {}, ...dependencies }
  vm.runInNewContext(script.replace(/^import .*$/gm, '').replace('export default', 'globalThis.component ='), context)
  const options = context.component
  const state = { resource: resource.createResource(), $route: { params: { slug: 'test-game', id: '1' } }, ...options.data?.() }
  for (const [name, getter] of Object.entries(options.computed || {})) Object.defineProperty(state, name, { get: () => getter.call(state) })
  for (const [name, method] of Object.entries(options.methods || {})) state[name] = method.bind(state)
  return { options, state, resource }
}

module.exports = { component }

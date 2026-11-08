import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApiClient } from './api-client.mjs'
import { createSharingServer, readTemplates } from './http.mjs'
import { createCardRenderer } from './render-card.mjs'
import { parseDetailRoute, detailMetadata } from '../../../packages/services/src/detail-metadata.mjs'
import { sharingMetadata } from '../../../packages/services/src/metadata.mjs'
import { replaceSharingHead } from '../../../scripts/lib/sharing-html.mjs'

export async function startSharingServer(env = process.env) {
  const port = Number(env.SHARING_PORT || 8787)
  const host = env.SHARING_HOST || '127.0.0.1'
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid SHARING_PORT')
  const assetRoot = resolve(env.SHARING_ASSET_ROOT || fileURLToPath(new URL('../../../', import.meta.url)))
  const distRoot = resolve(env.SHARING_DIST_ROOT || '/usr/share/nginx/html')
  const templates = await readTemplates(distRoot)
  const renderImage = await createCardRenderer({ assetRoot, distRoot })
  const server = createSharingServer({ templates, parseRoute: parseDetailRoute, mapMetadata: detailMetadata,
    genericMetadata: sharingMetadata, replaceHead: replaceSharingHead, renderImage,
    loadResource: createApiClient({ origin: env.SHARING_API_ORIGIN }) })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, () => { server.off('error', reject); resolve() })
  })
  return server
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await startSharingServer()
  console.log('Sharing service ready')
  let closing = false
  const close = () => {
    if (closing) return
    closing = true
    server.close(() => process.exit(0))
    const timer = setTimeout(() => { server.closeAllConnections(); process.exit(0) }, 3000)
    timer.unref()
  }
  process.on('SIGTERM', close)
  process.on('SIGINT', close)
}

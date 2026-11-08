import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { replaceSharingHead, sharingPages } from './lib/sharing-html.mjs'

const app = process.argv[2]
if (!['old-site', 'site-2026'].includes(app)) throw new Error('Expected old-site or site-2026')
const root = fileURLToPath(new URL('..', import.meta.url))
const dist = resolve(root, 'apps', app, 'dist')
const source = await readFile(resolve(dist, 'index.html'), 'utf8')
if (!source.includes('<!-- sharing:start -->')) throw new Error('Missing sharing head marker')
const years = app === 'old-site' ? [2019, 2020, 2021, 2022, 2023, 2024, 2025] : [2026]
for (const page of sharingPages(years)) {
  const target = resolve(dist, app === 'site-2026' ? page.file.replace(/^2026\//, '') : page.file)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, replaceSharingHead(source, page.metadata))
}
console.log(`Generated sharing HTML for ${years.join(', ')} without API requests`)

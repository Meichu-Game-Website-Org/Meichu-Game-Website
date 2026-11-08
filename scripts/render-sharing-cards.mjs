// Regenerate committed social images using the existing edition artwork.
// Requires the repository's Playwright and an installed Chromium browser.
import { chromium } from 'playwright'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { EDITIONS } from '../packages/services/src/metadata.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const artwork = {
  2019: 'apps/old-site/public/banner2019.jpg',
  2020: 'apps/old-site/src/assets/2020/cover.jpg',
  2021: 'apps/old-site/src/assets/2021/fulllogo.png',
  2022: 'apps/old-site/public/banner2022.jpg',
  2023: 'apps/old-site/src/assets/2023/banner.svg',
  2024: 'apps/old-site/src/assets/2024/index_cover.svg',
  2025: 'apps/old-site/src/assets/2025/index-cover-desktop.png',
  2026: 'apps/site-2026/src/assets/index-cover-desktop.webp'
}
const temporary = await mkdtemp(resolve(tmpdir(), 'meichu-sharing-'))
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  headless: true
})
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  const font = pathToFileURL(resolve(root, 'packages/assets/fonts/KozGoPr6N-Bold.otf'))
  for (const [year, edition] of Object.entries(EDITIONS)) {
    const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><style>
      @font-face { font-family: Meichu; src: url('${font}'); font-weight: 700; }
      * { box-sizing: border-box; } html,body { margin:0; width:1200px; height:630px; }
      body { background:#faf8ef; color:#182820; font-family:Meichu,sans-serif; }
      main { height:460px; display:flex; align-items:center; justify-content:center; padding:20px 48px; }
      img { width:100%; height:100%; object-fit:contain; }
      footer { height:170px; padding:26px 64px; border-top:2px solid #182820; display:flex; align-items:center; justify-content:space-between; }
      h1 { font-size:60px; font-weight:700; margin:0; line-height:1.15; }
      p { font-size:26px; margin:8px 0 0; line-height:1.2; }
      strong { font-size:64px; line-height:1; font-weight:700; }
    </style></head><body><main><img src="${pathToFileURL(resolve(root, artwork[year]))}" alt="${edition.name}梅竹主視覺"></main>
      <footer><div><h1>${edition.name}梅竹</h1><p>Meichu Games · meichu.games</p></div><strong>${year}</strong></footer>
    </body></html>`
    const input = resolve(temporary, `${year}.html`)
    await writeFile(input, html)
    await page.goto(pathToFileURL(input).href)
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map(image => image.decode()))
    })
    const app = year === '2026' ? 'site-2026' : 'old-site'
    const target = resolve(root, 'apps', app, 'public/sharing', `${year}.png`)
    await mkdir(dirname(target), { recursive: true })
    await page.screenshot({ path: target })
    console.log(target)
  }
} finally {
  await browser.close()
  await rm(temporary, { recursive: true, force: true })
}

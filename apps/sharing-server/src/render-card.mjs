import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { EDITIONS } from '../../../packages/services/src/metadata.mjs'

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630
export const MAX_CARD_BYTES = 2 * 1024 * 1024
const ROOT = fileURLToPath(new URL('../../../', import.meta.url))
const FONT_FAMILY = 'Kozuka Gothic Pr6N'
const FONT_FAMILIES = `${FONT_FAMILY}, Noto Sans TC`
const BACKGROUND = '#faf8ef'
const INK = '#182820'
const MUTED = '#375244'
const graphemes = new Intl.Segmenter('zh-Hant', { granularity: 'grapheme' })
// Largest advance of each printable ASCII glyph in the project's existing
// KozGoPr6N Bold/Regular fonts. CJK glyphs reserve a full em. This keeps long
// English words and Chinese copy inside the same measured text column.
const ASCII_WIDTHS = [0.233,0.283,0.414,0.567,0.572,0.901,0.699,0.218,0.331,0.331,0.483,0.68,0.272,0.342,0.271,0.381,0.572,0.572,0.572,0.572,0.572,0.572,0.572,0.572,0.572,0.572,0.271,0.272,0.68,0.68,0.68,0.456,0.813,0.663,0.625,0.621,0.712,0.544,0.537,0.69,0.708,0.298,0.414,0.623,0.522,0.874,0.711,0.735,0.6,0.735,0.614,0.548,0.552,0.698,0.638,0.923,0.612,0.599,0.59,0.331,0.376,0.331,0.68,0.571,0.342,0.548,0.615,0.484,0.613,0.551,0.354,0.606,0.608,0.281,0.294,0.55,0.281,0.903,0.608,0.593,0.615,0.612,0.386,0.443,0.385,0.604,0.54,0.803,0.529,0.532,0.478,0.331,0.288,0.331,0.68]

const escapeXml = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
})[character])

function text(value, fallback) {
  if (typeof value !== 'string') return fallback
  // Input is API text, never SVG. Bound work before Unicode processing; avoid
  // invisible direction controls and unsupported color-emoji glyph boxes.
  const normalized = value.slice(0, 2000).normalize('NFC')
    .replace(/[\ud800-\udfff\ufffe\uffff]/gu, '')
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, ' ')
    .replace(/\s+/g, ' ').trim()
  const printable = [...graphemes.segment(normalized)].map(({ segment }) =>
    /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u.test(segment) ? '' : segment
  ).join('').replace(/[\ufe0e\ufe0f]/g, '').replace(/\s+/g, ' ').trim()
  return printable || fallback
}

function advance(segment) {
  const code = segment.codePointAt(0)
  return segment.length === 1 && code >= 32 && code <= 126 ? ASCII_WIDTHS[code - 32] : 1
}

// Lines are truncated with an ellipsis instead of shrinking arbitrary API text
// to unreadable sizes. Grapheme segmentation keeps accents and CJK intact.
export function wrapCardText(value, maxUnits, maxLines) {
  if (typeof value !== 'string' || !Number.isFinite(maxUnits) || maxUnits < 1 || !Number.isInteger(maxLines) || maxLines < 1 || maxLines > 3) {
    throw new TypeError('Invalid sharing-card text layout')
  }
  const segments = [...graphemes.segment(value.slice(0, 2000))].map(part => part.segment)
  const lines = []
  let cursor = 0
  while (cursor < segments.length && lines.length < maxLines) {
    const current = []
    let width = 0
    while (cursor < segments.length && width + advance(segments[cursor]) <= maxUnits) {
      width += advance(segments[cursor])
      current.push(segments[cursor++])
    }
    // Prefer a word boundary for Latin copy; an exceptionally long word still
    // breaks at a grapheme boundary instead of escaping the fixed text column.
    if (cursor < segments.length && /[A-Za-z0-9]/.test(segments[cursor]) && /[A-Za-z0-9]/.test(current.at(-1) || '')) {
      const space = current.lastIndexOf(' ')
      if (space > current.length / 3) {
        cursor -= current.length - space - 1
        current.splice(space)
        width = current.reduce((total, segment) => total + advance(segment), 0)
      }
    }
    if (lines.length === maxLines - 1 && cursor < segments.length) {
      while (current.length && width + 1 > maxUnits) width -= advance(current.pop())
      lines.push(current.join('').trimEnd() + '…')
    } else lines.push(current.join('').trim())
  }
  return lines
}

function cardSvg(metadata, artwork) {
  const year = typeof metadata?.year === 'number' || typeof metadata?.year === 'string' ? String(metadata.year) : ''
  if (!Object.hasOwn(EDITIONS, year)) throw new TypeError('Unsupported sharing-card year')
  if (!['game', 'news'].includes(metadata.contentType)) throw new TypeError('Unsupported sharing-card type')
  const edition = EDITIONS[year]
  const label = metadata.contentType === 'news' ? '公告' : '賽事資訊'
  const fullTitle = text(metadata.contentTitle || metadata.title, label)
  const suffix = ` | ${edition.name}梅竹`
  const title = fullTitle.endsWith(suffix) ? fullTitle.slice(0, -suffix.length) : fullTitle
  const description = text(metadata.description, `${year} ${edition.name}梅竹${label}`)
  const titleLines = wrapCardText(title, 11.4, 3)
  const descriptionLines = wrapCardText(description, 23.2, 3)
  const line = (content, y, size, weight, color) => `<text x="64" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(content)}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><clipPath id="title"><rect x="64" y="44" width="650" height="240"/></clipPath><clipPath id="description"><rect x="64" y="306" width="650" height="142"/></clipPath></defs>
    <rect width="1200" height="630" fill="${BACKGROUND}"/>
    <g font-family="${FONT_FAMILIES}">
      <g clip-path="url(#title)">${titleLines.map((value, index) => line(value, 116 + index * 70, 56, 700, INK)).join('')}</g>
      <g clip-path="url(#description)">${descriptionLines.map((value, index) => line(value, 346 + index * 42, 27, 400, MUTED)).join('')}</g>
      <image x="740" y="138" width="396" height="260" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${artwork}"/>
      <path d="M64 510H1136" fill="none" stroke="${INK}" stroke-width="2"/>
      ${line(`${year} ${edition.name}梅竹`, 562, 32, 700, INK)}
      ${line('Meichu Games · meichu.games', 600, 23, 400, MUTED)}
      <text x="1136" y="578" text-anchor="end" font-size="32" font-weight="700" fill="${INK}">${label}</text>
    </g>
  </svg>`
}

/**
 * Load the existing project fonts and eight local brand images once at startup.
 * Paths are operator configuration only; no request/API field may select a file.
 * Rendered metadata.image is deliberately ignored: there is no network access.
 */
export async function createCardRenderer({ assetRoot = ROOT, distRoot = null } = {}) {
  const fonts = ['KozGoPr6N-Bold.otf', 'KozGoPr6N-Regular.otf', 'NotoSansTC-Bold.otf', 'NotoSansTC-Regular.otf'].map(name => resolve(assetRoot, 'packages/assets/fonts', name))
  // Fail startup with a clear missing-asset error rather than silently using a
  // system fallback font that may not contain Traditional Chinese.
  await Promise.all(fonts.map(file => readFile(file)))
  const entries = await Promise.all(Object.keys(EDITIONS).map(async year => {
    const file = distRoot
      ? resolve(distRoot, year === '2026' ? '2026/sharing' : 'sharing', `${year}.png`)
      : resolve(assetRoot, 'apps', year === '2026' ? 'site-2026' : 'old-site', 'public/sharing', `${year}.png`)
    const bytes = await readFile(file)
    if (bytes.length > MAX_CARD_BYTES || !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
      throw new Error(`Invalid local sharing artwork for ${year}`)
    }
    return [year, bytes.toString('base64')]
  }))
  const artwork = Object.fromEntries(entries)
  return metadata => {
    const year = typeof metadata?.year === 'number' || typeof metadata?.year === 'string' ? String(metadata.year) : ''
    const svg = cardSvg(metadata, artwork[year])
    const resvg = new Resvg(svg, { font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: FONT_FAMILY } })
    const png = resvg.render().asPng()
    if (png.length > MAX_CARD_BYTES) throw new Error('Sharing card exceeded its output limit')
    return png
  }
}

import { EDITIONS, sharingMetadata, SHARE_URL_PLACEHOLDER } from '../../packages/services/src/metadata.mjs'

const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character])

export function sharingHead(metadata) {
  const property = (name, value) => `<meta property="${name}" content="${escape(value)}">`
  const name = (key, value) => `<meta name="${key}" content="${escape(value)}">`
  return [
    `<title>${escape(metadata.title)}</title>`, name('description', metadata.description),
    `<link rel="canonical" href="${escape(metadata.url)}">`,
    property('og:title', metadata.title), property('og:description', metadata.description),
    property('og:site_name', metadata.siteName), property('og:type', 'website'),
    property('og:url', metadata.url), property('og:locale', 'zh_TW'),
    property('og:image', metadata.image), property('og:image:type', 'image/png'),
    property('og:image:width', '1200'), property('og:image:height', '630'), property('og:image:alt', metadata.imageAlt),
    name('twitter:card', 'summary_large_image'), name('twitter:title', metadata.title),
    name('twitter:description', metadata.description), name('twitter:image', metadata.image), name('twitter:image:alt', metadata.imageAlt)
  ].join('\n    ')
}

export function replaceSharingHead(html, metadata) {
  return html.replace(/<html\b[^>]*>/i, '<html lang="zh-Hant">')
    .replace(/<!--\s*sharing:start\s*-->[\s\S]*?<!--\s*sharing:end\s*-->/, () => `<!-- sharing:start -->\n    ${sharingHead(metadata)}\n    <!-- sharing:end -->`)
    .replace(/(<link\s+rel="icon"\s+href=")[^"]*(")/, `$1${metadata.icon}$2`)
}

export function sharingPages(years) {
  return years.flatMap(year => {
    const home = `/${year}/`
    const pages = ['', ...EDITIONS[year].routes].map(route => ({
      path: `${home}${route}`, file: `${year}/${route ? `${route}/` : ''}index.html`,
      metadata: sharingMetadata(`${home}${route}`)
    }))
    for (const type of ['game', 'news']) {
      pages.push({
        path: `${home}_${type}/`, file: `${year}/_${type}/index.html`,
        metadata: { ...sharingMetadata(`${home}${type}/${type === 'game' ? 'preview' : '1'}`), url: SHARE_URL_PLACEHOLDER }
      })
    }
    return pages
  })
}

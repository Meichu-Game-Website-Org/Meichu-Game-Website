export const SITE_ORIGIN = 'https://meichu.games'
export const SHARE_URL_PLACEHOLDER = '__MEICHU_SHARE_URL__'
export const EDITIONS = Object.freeze({
  2019: { name: '己亥', icon: '/favicon2019.ico', routes: ['game', 'news', 'about'] },
  2020: { name: '庚子', icon: '/favicon2020.png', routes: ['game', 'news', 'about', 'history'] },
  2021: { name: '辛丑', icon: '/favicon2021.png', routes: ['game', 'news', 'about', 'history'] },
  2022: { name: '壬寅', icon: '/favicon2022.ico', routes: ['game', 'news', 'about', 'history'] },
  2023: { name: '癸卯', icon: '/favicon2023.ico', routes: ['game', 'news', 'about', 'history', 'course'] },
  2024: { name: '甲辰', icon: '/favicon2024_128.ico', routes: ['game', 'news', 'about', 'history', 'course'] },
  2025: { name: '乙巳', icon: '/favicon2025.png', routes: ['game', 'about', 'history'] },
  2026: { name: '丙午', icon: '/2026/2026-favicon.svg', routes: ['game', 'about', 'history'] }
})
const PAGE_TITLES = { game: '賽事列表', news: '公告', about: '關於梅竹', history: '歷史紀錄', course: '賽程' }

// Only implemented routes may identify a share object. Do not trust Host,
// query parameters or API-provided URLs as the canonical origin/path.
export function sharingMetadata(pathname) {
  if (typeof pathname !== 'string') return null
  let path
  try { path = decodeURIComponent(pathname.split(/[?#]/, 1)[0]) } catch { return null }
  const match = /^\/(2019|202[0-6])(?:\/(.*))?$/.exec(path)
  if (!match) return null
  const year = match[1]
  const edition = EDITIONS[year]
  let route = (match[2] || '').replace(/\/$/, '')
  let pageTitle = ''
  if (route) {
    if (edition.routes.includes(route)) pageTitle = PAGE_TITLES[route]
    else if (/^game\/[A-Za-z0-9_-]{1,100}$/.test(route)) pageTitle = '賽事資訊'
    else if (/^news\/[0-9]{1,15}$/.test(route) && Number(route.slice(5)) > 0) {
      pageTitle = '公告'
      route = `news/${Number(route.slice(5))}`
    }
    else return null
  }
  const siteName = `${edition.name}梅竹 | ${year} Meichu Games`
  return {
    year, pageTitle, title: pageTitle ? `${pageTitle} | ${edition.name}梅竹` : siteName,
    titleTemplate: '%s',
    description: `${edition.name}梅竹官方網站，提供賽程、票務、戰況、轉播等梅竹賽之即時資訊。`,
    siteName, url: `${SITE_ORIGIN}/${year}/${route}`,
    image: `${SITE_ORIGIN}${year === '2026' ? '/2026' : ''}/sharing/${year}.png`,
    imageAlt: `${year} ${edition.name}梅竹主視覺`, imageType: 'image/png', imageWidth: 1200, imageHeight: 630,
    type: 'website', icon: edition.icon
  }
}

// Copy only known own fields; API text never becomes HTML or arbitrary links.
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key)

export function selectMetadata(records, defaults) {
  const result = { ...defaults }
  for (const value of records) {
    if (!value || typeof value !== 'object') continue
    for (const key of ['title', 'titleTemplate', 'description']) {
      if (own(value, key) && typeof value[key] === 'string') result[key] = value[key]
    }
    if (own(value, 'type') && ['website', 'article'].includes(value.type)) result.type = value.type
    if (own(value, 'image') && typeof value.image === 'string') {
      try {
        const image = new URL(value.image)
        if (image.origin === SITE_ORIGIN && !image.username && !image.password && !image.hash) {
          result.image = image.href
          result.imageAlt = own(value, 'imageAlt') && typeof value.imageAlt === 'string' ? value.imageAlt : ''
          result.imageType = own(value, 'imageType') && ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(value.imageType) ? value.imageType : null
          for (const key of ['imageWidth', 'imageHeight']) {
            result[key] = own(value, key) && Number.isInteger(value[key]) && value[key] > 0 && value[key] <= 4096 ? value[key] : null
          }
        }
      } catch { /* Keep the route's safe fallback image. */ }
    }
    if (own(value, 'link') && Array.isArray(value.link)) {
      const icon = value.link.find(link => link && own(link, 'rel') && own(link, 'href') &&
        link.rel === 'icon' && typeof link.href === 'string' && /^\/(?!\/)/.test(link.href))
      if (icon) result.icon = icon.href
    }
  }
  result.title = result.titleTemplate
    ? result.titleTemplate.replace(/%s/g, () => result.title || '')
    : result.title
  return result
}

export function installMetadata(app, documentRef = document, router = null) {
  const description = documentRef.querySelector('meta[name="description"], meta[property="description"]')
  const icon = documentRef.querySelector('link[rel="icon"]')
  const defaults = {
    title: documentRef.title,
    titleTemplate: '%s',
    description: description?.getAttribute('content') || '',
    icon: icon?.getAttribute('href') || ''
  }
  const entries = new Map()
  const states = new WeakMap()
  const setMeta = (attribute, key, value) => {
    let element = documentRef.querySelector(`meta[${attribute}="${key}"]`)
    if (value === null || value === undefined || value === '') {
      element?.remove()
      return
    }
    if (!element) {
      element = documentRef.createElement('meta')
      element.setAttribute(attribute, key)
      documentRef.head.appendChild(element)
    }
    element.setAttribute('content', value)
  }
  let pending = false
  let order = 0
  const update = () => {
    if (pending) return
    pending = true
    Promise.resolve().then(() => {
      pending = false
      const records = [...entries.values()].sort((a, b) => a.depth - b.depth || a.order - b.order)
      const route = sharingMetadata(documentRef.location?.pathname)
      const routeDefaults = route ? { ...route, title: route.pageTitle || route.title } : defaults
      const metadata = selectMetadata(records.map(entry => entry.value), routeDefaults)
      documentRef.title = metadata.title
      setMeta('name', 'description', metadata.description)
      if (icon) icon.setAttribute('href', metadata.icon)
      if (!route) return
      for (const [key, value] of Object.entries({
        title: metadata.title, description: metadata.description, type: metadata.type || 'website',
        url: route.url, site_name: route.siteName, locale: 'zh_TW', image: metadata.image,
        'image:type': metadata.imageType, 'image:width': metadata.imageWidth,
        'image:height': metadata.imageHeight, 'image:alt': metadata.imageAlt
      })) setMeta('property', `og:${key}`, value)
      for (const [key, value] of Object.entries({ card: 'summary_large_image', title: metadata.title,
        description: metadata.description, image: metadata.image, 'image:alt': metadata.imageAlt })) {
        setMeta('name', `twitter:${key}`, value)
      }
      let canonical = documentRef.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = documentRef.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        documentRef.head.appendChild(canonical)
      }
      canonical.setAttribute('href', route.url)
    })
  }
  router?.afterEach(update)
  app.mixin({
    created() {
      const option = this.$options.metaInfo
      if (!option) return
      let depth = 0
      for (let parent = this.$parent; parent; parent = parent.$parent) depth++
      const state = { active: true, depth, order: order++, value: null, stop: null }
      states.set(this, state)
      state.stop = this.$watch(() => typeof option === 'function' ? option.call(this) : option, value => {
        state.value = value
        if (state.active) {
          entries.set(this, state)
          update()
        }
      }, { immediate: true, deep: true })
    },
    activated() {
      const state = states.get(this)
      if (!state) return
      state.active = true
      entries.set(this, state)
      update()
    },
    deactivated() {
      const state = states.get(this)
      if (!state) return
      state.active = false
      entries.delete(this)
      update()
    },
    beforeUnmount() {
      const state = states.get(this)
      if (!state) return
      state.stop()
      entries.delete(this)
      states.delete(this)
      update()
    }
  })
}

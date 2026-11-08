const CONTENT_ORIGIN = 'https://meichu.games'
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key)
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value)

function list(value) {
  if (!Array.isArray(value)) {
    const error = new Error('Unexpected API response')
    error.code = 'INVALID_RESPONSE'
    throw error
  }
  return value
}

// Vue escapes attribute text but does not prevent javascript: URL execution.
// Resolve API-relative paths against the API's public origin, never the current
// year's route. Reject non-web protocols and malformed optional URL values.
export function safeHttpUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim(), CONTENT_ORIGIN)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

function urlFields(value, fields) {
  if (!record(value)) return value
  const result = { ...value }
  for (const field of fields) {
    if (own(value, field)) result[field] = safeHttpUrl(value[field])
  }
  return result
}

export function sanitizeNewsUrls(value) {
  const result = urlFields(value, ['link'])
  if (!record(result)) return result
  if (value.files != null) result.files = list(value.files).map(safeHttpUrl).filter(Boolean)
  return result
}

export function sanitizeGameUrls(value) {
  const result = urlFields(value, ['photo', 'location_url', 'live_url'])
  if (!record(result)) return result
  for (const key of ['team_nctu', 'team_nthu']) {
    if (own(value, key)) result[key] = urlFields(value[key], ['photo', 'link_facebook', 'link_instagram', 'link_website'])
  }
  if (value.news != null) result.news = sanitizeNewsListUrls(value.news)
  // A missing/blocked source must not create an empty iframe or reload this SPA.
  if (value.is_live && !result.live_url) result.is_live = false
  return result
}

export function sanitizeGameListUrls(games) {
  return list(games).map(sanitizeGameUrls)
}

export function sanitizeNewsListUrls(news) {
  return list(news).map(sanitizeNewsUrls)
}

export function sanitizeOptionUrls(data) {
  if (!record(data) || !Array.isArray(data.options)) return data
  return { ...data, options: data.options.map(option => {
    if (!record(option) || !['banners', 'banner-links'].includes(option.key) || !Array.isArray(option.value)) return option
    // Keep positions aligned: an invalid image/link must not shift its partner.
    return { ...option, value: option.value.map(safeHttpUrl) }
  }) }
}

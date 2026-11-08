// Only compact mapped metadata is retained, never API bodies, requests or headers.
export function createMetadataCache({ load, now = Date.now, maxEntries = 256,
  maxConcurrent = 8, ttlMs = 120000, staleMs = 1800000, failureTtlMs = 5000,
  missingTtlMs = 15000 } = {}) {
  const entries = new Map()
  const inFlight = new Map()
  let active = 0
  function put(key, entry) {
    entries.delete(key)
    entries.set(key, entry)
    while (entries.size > maxEntries) entries.delete(entries.keys().next().value)
  }
  function fallback(entry, at) {
    if (entry?.metadata && at - entry.updatedAt <= staleMs) return { kind: 'stale', metadata: entry.metadata }
    return { kind: 'unavailable', metadata: null }
  }
  return {
    async get(route) {
      const key = route.path
      const at = now()
      const cached = entries.get(key)
      if (cached && cached.expiresAt > at) {
        put(key, cached)
        if (cached.kind === 'failure') return fallback(cached, at)
        return { kind: cached.kind, metadata: cached.metadata }
      }
      if (inFlight.has(key)) return inFlight.get(key)
      if (active >= maxConcurrent) return fallback(cached, at)
      active++
      const request = Promise.resolve().then(() => load(route)).then(metadata => {
        const time = now()
        const entry = { kind: metadata ? 'fresh' : 'missing', metadata,
          updatedAt: time, expiresAt: time + (metadata ? ttlMs : missingTtlMs) }
        put(key, entry)
        return { kind: entry.kind, metadata }
      }).catch(() => {
        const time = now()
        const safe = fallback(cached, time)
        put(key, { kind: 'failure', metadata: safe.metadata,
          updatedAt: safe.metadata ? cached.updatedAt : time, expiresAt: time + failureTtlMs })
        return safe
      }).finally(() => { active--; inFlight.delete(key) })
      inFlight.set(key, request)
      return request
    },
    get size() { return entries.size },
    get active() { return active }
  }
}

export function createImageCache({ maxBytes = 16 * 1024 * 1024, maxEntries = 64 } = {}) {
  const entries = new Map()
  let bytes = 0
  return {
    get(key) {
      const value = entries.get(key)
      if (value) { entries.delete(key); entries.set(key, value) }
      return value
    },
    set(key, value) {
      const previous = entries.get(key)
      if (previous) { bytes -= previous.length; entries.delete(key) }
      if (value.length > maxBytes) return
      entries.set(key, value)
      bytes += value.length
      while (bytes > maxBytes || entries.size > maxEntries) {
        const first = entries.keys().next().value
        bytes -= entries.get(first).length
        entries.delete(first)
      }
    },
    get size() { return entries.size },
    get bytes() { return bytes }
  }
}

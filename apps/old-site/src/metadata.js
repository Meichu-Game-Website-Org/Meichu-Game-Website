// The archive only uses titles, descriptions and favicons. Copy these fields
// explicitly instead of recursively merging API-derived objects into DOM data.
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key)

export function selectMetadata(records, defaults) {
  const result = { ...defaults }
  for (const value of records) {
    if (!value || typeof value !== 'object') continue
    for (const key of ['title', 'titleTemplate', 'description']) {
      if (own(value, key) && typeof value[key] === 'string') result[key] = value[key]
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

export function installMetadata(app, documentRef = document) {
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
  let pending = false
  let order = 0
  const update = () => {
    if (pending) return
    pending = true
    Promise.resolve().then(() => {
      pending = false
      const records = [...entries.values()].sort((a, b) => a.depth - b.depth || a.order - b.order)
      const metadata = selectMetadata(records.map(entry => entry.value), defaults)
      documentRef.title = metadata.title
      if (description) description.setAttribute('content', metadata.description)
      if (icon) icon.setAttribute('href', metadata.icon)
    })
  }
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

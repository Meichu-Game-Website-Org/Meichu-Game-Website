const assert = require('node:assert/strict')
const test = require('node:test')
const { createRequire } = require('node:module')
const path = require('node:path')
const legacyRequire = createRequire(path.resolve(__dirname, '../apps/old-site/package.json'))

const defaults = { title: '梅竹', titleTemplate: '%s', description: '', icon: '/favicon.png' }

test('archive dependency graph uses Vue 3 and no Vue 2 metadata/compiler packages', () => {
  assert.match(legacyRequire('vue/package.json').version, /^3\./)
  assert.match(legacyRequire('vue-router/package.json').version, /^4\./)
  for (const name of ['vue-meta', 'deepmerge', 'vue-template-compiler', '@vitejs/plugin-vue2']) {
    assert.throws(() => legacyRequire.resolve(name), { code: 'MODULE_NOT_FOUND' })
  }
})

test('metadata selects known own fields without prototype poisoning or arbitrary links', async () => {
  const { selectMetadata } = await import('../apps/old-site/src/metadata.js')
  const poisoned = JSON.parse('{"__proto__":{"isAdmin":true},"title":"<img src=x onerror=alert(1)>","link":[{"rel":"icon","href":"javascript:alert(1)"}]}')
  const result = selectMetadata([poisoned], defaults)
  assert.equal(Object.getPrototypeOf(result), Object.prototype)
  assert.equal(result.isAdmin, undefined)
  assert.equal(result.title, '<img src=x onerror=alert(1)>')
  assert.equal(result.icon, '/favicon.png')
  assert.equal({}.isAdmin, undefined)
  assert.equal(selectMetadata([Object.create({ title: 'inherited' })], defaults).title, '梅竹')
})

test('metadata preserves nested-page title precedence and parent favicon/description', async () => {
  const { selectMetadata } = await import('../apps/old-site/src/metadata.js')
  const result = selectMetadata([
    { titleTemplate: '%s | 乙巳梅竹', description: '2025 資訊', link: [{ rel: 'icon', href: '/favicon2025.png' }] },
    { title: '公告 $&' }
  ], defaults)
  assert.deepEqual(result, { title: '公告 $& | 乙巳梅竹', titleTemplate: '%s | 乙巳梅竹', description: '2025 資訊', icon: '/favicon2025.png' })
})

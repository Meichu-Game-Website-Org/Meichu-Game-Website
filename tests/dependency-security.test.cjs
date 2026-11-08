const assert = require('node:assert/strict')
const test = require('node:test')
const merge = require('deepmerge')

const poisoned = () => JSON.parse('{"__proto__":{"isAdmin":true},"title":"公告"}')

test('metadata merges do not inherit attacker properties from null or poisoned targets', () => {
  for (const [target, source] of [
    [Object.create(null), poisoned()],
    [poisoned(), {}],
    [{ nested: null }, { nested: poisoned() }],
    [{ nested: poisoned() }, { nested: { title: '更新' } }],
  ]) {
    const result = merge(target, source)
    assert.equal(Object.getPrototypeOf(result), Object.prototype)
    assert.equal(result.isAdmin, undefined)
    if (result.nested) {
      assert.equal(Object.getPrototypeOf(result.nested), Object.prototype)
      assert.equal(result.nested.isAdmin, undefined)
    }
    assert.equal({}.isAdmin, undefined)
  }
})

test('metadata merges preserve ordinary titles, nested values, arrays and enumerable symbols', () => {
  const marker = Symbol('metadata')
  const source = { title: '公告', nested: { description: '最新消息' }, links: ['new'], [marker]: 1 }
  const result = merge({ nested: { language: 'zh-TW' }, links: ['old'] }, source)
  assert.deepEqual(result.nested, { language: 'zh-TW', description: '最新消息' })
  assert.deepEqual(result.links, ['old', 'new'])
  assert.equal(result.title, '公告')
  assert.equal(result[marker], 1)
  assert.notEqual(result.nested, source.nested)
})

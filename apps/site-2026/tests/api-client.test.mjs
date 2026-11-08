import assert from 'node:assert/strict'
import { test } from 'node:test'
import client from '../../../packages/services/src/client.js'

test('API query parameters retain repeated array keys, filters and omitted empty values', () => {
  const url = new URL(client.getUri({
    url: 'https://meichu.games/api/option',
    params: {
      data: ['about-meichu', 'meichu-history'],
      year_id: 58,
      is_sticky: false,
      unused: null,
      missing: undefined
    }
  }))
  assert.equal(url.pathname, '/api/option')
  assert.deepEqual([...url.searchParams], [
    ['data[]', 'about-meichu'], ['data[]', 'meichu-history'],
    ['year_id', '58'], ['is_sticky', 'false']
  ])
})

const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

function schoolSections(year) {
  const source = readFileSync(path.join(__dirname, `../apps/old-site/src/pages/${year}/AboutPage.vue`), 'utf8')
  return [...source.matchAll(/<h4\b[^>]*>([^<]+)<\/h4>([\s\S]*?)(?=<h4\b|<\/template>)/g)]
    .filter(([, title]) => /國立.*大學/.test(title))
    .map(([, title, content]) => ({
      title, content,
      links: [...content.matchAll(/href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
        .map(([, href, label]) => ({ href, label: label.replace(/<[^>]*>/g, '').trim() }))
    }))
}

for (const year of [2019, 2020]) {
  test(`${year}: each university links to its own activity and sports offices`, () => {
    const schools = schoolSections(year)
    assert.equal(schools.length, 2)
    for (const school of schools) {
      const nthu = school.title.includes('清華')
      const offices = school.links.filter(link => /課外活動|體育室/.test(link.label))
      assert.equal(offices.length, 2)
      for (const { href } of offices) {
        assert.ok(new URL(href).hostname.endsWith(nthu ? '.nthu.edu.tw' : '.nctu.edu.tw'), `${school.title}: ${href}`)
      }
      if (nthu) assert.equal(school.links.find(link => link.label === 'Facebook').href, 'https://www.facebook.com/nthu.tw/')
    }
  })
}

// NTHU's 2024 opening announcement identifies the host:
// https://www.nthu.edu.tw/hotNews/content/1165
// The official year 56 API confirms the six sports' venues:
// https://meichu.games/api/game?year_id=56
test('2024: the host and sports venues match the actual event year', () => {
  const schools = schoolSections(2024)
  const host = schools.find(school => school.title.startsWith('主辦校'))
  const cohost = schools.find(school => school.title.startsWith('協辦校'))
  assert.equal(host.title, '主辦校 / 國立清華大學')
  assert.equal(cohost.title, '協辦校 / 國立陽明交通大學')
  assert.match(host.content, /主辦學校為桌球、排球、羽球/)
  assert.match(cohost.content, /協辦學校為籃球、網球、象棋/)
  assert.ok(host.links.some(link => new URL(link.href).hostname === 'www.nthu.edu.tw'))
  assert.ok(cohost.links.some(link => new URL(link.href).hostname === 'www.nycu.edu.tw'))
})

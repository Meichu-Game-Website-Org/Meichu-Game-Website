import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { createSSRApp, compile } from 'vue'
import { parse } from 'vue/compiler-sfc'
import { renderToString } from 'vue/server-renderer'

const source = readFileSync(new URL('../src/components/MobileAbout.vue', import.meta.url), 'utf8')
const { descriptor } = parse(source)
const context = { OrgCard: { render: () => null }, RequestState: { render: () => null } }
vm.runInNewContext(descriptor.script.content.replace(/^import .*$/gm, '').replace('export default', 'globalThis.component ='), context)

for (const field of ['about-meichu', 'meichu-history']) {
  test(`About ${field}: API markup stays literal text with line breaks`, async () => {
    const content = '<img src=x onerror="window.meichuInjected=true">\n第二行 & 內容'
    const app = createSSRApp({ ...context.component, render: compile(descriptor.template.content) }, {
      resource: { status: 'success', error: '', data: { [field]: content } }
    })
    const html = await renderToString(app)
    assert.ok(html.includes('&lt;img src=x onerror='))
    assert.ok(!html.includes('<img src=x'))
    assert.ok(html.includes('\n第二行 &amp; 內容'))
  })
}

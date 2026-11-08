const assert = require('node:assert/strict')
const test = require('node:test')
const path = require('node:path')
const { createRequire } = require('node:module')

const cwd = path.resolve(__dirname, '../apps/old-site')
const legacyRequire = createRequire(path.join(cwd, 'package.json'))
const { ESLint } = legacyRequire('eslint')

test('patched lint dependency still selects and checks Vue files', async () => {
  const lint = new ESLint({ cwd })
  const [valid] = await lint.lintText(
    '<template><p>{{ label }}</p></template><script>export default { data() { return { label: "safe" } } }</script>',
    { filePath: 'src/security-contract.vue' }
  )
  assert.equal(valid.errorCount, 0, JSON.stringify(valid.messages))
  assert.equal(valid.warningCount, 0)
  const [invalid] = await lint.lintText(
    '<template><p>text</p></template><script>export default { mounted() { missingGlobal() } }</script>',
    { filePath: 'src/security-contract.vue' }
  )
  assert.equal(invalid.fatalErrorCount, 0)
  assert.ok(invalid.messages.some(message => message.ruleId === 'no-undef'))
})

const test = require('node:test')
const assert = require('node:assert/strict')
const { createRequire } = require('node:module')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const legacyRequire = createRequire(path.resolve(__dirname, '../apps/old-site/package.json'))
const compilerPath = legacyRequire.resolve('vue/compiler-sfc')
const compiler = legacyRequire('vue/compiler-sfc')

test('legacy browser runtime entry does not expose the template compiler', () => {
  assert.equal(legacyRequire('vue').compile, undefined)
  const manifest = legacyRequire('vue/package.json')
  assert.match(manifest.exports['.'].import.default, /vue\.runtime\.esm\.js$/)
})

test('legacy compiler terminates on unclosed raw-text tags with large hostile input', () => {
  // Run separately so a regression cannot block the test runner indefinitely.
  const result = spawnSync(process.execPath, ['-e', `
    const compiler = require(${JSON.stringify(compilerPath)});
    for (const tag of ['script', 'style', 'textarea']) {
      for (const payload of ['<'.repeat(500000), ('</' + tag).repeat(50000)]) {
        compiler.compileTemplate({
          source: '<div><' + tag + '>' + payload,
          filename: 'unclosed.vue'
        });
      }
    }
  `], { timeout: 8000, encoding: 'utf8' })
  assert.equal(result.error, undefined, result.error?.message)
  assert.equal(result.status, 0, result.stderr)
})

test('legacy compiler ignores inherited static class and style expressions', () => {
  // Prototype pollution is isolated from the test runner and restored on exit.
  const result = spawnSync(process.execPath, ['-e', `
    const assert = require('node:assert/strict');
    const compiler = require(${JSON.stringify(compilerPath)});
    Object.prototype.staticClass = '(globalThis.compilerPolluted = true)';
    Object.prototype.staticStyle = '(globalThis.compilerPolluted = true)';
    try {
      const result = compiler.compileTemplate({
        source: '<div :id="id"><span>{{ message }}</span></div>',
        filename: 'pollution.vue'
      });
      assert.deepEqual(result.errors, []);
      assert.doesNotMatch(result.code, /compilerPolluted/);
    } finally {
      delete Object.prototype.staticClass;
      delete Object.prototype.staticStyle;
    }
  `], { timeout: 8000, encoding: 'utf8' })
  assert.equal(result.error, undefined, result.error?.message)
  assert.equal(result.status, 0, result.stderr)
})

test('legacy compiler preserves valid raw-text content and ordinary template bindings', () => {
  const parsed = compiler.parseComponent('<template><div /></template><script>const value = "İ<";</ScRiPt><style>.a { color: red }</STYLE>')
  assert.equal(parsed.script.content, 'const value = "İ<";')
  assert.equal(parsed.styles[0].content, '.a { color: red }')
  const result = compiler.compileTemplate({
    source: '<div class="safe" style="color: red" :id="id"><textarea>\nfirst\nsecond</TEXTAREA><span v-for="n in nums" :key="n">{{n}}</span></div>',
    filename: 'normal.vue'
  })
  assert.deepEqual(result.errors, [])
  assert.equal(result.ast.staticClass, '"safe"')
  assert.equal(result.ast.staticStyle, '{"color":"red"}')
  assert.equal(result.ast.children[0].children[0].text, 'first\nsecond')
  assert.match(result.code, /_vm\.id/)
  assert.match(result.code, /_vm\.nums/)
})

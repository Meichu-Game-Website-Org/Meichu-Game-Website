const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const source = fs.readFileSync(path.resolve(__dirname, '../apps/old-site/src/components/2025/snake-game.js'), 'utf8')

function harness() {
  let now = 1000, id = 0, seed = 42
  const frames = new Map(), timers = new Map(), audio = [], text = []
  const window = new EventTarget()
  window.requestAnimationFrame = callback => { frames.set(++id, callback); return id }
  window.cancelAnimationFrame = token => frames.delete(token)
  window.setTimeout = (callback, delay) => { timers.set(++id, { callback, at: now + delay }); return id }
  window.clearTimeout = token => timers.delete(token)
  const math = Object.create(Math)
  math.random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000 }
  class Clock extends Date { static now() { return now } }
  class Audio {
    constructor() { this.paused = true; audio.push(this) }
    play() { this.paused = false; return Promise.reject(new Error('Autoplay unavailable')) }
    pause() { this.paused = true }
    removeAttribute(name) { if (name === 'src') this.src = '' }
    load() {}
  }
  const canvas = new EventTarget()
  const context = new Proxy({ canvas, fillText: value => text.push(value) }, {
    get(target, key) { return key in target ? target[key] : () => {} }
  })
  canvas.getContext = () => context
  const create = vm.runInNewContext('"use strict";\n' + source.replace('export function createSnakeGame', 'function createSnakeGame') + '\ncreateSnakeGame', { window, Date: Clock, Math: math, Audio })
  function advance(duration) {
    now += duration
    for (const [token, timer] of [...timers]) if (timer.at <= now) { timers.delete(token); timer.callback() }
    for (const [token, frame] of [...frames]) { frames.delete(token); frame() }
  }
  function key(code, type = 'keydown', target = canvas) {
    const event = new Event(type, { cancelable: true })
    Object.defineProperty(event, 'keyCode', { value: code })
    target.dispatchEvent(event)
    return event.defaultPrevented
  }
  return { create, canvas, window, frames, timers, audio, text, advance, key }
}

test('Snake starts after SPA mount, controls only its canvas, pauses and restarts', async () => {
  const h = harness()
  const app = h.create(h.canvas)
  h.advance(20)
  assert.ok(h.text.includes('Press Enter to start.'))
  assert.equal(app.paused, true)
  assert.equal(h.window.Application, undefined, 'Do not leak game models onto window')
  assert.equal(h.key(13, 'keydown', h.window), false, 'Ordinary page keys are untouched')
  assert.equal(h.key(9), false, 'Tab remains available to leave the canvas')
  h.key(13)
  h.advance(501)
  h.key(13, 'keyup')
  assert.equal(app.paused, false)
  const snake = app.models.find(model => model.segments)
  app.modLevel.wdata.fill(0)
  h.key(38)
  h.advance(1)
  h.key(38, 'keyup')
  assert.equal(snake.direction, 38)
  h.key(80)
  h.key(80, 'keyup')
  h.advance(1)
  assert.equal(app.paused, true)
  assert.ok(h.text.includes('Press Enter to continue.'))
  h.key(13)
  h.advance(501)
  h.key(13, 'keyup')
  assert.equal(app.paused, false)
  const head = snake.segments[0]
  app.modLevel.wdata[app.modLevel.index(head.x, (head.y + app.modLevel.height - 1) % app.modLevel.height)] = 2
  h.advance(201)
  assert.equal(snake.destroyed, true)
  h.key(13)
  h.advance(501)
  h.key(13, 'keyup')
  h.advance(20)
  assert.notEqual(app.models.find(model => model.segments), snake)
  assert.equal(app.paused, true)
  assert.equal(h.frames.size, 1, 'Restart keeps exactly one animation loop')
  app.destroy()
  await new Promise(resolve => setImmediate(resolve))
})

test('Snake teardown removes keys, timers, audio and animation even before first frame', () => {
  for (const started of [false, true]) {
    const h = harness()
    const app = h.create(h.canvas)
    if (started) h.advance(20)
    app.destroy()
    app.destroy()
    assert.equal(h.frames.size, 0)
    assert.equal(h.timers.size, 0)
    assert.equal(h.key(13), false)
    assert.ok(h.audio.every(audio => audio.paused && audio.src === ''))
    h.advance(1000)
    assert.equal(h.frames.size, 0)
    assert.equal(h.timers.size, 0)
  }
})

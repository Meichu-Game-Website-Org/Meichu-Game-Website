import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Keep both services in one container, with an explicit PID 1 lifecycle. A
// failed child must not leave a healthy-looking half-running container behind.
const children = new Set()
let stopping = false
let exitCode = 0
let deadline

function terminate(child, signal) {
  if (child.pid && child.exitCode === null && child.signalCode === null) child.kill(signal)
}

function shutdown(code = 0) {
  if (stopping) return
  stopping = true
  exitCode = code
  for (const child of children) terminate(child, 'SIGTERM')
  deadline = setTimeout(() => {
    for (const child of children) terminate(child, 'SIGKILL')
  }, 5000)
  deadline.unref()
  finish()
}

function finish() {
  if (stopping && children.size === 0) {
    clearTimeout(deadline)
    process.exitCode = exitCode
  }
}

function start(command, args) {
  const child = spawn(command, args, { stdio: 'inherit', shell: false })
  children.add(child)
  child.once('error', error => {
    console.error(`Container child failed: ${command}: ${error.message}`)
    shutdown(1)
  })
  child.once('exit', (code, signal) => {
    if (!stopping) {
      console.error(`Container child exited: ${command} (${signal || code})`)
      shutdown(1)
    }
  })
  child.once('close', () => {
    children.delete(child)
    finish()
  })
}

process.on('SIGTERM', () => shutdown())
process.on('SIGINT', () => shutdown())
start(process.execPath, [fileURLToPath(new URL('../apps/sharing-server/src/server.mjs', import.meta.url))])
start('nginx', ['-g', 'daemon off;'])

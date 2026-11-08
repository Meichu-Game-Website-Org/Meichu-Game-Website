import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('../', import.meta.url))
const args = process.argv.slice(2)
if (args.length && (args.length !== 2 || args[0] !== '--image')) {
  throw new Error('Usage: node scripts/smoke-container.mjs [--image IMAGE]')
}
const image = args[1] || `meichu-website:smoke-${process.pid}`
const docker = (args, options = {}) => execFileSync('docker', args, {
  cwd: root,
  encoding: 'utf8',
  ...options
})

if (!args.length) {
  docker(['build', '--file', 'apps/old-site/Dockerfile', '--tag', image, '.'], { stdio: 'inherit' })
}

const containers = new Set()
const network = `meichu-sharing-smoke-${process.pid}-${Date.now()}`
let networkCreated = false
let container
try {
  docker(['network', 'create', '--internal', network])
  networkCreated = true
  const fixture = fileURLToPath(new URL('./fixtures/sharing-api.mjs', import.meta.url))
  const api = docker(['run', '--detach', '--network', network, '--network-alias', 'api-fixture',
    '--read-only', '--volume', `${fixture}:/fixture.mjs:ro`,
    '--entrypoint', 'node', image, '/fixture.mjs']).trim()
  containers.add(api)

  const waitReady = async (id, port) => {
    const deadline = Date.now() + 30000
    while (Date.now() < deadline) {
      try {
        const body = docker(['exec', id, 'wget', '-q', '-O', '-', `http://127.0.0.1:${port}/healthz`], {
          timeout: 2000, stdio: ['ignore', 'pipe', 'pipe']
        })
        if (body === 'ok\n') return
      } catch { /* Wait for both processes to become ready. */ }
      await delay(250)
    }
    throw new Error(`Container health endpoint did not become ready on port ${port}`)
  }
  await waitReady(api, 8099)
  const startApplication = async () => {
    const id = docker(['run', '--detach', '--network', network,
      '--env', 'SHARING_API_ORIGIN=http://api-fixture:8099', image]).trim()
    assert.match(id, /^[a-f0-9]{64}$/)
    containers.add(id)
    await waitReady(id, 80)
    return { id }
  }
  const application = await startApplication()
  container = application.id
  // Exercise the same executable and URL used by Docker's HEALTHCHECK.
  docker(['exec', container, 'wget', '-q', '-O', '/dev/null', 'http://127.0.0.1/healthz'])

  const checks = readFileSync(new URL('./fixtures/check-sharing-http.mjs', import.meta.url), 'utf8')
  docker(['exec', '--interactive', container, 'node', '--input-type=module'], {
    input: checks, stdio: ['pipe', 'inherit', 'inherit']
  })

  docker(['stop', '--time', '8', container])
  assert.equal(docker(['inspect', '--format', '{{.State.ExitCode}}', container]).trim(), '0', 'SIGTERM shuts down both services cleanly')
  console.log('Container lifecycle passed: SIGTERM stopped both children with exit code 0')
  for (const child of ['nginx', 'sharing']) {
    const app = await startApplication()
    if (child === 'nginx') docker(['exec', app.id, 'killall', '-TERM', 'nginx'])
    else docker(['exec', app.id, 'node', '-e', `const fs=require('node:fs');for(const pid of fs.readdirSync('/proc')){if(!/^\\d+$/.test(pid))continue;try{const args=fs.readFileSync('/proc/'+pid+'/cmdline','utf8').split('\\0');if(args[1]==='/app/apps/sharing-server/src/server.mjs')process.kill(Number(pid),'SIGTERM')}catch{}}`])
    assert.equal(docker(['wait', app.id], { timeout: 15000 }).trim(), '1', `${child} failure shuts down the whole container`)
    console.log(`Container lifecycle passed: ${child} failure stopped its sibling with exit code 1`)
  }
  console.log(`Container HTTP smoke passed: both apps, dynamic OG/PNG for 8 years, safe API requests, caching, failure recovery and process lifecycle (${image})`)
} catch (error) {
  if (container) {
    try { docker(['logs', container], { stdio: 'inherit' }) } catch { /* Preserve the original failure. */ }
  }
  throw error
} finally {
  for (const id of containers) {
    try { docker(['rm', '--force', id]) } catch (error) {
      // --rm may already have removed a container that failed during startup.
      if (!String(error.stderr).includes('No such container')) throw error
    }
  }
  if (networkCreated) docker(['network', 'rm', network])
}

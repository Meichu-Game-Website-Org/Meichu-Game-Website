const assert = require('node:assert/strict')
const { test, before } = require('node:test')
const { createServer } = require('node:http')
const { mkdtemp, mkdir, writeFile, rm } = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const { pathToFileURL } = require('node:url')
let api, cache, http, metadata, detail, html
before(async () => {
  const module = async name => import(pathToFileURL(path.resolve(name)))
  ;[api, cache, http, metadata, detail, html] = await Promise.all([
    module('apps/sharing-server/src/api-client.mjs'), module('apps/sharing-server/src/cache.mjs'),
    module('apps/sharing-server/src/http.mjs'), module('packages/services/src/metadata.mjs'),
    module('packages/services/src/detail-metadata.mjs'), module('scripts/lib/sharing-html.mjs')
  ])
})
const route = (key = 'basketball', year = '2026', type = 'game') => detail.parseDetailRoute(`/${year}/${type}/${key}`)
const game = (key = 'basketball', yearId = 58) => ({ id: 1, name: '籃球決賽', year_id: yearId,
  item: { slug: key }, date: '2026-03-06', time: '10:00', location: '體育館', status: 'running', score_nthu: 12, score_nctu: 10 })
const news = (id = 7) => ({ id, year_id: 58, title: '賽程異動公告', content: '比賽移至下午兩點。' })
const template = '<!doctype html><html><head><link rel="icon" href="/favicon.png"><!-- sharing:start --><!-- sharing:end --></head><body><div id="app"></div><script src="/app.js"></script></body></html>'
const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), Buffer.from('fixture pixels')])
async function listen(t, server) {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) })
  return `http://127.0.0.1:${server.address().port}`
}
function options(overrides = {}) {
  return { templates: new Map(Array.from({ length: 8 }, (_, i) => 2019 + i).flatMap(year => ['game','news'].map(type => [`${year}/${type}`, template]))),
    parseRoute: detail.parseDetailRoute, mapMetadata: detail.detailMetadata, genericMetadata: metadata.sharingMetadata,
    replaceHead: html.replaceSharingHead, renderImage: () => png,
    loadResource: async target => target.type === 'game' ? game(target.key, target.yearId) : news(Number(target.key)), ...overrides }
}

test('API destination uses only validated route fields and a startup-only origin', () => {
  assert.equal(api.apiUrlForRoute(route()), 'https://meichu.games/api/game/slug/basketball?year_id=58')
  assert.equal(api.apiUrlForRoute(route('7', '2026', 'news')), 'https://meichu.games/api/news/7')
  assert.equal(api.apiUrlForRoute(route('basketball','2020'), 'http://fixture:1234'), 'http://fixture:1234/api/game/slug/basketball?year_id=2')
  for (const origin of ['file:///etc/passwd','https://user:pass@meichu.games','https://meichu.games/api','https://meichu.games/?next=1','https://meichu.games/#frag']) assert.throws(() => api.parseApiOrigin(origin))
  for (const bad of [{ year:'2027',type:'game',key:'x' },{year:'2026',type:'news',key:'1/other'},{year:'2026',type:'game',key:'../news/1'},{year:'2026',type:'game',key:'x'.repeat(101)}]) assert.throws(() => api.apiUrlForRoute(bad))
})

test('API fetch omits credentials, rejects redirects and never forwards caller headers', async t => {
  const seen = []
  const upstream = createServer((req,res) => {
    seen.push({ url: req.url, headers: req.headers })
    if (req.url.includes('redirect')) { res.writeHead(302,{location:'http://127.0.0.1:1/private'}).end(); return }
    res.setHeader('content-type','application/json'); res.end(JSON.stringify({game:game()}))
  })
  const origin = await listen(t, upstream)
  const load = api.createApiClient({origin})
  assert.equal((await load(route())).name,'籃球決賽')
  assert.equal(seen[0].headers.cookie,undefined)
  assert.equal(seen[0].headers.authorization,undefined)
  assert.equal(seen[0].url,'/api/game/slug/basketball?year_id=58')
  await assert.rejects(load(route('redirect')),api.UpstreamError)
  assert.equal(seen.length,2)
})

test('API response bounds cover streamed bytes, content type, malformed JSON and timeout', async t => {
  const upstream = createServer((req,res) => {
    res.setHeader('content-type', req.url.includes('html') ? 'text/html' : 'application/json')
    if(req.url.includes('streamslow')) { res.write('{'); return }
    if(req.url.includes('slow')) return
    if(req.url.includes('big')) { res.write(' '.repeat(200)); res.end(' '.repeat(200)); return }
    if(req.url.includes('broken')) { res.end('{broken'); return }
    if(req.url.includes('missing')) { res.writeHead(404).end(); return }
    res.end(JSON.stringify({game:game()}))
  })
  const origin = await listen(t,upstream)
  const load = api.createApiClient({origin,maxBytes:300,timeoutMs:50})
  for(const key of ['html','big','broken','slow','streamslow']) await assert.rejects(load(route(key)),api.UpstreamError)
  assert.equal(await load(route('missing')),null)
})

test('metadata cache shares in-flight requests, caps concurrent work and retains bounded last-good', async () => {
  let time=0, calls=0, resolveFirst, fail=false
  const store = cache.createMetadataCache({now:()=>time,maxEntries:2,maxConcurrent:1,ttlMs:10,staleMs:40,failureTtlMs:5,missingTtlMs:5,
    load:async target => { calls++; if(calls===1) return new Promise(resolve=>{resolveFirst=resolve}); if(fail)throw Error('offline'); return target.key==='missing'?null:{title:target.key} }})
  const first=store.get(route()), same=store.get(route())
  await Promise.resolve()
  assert.equal((await store.get(route('other'))).kind,'unavailable')
  resolveFirst({title:'first'}); assert.deepEqual(await first,await same); assert.equal(calls,1)
  time=11; fail=true; assert.equal((await store.get(route())).kind,'stale'); assert.equal(calls,2)
  time=12; await store.get(route()); assert.equal(calls,2,'Failure cooldown avoids hammering the upstream')
  time=41; assert.equal((await store.get(route())).kind,'unavailable','Expired last-good is not retained forever')
  fail=false; time=47; assert.equal((await store.get(route())).kind,'fresh')
  await store.get(route('missing')); await store.get(route('third')); assert.equal(store.size,2)
  assert.equal(store.active,0)
})

test('negative and transient caches retry after their short expiry', async () => {
  let time=0,calls=0,mode='missing'
  const store=cache.createMetadataCache({now:()=>time,missingTtlMs:3,failureTtlMs:3,load:async()=>{calls++;if(mode==='error')throw Error();return mode==='missing'?null:{title:'new'}}})
  assert.equal((await store.get(route())).kind,'missing'); mode='ok'; time=4
  assert.equal((await store.get(route())).kind,'fresh'); assert.equal(calls,2)
  const failing=cache.createMetadataCache({now:()=>time,failureTtlMs:3,load:async()=>{if(mode==='error')throw Error();return{title:'recovered'}}})
  mode='error';assert.equal((await failing.get(route())).kind,'unavailable');mode='ok';time=8
  assert.equal((await failing.get(route())).metadata.title,'recovered')
})

test('PNG cache evicts by both byte budget and entry count', () => {
  const images=cache.createImageCache({maxBytes:5,maxEntries:2})
  images.set('a',Buffer.alloc(2));images.set('b',Buffer.alloc(2));images.get('a');images.set('c',Buffer.alloc(2))
  assert.equal(images.get('b'),undefined);assert.equal(images.bytes,4);assert.equal(images.size,2)
  images.set('huge',Buffer.alloc(6));assert.equal(images.get('huge'),undefined);assert.equal(images.bytes,4)
})

test('request targets canonicalize encoded identifiers and reject arbitrary path/origin input', () => {
  assert.equal(http.parseRequestTarget('/2026/news/%30%30%37?url=http://evil.invalid',detail.parseDetailRoute).route.path,'/2026/news/7')
  assert.equal(http.parseRequestTarget('/og/2026/game/basketball.png?v=untrusted',detail.parseDetailRoute).image,true)
  for(const target of ['https://evil.invalid/2026/news/7','//evil.invalid/2026/news/7','/2026/news/7#x','/og/2026/game/a%2fb.png','/2026/game/%252e%252e','/2027/news/7','/2026/news/'+'1'.repeat(200),'/2026/news/%ZZ']) assert.equal(http.parseRequestTarget(target,detail.parseDetailRoute),null,target)
})

test('HTTP supplies resource-specific escaped raw HTML, HEAD, ETag and separate cached resources', async t => {
  let calls=0,renders=0
  const server=http.createSharingServer(options({loadResource:async target=>{calls++;return target.type==='news'?{...news(Number(target.key)),title:`公告${target.key} <script> & "`,content:'新描述 <b>純文字</b>'}:game(target.key,target.yearId)},renderImage:meta=>{renders++;return Buffer.concat([png,Buffer.from(meta.title)])}}))
  const origin=await listen(t,server)
  const headers={host:'attacker.invalid',cookie:'private=secret',authorization:'Bearer secret'}
  const one=await fetch(origin+'/2026/news/7?next=https://attacker.invalid',{headers});const body=await one.text()
  assert.equal(one.status,200);assert.match(body,/公告7 &lt;script&gt; &amp; &quot;/);assert.match(body,/新描述 純文字/)
  assert.match(body,/content="https:\/\/meichu.games\/2026\/news\/7"/);assert.ok(!body.includes('attacker.invalid'));assert.ok(body.includes('id="app"'))
  const head=await fetch(origin+'/2026/news/7',{method:'HEAD'});assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),one.headers.get('etag'))
  const unchanged=await fetch(origin+'/2026/news/7',{headers:{'if-none-match':one.headers.get('etag')}});assert.equal(unchanged.status,304)
  const two=await fetch(origin+'/2026/news/8');assert.match(await two.text(),/公告8/);assert.equal(calls,2)
  const image=await fetch(origin+'/og/2026/news/7.png?v=one');assert.equal(image.headers.get('content-type'),'image/png');assert.ok(Buffer.from(await image.arrayBuffer()).subarray(0,8).equals(png.subarray(0,8)))
  const image2=await fetch(origin+'/og/2026/news/7.png?v=two');await image2.arrayBuffer();assert.equal(renders,1,'Untrusted query cannot bypass the render cache')
  assert.equal(calls,2)
})

test('HTTP missing and unavailable resources preserve SPA fallback without cache poisoning', async t => {
  const server=http.createSharingServer(options({loadResource:async target=>{if(target.key==='missing')return null;throw Error('upstream secret')}}))
  const origin=await listen(t,server)
  const missing=await fetch(origin+'/2026/game/missing');assert.equal(missing.status,404);assert.equal(missing.headers.get('x-robots-tag'),'noindex');assert.match(await missing.text(),/id="app"/)
  const unavailable=await fetch(origin+'/2026/game/slow');assert.equal(unavailable.status,503);assert.equal(unavailable.headers.get('cache-control'),'no-store');const body=await unavailable.text();assert.match(body,/2026\/sharing\/2026.png/);assert.ok(!body.includes('upstream secret'))
  const image=await fetch(origin+'/og/2026/game/slow.png');assert.equal(image.status,503);assert.equal(image.headers.get('cache-control'),'no-store')
  assert.equal((await fetch(origin+'/og/2026/game/missing.png')).status,404)
  assert.equal((await fetch(origin+'/healthz')).status,200)
})

test('missing API resource fields are temporary errors while explicit null means not found', async t => {
  const loadResource=api.createApiClient({fetchImpl:async url=>new Response(JSON.stringify(url.endsWith('/1')?{news:null}:{}),{headers:{'content-type':'application/json'}})})
  const server=http.createSharingServer(options({loadResource}));const origin=await listen(t,server)
  const missing=await fetch(origin+'/2026/news/1');assert.equal(missing.status,404);assert.equal(missing.headers.get('x-robots-tag'),'noindex')
  const malformed=await fetch(origin+'/2026/news/2');assert.equal(malformed.status,503);assert.equal(malformed.headers.get('x-robots-tag'),null);assert.equal(malformed.headers.get('cache-control'),'no-store');assert.match(await malformed.text(),/id="app"/)
})

test('malformed resource titles are unavailable rather than permanently missing pages', async t => {
  const loadResource=api.createApiClient({fetchImpl:async url=>{
    const path=new URL(url).pathname
    const body=path.includes('/news/')?{news:{...news(Number(path.split('/').at(-1))),title:path.endsWith('/3')?null:' \t '}}:{game:{...game(path.split('/').at(-1)),name:path.includes('bad-name')?42:'  '}}
    return new Response(JSON.stringify(body),{headers:{'content-type':'application/json'}})
  }})
  const server=http.createSharingServer(options({loadResource}));const origin=await listen(t,server)
  for(const path of ['/2026/news/3','/2026/news/4','/2026/game/bad-name','/2026/game/blank-name']) {
    const response=await fetch(origin+path);assert.equal(response.status,503,path);assert.equal(response.headers.get('x-robots-tag'),null);assert.equal(response.headers.get('cache-control'),'no-store');assert.match(await response.text(),/id="app"/)
  }
})

test('HTTP last-good metadata and PNG recover after an outage without mixing revisions', async t => {
  let time=0,fail=false,title='第一版公告',calls=0
  const server=http.createSharingServer(options({now:()=>time,cacheOptions:{ttlMs:10,failureTtlMs:5,staleMs:30},
    loadResource:async()=>{calls++;if(fail)throw Error('offline');return{...news(),title}},
    renderImage:meta=>Buffer.concat([png,Buffer.from(meta.title)])}))
  const origin=await listen(t,server)
  const first=await fetch(origin+'/2026/news/7');assert.match(await first.text(),/第一版公告/)
  const firstImage=await fetch(origin+'/og/2026/news/7.png');const oldImage=Buffer.from(await firstImage.arrayBuffer())
  time=11;fail=true
  const stale=await fetch(origin+'/2026/news/7');assert.equal(stale.status,200);assert.equal(stale.headers.get('x-meichu-sharing'),'stale');assert.match(await stale.text(),/第一版公告/)
  const staleImage=await fetch(origin+'/og/2026/news/7.png');assert.deepEqual(Buffer.from(await staleImage.arrayBuffer()),oldImage);assert.equal(calls,2)
  time=17;fail=false;title='第二版公告'
  const changed=await fetch(origin+'/2026/news/7',{headers:{'if-none-match':first.headers.get('etag')}})
  assert.equal(changed.status,200);assert.match(await changed.text(),/第二版公告/);assert.notEqual(changed.headers.get('etag'),first.headers.get('etag'))
  const changedImage=await fetch(origin+'/og/2026/news/7.png',{headers:{'if-none-match':firstImage.headers.get('etag')}})
  assert.equal(changedImage.status,200);assert.notDeepEqual(Buffer.from(await changedImage.arrayBuffer()),oldImage);assert.equal(calls,3)
})

test('HTTP rendering exceptions and unsupported requests cannot crash the service', async t => {
  const server=http.createSharingServer(options({renderImage:()=>{throw Error('private file path')}}));const origin=await listen(t,server)
  const image=await fetch(origin+'/og/2026/game/basketball.png');assert.equal(image.status,503);assert.ok(!(await image.text()).includes('private'))
  const post=await fetch(origin+'/2026/news/7',{method:'POST',body:'not consumed'});assert.equal(post.status,405);assert.equal(post.headers.get('allow'),'GET, HEAD')
  assert.equal((await fetch(origin+'/2026/_news/index.html')).status,404)
  const healthy=await fetch(origin+'/healthz');assert.equal(await healthy.text(),'ok\n')
})

test('template preload reads only fixed edition files and fails on invalid build output', async t => {
  const root=await mkdtemp(path.join(os.tmpdir(),'meichu-sharing-templates-'));t.after(()=>rm(root,{recursive:true,force:true}))
  for(let year=2019;year<=2026;year++)for(const type of ['game','news']) { const dir=path.join(root,String(year),'_'+type);await mkdir(dir,{recursive:true});await writeFile(path.join(dir,'index.html'),template) }
  const templates=await http.readTemplates(root);assert.equal(templates.size,16)
  await writeFile(path.join(root,'2026','_news','index.html'),'missing marker');await assert.rejects(http.readTemplates(root),/markers/)
})

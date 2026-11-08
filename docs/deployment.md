# Container deployment

Build **from the repository root**. The Dockerfile remains at its historical
`apps/old-site/Dockerfile` location, but the image now contains both applications:

```sh
docker build -f apps/old-site/Dockerfile -t meichu-website:local .
docker run --rm -p 127.0.0.1:8080:80 meichu-website:local
```

The build stage uses Node 24 and pnpm 10.28.1, installs the whole workspace with
`--frozen-lockfile --ignore-scripts`, and builds both sites. The runtime image
contains nginx, Node 24, the isolated sharing service and its production
dependencies, shared metadata helpers, the required local fonts, and both
applications' generated files. Frontend development dependencies remain in the
build stage. `.dockerignore` excludes local dependency directories, generated
output and credentials from the build context.

The nginx configuration is copied into the image and defines one routing contract:

| Request | Result |
| --- | --- |
| `/` or `/2026` | Relative redirect to `/2026/`, preserving the query string |
| `/2026/…` | 2026 application, with its own assets, generated sharing HTML and SPA fallback |
| `/2019/…` through `/2025/…` | Archive application, with each year's generated sharing HTML and fallback |
| `/assets/…` and existing root public files | Archive assets |
| Valid `/{year}/game/{slug}` and `/{year}/news/{id}` | Dynamic initial HTML with the record's sharing metadata |
| `/og/{year}/{game\|news}/{key}.png` | Record-specific PNG when the API record has no suitable image |
| Unknown years or unknown root paths | HTTP 404 |
| Missing files under either assets directory | HTTP 404, never SPA HTML |
| `/healthz` | HTTP 200 only when nginx can reach the ready sharing service |

No year cookie or Referer header selects an application. Relative redirects also
work when the image is published on a different host port or placed behind a TLS
reverse proxy. The browser API remains the external endpoint configured by
`packages/services`; this image does not start or proxy a backend API.

The build emits separate HTML for each implemented year and static route. Social
crawlers receive Open Graph and Twitter card metadata without executing the SPA.
Game detail slugs containing only letters, digits, `_` or `-`, and numeric news
IDs are sent to the sharing service on loopback port 8787. All visitors receive
the same initial HTML; there is no crawler User-Agent branch. The service requests
the corresponding public API record, renders its title and description, and uses
an appropriate API image or a generated per-record PNG. The browser continues to
fetch the live record after navigation. A bounded in-memory cache and shared
in-flight requests limit API and image-rendering work.

Canonical URLs use the fixed `https://meichu.games` origin and validated routes.
Request Host, query, Cookie and Authorization values do not choose the API or
change metadata. nginx strips forwarded request headers and bodies; the service
also validates routes before making fixed, credential-free API requests. The
`_game` and `_news` templates remain private, and missing sharing assets return
404 instead of HTML. Missing records return HTML 404 with `noindex`; transient
API failures use bounded last-good metadata when available, otherwise return a
non-cacheable HTML 503 with `Retry-After`. Both retain the SPA shell.

The PID 1 entrypoint supervises nginx and Node together. A terminated or failed
child stops its sibling and exits nonzero. Container `SIGTERM` stops both, with a
bounded shutdown deadline. The internal service port is not published.

### API origin and files

`SHARING_API_ORIGIN` defaults to `https://meichu.games`. Only deployment operators
may set it; it must be an origin without credentials, path, query or fragment.
The service appends its fixed `/api/news/…` or `/api/game/slug/…` paths and does not
follow redirects. The local smoke check overrides it with an isolated fixture.

If a future rollout points the entire `meichu.games` domain to this container,
first provide a separately reachable origin for the existing API, or preserve an
explicit `/api` upstream route outside this image. Otherwise the default API
origin would point back at this frontend and return 404. No DNS or API routing
change is performed by building or testing this repository.

`SHARING_DIST_ROOT` defaults to `/usr/share/nginx/html`, containing both sites;
`SHARING_ASSET_ROOT` defaults to `/app`, containing the explicitly copied fonts.
The runtime keeps the existing Kozuka font files unchanged, including their
embedded notices, and includes the OFL Noto Sans TC fallback with its license and
pinned upstream source notice. These fonts are used locally for generated PNGs;
the service does not download fonts or images while serving a request.

Run the repeatable container check with Node 24 and a running Docker daemon:

```sh
# Build the image, run isolated containers, test them, then remove test containers.
node scripts/smoke-container.mjs

# Validate an image already built by CI or a release pipeline.
node scripts/smoke-container.mjs --image meichu-website:local
```

The smoke check starts a read-only fixture API and the application on a Docker
**internal** network, so neither can request production content. It pipes the
test-only HTTP checks into Node 24 inside the application container with
`docker exec`; no test ports are published. It verifies both entry points, all
archive years, static sharing pages, distinct news/game titles, descriptions and
PNGs, API credential isolation, cache sharing, errors/timeouts/redirects,
HEAD/405/ETag handling, emitted assets, cross-year cookies and unknown paths. It
also checks graceful shutdown and the loss of either child process. The check
removes only its own temporary containers and network. It does not publish the
image or change a production deployment.

For a release, build an immutable application-specific image tag, run the smoke
check against that exact tag, then use the hosting platform's deployment command.
Point the platform health probe to `/healthz` and terminate TLS at the platform
or reverse proxy. Verify `/2026/` and an archive deep link after rollout; keep the
previous image tag available for rollback. Hosting credentials and rollout
configuration are supplied by the deployment environment, not by this repository.

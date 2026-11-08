# Container deployment

Build **from the repository root**. The Dockerfile remains at its historical
`apps/old-site/Dockerfile` location, but the image now contains both applications:

```sh
docker build -f apps/old-site/Dockerfile -t meichu-website:local .
docker run --rm -p 127.0.0.1:8080:80 meichu-website:local
```

The build stage uses Node 24 and pnpm 10.28.1, installs the whole workspace with
`--frozen-lockfile --ignore-scripts`, and builds both sites. The runtime image
contains nginx and the generated static files; Node, source files and development
dependencies remain in the build stage. `.dockerignore` excludes local dependency
directories, generated output and credentials from the build context.

The nginx configuration is copied into the image and defines one routing contract:

| Request | Result |
| --- | --- |
| `/` or `/2026` | Relative redirect to `/2026/`, preserving the query string |
| `/2026/…` | 2026 application, with its own `/2026/assets/` namespace and SPA fallback |
| `/2019/…` through `/2025/…` | Archive application and its SPA fallback |
| `/assets/…` and existing root public files | Archive assets |
| Unknown years or unknown root paths | HTTP 404 |
| Missing files under either assets directory | HTTP 404, never SPA HTML |
| `/healthz` | HTTP 200, used by the container health check |

No year cookie or Referer header selects an application. Relative redirects also
work when the image is published on a different host port or placed behind a TLS
reverse proxy. The API remains the external endpoint configured by
`packages/services`; this image does not start or proxy a backend API.

Run the repeatable container check with Node 24 and a running Docker daemon:

```sh
# Build the image, start it on a temporary loopback port, test it, remove the test container.
node scripts/smoke-container.mjs

# Validate an image already built by CI or a release pipeline.
node scripts/smoke-container.mjs --image meichu-website:local
```

The smoke check verifies both entry points, all seven archive years, deep links,
query-preserving redirects, emitted JavaScript/CSS/fonts/images, cross-year
cookies, and unknown/missing paths. It creates and removes only its own temporary
container. It does not publish the image or change a production deployment.

For a release, build an immutable application-specific image tag, run the smoke
check against that exact tag, then use the hosting platform's deployment command.
Point the platform health probe to `/healthz` and terminate TLS at the platform
or reverse proxy. Verify `/2026/` and an archive deep link after rollout; keep the
previous image tag available for rollback. Hosting credentials and rollout
configuration are supplied by the deployment environment, not by this repository.

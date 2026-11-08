# Meichu Game Web (New)

This repository contains the source code for the Meichu Game websites, structured as a monorepo.

## Project Structure

*   **apps/**
    *   **old-site/**: The legacy website serving years 2019-2025. Built with Vue 2.7 + Vite.
    *   **site-2026/**: The new website for 2026. Built with Vue 3 + Vite + Node 24.
*   **packages/**
    *   **services/**: Shared API services and utilities.
*   **dev-proxy.js**: A local development proxy server that routes traffic between different apps based on the URL year.

## Getting Started

### Prerequisites

*   **Node.js**: The project is configured to support newer Node versions (e.g., Node 24) for new apps, while maintaining compatibility for legacy apps via pnpm settings.
*   **pnpm**: Package manager (v10+).

### Installation

```bash
pnpm install
```

### Development

To start the development environment, simply run:

```bash
pnpm start
```

This command simultaneously starts:
1.  `old-site` (Port 3030)
2.  `site-2026` (and any other `site-*` apps)
3.  `dev-proxy` (Port 8080)

**Open your browser at:** [http://localhost:8080](http://localhost:8080)

## How Routing Works

The **Proxy Server** (`dev-proxy.js`) listens on `127.0.0.1:8080` and uses only
URL paths to select a site:

* `/` redirects to `/2026/`, preserving the query string.
* `/2026` redirects to `/2026/`. `/2026/…` is forwarded unchanged to
  **site-2026** on port **22026**.
* `/2019/…` through `/2025/…`, legacy `/assets/…` files and legacy public
  assets go to **old-site** on port **3030**.
* Only exact `apps/site-YYYY` directories containing a `package.json` register a
  new year. Missing years (including `/2027/` until that app exists), malformed
  year prefixes such as `/20260/`, and unknown root paths return **404**.
* HTTP and Vite HMR WebSocket upgrades use the same routing rules. The year
  prefix is preserved, including query parameters and Vite's HMR token.

Every new site's Vite public `base` and router history base must be `/YYYY/`.
Its module, CSS, image and HMR URLs therefore carry the year themselves; the
proxy never uses a shared cookie or Referer to guess their owner. Archive assets
remain root-relative. Old `meichu-year` cookies are ignored.

Production servers must mount the 2026 `dist` directory at `/2026/` with a
fallback to `/2026/index.html`, and mount the archive `dist` directory at the
root with a fallback to its index for the known archive years. Apply the same
root redirect and unknown-year policy; do not strip the new site's year prefix.

## How to Add a New Year (e.g., 2027)

1. Create `apps/site-2027` with its own `package.json` and a `dev` script.
2. Set Vite's `base` and port, and keep the port strict so a busy port fails
   explicitly instead of silently serving a different site:

   ```javascript
   export default defineConfig({
     base: '/2027/',
     server: { port: 22027, strictPort: true },
     // plugins, aliases, etc.
   })
   ```

3. Configure Vue Router with `createWebHistory(import.meta.env.BASE_URL)`.
   Prefix public URLs with `import.meta.env.BASE_URL` in JavaScript or
   `%BASE_URL%` in the HTML entry. Do not infer the router base from the current URL.
4. Restart `pnpm start`. The startup script discovers `site-*` workspaces and
   the proxy registers the exact `site-2027` app. Vite's default HMR connection
   uses the proxy origin and `/2027/` path; no separate HMR port is needed.
5. Add the new year to the production server's site mounts. Change the proxy's
   `defaultYear` and production root redirect together when it becomes the
   current homepage year.

## Technology Stack

*   **Old Site**: Vue 2.7, Vite, Bootstrap
*   **New Sites (2026+)**: Vue 3, Vite, Tailwind/Custom CSS
*   **Package Manager**: pnpm (configured with `shamefully-hoist=true` for legacy compatibility)

## Tests

Run the component and request-state regressions with:

```bash
pnpm test
```

The browser suite builds both apps, serves their production output on temporary localhost ports, and substitutes API fixtures. It checks announcement links, attachments, loading/empty/error states, retry, timeout, and out-of-order responses without calling the production API. It also starts isolated Vite servers and the real proxy to check simultaneous archive/current/future tabs, dynamic imports, canonical redirects, unknown years and each site's HMR WebSocket channel.

```bash
pnpm exec playwright install chromium
pnpm test:browser
```

To use an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable. Screenshots are saved in the system temporary directory under `meichu-p1-screenshots`, or in `P1_SCREENSHOTS` when provided.

## Container deployment

The production image contains both sites and nginx's year-specific routing.
From the repository root, run `pnpm test:container` to build it and verify its
HTTP routes and emitted assets. See [deployment instructions](docs/deployment.md)
for image build/run commands, health checks and release validation.

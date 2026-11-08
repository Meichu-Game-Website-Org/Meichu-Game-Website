# Social sharing

Both production builds emit Open Graph, Twitter card and canonical metadata in the
initial HTML, without JavaScript or API requests. Each implemented static route
and archive year has its own HTML entry, with the matching edition title, language,
description, favicon and a committed 1200 × 630 PNG of existing edition artwork.

`pnpm --filter old-site build` and `pnpm --filter site-2026 build` run the metadata
generator after Vite. Serve these outputs with the repository's nginx config;
serving every route through a single root `index.html` loses the per-year metadata.

Game/news detail pages use the correct year's **generic** game/news description
and artwork. nginx fills their canonical and `og:url` from a strict safe route
allowlist at the fixed `https://meichu.games` origin. Query parameters and incoming
Host headers are never reflected. Private template files are not public pages.
The client updates its title and metadata when API content arrives; social bots
receive the generic detail card, **not** a server-rendered article title or live score.
Specific article previews would require a separate prerender/SSR data strategy.

Card assets are committed so production builds do not need a browser. To regenerate
them from the repository's existing artwork and font, install Playwright Chromium
and run `node scripts/render-sharing-cards.mjs`. An existing Chrome may be selected
with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. This script renders locally and makes no
API requests. Keep all eight output PNGs with their matching edition.

`pnpm test` checks URL/HTML safety and image files; `pnpm test:browser` checks built
HTML with JavaScript disabled plus client navigation. `pnpm test:container` checks
actual nginx responses for crawlers, deep routes, images and hostile URL inputs.

The canonical production origin is explicitly `https://meichu.games`; change and
test the shared metadata and nginx configuration together if that origin changes.
This change does not deploy the site or invalidate social platforms' existing
preview caches. Live preview/cache validation remains a post-deployment task.

The metadata follows the [Open Graph protocol](https://ogp.me/), including its four
required properties and image dimension/alt attributes. The PNG card dimensions
are a project convention; final presentation is controlled by each social platform.

# Archived websites (2019–2025)

Use Node 24 and pnpm from the repository root:

```sh
pnpm install
pnpm --filter old-site serve
pnpm --filter old-site build
pnpm --filter old-site preview
```

Vite serves the archive on port 3030. The root `pnpm start` command also starts
the year-routing proxy. Production output remains in `apps/old-site/dist`;
hosting must fall back to `index.html` for history-mode routes such as
`/2020/game/baseball`. All years use root-relative asset URLs.

Templates are compiled with `@vitejs/plugin-vue2`, and the browser receives only
Vue's runtime build. Vue 2 and this compatibility plugin are end-of-life; this
build migration removes the Vue CLI/Webpack dependency chain without changing
the archive's framework or page behavior.

`@vitejs/plugin-legacy` uses the existing `browserslist` targets from package.json
to emit SystemJS fallback bundles and usage-based polyfills alongside modern
modules. Tests force the fallback path in Chromium; they do not certify actual
Internet Explorer behavior.

Run the shared regressions and production browser checks from the root:

```sh
pnpm test
pnpm test:browser
```

The browser checks cover every archived year and verify emitted stylesheet
images and shared fonts. `pnpm --filter old-site lint` runs modern ESLint without
automatically editing files. Historical lint findings, primarily in `Snake.vue`,
remain and are not suppressed by the build migration.

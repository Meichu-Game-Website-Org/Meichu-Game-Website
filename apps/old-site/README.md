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

Templates are compiled with `@vitejs/plugin-vue`, and the browser receives only
Vue 3's runtime build. Vue Router 4 preserves the existing named archive routes.
The small metadata adapter in `src/metadata.js` retains the archive's `metaInfo`
options without installing Vue 2, vue-meta, deepmerge or a compatibility runtime.

Vue 3 requires native ES2016 support and does not support Internet Explorer,
because its reactivity depends on Proxy. The browser targets explicitly require
ES modules and exclude dead browsers; this is an intentional change from the
former Vue 2 archive. See the [Vue browser support policy](https://vuejs.org/about/faq.html#what-browsers-does-vue-support).
`@vitejs/plugin-legacy` still emits a SystemJS fallback and usage-based polyfills
for supported browsers that lack newer syntax/features. Tests force that path
in Chromium; they do not emulate or certify IE.

Run the shared regressions and production browser checks from the root:

```sh
pnpm test
pnpm test:browser
```

The browser checks cover every archived year and verify emitted stylesheet
images and shared fonts. `pnpm --filter old-site lint` runs modern ESLint without
automatically editing files. Metadata tests also cover asynchronous titles,
cross-year favicon changes, named slots and KeepAlive navigation.

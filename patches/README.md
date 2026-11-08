# Dependency maintenance

Both website applications now use maintained Vue 3. The archive no longer
installs Vue 2, `vue-template-compiler`, `@vitejs/plugin-vue2`, `vue-meta` or
`deepmerge`; the temporary Vue 2 compiler and deepmerge patches have been
removed instead of suppressing their advisories.

Archive metadata is handled by `apps/old-site/src/metadata.js`. It copies only
known own fields (title, title template, description and root-relative favicon)
and assigns text/attributes through DOM APIs. It never recursively merges API
objects or interprets their content as HTML. Watchers track asynchronous page
metadata, while unmount and KeepAlive deactivation remove stale entries.

Use the pinned pnpm version and `pnpm install --frozen-lockfile`, then run
`pnpm test`, `pnpm test:browser` and `pnpm audit`. No advisory IDs are suppressed.
The regression suite verifies the removed packages stay absent, inherited fields
cannot affect metadata, and the current Vue compiler handles the historical
hostile-template cases.

## ESLint's minimatch dependency

The scoped ESLint and `@eslint/config-array` overrides select minimatch 11.0.5 to
fix [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), while
their published ranges still select the affected 10.x line. The overrides are
restricted to these parents and preserve the CommonJS API used by ESLint.
`tests/lint-toolchain.test.cjs` checks Vue file selection, parsing and
undefined-variable diagnostics. Remove the overrides once upstream packages
accept a patched minimatch version.

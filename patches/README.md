# Dependency security patches

Install with the pinned pnpm version and `pnpm install --frozen-lockfile` so the
lockfile's patch hashes are verified. Run `pnpm test`, `pnpm test:browser` and
`pnpm audit` after dependency updates. No advisory IDs are suppressed.

## ESLint's minimatch dependency

The scoped `eslint@^10.14.0>minimatch` override selects 11.0.5 to fix
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), while
ESLint's published range still selects the affected 10.x line. It is restricted
to this parent and preserves the CommonJS API used by ESLint. The lint contract
test checks Vue file selection, parsing and undefined-variable diagnostics.
The override also produced identical diagnostics for all 108 existing source
files. Remove it once upstream ESLint accepts a patched minimatch version.

## deepmerge

`deepmerge@4.3.1.patch` blocks `__proto__` keys before copying from either
argument in the source, CommonJS and UMD builds. This closes the
[prototype-poisoning bypass](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)
for null-prototype targets, nested placeholders and objects carrying their own
`__proto__` property. `vue-meta` imports the patched CommonJS package through
Vite; its metadata behavior and ordinary array/symbol merging are preserved.

There is currently no published fixed deepmerge version. The version-based low
advisory therefore remains visible in `pnpm audit`; no audit suppression is
configured. `tests/dependency-security.test.cjs` reproduces the bypass against
the unpatched package and tests the installed patched package. Revisit this
patch when upstream publishes a fix.

## Vue 2 compiler

`vue-compiler-sfc-2.7.16.patch` hardens the compiler used by the legacy site's
`@vitejs/plugin-vue2` through `vue/compiler-sfc`. Keep this version-specific
patch registered in the root `pnpm-workspace.yaml` configuration:

```yaml
patchedDependencies:
  '@vue/compiler-sfc@2.7.16': patches/vue-compiler-sfc-2.7.16.patch
```

The changes address two problems in the shared Vue 2 compiler implementation:

- [CVE-2024-9506](https://github.com/advisories/GHSA-5j4c-8p2g-v4jx): raw-text
  parsing now searches for a fixed closing-tag prefix and then the next `>`.
  Both searches are linear. This preserves mixed-case closing tags and source
  offsets without repeatedly attempting an unanchored wildcard expression.
- [CVE-2024-6783](https://github.com/advisories/GHSA-g3ch-rx76-35fx): element AST
  records have no prototype, so inherited `staticClass` and `staticStyle`
  expressions cannot become generated render code. The raw-text regex cache
  also has no prototype.

This is a local source patch, not an official Vue 2 release. The application
uses Vue's runtime-only browser entry, so it does not compile templates supplied
by API responses or browser users. The build compiles repository-owned SFCs.
`vue-template-compiler` must remain absent after the Vite migration; it contains
another copy of the affected code.

The published `vue@2.7.16` package also contains full compiler builds under
`vue/dist/`. Those unused builds are **not** changed by this patch. Do not add a
compiler-enabled Vue alias or import a full build without revisiting these
advisories. The test suite checks the installed default browser entry and
runtime entry, and directly exercises the SFC compiler resolved by the legacy
application.

Vue 2 is end of life and its advisory covers every Vue 2 version. `pnpm audit`
will therefore continue reporting the Vue 2 low-severity advisory even with
this patch. Do not ignore it, change package versions to evade detection, or
describe this patch as eliminating all Vue 2 risk. Migrating the legacy runtime
and its router/metadata integrations to maintained Vue 3 is the path to removing
the dependency-level finding.

`tests/legacy-compiler-security.test.cjs` covers hostile unclosed raw-text,
prototype-polluted code generation, valid text/template semantics, and the
runtime-only entry. The two hostile-input regressions fail against the original
2.7.16 compiler and pass with the patch. Run them after every clean frozen-lockfile
install, and review or remove this patch whenever the legacy compiler changes.

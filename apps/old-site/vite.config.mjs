import { fileURLToPath, URL } from 'node:url'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

const require = createRequire(import.meta.url)

export default defineConfig({
  // All archived years share one history-mode router and root-relative assets.
  base: '/',
  plugins: [
    vue(),
    // Keep a SystemJS fallback for supported browsers lacking newer features.
    legacy({
      targets: require('./package.json').browserslist,
      additionalLegacyPolyfills: ['core-js/modules/es.promise.js']
    })
  ],
  resolve: {
    alias: [
      // Templates are compiled at build time; do not ship Vue's runtime compiler.
      { find: /^vue$/, replacement: require.resolve('vue/dist/vue.runtime.esm-bundler.js') },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@meichu/assets', replacement: fileURLToPath(new URL('../../packages/assets', import.meta.url)) }
    ],
    // Existing archive components omit .vue in their imports.
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: { port: 3030, strictPort: true }
})

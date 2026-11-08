import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/scss/_base.scss"
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import axios from 'axios'
import router from './router.js'
import { installMetadata } from '@meichu/services/src/metadata.mjs'

const app = createApp(App)
installMetadata(app, document, router)
app.use(router)

// Global properties in Vue 3
app.config.globalProperties.$http = axios
app.config.productionTip = false

// Set default axios credentials
axios.defaults.withCredentials = true

// Handle routing scroll (moved to router configuration in Vue 3)
// router.afterEach(...) logic is handled by router's scrollBehavior usually.

router.isReady().then(() => app.mount('#app'))

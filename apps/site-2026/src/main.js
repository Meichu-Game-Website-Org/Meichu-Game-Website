import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/scss/_base.scss"
import moment from 'moment'
import axios from 'axios'
import router from './router.js'

// VueMeta is not fully compatible with Vue 3 yet (alpha stage), and usually @vueuse/head is preferred.
// For now, we omit it to ensure the app runs.
// import VueMeta from 'vue-meta'

const app = createApp(App)

app.use(router)

// app.use(VueMeta, {
//   refreshOnceOnNavigation: true
// })

// Global properties in Vue 3
app.config.globalProperties.$http = axios
app.config.productionTip = false

// Set default axios credentials
axios.defaults.withCredentials = true

// Handle routing scroll (moved to router configuration in Vue 3)
// router.afterEach(...) logic is handled by router's scrollBehavior usually.

app.mount('#app')

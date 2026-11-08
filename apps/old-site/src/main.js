import { createApp } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import App from './App.vue'
import axios from 'axios'
import router from './router.js'
import { installMetadata } from './metadata.js'

axios.defaults.withCredentials = true
const app = createApp(App)
installMetadata(app, document, router)
app.use(router)
router.isReady().then(() => app.mount('#app'))


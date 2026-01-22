import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import moment from 'moment'
import axios from 'axios'
import router from './router.js'
import VueMeta from 'vue-meta'

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})

Vue.use(VueRouter)

axios.defaults.withCredentials = true
Vue.config.productionTip = false

// eslint-disable-next-line
router.afterEach((to, from, failure) => {
  window.scrollTo(0, 0);
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')


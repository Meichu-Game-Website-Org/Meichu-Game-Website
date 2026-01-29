import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'

import AppView2026 from '@/pages/AppView.vue'
import IndexPage2026 from '@/pages/IndexPage.vue'
import GameShowPage2026 from '@/pages/GameShowPage.vue'
import GameListPage2026 from '@/pages/GameListPage.vue'
import AboutPage2026 from '@/pages/AboutPage.vue'
import HistoryPage2026 from '@/pages/HistoryPage.vue'

axios.defaults.withCredentials = true

const routes = [
  {
    path: '/',
    component: AppView2026,
    children: [{
      path: '',
      name: 'index-2026',
      component: IndexPage2026,
      meta: { keepAlive: true }
    },
    {
      path: 'game/:slug',
      name: 'game-show-2026',
      component: GameShowPage2026
    },
    {
      path: 'game',
      name: 'game-list-2026',
      component: GameListPage2026
    },
    {
      path: 'about',
      name: 'about-2026',
      component: AboutPage2026
    },
    {
      path: 'history',
      name: 'history-2026',
      component: HistoryPage2026
    }
    ]
  },
  // Fallback for when the router is accessed via /2026/ path but history base is not set
  {
    path: '/2026',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(window.location.pathname.startsWith('/2026') ? '/2026/' : '/'),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router

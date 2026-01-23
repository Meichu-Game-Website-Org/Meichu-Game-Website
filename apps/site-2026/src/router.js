import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'

import AppView2025 from '@/pages/AppView.vue'
import IndexPage2025 from '@/pages/IndexPage.vue'
import GameShowPage2025 from '@/pages/GameShowPage.vue'
import GameListPage2025 from '@/pages/GameListPage.vue'
import AboutPage2025 from '@/pages/AboutPage.vue'
import HistoryPage2025 from '@/pages/HistoryPage.vue'

axios.defaults.withCredentials = true

const routes = [
  {
    path: '/2026/',
    component: AppView2025,
    children: [{
      path: '',
      name: 'index-2025',
      component: IndexPage2025,
      meta: { keepAlive: true }
    },
    {
      path: 'game/:slug',
      name: 'game-show-2025',
      component: GameShowPage2025
    },
    {
      path: 'game',
      name: 'game-list-2025',
      component: GameListPage2025
    },
    {
      path: 'about',
      name: 'about-2025',
      component: AboutPage2025
    },
    {
      path: 'history',
      name: 'history-2025',
      component: HistoryPage2025
    }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router

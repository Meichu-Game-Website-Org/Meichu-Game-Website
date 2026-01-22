import VueRouter from 'vue-router'
import axios from 'axios'

const AppView2019 = () => import('@/pages/2019/AppView.vue')
const IndexPage2019 = () => import('@/pages/2019/IndexPage.vue')
const GameShowPage2019 = () => import('@/pages/2019/GameShowPage.vue')
const GameListPage2019 = () => import('@/pages/2019/GameListPage.vue')
const NewsShowPage2019 = () => import('@/pages/2019/NewsShowPage.vue')
const NewsListPage2019 = () => import('@/pages/2019/NewsListPage.vue')
const AboutPage2019 = () => import('@/pages/2019/AboutPage.vue')

// import AppView2019 from '@/pages/2019/AppView.vue'
// import IndexPage2019 from '@/pages/2019/IndexPage.vue'
// import GameShowPage2019 from '@/pages/2019/GameShowPage.vue'
// import GameListPage2019 from '@/pages/2019/GameListPage.vue'
// import NewsShowPage2019 from '@/pages/2019/NewsShowPage.vue'
// import NewsListPage2019 from '@/pages/2019/NewsListPage.vue'
// import AboutPage2019 from '@/pages/2019/AboutPage.vue'

const AppView2020 = () => import('@/pages/2020/AppView.vue')
const IndexPage2020 = () => import('@/pages/2020/IndexPage.vue')
const GameShowPage2020 = () => import('@/pages/2020/GameShowPage.vue')
const GameListPage2020 = () => import('@/pages/2020/GameListPage.vue')
const NewsShowPage2020 = () => import('@/pages/2020/NewsShowPage.vue')
const NewsListPage2020 = () => import('@/pages/2020/NewsListPage.vue')
const AboutPage2020 = () => import('@/pages/2020/AboutPage.vue')
const HistoryPage2020 = () => import('@/pages/2020/HistoryPage.vue')

// import AppView2020 from '@/pages/2020/AppView.vue'
// import IndexPage2020 from '@/pages/2020/IndexPage.vue'
// import GameShowPage2020 from '@/pages/2020/GameShowPage.vue'
// import GameListPage2020 from '@/pages/2020/GameListPage.vue'
// import NewsShowPage2020 from '@/pages/2020/NewsShowPage.vue'
// import NewsListPage2020 from '@/pages/2020/NewsListPage.vue'
// import AboutPage2020 from '@/pages/2020/AboutPage.vue'
// import HistoryPage2020 from '@/pages/2020/HistoryPage.vue'

const AppView2021 = () => import('@/pages/2021/AppView.vue')
const IndexPage2021 = () => import('@/pages/2021/IndexPage.vue')
const GameShowPage2021 = () => import('@/pages/2021/GameShowPage.vue')
const GameListPage2021 = () => import('@/pages/2021/GameListPage.vue')
const NewsShowPage2021 = () => import('@/pages/2021/NewsShowPage.vue')
const NewsListPage2021 = () => import('@/pages/2021/NewsListPage.vue')
const AboutPage2021 = () => import('@/pages/2021/AboutPage.vue')
const HistoryPage2021 = () => import('@/pages/2021/HistoryPage.vue')

// import AppView2021 from '@/pages/2021/AppView.vue'
// import IndexPage2021 from '@/pages/2021/IndexPage.vue'
// import GameShowPage2021 from '@/pages/2021/GameShowPage.vue'
// import GameListPage2021 from '@/pages/2021/GameListPage.vue'
// import NewsShowPage2021 from '@/pages/2021/NewsShowPage.vue'
// import NewsListPage2021 from '@/pages/2021/NewsListPage.vue'
// import AboutPage2021 from '@/pages/2021/AboutPage.vue'
// import HistoryPage2021 from '@/pages/2021/HistoryPage.vue'

const AppView2022 = () => import('@/pages/2022/AppView.vue')
const IndexPage2022 = () => import('@/pages/2022/IndexPage.vue')
const GameShowPage2022 = () => import('@/pages/2022/GameShowPage.vue')
const GameListPage2022 = () => import('@/pages/2022/GameListPage.vue')
const NewsShowPage2022 = () => import('@/pages/2022/NewsShowPage.vue')
const NewsListPage2022 = () => import('@/pages/2022/NewsListPage.vue')
const AboutPage2022 = () => import('@/pages/2022/AboutPage.vue')
const HistoryPage2022 = () => import('@/pages/2022/HistoryPage.vue')

// import AppView2022 from '@/pages/2022/AppView.vue'
// import IndexPage2022 from '@/pages/2022/IndexPage.vue'
// import GameShowPage2022 from '@/pages/2022/GameShowPage.vue'
// import GameListPage2022 from '@/pages/2022/GameListPage.vue'
// import NewsShowPage2022 from '@/pages/2022/NewsShowPage.vue'
// import NewsListPage2022 from '@/pages/2022/NewsListPage.vue'
// import AboutPage2022 from '@/pages/2022/AboutPage.vue'
// import HistoryPage2022 from '@/pages/2022/HistoryPage.vue'

import AppView2023 from '@/pages/2023/AppView.vue'
import IndexPage2023 from '@/pages/2023/IndexPage.vue'
import GameShowPage2023 from '@/pages/2023/GameShowPage.vue'
import GameListPage2023 from '@/pages/2023/GameListPage.vue'
import NewsShowPage2023 from '@/pages/2023/NewsShowPage.vue'
import NewsListPage2023 from '@/pages/2023/NewsListPage.vue'
import AboutPage2023 from '@/pages/2023/AboutPage.vue'
import HistoryPage2023 from '@/pages/2023/HistoryPage.vue'
import CoursePage2023 from '@/pages/2023/CoursePage.vue'

import AppView2024 from '@/pages/2024/AppView.vue'
import IndexPage2024 from '@/pages/2024/IndexPage.vue'
import GameShowPage2024 from '@/pages/2024/GameShowPage.vue'
import GameListPage2024 from '@/pages/2024/GameListPage.vue'
import NewsShowPage2024 from '@/pages/2024/NewsShowPage.vue'
import NewsListPage2024 from '@/pages/2024/NewsListPage.vue'
import AboutPage2024 from '@/pages/2024/AboutPage.vue'
import HistoryPage2024 from '@/pages/2024/HistoryPage.vue'
import CoursePage2024 from '@/pages/2024/CoursePage.vue'

import AppView2025 from '@/pages/2025/AppView.vue'
import IndexPage2025 from '@/pages/2025/IndexPage.vue'
import GameShowPage2025 from '@/pages/2025/GameShowPage.vue'
import GameListPage2025 from '@/pages/2025/GameListPage.vue'
import AboutPage2025 from '@/pages/2025/AboutPage.vue'
import HistoryPage2025 from '@/pages/2025/HistoryPage.vue'
axios.defaults.withCredentials = true

const routes = [
  {
    path: '/',
    redirect: '/2025'
  },
  {
    path: '/2023/',
    redirect: '/2024'
  },
  {
    path: '/2019/',
    component: AppView2019,
    children: [{
      path: '',
      name: 'index',
      component: IndexPage2019,
    },
    {
      path: 'game/:slug',
      name: 'game-show',
      component: GameShowPage2019
    },
    {
      path: 'game',
      name: 'game-list',
      component: GameListPage2019
    },
    {
      path: 'news/:id',
      name: 'news-show',
      component: NewsShowPage2019
    },
    {
      path: 'news',
      name: 'news-list',
      component: NewsListPage2019
    },
    {
      path: 'about',
      name: 'about',
      component: AboutPage2019
    }
    ]
  },
  {
    path: '/2020/',
    component: AppView2020,
    children: [{
      path: '',
      name: 'index-2020',
      component: IndexPage2020,
    },
    {
      path: 'game/:slug',
      name: 'game-show-2020',
      component: GameShowPage2020
    },
    {
      path: 'game',
      name: 'game-list-2020',
      component: GameListPage2020
    },
    {
      path: 'news/:id',
      name: 'news-show-2020',
      component: NewsShowPage2020
    },
    {
      path: 'news',
      name: 'news-list-2020',
      component: NewsListPage2020
    },
    {
      path: 'about',
      name: 'about-2020',
      component: AboutPage2020
    },
    {
      path: 'history',
      name: 'history-2020',
      component: HistoryPage2020
    }
    ]
  },
  {
    path: '/2021/',
    component: AppView2021,
    children: [{
      path: '',
      name: 'index-2021',
      component: IndexPage2021,
    },
    {
      path: 'game/:slug',
      name: 'game-show-2021',
      component: GameShowPage2021
    },
    {
      path: 'game',
      name: 'game-list-2021',
      component: GameListPage2021
    },
    {
      path: 'news/:id',
      name: 'news-show-2021',
      component: NewsShowPage2021
    },
    {
      path: 'news',
      name: 'news-list-2021',
      component: NewsListPage2021
    },
    {
      path: 'about',
      name: 'about-2021',
      component: AboutPage2021
    },
    {
      path: 'history',
      name: 'history-2021',
      component: HistoryPage2021
    }
    ]
  },
  {
    path: '/2022/',
    component: AppView2022,
    children: [{
      path: '',
      name: 'index-2022',
      component: IndexPage2022,
    },
    {
      path: 'game/:slug',
      name: 'game-show-2022',
      component: GameShowPage2022
    },
    {
      path: 'game',
      name: 'game-list-2022',
      component: GameListPage2022
    },
    {
      path: 'news/:id',
      name: 'news-show-2022',
      component: NewsShowPage2022
    },
    {
      path: 'news',
      name: 'news-list-2022',
      component: NewsListPage2022
    },
    {
      path: 'about',
      name: 'about-2022',
      component: AboutPage2022
    },
    {
      path: 'history',
      name: 'history-2022',
      component: HistoryPage2022
    }
    ]
  },
  {
    path: '/2023_temp/',
    component: AppView2023,
    children: [{
      path: '',
      name: 'index-2023',
      component: IndexPage2023,
    },
    {
      path: 'game/:slug',
      name: 'game-show-2023',
      component: GameShowPage2023
    },
    {
      path: 'game',
      name: 'game-list-2023',
      component: GameListPage2023
    },
    {
      path: 'news/:id',
      name: 'news-show-2023',
      component: NewsShowPage2023
    },
    {
      path: 'news',
      name: 'news-list-2023',
      component: NewsListPage2023
    },
    {
      path: 'about',
      name: 'about-2023',
      component: AboutPage2023
    },
    {
      path: 'course',
      name: 'course-2023',
      component: CoursePage2023
    },
    {
      path: 'history',
      name: 'history-2023',
      component: HistoryPage2023
    }
    ]
  },
  {
    path: '/2024/',
    component: AppView2024,
    children: [{
      path: '',
      name: 'index-2024',
      component: IndexPage2024,
    },
    {
      path: 'game/:slug',
      name: 'game-show-2024',
      component: GameShowPage2024
    },
    {
      path: 'game',
      name: 'game-list-2024',
      component: GameListPage2024
    },
    {
      path: 'news/:id',
      name: 'news-show-2024',
      component: NewsShowPage2024
    },
    {
      path: 'news',
      name: 'news-list-2024',
      component: NewsListPage2024
    },
    {
      path: 'about',
      name: 'about-2024',
      component: AboutPage2024
    },
    {
      path: 'course',
      name: 'course-2024',
      component: CoursePage2024
    },
    {
      path: 'history',
      name: 'history-2024',
      component: HistoryPage2024
    }
    ]
  },
  {
    path: '/2025/',
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

const router = new VueRouter({
  mode: 'history',
  routes,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior (to, from, savedPosition) {
    var wraps = document.getElementById('wrapper')
    wraps.scrollTop = 0
    return { x: 0, y: 0 }
  }
})

export default router

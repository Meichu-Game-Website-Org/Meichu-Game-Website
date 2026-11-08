<template>
  <div>
    <div class="cover">
      <img src="@/assets/2020/cover.jpg" class="bg" alt="">
    </div>

    <div class="row">
      <div class="col-12 col-lg-4" :key="banner.image_url" v-for="banner in bannerList">
        <a v-if="banner.url" :href="banner.url" target="_blank">
          <img :src="banner.image_url" class="banner__image" />
        </a>
        <img v-else :src="banner.image_url" class="banner__image" />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <NewsPanel :is_sticky="true"><template #title><span>重要訊息</span></template></NewsPanel>
        <div class="see-all-news">
          <router-link :to="{name: 'news-list-2020'}">
            <i class="fas fa-arrow-circle-right"></i>&nbsp;<span>查看所有訊息</span>
          </router-link>
        </div>
      </div>
      <!-- <div class="col">
        <h2><i class="fab fa-youtube"></i> 宣傳影片</h2>
      </div> -->
    </div>

    <GameListPage />

  </div>
</template>

<script>

import GameListPage from './GameListPage.vue'
import NewsPanel from '@/components/2020/NewsPanel.vue'
// import GameItem from '@/components/2020/GameItem.vue'
import { Option as OptionApi } from '@meichu/services'
import { createBannerList, readBannerOptions } from '@/utils/banners.mjs'

export default {
  name: 'index',

  metaInfo: {
    title: '庚子梅竹 | 2020 Meichu Games',
    titleTemplate: '%s',
  },

  data() {
    return {
      options: {}
    }
  },

  components: {
    // GameItem,
    NewsPanel,
    GameListPage
  },

  computed: {
    bannerList() {
      return createBannerList(this.options)
    }
  },

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      const params = {
        data: ['banners', 'banner-links'],
        year_id: 2
      }
      return OptionApi.fetchOptions(params)
        .then(data => { this.options = readBannerOptions(data) })
        .catch(() => { this.options = readBannerOptions(null) })
    }
  }
}

</script>

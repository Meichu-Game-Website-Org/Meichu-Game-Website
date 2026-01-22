<template>
  <div>
    <!-- <div class="cover">
      <img src="@/assets/2021/cover.jpg" class="bg" alt="">
    </div> -->

    <div class="section index-banners">
      <div class="row">
        <div class="col-12 col-lg-4" :key="banner.image_url" v-for="banner in bannerList">
          <a v-if="banner.url" :href="banner.url" target="_blank">
            <img :src="banner.image_url" class="banner__image" />
          </a>
          <img v-else :src="banner.image_url" class="banner__image" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <NewsPanel :is_sticky="true"><span slot="title">重要公告</span></NewsPanel>
        <div class="see-all-news">
          <router-link :to="{name: 'news-list-2021'}">
            <i class="fas fa-arrow-circle-right"></i>&nbsp;<span>查看所有公告</span>
          </router-link>
        </div>
        <router-link :to="{name: ''}"></router-link>
      </div>
      <!-- <div class="col">
        <h2><i class="fab fa-youtube"></i> 宣傳影片</h2>
      </div> -->
    </div>

    <GameList></GameList>

  </div>
</template>

<script>

import NewsPanel from '@/components/2021/NewsPanel.vue'
import GameList from '@/components/2021/GameList.vue'
import { Option as OptionApi } from '@meichu/services'

export default {
  name: 'index',

  metaInfo: {
    title: '辛丑梅竹 | 2021 Meichu Games',
    titleTemplate: '%s',
  },

  data() {
    return {
      options: {}
    }
  },

  components: {
    GameList,
    NewsPanel
  },

  computed: {
    bannerList() {
      let banners = []
      if (!this.options.banners || !this.options['banner-links'].length) return []
      for (let i = 0; i < this.options.banners.length; i++) {
        let curBanner = {
          image_url: this.options.banners[i],
        }
        if (i < this.options['banner-links'].length) {
          curBanner['url'] = this.options['banner-links'][i]
        }
        banners.push(curBanner)
      }
      return banners
    }
  },

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      const params = {
        data: ['banners', 'banner-links'],
        year_id: 53
      }
      OptionApi.fetchOptions(params).then((data) => {
        this.options = Object.assign({}, ...data.options.map(option => ({
          [option.key]: option.value
        })))
      })
    }
  }
}

</script>
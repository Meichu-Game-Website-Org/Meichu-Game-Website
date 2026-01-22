<template>
  <div>
    <div class="news_list_page_back_box">
        <!-- <img src="@/assets/2024/news_background.svg" class="news_list_page_back" alt="" /> -->
      </div>
    <div class="">
      <img src="@/assets/2024/index_cover.svg" class="banner__image" alt="" />
      <img src="@/assets/2024/mobile_index_background.svg" class="mobile-index-background" alt="" />
    </div>
    <!-- <div class="index_pic">
        <img src="@/assets/2023/Rectangle_left.svg" class="rec_left" alt="" />
        <img src="@/assets/2023/fox.svg" class="fox" alt="" />

        <img src="@/assets/2023/words.svg" class="index_title" alt="" />
        <img src="@/assets/2023/Rectangle_right.svg" class="rec_right" alt="" />
        <img src="@/assets/2023/panda.svg" class="panda" alt="" />
    </div> -->
    <GameList></GameList>

  </div>
</template>

<script>

// import NewsPanel from '@/components/2023/NewsPanel.vue'
import GameList from '@/components/2024/GameList.vue'
import { Option as OptionApi } from '@meichu/services'

export default {
  name: 'index',

  metaInfo: {
    title: '甲辰梅竹 | 2024 Meichu Games',
    titleTemplate: '%s',
  },

  data() {
    return {
      options: {}
    }
  },

  components: {
    GameList
    // NewsPanel
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
        year_id: 54
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
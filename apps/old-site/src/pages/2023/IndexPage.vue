<template>
  <div>
    <!-- <div class="cover">
      <img src="@/assets/2021/cover.jpg" class="bg" alt="">
    </div> -->
    <div class="front_title">
      <img src="@/assets/2023/banner.svg" class="banner__image" alt="" />
    </div>
    <div class="index_pic">
        <img src="@/assets/2023/Rectangle_left.svg" class="rec_left" alt="" />
        <img src="@/assets/2023/fox.svg" class="fox" alt="" />

        <img src="@/assets/2023/words.svg" class="index_title" alt="" />
        <img src="@/assets/2023/Rectangle_right.svg" class="rec_right" alt="" />
        <img src="@/assets/2023/panda.svg" class="panda" alt="" />
    </div>
    <!-- <div class="section index-banners">
      <div class="row">
        <div class="col-12 col-lg-4" :key="banner.image_url" v-for="banner in bannerList">
          <a v-if="banner.url" :href="banner.url" target="_blank">
            <img :src="banner.image_url" class="banner__image" />
          </a>
          <img v-else :src="banner.image_url" class="banner__image" />
        </div>
      </div>
    </div> -->
    <!-- <div class="row">
      <div class="col margin-new">
        <div class="newspanel">
        <NewsPanel :is_sticky="true">
          <span class="message_title">訊息公告</span><img src="@/assets/2022/梅竹_圈-素材.svg" slot="title_circle_behind" class="title_circle_behind" alt="" />
        <div class="see-all-news">
          <router-link :to="{name: 'news-list-2022'}">
            <i class="fas fa-arrow-circle-right"></i>&nbsp;<span>查看所有公告</span>
          </router-link>
        </div>
        </div>
        <router-link :to="{name: ''}"></router-link>
      </div>
      <div class="col">
        <h2><i class="fab fa-youtube"></i> 宣傳影片</h2>
      </div> 
    </div> -->

    <GameList></GameList>

  </div>
</template>

<script>

// import NewsPanel from '@/components/2023/NewsPanel.vue'
import GameList from '@/components/2023/GameList.vue'
import { Option as OptionApi } from '@meichu/services'

export default {
  name: 'index',

  metaInfo: {
    title: '癸卯梅竹 | 2023 Meichu Games',
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
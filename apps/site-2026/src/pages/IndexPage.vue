<template>
  <div class="home">
    <!-- <IndexAnime /> -->
    <div class="cover">
      <img src="@/assets/index-cover-desktop.png" alt="Cover Image" v-if="isDesktop">
      <img src="@/assets/index-cover-mobile.png" alt="Cover Image" v-if="!isDesktop">
      <img src="@/assets/index-cover-mobile-bg.png" alt="" v-if="!isDesktop" class="cover-bg">
    </div>
    <template v-if="isDesktop">
      <Snake />
    </template>
    <CurrScore />
  </div>
</template>

<script>

import CurrScore from '@/components/CurrScore.vue'
// import IndexAnime from '@/components/IndexAnime.vue'
import Snake from '@/components/Snake.vue'
import { Option as OptionApi } from '@meichu/services'

export default {
  name: 'index',

  metaInfo: {
    title: '乙巳梅竹 | 2025 Meichu Games',
    titleTemplate: '%s',
  },

  data() {
    return {
      options: {},
      isDesktop: false,
    }
  },

  components: {
    CurrScore,
    Snake
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
    this.isDesktop = window.innerWidth > 1024
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
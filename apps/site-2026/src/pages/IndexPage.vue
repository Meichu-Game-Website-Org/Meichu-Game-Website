<template>
  <div class="home">
    <IndexAnime />

    <div class="cover">
      <img src="@/assets/index-cover-desktop.webp" alt="Cover Image" v-if="isDesktop">
    </div>

    <CurrScore />

    <div class="typing-container">
      <div class="text-group">
        <div class="text-line">丙心不懈，熊勢如虹驚八方</div>
        <div class="text-line">午場爭輝，狐姿似電耀全場</div>
      </div>
    </div>
  </div>
</template>

<script>

import IndexAnime from '@/components/IndexAnime.vue'
import CurrScore from '@/components/CurrScore.vue'
import { Option as OptionApi } from '@meichu/services'
import { YEAR_ID } from '@/utils'

export default {
  name: 'index',

  metaInfo: {
    title: '丙午梅竹 | 2026 Meichu Games',
    titleTemplate: '%s',
  },

  data() {
    return {
      options: {},
      isDesktop: false,
    }
  },

  components: {
    IndexAnime,
    CurrScore,
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
        year_id: YEAR_ID
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

<style lang="scss" scoped>
.home{
  margin-top: -80px;
  background-repeat: repeat-y;
  background-size: 100vw auto;
  background-position: center;
  @media (max-width: $screen-md) {
    margin-top: 0;
  }
  .cover {
    position: relative;
    width: 100vw;
    height: auto;
    img {
      position: relative;
      margin-top: -30px;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
      @media (max-width: $screen-sm) {
        margin-top: 0;
      }
    }
    @media (max-width: $screen-md) {
      display: none;
    }
  }

  .typing-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px 0;
  }

  .text-group {
    display: flex;
    flex-direction: column;
  }

  .text-line {
    font-size: 1.33rem; 
    line-height: 1.5;
    font-weight: 700;
    color: $primary;
    font-family: "Noto Serif TC";
    min-height: 1.5em; 
    white-space: nowrap; // Keep text on one line if possible

    @media (max-width: $screen-md) {
      font-size: 2rem;
    }
    
    @media (max-width: $screen-sm) {
      font-size: 1.5rem;
      white-space: normal; // Allow wrap on small screens if needed, but 'clamp' usually handles size
      word-break: break-all;
    }

    &:nth-child(2) {
      margin-left: 10em;

      @media (max-width: $screen-sm) {
        margin-left: 5em;
      }
    }
  }
}
</style>
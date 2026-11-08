<template>
  <div class="home">
    <!-- <IndexAnime /> -->
    <div class="cover">
      <img src="@/assets/2025/index-cover-desktop.png" alt="Cover Image" v-if="isDesktop">
      <img src="@/assets/2025/index-cover-mobile.png" alt="Cover Image" v-if="!isDesktop">
      <img src="@/assets/2025/index-cover-mobile-bg.png" alt="" v-if="!isDesktop" class="cover-bg">
    </div>
    <template v-if="isDesktop">
      <Snake />
    </template>
    <CurrScore />
  </div>
</template>

<script>
import CurrScore from '@/components/2025/CurrScore.vue'
import Snake from '@/components/2025/Snake.vue'

export default {
  name: 'index',
  metaInfo: {
    title: '乙巳梅竹 | 2025 Meichu Games',
    titleTemplate: '%s',
  },
  data() {
    return { isDesktop: false }
  },
  components: { CurrScore, Snake },
  created() {
    this.updateViewport()
  },
  mounted() {
    window.addEventListener('resize', this.updateViewport)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateViewport)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateViewport)
  },
  methods: {
    updateViewport() {
      this.isDesktop = window.innerWidth > 1024
    }
  }
}
</script>

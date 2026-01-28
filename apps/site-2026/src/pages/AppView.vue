<template>
  <div id="meichu2026">
    <MobileNav></MobileNav>
    <Nav></Nav>
    <div class="main">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>  
    </div>
    <footer>
      <Footer></Footer>
    </footer>
  </div>

</template>


<script>
import "@/assets/styles-2026.scss"
import Footer from '@/components/Footer.vue'
import Nav from '@/components/Nav.vue'
import MobileNav from '@/components/MobileNav.vue'

export default {
  name: 'app',

  metaInfo: {
    titleTemplate: '%s | 乙巳梅竹',
    description: '乙巳梅竹官方網站，提供賽程、票務、戰況、轉播等梅竹賽之即時資訊。',
    link: [
      { rel: 'icon', href: '/favicon2025.png' } //to-do
    ]
  },

  components: {
    Footer,
    Nav,
    MobileNav
  },

  data: function() {
    return {
      isIn: false,
      nctu: 100,
      nthu: 100
    }
  },

  created() {
    setTimeout(() => {
      this.isIn = true
    }, 1500)
    document.body.classList = []
    document.body.classList.add('meichu2026')
  },

  watch: {
    '$route.name'() {
      document.body.classList = []
      document.body.classList.add('meichu2026')
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  overflow-x: hidden;
  padding-top: 110px;
  @media (max-width: $screen-md) {
    padding-top: 0;
  }
}
</style>
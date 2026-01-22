<template>
  <div id="meichu2024">
    <!-- <div class="outline">
      <div class="outline-top"></div>
      <div class="outline-bottom"></div>
      <div class="outline-left"></div>
      <div class="outline-right"></div>
      <div class="outline-topright"></div>
      <div class="outline-bottomright"></div>
    </div> -->
    <!-- <MobileNav></MobileNav> -->

      <!-- <Header></Header> -->
    <MobileNav></MobileNav>
    <div class="main">
      
        <Nav></Nav>
      </div>
      <router-view></router-view>
    <footer>
      <Footer></Footer>
    </footer>
  </div>

</template>


<script>
import "@/assets/styles-2024.scss"
// import Header from '@/components/2023/Header'
import Footer from '@/components/2024/Footer'
import Nav from '@/components/2024/Nav'
import MobileNav from '@/components/2024/MobileNav'

export default {
  name: 'app',

  metaInfo: {
    titleTemplate: '%s | 甲辰梅竹',
    description: '甲辰梅竹官方網站，提供賽程、票務、戰況、轉播等梅竹賽之即時資訊。',
    link: [
      { rel: 'icon', href: '/favicon2023.ico' } //to-do
    ]
  },

  components: {
    // Header,
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
    document.body.classList.add('meichu2024')
  },

  watch: {
    '$route.name'() {
      document.body.classList = []
      document.body.classList.add('meichu2024')
    }
  }
}
</script>
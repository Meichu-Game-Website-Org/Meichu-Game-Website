<template>
  <div id="meichu2022">
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
import "@/assets/styles-2022.scss"
import Header from '@/components/2022/Header'
import Footer from '@/components/2022/Footer'
import Nav from '@/components/2022/Nav'
import MobileNav from '@/components/2022/MobileNav'

export default {
  name: 'app',

  metaInfo: {
    titleTemplate: '%s | 壬寅梅竹',
    description: '壬寅梅竹官方網站，提供賽程、票務、戰況、轉播等梅竹賽之即時資訊。',
    link: [
      { rel: 'icon', href: '/favicon2022.ico' }
    ]
  },

  components: {
    Header,
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
    document.body.classList.add('meichu2022')
  },

  watch: {
    '$route.name'() {
      document.body.classList = []
      document.body.classList.add('meichu2022')
    }
  }
}
</script>
<template>
  <div id="meichu2021">
    <div class="outline">
      <div class="outline-top"></div>
      <div class="outline-bottom"></div>
      <div class="outline-left"></div>
      <div class="outline-right"></div>
      <div class="outline-topright"></div>
      <div class="outline-bottomright"></div>
    </div>
    <MobileNav></MobileNav>
    <div class="context">
      <Header></Header>
      <div class="wrapper" id="wrapper">
        <div class="container-fluid main">
          <Nav></Nav>
          <router-view></router-view>
        </div>
        <footer>
          <Footer></Footer>
        </footer>
      </div>
    </div>
  </div>
</template>


<script>
import "@/assets/styles-2021.scss"
import Header from '@/components/2021/Header'
import Footer from '@/components/2021/Footer'
import Nav from '@/components/2021/Nav'
import MobileNav from '@/components/2021/MobileNav'

export default {
  name: 'app',

  metaInfo: {
    titleTemplate: '%s | 辛丑梅竹',
    description: '辛丑梅竹官方網站，提供賽程、票務、戰況、轉播等梅竹賽之即時資訊。',
    link: [
      { rel: 'icon', href: '/favicon2020.png' }
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
    document.body.classList.add('meichu2021')
  },

  watch: {
    '$route.name'() {
      document.body.classList = []
      document.body.classList.add('meichu2021')
    }
  }
}
</script>
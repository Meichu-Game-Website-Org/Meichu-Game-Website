<template>
  <div id="meichu2025">
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
import "@/assets/styles-2025.scss"
import Footer from '@/components/2025/Footer'
import Nav from '@/components/2025/Nav'
import MobileNav from '@/components/2025/MobileNav'

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
    document.body.classList.add('meichu2025')
  },

  watch: {
    '$route.name'() {
      document.body.classList = []
      document.body.classList.add('meichu2025')
    }
  }
}
</script>
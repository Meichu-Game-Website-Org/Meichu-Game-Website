<template>
  <div id="meichu2020">
    <Header></Header>
    <div class="wrapper">
      <div class="container-fluid main">
        <router-view></router-view>
      </div>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  </div>
</template>

<script>
import "@/assets/styles-2020.scss"
import Header from '@/components/2020/Header'
import Footer from '@/components/2020/Footer'

export default {
  name: 'app',

  metaInfo: {
    titleTemplate: '%s | 庚子梅竹',
    description: '庚子梅竹官方網站，提供賽程、票務、戰況、轉播等梅竹賽之即時資訊。',
    link: [
      { rel: 'icon', href: '/favicon2020.png' }
    ]
  },

  components: {
    Header,
    Footer
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
    document.body.classList.add('meichu2020')
  },

  watch: {
    '$route.name'() {
      document.body.classList = []
      document.body.classList.add('meichu2020')
    }
  },

  methods: {

    fightNTHU() {
      this.nthu -= 1
      if (this.nthu <= 0) {
        alert("2019 己亥梅竹，交大的朋友們，一起來觀戰！")
        this.nthu = 100
      }
    },

    fightNCTU() {
      this.nctu -= 1
      if (this.nctu <= 0) {
        alert("2019 己亥梅竹，清大的朋友們，一起來觀戰！")
        this.nctu = 100
      }
    }
  }
}
</script>
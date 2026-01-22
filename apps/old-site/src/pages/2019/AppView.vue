<template>
  <div id="meichu2019">

    <div class="background">
      <img src="@/assets/background-sm.jpg" class="bg" alt="">
    </div>

    <img src="@/assets/nctu.png" :class="{'nctu': true, 'in': isIn}" :style="{'opacity': nctu/100}" @click="fightNCTU" alt="">
    <div class="nctu-blood" v-if="nctu <= 90 && nctu >= 0">
      <span class="blood" :style="{'width': nctu + '%'}"></span>
    </div>
    <img src="@/assets/nthu.png" :class="{'nthu': true, 'in': isIn}" :style="{'opacity': nthu/100}" @click="fightNTHU"  alt="">
    <div class="nthu-blood" v-if="nthu <= 90 && nthu >= 0">
      <span class="blood" :style="{'width': nthu + '%'}"></span>
    </div>

    <div class="mask"></div>

    <div class="main">

      <Header />

      <router-view></router-view>

      <footer class="footer">
        Copyright © 2019 己亥梅竹賽籌備委員會<br>
        <router-link :to="{name: 'index-2022'}">
          壬寅梅竹
        </router-link>,
        <router-link :to="{name: 'index-2021'}">
          辛丑梅竹
        </router-link>, 
        <router-link :to="{name: 'index-2020'}">
          庚子梅竹
        </router-link>, 
        <router-link :to="{name: 'index'}">
          己亥梅竹
        </router-link>
      </footer>
      

    </div>

  </div>
</template>

<script>

import "@/assets/styles-2019.scss"
import Header from '@/components/2019/Header'

export default {
  name: 'app',

  components: {
    Header
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
    document.body.classList.add('meichu2019')
  },

  watch: {
    '$route.name'() {
      document.body.classList = []
      document.body.classList.add('meichu2019')
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
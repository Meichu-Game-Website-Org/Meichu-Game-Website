<template>
  <div class="desktop-nav">
    <nav>
      <div class="nav">
        <div class="nav-icon">
          <router-link class="" :to="{name: 'index-2025'}">
            <img src="@/assets/2025-logo.png" class="nav-logo" alt="">
          </router-link>
        </div>
        <div class="nav-content">
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'index-2025'}" custom v-slot="{ navigate }">
              <button @click="navigate" role="link" class="transparent-button">首頁</button>
            </router-link>
            <router-link class="nav-link__bg" :to="{name: 'index-2025'}">
              首頁
            </router-link>
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'game-list-2025'}" custom v-slot="{ navigate }">
              <button @click="navigate" role="link" class="transparent-button">賽事</button>
            </router-link>
            <router-link class="nav-link__bg" :to="{name: 'game-list-2025'}">
              賽事
            </router-link>          
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'about-2025'}" custom v-slot="{ navigate }">
              <button @click="navigate" role="link" class="transparent-button">關於</button>
            </router-link>
            <router-link class="nav-link__bg" :to="{name: 'about-2025'}">
              關於
            </router-link>
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'history-2025'}" custom v-slot="{ navigate }">
              <button @click="navigate" role="link" class="transparent-button">歷史</button>
            </router-link>
            <router-link class="nav-link__bg" :to="{name: 'history-2025'}">
              歷史
            </router-link>
          </div>
          <div class="nav-item">
            <a href="https://drive.google.com/drive/folders/1dExG8EBZiznedirvdd5vhJIwrgLIAsch?usp=sharing" class="nav-link schoolteam">
              獎勵辦法與<br/>梅竹法規
            </a>
            <a href="https://drive.google.com/drive/folders/1dExG8EBZiznedirvdd5vhJIwrgLIAsch?usp=sharing" class="nav-link__bg schoolteam">
              獎勵辦法與<br/>梅竹法規
            </a>
          </div>
          <div class="nav-item">
            <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" class="nav-link">
              <!-- <i class="fab fa-facebook"></i> -->
              Facebook
            </a>
            <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" class="nav-link__bg">
              <!-- <i class="fab fa-facebook"></i> -->
              Facebook
            </a>
          </div>
          <div class="nav-item">
            <a href="https://www.instagram.com/meichu_prep_cmte/" class="nav-link">
              <!-- <i class="fab fa-instagram"></i>  -->
              Instagram
            </a>
            <a href="https://www.instagram.com/meichu_prep_cmte/" class="nav-link__bg">
              <!-- <i class="fab fa-instagram"></i>  -->
              Instagram
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>


<script>
import skrollr from 'skrollr';

export default {
  name: 'Nav',
  mounted() {
    var s = skrollr.init();
    if (s.isMobile()) {
      s.destroy();
      return;
    }
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const navbar = document.querySelector('.desktop-nav nav .nav');
      // const navLinks = document.querySelectorAll('a.nav-item.nav-link__bg');

      if (window.scrollY > 0) {
        navbar.classList.add('navbar-gb');
      } else {
        navbar.classList.remove('navbar-gb');
      }
    }
  }
}
</script>

<style>
.navbar-gb {
  background-color: rgba(26, 26, 26); /* 你可以根據需要調整背景顏色 */
}
</style>
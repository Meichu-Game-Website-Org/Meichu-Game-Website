<template>
  <div class="desktop-nav">
    <nav>
      <div class="nav">
        <div class="nav-icon">
          <router-link class="" :to="{name: 'index-2025'}">
            <img src="@/assets/2025/2025-logo.png" class="nav-logo" alt="">
          </router-link>
        </div>
        <div class="nav-content">
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'index-2025'}">
              <span class="nav-link__label">首頁</span>
              <span class="nav-link__bg" aria-hidden="true">首頁</span>
            </router-link>
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'game-list-2025'}">
              <span class="nav-link__label">賽事</span>
              <span class="nav-link__bg" aria-hidden="true">賽事</span>
            </router-link>
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'about-2025'}">
              <span class="nav-link__label">關於</span>
              <span class="nav-link__bg" aria-hidden="true">關於</span>
            </router-link>
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'history-2025'}">
              <span class="nav-link__label">歷史</span>
              <span class="nav-link__bg" aria-hidden="true">歷史</span>
            </router-link>
          </div>
          <div class="nav-item">
            <a href="https://drive.google.com/drive/folders/1dExG8EBZiznedirvdd5vhJIwrgLIAsch?usp=sharing" class="nav-link schoolteam">
              <span class="nav-link__label">獎勵辦法與<br/>梅竹法規</span>
              <span class="nav-link__bg" aria-hidden="true">獎勵辦法與<br/>梅竹法規</span>
            </a>
          </div>
          <div class="nav-item">
            <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" class="nav-link">
              <span class="nav-link__label">Facebook</span>
              <span class="nav-link__bg" aria-hidden="true">Facebook</span>
            </a>
          </div>
          <div class="nav-item">
            <a href="https://www.instagram.com/meichu_prep_cmte/" class="nav-link">
              <span class="nav-link__label">Instagram</span>
              <span class="nav-link__bg" aria-hidden="true">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>


<script>
// import skrollr from 'skrollr';

export default {
  name: 'Nav',
  mounted() {
    var s = window.skrollr.init();
    if (s.isMobile()) {
      s.destroy();
      return;
    }
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const navbar = document.querySelector('.desktop-nav nav .nav');

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
<template>
  <div :class="{'mobile-header': true, 'mobile-header--active': navToggle}">
    <div :class="{'mobile-header-inner': true, 'mobile-header--active': navToggle}">
      <div class="mobile-header__left">
        <!-- <router-link :to="{name: 'index-2022'}">
          <img src="@/assets/2022/logo-h.svg" alt="壬寅梅竹 | 2021 Meichu Games" class="logo">
        </router-link> -->
      </div>

      <div class="mobile-header__right">
        <div class="mobile-header__toggle" @click="navToggle = 1 - navToggle">
          <i class="fas fa-bars"></i>
        </div>
      </div>
    </div>

    <nav :class="{'mobile-nav': true, 'mobile-nav--active': navToggle}">
      <ul class="mobile-nav__ul">
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'index-2023'}">
            首頁
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'game-list-2023'}">
            賽事
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'news-list-2023'}">
            公告
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'about-2023'}">
            關於
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'history-2023'}">
            歷史
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <a href="https://drive.google.com/drive/folders/1A6YhtzDkBYhAWvGpixGZrtVwmS3Ymv2L?usp=share_link" target="_blank" class="mobile-nav__link">
            校隊與教練<br/>獎勵辦法
          </a>
        </li>
        <li class="mobile-nav__li">
          <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" target="_blank" class="mobile-nav__link">
            <i class="fab fa-facebook"></i>Facebook
          </a>
        </li>
        <li class="mobile-nav__li">
          <a href="https://www.instagram.com/meichu_prep_cmte/" target="_blank" class="mobile-nav__link">
            <i class="fab fa-instagram"></i>Instagram
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'header-2022',

  data() {
    return {
      navToggle: false
    }
  },

  watch: {
    '$route.name'() {
      this.navToggle = false
    }
  }
}

</script>
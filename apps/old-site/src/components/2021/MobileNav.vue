<template>
  <div class="mobile-header">
    <div class="mobile-header-inner">
      <div class="mobile-header__left">
        <router-link :to="{name: 'index-2021'}">
          <img src="@/assets/2021/logo-h.png" alt="辛丑梅竹 | 2021 Meichu Games" class="logo">
        </router-link>
        <!-- <span class="mobile-header__title">辛丑梅竹</span> -->
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
          <router-link class="mobile-nav__link" :to="{name: 'game-list-2021'}">
            賽事
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'news-list-2021'}">
            公告
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'about-2021'}">
            關於
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'history-2021'}">
            歷史
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" target="_blank" class="mobile-nav__link">
            <i class="fab fa-facebook"></i>
          </a>
        </li>
        <li class="mobile-nav__li">
          <a href="https://www.instagram.com/meichu_prep_cmte/" target="_blank" class="mobile-nav__link">
            <i class="fab fa-instagram"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'header-2021',

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
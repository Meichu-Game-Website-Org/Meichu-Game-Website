<template>
  <div @keydown.esc.stop="closeMenu" :class="{'mobile-header': true, 'mobile-header--active': navToggle}">
    <div :class="{'mobile-header-inner': true, 'mobile-header--active': navToggle}">
      <div class="mobile-header__left">
        <router-link :to="{name: 'index-2022'}">
          <img src="@/assets/2022/logo-h.svg" alt="壬寅梅竹 | 2021 Meichu Games" class="logo">
        </router-link>
      </div>

      <div class="mobile-header__right">
        <button ref="menuToggle" type="button" class="mobile-header__toggle" :aria-expanded="Boolean(navToggle)" aria-controls="mobile-navigation-2022" :aria-label="navToggle ? '關閉導覽選單' : '開啟導覽選單'" @click="navToggle = !navToggle">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <nav id="mobile-navigation-2022" @click="closeOnNavigate" :class="{'mobile-nav': true, 'mobile-nav--active': navToggle}">
      <ul class="mobile-nav__ul">
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'index-2022'}">
            首頁
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'game-list-2022'}">
            賽事
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'news-list-2022'}">
            公告
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'about-2022'}">
            關於
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'history-2022'}">
            歷史
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <a href="https://meichu54.weebly.com/" target="_blank" class="mobile-nav__link">
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

  methods: {
    closeMenu() {
      this.navToggle = false
      this.$refs.menuToggle?.focus()
    },
    closeOnNavigate(event) {
      if (event.target.closest('a')) this.navToggle = false
    }
  },

  watch: {
    '$route.name'() {
      this.navToggle = false
    }
  }
}

</script>
<style scoped>
.mobile-header__toggle {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
}
.mobile-header__toggle:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
</style>

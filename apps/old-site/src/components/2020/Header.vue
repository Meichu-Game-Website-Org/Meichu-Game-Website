<template>
  <div @keydown.esc="closeMenu">
    <div class="mobile-header">
      <div class="mobile-header__left">
        <router-link :to="{name: 'index-2020'}">
          <img src="@/assets/2020/logo.png" alt="庚子梅竹 | 2020 Meichu Games" class="logo">
        </router-link>
        <span class="mobile-header__title">庚子梅竹</span>
      </div>

      <div class="mobile-header__right">
        <button ref="menuToggle" type="button" class="mobile-header__toggle" :aria-expanded="Boolean(navToggle)" aria-controls="mobile-navigation-2020" :aria-label="navToggle ? '關閉導覽選單' : '開啟導覽選單'" @click="navToggle = !navToggle">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <nav id="mobile-navigation-2020" @click="closeOnNavigate" :class="{'mobile-nav': true, 'mobile-nav--active': navToggle}">
        <ul class="mobile-nav__ul">
          <li class="mobile-nav__li">
            <router-link class="mobile-nav__link" :to="{name: 'game-list-2020'}">
              賽事列表
            </router-link>
          </li>
          <li class="mobile-nav__li">
            <router-link class="mobile-nav__link" :to="{name: 'news-list-2020'}">
              訊息公告
            </router-link>
          </li>
          <li class="mobile-nav__li">
            <router-link class="mobile-nav__link" :to="{name: 'about-2020'}">
              關於梅竹
            </router-link>
          </li>
          <li class="mobile-nav__li">
            <router-link class="mobile-nav__link" :to="{name: 'history-2020'}">
              歷史紀錄
            </router-link>
          </li>
          <li class="mobile-nav__li">
            <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" target="_blank" class="mobile-nav__link">
              Facebook
            </a>
          </li>
          <li class="mobile-nav__li">
            <a href="https://www.instagram.com/meichu_2020" target="_blank" class="mobile-nav__link">
              Instagram
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="sidebar">
      <router-link :to="{name: 'index-2020'}">
        <img src="@/assets/2020/logo.png" alt="庚子梅竹 | 2020 Meichu Games" class="logo">
      </router-link>

      <nav>
        <ul class="nav">
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'game-list-2020'}">
              賽事列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'news-list-2020'}">
              訊息公告
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'about-2020'}">
              關於梅竹
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'history-2020'}">
              歷史紀錄
            </router-link>
          </li>
          <li class="nav-item">
            <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" target="_blank" class="nav-link">
              Facebook
            </a>
          </li>
          <li class="nav-item">
            <a href="https://www.instagram.com/meichu_2020" target="_blank" class="nav-link">
              Instagram
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>

export default {
  name: 'header-2020',

  data() {
    return {
      navToggle: false
    }
  },

  methods: {
    closeMenu(event) {
      if (!this.navToggle) return
      event.stopPropagation()
      event.preventDefault()
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

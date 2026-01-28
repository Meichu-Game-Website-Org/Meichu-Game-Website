<template>
  <div :class="{'mobile-header': true, 'mobile-header--open': navToggle}">
    <div class="mobile-header__row">
      <div class="mobile-header__left">
        <router-link :to="{name: 'index-2026'}">
          <img src="@/assets/2026-logo.svg" alt="丙午梅竹 | 2026 Meichu Games" class="logo">
        </router-link>
      </div>

      <div class="mobile-header__right">
        <div class="mobile-header__toggle" @click="navToggle = !navToggle">
          <i class="fas fa-bars fa-xs"></i>
        </div>
      </div>
    </div>

    <nav :class="{'mobile-nav': true, 'mobile-nav--active': navToggle}">
      <ul class="mobile-nav__ul">
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'index-2026'}">
            首頁
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'game-list-2026'}">
            賽事
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'about-2026'}">
            關於
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'history-2026'}">
            歷史
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <a href="https://drive.google.com/drive/folders/1dExG8EBZiznedirvdd5vhJIwrgLIAsch?usp=sharing" target="_blank" class="mobile-nav__link">
            獎勵辦法與梅竹法規
          </a>
        </li>
        <li class="mobile-nav__li">
          <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" target="_blank" class="mobile-nav__link">
            Facebook
          </a>
        </li>
        <li class="mobile-nav__li">
          <a href="https://www.instagram.com/meichu_prep_cmte/" target="_blank" class="mobile-nav__link">
            Instagram
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>

import skrollr from 'skrollr';

export default {
  name: 'header-2026',

  data() {
    return {
      navToggle: false,
    }
  },
  mounted() {
    skrollr.init();
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
  },

  watch: {
    '$route.name'() {
      this.navToggle = false
    }
  }
}

</script>

<style scoped lang="scss">
.mobile-header {
  position: fixed;
  width: 100%;
  z-index: 50;
  transition: .5s all cubic-bezier(0.15, 0.82, 0.165, 1);
  @media (min-width: $screen-md) {
    display: none;
  }
  .mobile-header__row {
    width: 100%;
    height: 60px;
    padding: 50px 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }
  .logo {
    width: auto;
    vertical-align: middle;
    height: 60px;
    padding: 1.5rem 0;
    display: block;
  }
  .mobile-header__left {
    display: flex;
    align-items: center;
  }
  .mobile-header__right {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .mobile-header__toggle {
    font-size: 2rem;
    text-align: center;
    .fas {
      width: 60%;
      height: auto;
    }
  }
  .mobile-nav {
    display: block;
    position: absolute;
    top: 90px;
    left: 0;
    bottom: auto;
    width: 100%;
    visibility: hidden;
    opacity: 0;
    transition: 1s all cubic-bezier(0.15, 0.82, 0.165, 1);
    z-index: 50;
    transform: translateX(100%);
    @media (min-width: $screen-md) {
      display: none;
    }
    &.mobile-nav--active {
      visibility: visible;
      opacity: 1;
      transform: translateX(0);
    }
    .mobile-nav__ul {
      list-style: none;
      margin: 0;
      padding: 1rem 2rem;
      background: #90074ECC;
      border-bottom: 1px solid #90074ECC;
      overflow: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }
    .mobile-nav__link {
      display: block;
      width: auto;
      font-size: 1.67rem;
      font-weight: 700;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      padding: .35rem 0;
    }
  }
}
</style>
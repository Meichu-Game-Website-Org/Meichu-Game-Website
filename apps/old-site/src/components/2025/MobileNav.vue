<template>
  <div @keydown.esc.stop="closeMenu" :class="{'mobile-header': true, 'mobile-header--active': navToggle}">
    <div class="mobile-header__left">
      <!-- <router-link :to="{name: 'index-2022'}">
        <img src="@/assets/2022/logo-h.svg" alt="壬寅梅竹 | 2021 Meichu Games" class="logo">
      </router-link> -->
    </div>

    <div class="mobile-header__right">
      <button ref="menuToggle" type="button" class="mobile-header__toggle" :aria-expanded="Boolean(navToggle)" aria-controls="mobile-navigation-2025" :aria-label="navToggle ? '關閉導覽選單' : '開啟導覽選單'" @click="navToggle = !navToggle">
        <i class="fas fa-bars fa-xs"></i>
      </button>
    </div>

    <nav id="mobile-navigation-2025" @click="closeOnNavigate" :class="{'mobile-nav': true, 'mobile-nav--active': navToggle}">
      <ul class="mobile-nav__ul">
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'index-2025'}">
            首頁
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'game-list-2025'}">
            賽事
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'about-2025'}">
            關於
          </router-link>
        </li>
        <li class="mobile-nav__li">
          <router-link class="mobile-nav__link" :to="{name: 'history-2025'}">
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
            <i class="fab fa-facebook"></i>&nbsp;Facebook
          </a>
        </li>
        <li class="mobile-nav__li">
          <a href="https://www.instagram.com/meichu_prep_cmte/" target="_blank" class="mobile-nav__link">
            <i class="fab fa-instagram"></i>&nbsp;Instagram
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'header-2025',

  data() {
    return {
      navToggle: false
    }
  },
  mounted() {
    if (window.skrollr) {
      window.skrollr.init();
    }
    window.addEventListener('scroll', this.handleScroll, { passive: false });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    closeMenu() {
      this.navToggle = false
      this.$refs.menuToggle?.focus()
    },
    closeOnNavigate(event) {
      if (event.target.closest('a')) this.navToggle = false
    },
    handleScroll(event) {
      event.preventDefault(); // 如果需要阻止默認行為，這行代碼可以保留
      const navbar = document.querySelector('.mobile-header');
      // const navLinks = document.querySelectorAll('a.nav-item.nav-link__bg');

      if (window.scrollY > 0) {
        navbar.classList.add('mobile-header--active');
      } else {
        navbar.classList.remove('mobile-header--active');
      }
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

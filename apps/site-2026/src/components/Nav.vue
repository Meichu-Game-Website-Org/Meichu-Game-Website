<template>
  <div class="desktop-nav">
    <nav>
      <div class="nav">
        <div class="nav-icon">
          <router-link class="" :to="{name: 'index-2026'}">
            <img src="@/assets/2026-logo.svg" class="nav-logo" alt="">
          </router-link>
        </div>
        <div class="nav-content">
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'index-2026'}" custom v-slot="{ navigate }">
              <button @click="navigate" role="link" class="transparent-button">首頁</button>
            </router-link>
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'game-list-2026'}" custom v-slot="{ navigate }">
              <button @click="navigate" role="link" class="transparent-button">賽事</button>
            </router-link>        
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'about-2026'}" custom v-slot="{ navigate }">
              <button @click="navigate" role="link" class="transparent-button">關於</button>
            </router-link>
          </div>
          <div class="nav-item">
            <router-link class="nav-link" :to="{name: 'history-2026'}" custom v-slot="{ navigate }">
              <button @click="navigate" role="link" class="transparent-button">歷史</button>
            </router-link>
          </div>
          <div class="nav-item">
            <a href="https://drive.google.com/drive/folders/1dExG8EBZiznedirvdd5vhJIwrgLIAsch?usp=sharing" class="nav-link schoolteam">
              獎勵辦法<br/>與梅竹法規
            </a>
          </div>
          <div class="nav-item">
            <a href="https://www.instagram.com/meichu_prep_cmte/" class="nav-link">
              <img src="@/assets/instagram.svg" alt="icon" class="nav-icon">
            </a>
          </div>
          <div class="nav-item">
            <a href="https://web.facebook.com/MeiChuGamePreparatoryCommittee/" class="nav-link">
              <img src="@/assets/facebook.svg" alt="icon" class="nav-icon">
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

      if (window.scrollY > 0) {
        navbar.classList.add('navbar-bg');
      } else {
        navbar.classList.remove('navbar-bg');
      }
    }
  }
}
</script>

<style scoped lang="scss">
.desktop-nav {
  display: block;
  width: 100%;
  height: max-content;
  transition: transform 2s ease-in;

  @media (max-width: $screen-md) {
    display: none;
  }
}
.nav {
  z-index: 30;
  position: fixed;
  width: 100%;
  padding: 2vw 3vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.5s ease;
  
  &.navbar-bg {
    background-color: $background;
  }

  .nav-icon {
    display: block;
  }
  .nav-logo{
    position: relative;
    width: 15vw;
    max-width: 150px;
  }
  .nav-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4vw;
  }
  .nav-item {
    position: relative;
    text-align: center;
    justify-content: center;
    a {
      text-decoration: none;
    }
  }
  .nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    font-size: .83rem;
    padding: 0;
    font-weight: 800;
    border-bottom: 3px solid transparent;
    @media (max-width: $screen-lg) {
      font-size: .83rem;
    }
    @media (max-width: $screen-md) {
      font-size: 1.5rem;
    }
    &.router-link-exact-active {
      color: $linked_text;
    }
    &:hover {
      text-shadow: 0 0 30px $linked_text;
      transform: scale(1.09);
      .nav-icon {
        fill: $linked_text;
        filter: drop-shadow(0 0 8px $linked_text);
      }
    }
  }
  .transparent-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
  }
  .schoolteam {
    font-size: .75rem;
    line-height: 100%;
    margin: 2px 0;
  }
}
</style>
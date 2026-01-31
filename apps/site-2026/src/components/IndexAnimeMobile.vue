<template>
  <div 
    class="index-anime-mobile" 
    :class="{ 'is-accelerated': isAccelerated }"
    @wheel="accelerate" 
    @touchmove="accelerate" 
    @click="accelerate"
  >
    <transition name="fade">
      <div v-if="step >= 1" class="bg-image-mobile"></div>
    </transition>

    <div class="anime-text-mobile-container">
      <svg width="211" height="51" viewBox="0 0 211 51" fill="none" xmlns="http://www.w3.org/2000/svg" class="anime-text-mobile">
        <transition name="fade">
          <path v-if="step >= 2" d="M1.29691 15.5671H20.5814V9.49055H0L4.98378 3.03613H47.7776V9.49055H27.3566V15.5671H46.4763V50.2802H32.284L36.6736 44.043H39.9787V22.1301H27.3566V25.6005L37.2678 34.0616V42.362L24.2119 31.2948L10.5098 43.1178V34.4916L20.5858 25.6483V22.1214H7.74677V50.2715H1.30125V15.5671H1.29691Z" fill="#FF0085"/>
        </transition>
        <transition name="fade">
          <path v-if="step >= 3" d="M75.9916 36.0683H53.4062L57.7394 29.6138H75.9916V11.7144H63.1006V20.5012L56.3297 25.4919V1.68091H63.1006V5.20782H99.7177V11.7187H82.9273V29.6182H102.155V36.0726H82.9273V50.3366H75.996V36.0726L75.9916 36.0683Z" fill="#FF0085"/>
        </transition>
        <transition name="fade">
          <path v-if="step >= 4" d="M120.951 50.4452H114.34V13.5604H107.027L110.276 6.99735H114.34V1.57234H120.951V6.99735H127.127V13.5604H121.059L120.951 50.4452ZM113.043 17.7909V37.3192L108.168 43.2307V17.7909H113.043ZM126.963 17.7909V30.6476L122.144 36.507V17.7952H126.963V17.7909ZM129.509 50.4452V34.8782H127.613V28.6409H129.509V13.7775H155.074V28.6409H157.186V34.8782H155.074V45.6196L150.524 50.4452H129.509ZM128.589 3.85267L135.412 0V3.52691H156.267V9.82062H135.412V12.6395H128.589V3.85267ZM135.954 19.8541V28.6974H148.628V19.8541H135.954ZM148.628 34.826H135.954V44.373H148.628V34.826ZM145.38 25.6613L139.42 27.9373V21.2657H145.38V25.6613ZM145.38 41.0676L139.42 43.1829V36.3506H145.38V41.0676Z" fill="#FF0085"/>
        </transition>
        <transition name="fade">
          <path v-if="step >= 5" d="M172.086 12.2573H171.166L168.026 18.1688H160.93L168.837 1.78955H175.985L174.198 5.64222H185.788V12.0445H178.692V50.341H172.081V12.2573H172.086ZM194.459 44.0429H199.768V12.0402H193.214L190.342 18.1688H183.303L190.884 1.78955H197.707L195.812 5.64222H210.815V12.0445H206.374V50.341H189.8L194.459 44.0473V44.0429Z" fill="#FF0085"/>
        </transition>
      </svg>
    </div>

    <div class="scroll-guide">
        <span class="text">SPEED UP</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="icon" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexAnimeMobile',
  data() {
    return {
      step: 1,
      timer: null,
      isAccelerated: false,
      acceleratedTypingSpeed: 40
    }
  },
  mounted() {
    this.timer = setTimeout(this.runNextStep, 1000);
  },
  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  },
  methods: {
    accelerate() {
       this.isAccelerated = true;
       if (this.timer) clearTimeout(this.timer);
       this.runNextStep();
    },
    runNextStep() {
      const maxSteps = 6;
      if (this.step < maxSteps) {
        this.step++;
        
        let delay = 500;
        if (this.step === 6) {
          delay = 800;
        }
        
        this.timer = setTimeout(() => {
          this.isAccelerated = false;
          this.runNextStep();
        }, this.isAccelerated ? this.acceleratedTypingSpeed : delay);
      } else {
        this.finish();
      }
    },
    finish() {
      this.$emit('finish');
    }
  }
}
</script>

<style lang="scss" scoped>
.index-anime-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $background;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $primary;
  overflow: hidden;
}

.bg-image-mobile {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/index-anime-bg-mobile.webp");
  background-size: cover;
  background-position: center;
  z-index: 5;
}

.anime-text-mobile-container {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 240px;
  display: flex;
  justify-content: center;
  z-index: 100;
}

.anime-text-mobile {
  width: 100%;
  height: auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.index-anime-mobile.is-accelerated {
  .fade-enter-active, .fade-leave-active {
    transition-duration: 0.5s !important;
  }
}

.scroll-guide {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 1.5s infinite;
  pointer-events: none;
  color: white;
  
  .text {
    font-size: 1rem;
    font-weight: 700;
    font-family: 'Noto Sans TC', sans-serif;
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
  
  .icon {
    margin-top: 0.5rem;
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); opacity: 0.8; }
  50% { transform: translateY(10px); opacity: 1; }
}
</style>

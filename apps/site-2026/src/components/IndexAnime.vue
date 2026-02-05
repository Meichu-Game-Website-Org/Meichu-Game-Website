<template>
  <transition name="fade">
    <div v-if="visible">
      <div 
        v-if="!isMobile" 
        class="index-anime" 
        :class="{ 'is-accelerated': isAccelerated }"
        @wheel="accelerate" 
        @touchmove="accelerate" 
        @click="accelerate"
      >
        <transition name="fade">
          <div v-if="step >= 2" class="bg-image"></div>
        </transition>

        <transition name="slide-left">
          <img v-if="step >= 4" class="anime-panda" src="@/assets/index-anime-panda.webp" />
        </transition>

        <transition name="slide-right">
          <img v-if="step >= 3" class="anime-fox" src="@/assets/index-anime-fox.webp" />
        </transition>

        <transition name="fade">
          <div v-if="step >= 5" class="anime-mask"></div>
        </transition>

        <transition name="fade">
          <img v-if="step >= 6" class="anime-text" src="@/assets/index-anime-text.svg" />
        </transition>

        <transition name="fade">
          <div v-if="step === 1" class="anime-container">
            <div class="ghost-container">
              <div class="text-line">{{ text1 }}</div>
              <div class="text-line">{{ text2 }}</div>
            </div>
            <div class="typing-container">
              <div class="text-line">
                {{ line1 }}<span v-if="cursorLine === 1" class="cursor"></span>
              </div>
              <div class="text-line">
                {{ line2 }}<span v-if="cursorLine === 2" class="cursor"></span>
              </div>
            </div>
          </div>
        </transition>

        <div class="scroll-guide">
          <span class="text">SPEED UP</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="icon" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <index-anime-mobile v-else @finish="finish" />
    </div>
  </transition>
</template>

<script>
import IndexAnimeMobile from './IndexAnimeMobile.vue';

export default {
  name: 'IndexAnime',
  components: {
    IndexAnimeMobile
  },
  data() {
    return {
      text1: "丙心不懈，熊勢如虹驚八方",
      text2: "午場爭輝，狐姿似電耀全場",
      line1: "",
      line2: "",
      cursorLine: 1,
      visible: !window.hasPlayedIndexAnime,
      step: 1,
      typingSpeed: 400, // ms per char
      acceleratedTypingSpeed: 40,
      timer: null,
      isAccelerated: false,
      isMobile: false
    }
  },
  mounted() {
    this.isMobile = window.innerWidth <= 768;

    if (!this.visible) return;
    // Prevent background scrolling while animation is active
    document.body.style.overflow = 'hidden';
    
    if (!this.isMobile) {
      this.startTyping();
    }
    
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', this.handleKeydown);
    if (this.timer) clearTimeout(this.timer);
  },
  methods: {
    handleKeydown(e) {
      if (['Space', 'Enter', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
        this.accelerate();
      }
    },
    accelerate() {
       if (this.isMobile) return;

       this.isAccelerated = true;
       if (this.timer) clearTimeout(this.timer);

       const typingComplete = this.line1.length === this.text1.length && this.line2.length === this.text2.length;

       if (this.step === 1 && !typingComplete) {
         this.typeNext();
       } else {
         this.runNextStep();
       }
    },
    startTyping() {
       this.timer = setTimeout(this.typeNext, this.typingSpeed);
    },
    typeNext() {
      if (this.line1.length < this.text1.length) {
        this.line1 += this.text1[this.line1.length];
        this.timer = setTimeout(() => {
           this.isAccelerated = false;
           this.typeNext();
        }, this.isAccelerated ? this.acceleratedTypingSpeed : this.typingSpeed);
      } else if (this.line2.length < this.text2.length) {
        this.cursorLine = 2; // Move cursor to second line
        this.line2 += this.text2[this.line2.length];
        this.timer = setTimeout(() => {
           this.isAccelerated = false;
           this.typeNext();
        }, this.isAccelerated ? this.acceleratedTypingSpeed : this.typingSpeed);
      } else {
        // Done
        this.cursorLine = 0; // Hide cursor
        this.timer = setTimeout(() => {
          this.isAccelerated = false;
          this.runNextStep();
        }, 1200); 
      }
    },
    runNextStep() {
      const maxSteps = 6;
      if (this.step < maxSteps) {
        this.step++;
        
        let delay = 1000;
        if (this.step === 6) delay = 1500;
        
        this.timer = setTimeout(() => {
          this.isAccelerated = false;
          this.runNextStep();
        }, this.isAccelerated ? this.acceleratedTypingSpeed : delay);
      } else {
        this.finish();
      }
    },
    finish() {
      this.visible = false;
      document.body.style.overflow = '';
      window.hasPlayedIndexAnime = true;
      this.$emit('finish');
    }
  }
}
</script>

<style lang="scss" scoped>
.index-anime {
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

.anime-container {
  position: relative;
  z-index: 10; 
}

.ghost-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  visibility: hidden;
}

.typing-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
}

.text-line {
    font-size: 2.08rem; 
    line-height: 1.5;
    font-weight: 700;
    font-family: "Noto Serif TC";
    min-height: 1.5em; 
    white-space: nowrap; // Keep text on one line if possible

    @media (max-width: $screen-lg) {
      font-size: 1.75rem;
    }
    
    @media (max-width: $screen-sm) {
      white-space: normal; // Allow wrap on small screens if needed, but 'clamp' usually handles size
      word-break: break-all;
    }

    &:nth-child(2) {
      margin-left: 7em;
    }
}

.index-anime.is-accelerated {
  .fade-enter-active, .fade-leave-active,
  .slide-left-enter-active, .slide-left-leave-active,
  .slide-right-enter-active, .slide-right-leave-active {
    transition-duration: 0.3s !important;
  }
}

.cursor {
  display: inline-block;
  width: 4px;
  background-color: $white;
  margin-left: 5px;
  animation: blink 1.6s infinite;
  vertical-align: middle;
  height: 1em;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 1s, opacity 1s;
}
.slide-left-enter-from, .slide-left-leave-to {
  transform: translateX(-150%);
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 1s, opacity 1s;
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(150%);
  opacity: 0;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/index-anime-bg.webp");
  background-size: cover;
  background-position: center;
  z-index: 5;
}

.anime-panda {
  position: absolute;
  right: calc(50% - 22vw);
  top: 9%;
  // bottom: 0;
  height: 109vh;
  z-index: 5;
  object-fit: contain;
  pointer-events: none;
}

.anime-fox {
  position: absolute;
  left: calc(50% - 20vw);
  top: -6%;
  // bottom: 0;
  height: 120vh;
  z-index: 6;
  object-fit: contain;
  pointer-events: none;
}

.anime-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #130F1399;
  z-index: 7;
}

.anime-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 67.5%;
  z-index: 8;
  pointer-events: none;
}

.scroll-guide {
  position: absolute;
  right: 3rem;
  bottom: 3rem;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 1.5s infinite;
  pointer-events: none;
  color: white;
  
  .text {
    font-size: 0.9rem;
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

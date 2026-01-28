<template>
  <div class="org-card">
    <div class="card-content">
      <div class="name-zh">{{ nameZh }}</div>
      <div class="name-en">{{ nameEn }}</div>
      <div class="desc">{{ desc }}</div>
      <div 
        class="links" 
        ref="linksContainer"
        :class="{ 'is-wrapped': isWrapped }"
      >
        <div v-for="link in links" :key="link.link" class="link-item">
          <a :href="link.link" target="_blank" rel="noopener noreferrer">
            <img :src="getIcon(link)" alt="icon" class="icon">
            <span>{{ link.text }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import websiteIcon from "@/assets/website-icon.svg"
import facebookIcon from "@/assets/facebook.svg"
import instagramIcon from "@/assets/instagram.svg"

export default {
  props: ["nameZh", "nameEn", "desc", "links"],
  data() {
    return {
      isWrapped: false,
      observer: null
    }
  },
  methods: {
    getIcon(link) {
      if (link.type === "website") return websiteIcon
      if (link.type === "facebook") return facebookIcon
      if (link.type === "instagram") return instagramIcon
      return websiteIcon
    },
    checkWrap() {
      const container = this.$refs.linksContainer;
      if (!container || container.children.length <= 1) {
        this.isWrapped = false;
        return;
      }
      
      const firstItem = container.children[0];
      const lastItem = container.children[container.children.length - 1];
      
      // 如果第一個與最後一個元素的 offsetTop 不同，代表發生了換行
      this.isWrapped = firstItem.offsetTop !== lastItem.offsetTop;
    }
  },
  mounted() {
    this.observer = new ResizeObserver(() => {
      this.checkWrap();
    });
    if (this.$refs.linksContainer) {
      this.observer.observe(this.$refs.linksContainer);
    }
    this.$nextTick(this.checkWrap);
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
</script>

<style scoped lang="scss">
.org-card {
  position: relative;
  background-color: $background;
  border: 45px solid transparent;
  border-image: url("@/assets/about-org-border.svg") 80 stretch;
  margin-bottom: 20px;
  color: $white;
  font-size: .83rem;
  font-weight: 600;
  letter-spacing: .05rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: visible;

  @media (max-width: $screen-md) {
    font-size: 1rem;
    border-width: 25px;
    border-radius: 30px;
    letter-spacing: 0;
    text-align: left;
  }
  @media (max-width: $screen-sm) {
    font-size: .83rem;
  }

  &::before {
    content: "";
    position: absolute;
    // 讓 pseudo-element 的 border 與父層重疊
    top: -45px;
    left: -45px;
    right: -45px;
    bottom: -45px;
    border: 45px solid transparent;
    border-image: url("@/assets/about-org-border.svg") 80 stretch;
    z-index: 0;

    @media (max-width: $screen-md) {
      top: -25px;
      left: -25px;
      right: -25px;
      bottom: -25px;
      border-width: 25px;
      border-radius: 30px;
    }

    // 透過高亮濾鏡與移動的 mask 建立流動感
    filter: brightness(1.6) contrast(1.2);
    mask-image: linear-gradient(135deg, transparent 35%, rgba(255, 255, 255, 0.8) 50%, transparent 65%);
    mask-size: 300% 300%;
    animation: border-marquee 2s linear infinite;
    pointer-events: none;
  }

  .card-content {
    position: relative;
    z-index: 1;
  }

  .name-zh {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: .1rem;
    margin-bottom: 4px;
    @media (max-width: $screen-md) {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }
    @media (max-width: $screen-sm) {
      font-size: 1.17rem;
      margin-bottom: 4px;
    }
  }

  .name-en {
    font-size: .625rem;
    font-weight: 700;
    color: $primary;
    margin-bottom: .5rem;
    @media (max-width: $screen-md) {
      font-size: 1rem;
    }
    @media (max-width: $screen-sm) {
      font-size: .83rem;
    }
  }

  .desc {
    margin-bottom: .5rem;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 1rem;

    &.is-wrapped {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px 1rem;
      @media (max-width: $screen-md) {
        gap: 0px 1rem;
      }
    }

    .link-item {
      white-space: nowrap;
      flex: 1;
      a {
        display: flex;
        align-items: center;
        gap: 8px;
        color: $white;
        text-decoration: none;

        @media (max-width: $screen-md) {
          gap: 6px;
        }

        .icon {
          height: .83rem;
          width: auto;
          @media (max-width: $screen-md) {
            height: 1rem;
          }
          @media (max-width: $screen-sm) {
            height: .83rem;
          }
        }

        &:hover {
          color: $primary;
        }
      }
    }
  }
}

@keyframes border-marquee {
  0% {
    mask-position: 100% 100%;
  }
  100% {
    mask-position: 0% 0%;
  }
}
</style>

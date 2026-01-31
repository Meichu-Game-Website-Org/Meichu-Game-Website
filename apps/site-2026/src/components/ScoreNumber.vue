<template>
  <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg" class="score-number-svg">
    <defs>
      <!-- 漸層定義 -->
      <linearGradient :id="`textFillGradient-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.5" />
      </linearGradient>

      <linearGradient :id="`textStrokeGradient-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="8.28%" stop-color="#FF0085" />
        <stop offset="50.33%" stop-color="#FF0085" stop-opacity="0.1" />
      </linearGradient>

      <!-- Mask 1: 文字本身填充範圍 -->
      <mask :id="`maskFill-${uid}`">
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dominant-baseline="central"
          font-size="160"
          font-weight="bold" 
          fill="white"
        >
          {{ value }}
        </text>
      </mask>

      <!-- Mask 2: 文字外框範圍 -->
      <!-- 技巧：外框用 white stroke 顯示，內部 fill black 隱藏 -->
      <mask :id="`maskStroke-${uid}`">
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dominant-baseline="central"
          font-size="160"
          font-weight="bold" 
          stroke="white"
          stroke-width="6"
          fill="black"
        >
          {{ value }}
        </text>
      </mask>
    </defs>

    <!-- 1. 外框層 (Stroke Layer) -->
    <!-- Mask 加在靜止的 <g> 上，確保文字形狀不動 -->
    <g :mask="`url(#maskStroke-${uid})`">
      <rect 
        class="spinner"
        x="-50%" 
        y="-50%" 
        width="200%" 
        height="200%" 
        :fill="`url(#textStrokeGradient-${uid})`"
      />
    </g>

    <!-- 2. 內填層 (Fill Layer) -->
    <!-- Mask 加在靜止的 <g> 上，確保文字形狀不動 -->
    <g :mask="`url(#maskFill-${uid})`">
      <rect 
        class="spinner"
        x="-50%" 
        y="-50%" 
        width="200%" 
        height="200%" 
        :fill="`url(#textFillGradient-${uid})`"
      />
    </g>
  </svg>
</template>

<script>
let uidCounter = 0;
export default {
  name: 'ScoreNumber',
  props: {
    value: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    uidCounter += 1;
    return {
      uid: uidCounter
    }
  },
  computed: {
    viewBox() {
      const len = String(this.value).length;
      const width = Math.max(200, len * 110);
      return `0 0 ${width} 200`;
    }
  }
}
</script>

<style scoped>
.score-number-svg {
  width: 100%;
  height: 100%;
}

.score-number-svg text {
  font-family: inherit;
}

.spinner {
  /* 設定旋轉中心為該元素的中心 */
  transform-box: fill-box;
  transform-origin: center;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
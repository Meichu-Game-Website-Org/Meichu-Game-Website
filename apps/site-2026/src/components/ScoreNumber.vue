<template>
  <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg" class="score-number-svg">
    <defs>
      <linearGradient :id="`textFillGradient-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.5" />
        <animateTransform 
            attributeName="gradientTransform" 
            type="rotate" 
            from="0 0.5 0.5" 
            to="360 0.5 0.5" 
            dur="3s" 
            repeatCount="indefinite" 
        />
      </linearGradient>

      <linearGradient :id="`textStrokeGradient-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="8.28%" stop-color="#FF0085" />
        <stop offset="50.33%" stop-color="#FF0085" stop-opacity="0.1" />
        <animateTransform 
            attributeName="gradientTransform" 
            type="rotate" 
            from="0 0.5 0.5" 
            to="360 0.5 0.5" 
            dur="3s" 
            repeatCount="indefinite" 
        />
      </linearGradient>
    </defs>

    <text 
      x="50%" 
      y="50%" 
      text-anchor="middle" 
      dominant-baseline="central"
      font-size="160"
      :fill="`url(#textFillGradient-${uid})`"
      :stroke="`url(#textStrokeGradient-${uid})`"
      stroke-width="6"
      paint-order="stroke fill"
      font-weight="bold" 
    >
      {{ value }}
    </text>
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
      // Estimate width needed. Base 200 is good for 1-2 digits.
      // For more, expand.
      // 1 char: 200
      // 2 chars: 200
      // 3 chars: 300
      // 4 chars: 400
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
  text {
    font-family: inherit; /* Inherit font family from parent */
  }
}
</style>
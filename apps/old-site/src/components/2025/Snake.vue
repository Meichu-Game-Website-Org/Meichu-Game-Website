
<template>
  <div class="snake">
    <div class="link-container">
      <a href="https://www.instagram.com/meichu_prep_cmte?igsh=emluaDVnNmU4cGx1" aria-label="梅竹籌備委員會 Instagram">
        <i class="fa-brands fa-instagram"></i>
      </a>
      <a href="https://www.facebook.com/share/18X4Cj2Xmy/?mibextid=wwXIfr" aria-label="梅竹籌備委員會 Facebook">
        <i class="fa-brands fa-facebook"></i>
      </a>
      <a href="https://www.threads.net/@meichu_prep_cmte" aria-label="梅竹籌備委員會 Threads">
        <i class="fa-brands fa-threads"></i>
      </a>
      <a href="mailto:meichu2024@gmail.com" aria-label="寄信給梅竹籌備委員會">
        <i class="fa-solid fa-envelope"></i>
      </a>
      <a href="https://meichu.games/">
        <img src="@/assets/2025/index-2025-logo.png" alt="2025 Logo Square">
      </a>
    </div>
    <div class="game-container">
      <canvas ref="canvas" id="render-target" width="400" height="400" tabindex="0" aria-label="梅竹貪食蛇遊戲：Enter 開始或重新開始，方向鍵移動，P 暫停"></canvas>
      <span class="font-trick">Cyber-Snake</span>
    </div>
  </div>
</template>

<script>
import { createSnakeGame } from './snake-game.js'

const games = new WeakMap()

export default {
  mounted() { this.startGame() },
  activated() { this.startGame() },
  deactivated() { this.stopGame() },
  beforeDestroy() { this.stopGame() },
  beforeUnmount() { this.stopGame() },
  methods: {
    startGame() {
      if (!games.has(this) && this.$refs.canvas) {
        games.set(this, createSnakeGame(this.$refs.canvas))
      }
    },
    stopGame() {
      games.get(this)?.destroy()
      games.delete(this)
    }
  }
}
</script>

<style scoped>
canvas:focus-visible { outline: 3px solid #f9c43c; outline-offset: 3px; }
</style>

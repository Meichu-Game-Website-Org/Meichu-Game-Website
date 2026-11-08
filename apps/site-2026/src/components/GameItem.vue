<template>
  <div :class="'game-item status-' + game.status" v-if="game">
    <router-link :to="{ name: 'game-show-2026', params: {slug: game.item.slug} }" class="game-item__link" :aria-label="`查看${game.name}賽事詳情`"></router-link>
    <div class="game-item__mask"></div>
    <img v-if="game.photo" :src="game.photo" class="game-item__photo" alt="">
    <div class="game-item__content">
      <div class="game-item__info">
        <div class="game-item__time"><i class="fa-regular fa-clock" aria-hidden="true"></i> {{ game.time || '時間待定' }}</div>
        <div class="game-item__location">{{ game.location }}</div>
      </div>
      <div class="game-item__text">
        <div v-if="game.type_of !== 'agenda' && isShowScore(game.status)" class="game-item__score">陽明交大 {{ score.nctu }} : {{ score.nthu }} 清大<span v-if="score.note" class="game-item__score-note">{{ score.note }}</span></div>
        <div class="game-item__title">{{ game.name }}</div>
      </div>
    </div>

    

  </div>
</template>

<script>

import { gameScore } from '@/game-display'

export default {
  name: 'game-item-2026',

  props: ['game'],
  computed: { score() { return gameScore(this.game) } },

  data: function() {
    return {
    }
  },

  created() {
  },

  methods: {
    isShowScore(status) {
      return ['running', 'pause', 'draw', 'nctu', 'nthu', 'end'].includes(status)
    }
  }
}

</script>

<style scoped lang="scss">
$border-width: 4px;
$trail-length: 75%;

.game-item {
  width: 100%;
  height: 18vw;
  margin-bottom: .4rem;
  font-size: .67rem;
  position: relative;
  overflow: hidden;

  @media (max-width: $screen-md) {
    height: 50vw;
    font-size: 1.2rem;
  }
  @media (max-width: $screen-sm) {
    font-size: 1rem;
  }
  
  .game-item__link {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 15;
    &:focus-visible { outline: 3px solid $white; outline-offset: -6px; }
  }
  .game-item__mask {
    position: absolute;
    inset: $border-width;
    width: calc(100% - 2 * #{$border-width});
    height: calc(100% - 2 * #{$border-width});
    background: $background;
    opacity: .5;
    z-index: 3;
    transition: .5s all cubic-bezier(0.15, 0.82, 0.165, 1);
  }
  .game-item__photo {
    position: absolute;
    inset: $border-width;
    width: calc(100% - 2 * #{$border-width});
    height: calc(100% - 2 * #{$border-width});
    object-fit: cover;
    z-index: 1;
    transition: .5s all cubic-bezier(0.15, 0.82, 0.165, 1);
  }
  .game-item__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    line-height: 1.9;
    z-index: 5;
    @media (max-width: $screen-md) {
      padding: 15px;
    }
  }
  .game-item__info {
    z-index: 6;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
  .game-item__time {
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 7;
    font-weight: 700;
  }
  .game-item__location {
    z-index: 7;
    font-weight: 700;
  }
  .game-item__text {
    z-index: 6;
  }
  .game-item__score { font-size: max(.75rem, 14px); line-height: 1.4; margin-bottom: .25rem; }
  .game-item__score-note { display: block; font-size: max(.7rem, 13px); }
  .game-item__title {
    font-weight: 700;
    font-size: .83rem;
    line-height: 1;
    @media (max-width: $screen-md) {
      font-size: 1.8rem;
    }
    @media (max-width: $screen-sm) {
      font-size: 1.33rem;
    }
  }

  &:hover {
    .game-item__mask, .game-item__photo {
      transform: scale(1.1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    animation: rotate 4s linear infinite;
    z-index: 0;

    background: conic-gradient(transparent, $primary $trail-length, transparent, $background);
    @at-root .status-nthu#{&} {
      background: conic-gradient(transparent, $nthu $trail-length, transparent, $background);
    }
    @at-root .status-nctu#{&} {
      background: conic-gradient(transparent, $nctu $trail-length, transparent, $background);
    }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}
</style>

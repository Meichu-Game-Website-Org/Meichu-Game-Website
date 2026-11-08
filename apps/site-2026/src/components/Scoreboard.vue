<template>
  <div :class="'game__scoreboard status-' + game.status" v-if="game && game.name">
    <img src="@/assets/game-scoreboard-bg.svg" alt="bg" class="game__scoreboard__bg --desktop" />
    <img src="@/assets/game-scoreboard-bg-mobile.png" alt="bg" class="game__scoreboard__bg --mobile" />
    
    <div class="game__scoreboard__status">
      {{ GAME_STATUS[game.status] }}
    </div>
    
    <div class="game__info">
      <h1 :class="'game__info__name game-status-' + game.status">{{ game.name }}</h1> 
      <div class="game__info__item">
        {{ gameDateLabel(game.date) }} {{ game.time || '時間待定' }}
      </div>
      <div class="game__info__item">
        <a :href="game.location_url" class="game__location" title="在 Google Maps 中查看" target="_blank">{{ game.location }}</a>
      </div>
      <div v-if="game.type_of !== 'agenda'" class="game__scores" :aria-label="`陽明交通大學 ${score.nctu} 分，清華大學 ${score.nthu} 分`" role="group">
        <div><span class="game__scores__school">陽明交通大學</span><strong class="game__scores__value">{{ score.nctu }}</strong></div>
        <span class="game__scores__separator" aria-hidden="true">:</span>
        <div><span class="game__scores__school">清華大學</span><strong class="game__scores__value">{{ score.nthu }}</strong></div>
      </div>
      <p v-if="score.note" class="game__score-note">{{ score.note }}</p>
    </div>
  </div>
</template>

<script>
import { GAME_STATUS } from '@/utils'
import { gameScore, gameDateLabel } from '@/game-display'

export default {
  name: 'GameScoreboard',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      GAME_STATUS,
      gameDateLabel
    }
  },
  computed: { score() { return gameScore(this.game) } }
}
</script>

<style scoped lang="scss">
.game__scoreboard {
  position: relative;
  overflow: hidden;
  height: 30vw;
  width: 80vw;
  margin-top: 15px;
  top: 15vh;
  margin: 0 10vw;
  @media (max-width: $screen-md) {
    height: auto;
    top: 0;
  }
}
.game__location {
  color: $white;
  &:hover {
    color: $linked_text;
  }
}
.game__scores {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(.75rem, 3vw, 2rem);
  margin-top: .5rem;
  color: $white;
  text-align: center;
  line-height: 1.15;
}
.game__scores__school { display: block; font-size: max(.75rem, 14px); }
.game__scores__value { display: block; font-size: clamp(2rem, 5vw, 4rem); font-variant-numeric: tabular-nums; }
.game__scores__separator { font-size: clamp(2rem, 5vw, 4rem); }
.game__score-note { margin: .35rem 0 0; color: $white; font-size: max(.75rem, 14px); text-align: center; }
.game__scoreboard__bg {
  position: absolute;
  width: 100%;
  height: auto;
  left: 0;
  z-index: 6;
  &.--mobile {
    display: none;
  }
  @media (max-width: $screen-md) {
    &.--desktop {
      display: none;
    }
    &.--mobile {
      display: block;
      position: relative;
    }
  }
}
.game__info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 6;
  .game__info__name {
    margin: 0;
    font-size: 2.08rem;
    font-weight: 700;
    z-index: 10;
    line-height: 1;
    padding: .5rem 0;
    @media (max-width: $screen-lg) {
      font-size: 2rem;
    }
    @media (max-width: $screen-md) {
      font-size: 3rem;
      padding: 1rem 0;
    }
    @media (max-width: $screen-sm) {
      font-size: 2rem;
      padding: 1rem 0;
    }
  }
  .game__info__item {
    display: block;
    color: $white;
    font-weight: 600;
    text-align: center;
    margin: 0 10%;
    @media (max-width: $screen-md) {
      font-size: 1.5rem;
    }
    @media (max-width: $screen-sm) {
      font-size: 13px;
    }
    i {
      width: 2rem;
      @media (max-width: $screen-md) {
        width: 1.5rem;
      }
    }
  }
}
.game__scoreboard__status {
  position: absolute;
  z-index: 8;
  font-weight: 700;
  font-size: .83rem;
  color: $white;
  right: 0;
  top: 0;
  padding: 1.5rem;
  line-height: 1;
  @media (max-width: $screen-md) {
    font-size: 11px;
    font-weight: 800;
    right: 5%;
    bottom: 5%;
    top: auto;
    padding: 1rem;
  }
}
.game-status-nctu {
  color: $nctu
}
.game-status-nthu {
  color: $nthu
}
</style>

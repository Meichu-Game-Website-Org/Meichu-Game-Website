<template>
  <div :class="'game__scoreboard status-' + game.status" v-if="game && game.name">
    <img src="@/assets/game-scoreboard-bg.svg" alt="bg" class="game__scoreboard__bg" />
    
    <div class="game__scoreboard__status">
      {{ GAME_STATUS[game.status] }}
    </div>
    
    <div class="game__info">
      <h1 :class="'game__info__name game-status-' + game.status">{{ game.name }}</h1> 
      <div class="game__info__item">
        {{ moment(game.date).format('MM/DD') }} {{ game.time }}
      </div>
      <div class="game__info__item">
        <a :href="game.location_url" class="game__location" title="在 Google Maps 中查看" target="_blank">{{ game.location }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { GAME_STATUS } from '@/utils'

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
      moment,
      GAME_STATUS
    }
  }
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
    height: 23vh;
    top: 0;
  }
}
.game__location {
  color: $white;
  &:hover {
    color: $linked_text;
  }
}
.game__scoreboard__bg {
  position: absolute;
  width: 100%;
  height: auto;
  left: 0;
  z-index: 6;
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
      font-size: 3.5rem;
    }
    @media (max-width: $screen-md) {
      font-size: 2.5rem;
      padding: .5rem 0;
    }
  }
  .game__info__item {
    display: block;
    color: $white;
    font-weight: 600;
    @media (max-width: $screen-md) {
      font-size: 1rem;
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
  @media (max-width: $screen-lg) {
    font-size: 1.5rem;        
  }
  @media (max-width: $screen-md) {
    font-size: 1rem;
    bottom: auto;
    top: 0;
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

<template>
  <div class="curr-score">
    <h1>正式賽當前積點</h1>
    <div class="title-bar"/>
    <div class="curr-score__score">
      <div class="score__school">
        <img src="@/assets/index-score-panda.png" alt="熊貓"/>
        <div>清華大學</div>
      </div>
      <div class="score__score">
        <div class="left">
          <ScoreNumber :value="this.score['nthu']" />
        </div>
        <div class="center">:</div>
        <div class="right">
          <ScoreNumber :value="this.score['nctu']" />
        </div>
      </div>
      <div class="score__school">
        <img src="@/assets/index-score-fox.png" alt="狐狸" style="transform: scale(1.4);"/>
        <div>陽明交通大學</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Game as GameApi } from '@meichu/services'
import ScoreNumber from '@/components/ScoreNumber.vue'
import { YEAR_ID } from '@/utils'

export default {
  name: 'curr-score',
  
  components: {
      ScoreNumber
  },

  data: function() {
    return {
      score: {
        'nthu': 0,
        'nctu': 0
      }
    }
  },

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      const params = {
        year_id: YEAR_ID
      }
      GameApi.fetchAllGames(params)
        .then((games) => {
          games = games.filter(game => game.item && game.type_of === 'official');

          // Count the current score
          var draw = games.filter(game => game.status === 'draw').length;
          this.score['nthu'] = games.filter(game => game.status === 'nthu').length + 0.5 * draw;
          this.score['nctu'] = games.filter(game => game.status === 'nctu').length + 0.5 * draw;
          
        })
    },
  }
}
</script>


<style lang="scss" scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.curr-score {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: $screen-md) {
    padding: 0;
  }

  .curr-score__score {
    padding: 0 10%;
    display: flex;
    justify-content: space-between;
    @media (max-width: $screen-md) {
      padding: 0 5%;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
  }
  .score__school {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: $screen-md) {
      gap: 1rem;
      &:last-child {
        flex-direction: column-reverse;
      }
    }

    img {
      width: 18vw;
      @media (max-width: $screen-md) {
        width: 42vw;
      }
    }
    div {
      font-weight: 700;
      letter-spacing: 0.1em;
      text-align: center;
      font-size: 1.33rem;
      // @media (max-width: $screen-xl) {
      //   font-size: 1.rem;
      // }
      @media (max-width: $screen-lg) {
        font-size: .9rem;
      }
      @media (max-width: $screen-md) {
        font-size: 2rem;
      }
      @media (max-width: $screen-sm) {
        font-size: 1.33rem;
      }
    }
  }
  .score__score {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    font-weight: 800;
    line-height: normal;

    font-size: 5.3rem;
    @media (max-width: $screen-xl) {
      font-size: 4.7rem;
    }
    @media (max-width: $screen-lg) {
      font-size: 3.5rem;
    }
    @media (max-width: $screen-md) {
      gap: 2rem;
      font-size: 7rem;
      flex-direction: column;
    }
    @media (max-width: $screen-sm) {
      gap: 0px;
      font-size: 5rem;
    }
    .left {
      margin-right: auto;
      text-align: right;
      height: 1.5em; /* Ensure height for SVG */
      display: flex;
      align-items: center;
      @media (max-width: $screen-md) {
        margin: 0;
      }
    }
    .right {
      margin-left: auto;
      text-align: left;
      height: 1.5em; /* Ensure height for SVG */
      display: flex;
      align-items: center;
      @media (max-width: $screen-md) {
        margin: 0;
      }
    }
    .center {
      margin: 0 auto;
      animation: blink 2s infinite ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transform: translateY(-0.1em); /* 向上微調以對齊數字中心 */
    }
  }
}
</style>
<template>
  <div class="curr-score">
    <div class="curr-score__title">正式賽當前積點</div>
    <div class="curr-score__score">
      <div class="score__school">
        <img src="@/assets/panda.png" alt="熊貓"/>
        <div>清華大學</div>
      </div>
      <div class="score__score">
        <div class="left">{{ this.score['nthu'] }}</div>
        <div class="center">:</div>
        <div class="right">{{ this.score['nctu'] }}</div>
      </div>
      <div class="score__school">
        <img src="@/assets/fox.png" alt="狐狸"/>
        <div>陽明交通大學</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Game as GameApi } from '@meichu/services'

export default {
  name: 'curr-score',

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
        year_id: 57
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



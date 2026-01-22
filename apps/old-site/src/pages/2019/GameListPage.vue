<template>
  <div style="padding: 0 15px;">
    <div class="container">
      <div class="row game-row">
        <div class="game-col">

          <h3 class="game-day">2/23 （六）</h3>
          <GameItem :game="games['men-basketball']" />

          <h3 class="game-day">2/28 （四）</h3>
          <GameItem :game="games['bridge']" />
          <GameItem :game="games['go']" />
          <GameItem :game="games['kendo']" />

        </div>
        <div class="game-col">

          <h3 class="game-day">3/1 （五）</h3>
          <GameItem :game="games['billiard']" />

          <h3 class="game-day">3/3 （日）</h3>

          <GameItem :game="games['darts']" />
          <GameItem :game="games['archery']" />
          <GameItem :game="games['softball']" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// import NewsPanel from '@/components/2019/NewsPanel.vue'
import GameItem from '@/components/2019/GameItem.vue'
import { Game as GameApi } from '@meichu/services'

export default {
  name: 'game-list',

  components: {
    GameItem,
    // NewsPanel,
  },

  data: function() {
    return {
      games: {},
    }
  },

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      const params = {
        year_id: 1
      }
      GameApi.fetchAllGames(params)
        .then((games) => {
          this.games = Object.assign({}, ...games.map(game => ({
            [game.slug]: game
          })))

        })
    },
  }
}

</script>
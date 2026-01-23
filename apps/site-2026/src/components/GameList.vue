<template>

  <div>
    <div class="row">
      <div class="col">
        <h1>所有賽事</h1>
        <div class="title_bar">
        </div>
        <Loading v-if="isLoading" />
        <div class="game-row" v-if="!isLoading">
          <div class="game-col">
            <h3 class="game-day">02/28 (五)</h3>
            <GameItem :game="games['opening']" />
            <GameItem :game="games['billiard']" />
            <GameItem :game="games['soccer']" />
            <GameItem :game="games['women-table-tennis']" />
            <GameItem :game="games['kendo']" />
            <GameItem :game="games['table-tennis']" />
            <GameItem :game="games['badminton']" />
          </div>
          <div class="game-col">
            <h3 class="game-day">03/01 (六)</h3>
            <GameItem :game="games['bridge']" />
            <GameItem :game="games['chess']" />
            <GameItem :game="games['go']" />
            <GameItem :game="games['women-tennis']" />
            <GameItem :game="games['tennis']" />
            <GameItem :game="games['baseball']" />
            <GameItem :game="games['women-basketball']" />
            <GameItem :game="games['men-basketball']" />
          </div>
          <div class="game-col">
            <h3 class="game-day">03/02 (日)</h3>
            <GameItem :game="games['bridge']" />
            <GameItem :game="games['archery']" />
            <GameItem :game="games['softball']" />
            <GameItem :game="games['men-volleyball']" />
            <GameItem :game="games['women-volleyball']" />
            <GameItem :game="games['closing']" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import GameItem from '@/components/GameItem.vue'
import Loading from '@/components/Loading.vue'
import { Game as GameApi } from '@meichu/services'

export default {
  name: 'game-list',

  components: {
    GameItem,
    Loading
  },

  data: function() {
    return {
      games: {},
      isLoading: true
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
          this.games = Object.assign({}, ...games.filter(val => val.item).map(game => ({
            [game.item.slug]: game
          })))
          // Loop for games and edit the path of the photo
          for (let key in this.games) {
            this.games[key].photo = "https://meichu.games" + this.games[key].photo
          }
        })
        .then(() => {
          this.isLoading = false
        })
    },
  }
}

</script>
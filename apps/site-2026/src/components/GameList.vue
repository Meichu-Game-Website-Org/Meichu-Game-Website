<template>

  <div>
    <h1>所有賽事</h1>
    <div class="title-bar"/>
    <Loading v-if="isLoading" />
    <div class="game-row" v-if="!isLoading">
      <div class="game-col">
        <h3 class="game-day">03/06 (五)</h3>
        <GameItem :game="games['opening']" />
        <GameItem :game="games['billiard']" />
        <GameItem :game="games['soccer']" />
        <GameItem :game="games['women-table-tennis']" />
        <GameItem :game="games['kendo']" />
        <GameItem :game="games['table-tennis']" />
        <GameItem :game="games['badminton']" />
      </div>
      <div class="game-col">
        <h3 class="game-day">03/07 (六)</h3>
        <GameItem :game="games['bridge']" />
        <GameItem :game="games['chess']" />
        <GameItem :game="games['go']" />
        <GameItem :game="games['women-tennis']" />
        <GameItem :game="games['tennis']" />
        <GameItem :game="games['women-basketball']" />
        <GameItem :game="games['men-basketball']" />
      </div>
      <div class="game-col">
        <h3 class="game-day">03/08 (日)</h3>
        <GameItem :game="games['bridge']" />
        <GameItem :game="games['archery']" />
        <GameItem :game="games['softball']" />
        <GameItem :game="games['men-volleyball']" />
        <GameItem :game="games['women-volleyball']" />
        <GameItem :game="games['closing']" />

        <h3 class="game-day">03/15 (日)</h3>
        <GameItem :game="games['baseball']" />
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

<style scoped lang="scss">
.game-row {
  z-index: 2;
  position: relative;
  display: flex;
  width: 100%;
  padding: 0 1% 0 1%;
  @media (max-width: $screen-md) {
    flex-direction: column;
  }
  .game-col {
    width: 100%;
    margin: 1.5%;
    background-color: $background;
    @media (max-width: $screen-md) {
      width: 100%;
      margin: 0 0 2rem 0;
      padding: 0 2rem;
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }
  }
}
.game-day {
  text-align: center;
  margin-top: 1.5rem;
  color: $text;
  font-weight: 700;
  position: relative;
  @media (max-width: $screen-md) {
    font-size: 1.15rem;
  }
}
</style>
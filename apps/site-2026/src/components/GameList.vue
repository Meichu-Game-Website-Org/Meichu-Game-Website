<template>

  <div>
    <h1>所有賽事</h1>
    <div class="title-bar"/>
    <Loading v-if="isLoading" />
    <div class="game-row" v-if="!isLoading">
      <div class="game-col">
        <h3 class="game-day">03/06 (五)</h3>
        <GameItem 
          v-for="game in gamesByDate('2026-03-06')" 
          :key="game.id" 
          :game="game"
        />
      </div>
      <div class="game-col">
        <h3 class="game-day">03/07 (六)</h3>
        <GameItem 
          v-for="game in gamesByDate('2026-03-07')" 
          :key="game.id" 
          :game="game"
        />
      </div>
      <div class="game-col">
        <h3 class="game-day">03/08 (日)</h3>
        <GameItem 
          v-for="game in gamesByDate('2026-03-08')" 
          :key="game.id" 
          :game="game"
        />

        <h3 class="game-day special-day">03/15 (日)</h3>
        <GameItem 
          v-for="game in gamesByDate('2026-03-15')" 
          :key="game.id" 
          :game="game"
        />
      </div>
    </div>
  </div>
</template>

<script>

import GameItem from '@/components/GameItem.vue'
import Loading from '@/components/Loading.vue'
import { Game as GameApi } from '@meichu/services'
import { YEAR_ID } from '@/utils'
import moment from 'moment'

export default {
  name: 'game-list',

  components: {
    GameItem,
    Loading
  },

  data: function() {
    return {
      allGames: [],
      isLoading: true
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
          // Filter valid games
          let validGames = games.filter(val => val.item)

          // Process Photo URL
          validGames.forEach(game => {
            game.photo = "https://meichu.games" + game.photo
          })

          // Sort by Time (Date sorting happens implicitly by placement, but we sort by time here)
          validGames.sort((a, b) => {
             return a.time.localeCompare(b.time)
          })

          this.allGames = validGames
        })
        .then(() => {
          this.isLoading = false
        })
    },
    gamesByDate(date) {
      return this.allGames.filter(game => game.date === date)
    }
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
.special-day {
  @media (max-width: $screen-md) {
    margin-top: 3.5rem;
  }
}
</style>
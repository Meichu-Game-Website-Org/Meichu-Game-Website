<template>

  <div>
    <h1>所有賽事</h1>
    <div class="title-bar"/>
    <RequestState :resource="resource" empty-text="目前尚無賽事。" @retry="fetch" />
    <div class="game-row" v-if="resource.status === 'success'">
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
import RequestState from '@/components/RequestState.vue'
import { Game as GameApi, resourceMixin, loadResource, readGames } from '@meichu/services'
import { YEAR_ID } from '@/utils'

export default {
  name: 'game-list',
  mixins: [resourceMixin],
  components: { GameItem, RequestState },
  computed: {
    allGames() { return this.resource.data || [] }
  },
  created() { this.fetch() },
  methods: {
    fetch() {
      return loadResource(this.resource, async () => {
        const games = readGames(await GameApi.fetchAllGames({ year_id: YEAR_ID }))
        return games.sort((a, b) => a.time.localeCompare(b.time))
      }, games => games.length === 0)
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
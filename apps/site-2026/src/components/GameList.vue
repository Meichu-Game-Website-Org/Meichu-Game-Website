<template>

  <div>
    <h1>所有賽事</h1>
    <div class="title-bar"/>
    <RequestState :resource="resource" empty-text="目前尚無賽事。" @retry="fetch" />
    <div class="game-row" v-if="resource.status === 'success'">
      <section class="game-col" v-for="group in groups" :key="group.date || 'undated'" :aria-label="group.label">
        <h2 class="game-day">{{ group.label }}</h2>
        <GameItem
          v-for="game in group.games"
          :key="game.id" 
          :game="game"
        />
      </section>
    </div>
  </div>
</template>

<script>
import GameItem from '@/components/GameItem.vue'
import RequestState from '@/components/RequestState.vue'
import { Game as GameApi, resourceMixin, loadResource, readGames } from '@meichu/services'
import { YEAR_ID } from '@/utils'
import { groupGames } from '@/game-display'

export default {
  name: 'game-list',
  mixins: [resourceMixin],
  components: { GameItem, RequestState },
  computed: {
    groups() { return groupGames(this.resource.data || []) }
  },
  created() { this.fetch() },
  methods: {
    fetch() {
      return loadResource(this.resource, async () => {
        return readGames(await GameApi.fetchAllGames({ year_id: YEAR_ID }))
      }, games => games.length === 0)
    }
  }
}
</script>

<style scoped lang="scss">
.game-row {
  z-index: 2;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem 3%;
  width: 100%;
  padding: 0 1% 0 1%;
  @media (max-width: $screen-md) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
  .game-col {
    width: 100%;
    min-width: 0;
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
  font-size: 1.15rem;
  position: relative;
  @media (max-width: $screen-md) {
    font-size: 1.15rem;
  }
}
</style>

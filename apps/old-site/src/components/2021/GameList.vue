<template>
  <div>
    <RequestState :resource="resource" empty-text="目前尚無賽事。" @retry="fetch" />
    <template v-if="resource.status === 'success'">
    <div class="row">
      <div class="col">
        <h2><i class="fas fa-trophy"></i>所有賽事</h2>
        <div class="row game-row">
          <div class="game-col">
            <h3 class="game-day">03/05 （五）</h3>
            <GameItem :game="games['opening']" />
            <GameItem :game="games['track-field']" />
            <GameItem :game="games['billiard']" />
            <GameItem :game="games['women-table-tennis']" />
            <GameItem :game="games['kendo']" />
            <GameItem :game="games['table-tennis']" />
            <GameItem :game="games['badminton']" />
          </div>
          <div class="game-col">
            <h3 class="game-day">03/06 （六）</h3>
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
            <h3 class="game-day">03/07 （日）</h3>
            <GameItem :game="games['bridge']" />
            <GameItem :game="games['darts']" />
            <GameItem :game="games['archery']" />
            <GameItem :game="games['softball']" />
            <GameItem :game="games['men-volleyball']" />
            <GameItem :game="games['women-volleyball']" />
            <GameItem :game="games['closing']" />
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import { archiveResourceMixin, readGameMap } from '@/utils/archive-resource'

import GameItem from '@/components/2021/GameItem.vue'
import { Game as GameApi, loadResource } from '@meichu/services'

export default {
  mixins: [archiveResourceMixin],
  name: 'game-list',

  components: {
    GameItem
  },

  created() {
    this.fetch()
  },

  computed: {
    games() { return this.resource.data || {} },
  },

  methods: {
    fetch() {
      return loadResource(this.resource, () => GameApi.fetchAllGames({ year_id: 53 }).then(readGameMap), games => Object.keys(games).length === 0)
    },
  }
}

</script>
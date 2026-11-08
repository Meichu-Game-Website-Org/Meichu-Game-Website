<template>
  <div>
    <RequestState :resource="resource" empty-text="目前尚無賽事。" @retry="fetch" />
    <template v-if="resource.status === 'success'">
    <div class="row">
      <div class="col">
        <h2>
          <div class="message_title">所有賽事</div><img src="@/assets/2022/梅竹_圈-素材.svg" class="title_circle_behind" alt="" />
        </h2>
        <div class="row game-row">
          <div class="game-col">
            <h3 class="game-day">02/24（五）</h3>
            <GameItem :game="games['opening']" />
            <GameItem :game="games['soccer']" />
            <GameItem :game="games['women-table-tennis']" />
            <GameItem :game="games['kendo']" />
            <GameItem :game="games['table-tennis']" />
            <GameItem :game="games['badminton']" />
            <!-- <GameItem :game="games['badminton']" /> -->
          </div>
          <div class="game-col">
            <h3 class="game-day">02/25 （六）</h3>
            <GameItem :game="games['bridge']" />
            <GameItem :game="games['chess']" />
            <GameItem :game="games['go']" />
            <!-- <GameItem :game="games['women-tennis']" /> -->
            <GameItem :game="games['tennis']" />
            <GameItem :game="games['baseball']" />
            <GameItem :game="games['women-basketball']" />
            <GameItem :game="games['men-basketball']" />
          </div>
          <div class="game-col">
            <h3 class="game-day">02/26 （日）</h3>
            <GameItem :game="games['bridge']" />
            <!-- <GameItem :game="games['darts']" /> -->
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

import GameItem from '@/components/2022/GameItem.vue'
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
      return loadResource(this.resource, () => GameApi.fetchAllGames({ year_id: 54 }).then(readGameMap), games => Object.keys(games).length === 0)
    },
  }
}

</script>
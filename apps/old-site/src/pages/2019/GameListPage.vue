<template>
  <div style="padding: 0 15px;">
    <RequestState :resource="resource" empty-text="目前尚無賽事。" @retry="fetch" />
    <template v-if="resource.status === 'success'">
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
    </template>
  </div>
</template>

<script>
import { archiveResourceMixin, readGameMap } from '@/utils/archive-resource'

// import NewsPanel from '@/components/2019/NewsPanel.vue'
import GameItem from '@/components/2019/GameItem.vue'
import { Game as GameApi, loadResource } from '@meichu/services'

export default {
  mixins: [archiveResourceMixin],
  name: 'game-list',

  components: {
    GameItem,
    // NewsPanel,
  },

  created() {
    this.fetch()
  },

  computed: {
    games() { return this.resource.data || {} },
  },

  methods: {
    fetch() {
      return loadResource(this.resource, () => GameApi.fetchAllGames({ year_id: 1 }).then(readGameMap), games => Object.keys(games).length === 0)
    },
  }
}

</script>
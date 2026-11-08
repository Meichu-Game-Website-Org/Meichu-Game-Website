<template>
  <div class="curr-score">
    <div class="curr-score__title">正式賽當前積點</div>
    <RequestState :resource="resource" empty-text="目前尚無正式賽積點資料。" @retry="fetch" />
    <div class="curr-score__score" v-if="resource.status === 'success'">
      <div class="score__school">
        <img src="@/assets/2025/panda.png" alt="熊貓"/>
        <div>清華大學</div>
      </div>
      <div class="score__score">
        <div class="left">{{ this.score['nthu'] }}</div>
        <div class="center">:</div>
        <div class="right">{{ this.score['nctu'] }}</div>
      </div>
      <div class="score__school">
        <img src="@/assets/2025/fox.png" alt="狐狸"/>
        <div>陽明交通大學</div>
      </div>
    </div>
  </div>
</template>

<script>
import { archiveResourceMixin } from '@/utils/archive-resource'
import { Game as GameApi, loadResource, readGames } from '@meichu/services'

export default {
  mixins: [archiveResourceMixin],
  name: 'curr-score',


  created() {
    this.fetch()
  },

  computed: {
    score() { return this.resource.data || {} },
  },

  methods: {
    fetch() {
      return loadResource(this.resource, async () => {
        const games = readGames(await GameApi.fetchAllGames({ year_id: 57 })).filter(game => game.type_of === 'official')
        if (!games.length) return null
        const draw = games.filter(game => game.status === 'draw').length
        return {
          nthu: games.filter(game => game.status === 'nthu').length + 0.5 * draw,
          nctu: games.filter(game => game.status === 'nctu').length + 0.5 * draw
        }
      })
    },
  }
}
</script>



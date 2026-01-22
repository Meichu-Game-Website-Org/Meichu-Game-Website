<template>
  <div>
    <div class="row">
      <div class="col">
        <h2><i class="fas fa-trophy"></i>所有賽事</h2>
        <div class="row game-row">
          <div class="game-col">
            <h3 class="game-day">2/28 （五）</h3>
            <GameItem :game="games['billiard']" />
            <GameItem :game="games['women-table-tennis']" />
            <GameItem :game="games['kendo']" />
            <GameItem :game="games['table-tennis']" />
            <GameItem :game="games['badminton']" />
          </div>
          <div class="game-col">
            <h3 class="game-day">2/29 （六）</h3>
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
            <h3 class="game-day">3/1 （日）</h3>
            <GameItem :game="games['bridge']" />
            <GameItem :game="games['darts']" />
            <GameItem :game="games['softball']" />
            <GameItem :game="games['men-volleyball']" />
            <GameItem :game="games['women-volleyball']" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// import NewsPanel from '@/components/2020/NewsPanel.vue'
import GameItem from '@/components/2020/GameItem.vue'
import { Game as GameApi } from '@meichu/services'

export default {
  name: 'game-list',

  metaInfo: {
    title: '賽事列表'
  },

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
        year_id: 2
      }
      GameApi.fetchAllGames(params)
        .then((games) => {
          this.games = Object.assign({}, ...games.filter(val => val.item).map(game => ({
            [game.item.slug]: game
          })))

        })
    },
  }
}

</script>
<template>
  <div>
    <div class="row">
      <div class="col">
        <h2>
          <div class="message_title">所有賽事</div><img src="@/assets/2022/梅竹_圈-素材.svg" slot="title_circle_behind" class="title_circle_behind" alt="" />
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
  </div>
</template>

<script>

import GameItem from '@/components/2022/GameItem.vue'
import { Game as GameApi } from '@meichu/services'

export default {
  name: 'game-list',

  components: {
    GameItem
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
        year_id: 54
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
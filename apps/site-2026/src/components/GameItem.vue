<template>
  <div :class="'game-item status-' + game.status" v-if="game">
    <router-link :to="{ name: 'game-show-2025', params: {slug: game.item.slug} }" class="game-item__link"></router-link>
    <div class="game-item__mask"></div>
    <img :src="game.photo" class="game-item__photo" alt="">
    <div class="game-item__content">
      <div class="game-item__info">
        <div class="game-item__time"><i class="fa-regular fa-clock"></i> {{ game.time }}</div>
        <div class="game-item__location">{{ game.location }}</div>
      </div>
      <div class="game-item__text">
        <div class="game-item__title">
          <small v-if="isShowScore(game.status)" class="game-item__score">陽明交大 {{ game.score_nctu }} : {{ game.score_nthu }} 清大</small>
          <div>{{ game.name }}</div>
        </div>
      </div>
    </div>

    

  </div>
</template>

<script>

// import { Game as GameApi } from '@meichu/services'

export default {
  name: 'game-item-2025',

  props: ['game'],

  data: function() {
    return {
    }
  },

  created() {
  },

  methods: {
    isShowScore(status) {
      return status == 'nctu' || status == 'nctu' || status == 'nthu'
    }
  }
}

</script>
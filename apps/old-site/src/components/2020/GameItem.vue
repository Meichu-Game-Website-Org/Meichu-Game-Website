<template>
  <div :class="'game-item status-' + game.status" v-if="game">
    <router-link :to="{ name: 'game-show-2020', params: {slug: game.item.slug} }" class="game-item__link"></router-link>
    <div class="game-item__mask"></div>
    <div class="game-item__bg">
      <img :src="game.photo" class="game-item__photo" alt="">
    </div>

    <div class="game-item__time"><i class="fas fa-clock"></i> {{ game.time }}</div>
    <div class="game-item__location"><i class="fas fa-location-arrow"></i> {{ game.location }}</div>

    <div class="game-item__content">
      <div class="game-item__title">
        <small v-if="isShowScore(game.status)" class="game-item__score">交大 {{ game.score_nctu }} : {{ game.score_nthu }} 清大</small>
        <h4>{{ game.name }}</h4>
      </div>

    </div>

  </div>
</template>

<script>

// import { Game as GameApi } from '@meichu/services'

export default {
  name: 'game-item-2020',

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
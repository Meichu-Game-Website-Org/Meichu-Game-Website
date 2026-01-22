<template>
  <div :class="'game-item status-' + game.status" v-if="game">
    <router-link :to="{ name: 'game-show', params: {slug: game.slug} }" class="game-link"></router-link>
    <div class="game-mask"></div>
    <div class="game-bg">
      <img :src="game.photo" class="game-photo" alt="">
    </div>

    <div class="game-time"><i class="fas fa-clock"></i> {{ game.time }}</div>
    <div class="game-location"><i class="fas fa-location-arrow"></i> {{ game.location }}</div>

    <div class="game-content">
      <div class="game-title">
        <small v-if="isShowScore(game.status)" class="game-score">交大 {{ game.score_nctu }} : {{ game.score_nthu }} 清大</small>
        <h4>{{ game.name }}</h4>
      </div>

    </div>

  </div>
</template>

<script>

// import { Game as GameApi } from '@meichu/services'

export default {
  name: 'game-item',

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
<template>
  <div class="game-list">
    <GameList></GameList>
  </div>
</template>

<script>

import GameList from '@/components/GameList.vue'

export default {
  name: 'game-list-2026',

  metaInfo: {
    title: '賽事列表'
  },

  components: {
    GameList
  }
}

</script>
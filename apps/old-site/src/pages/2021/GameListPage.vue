<template>
  <div>
    <GameList></GameList>
  </div>
</template>

<script>

import GameList from '@/components/2021/GameList.vue'

export default {
  name: 'game-list',

  metaInfo: {
    title: '賽事列表'
  },

  components: {
    GameList
  }
}

</script>
<template>
  <div class="game-list">
    <!-- <div class="page-fix-bg-container">
      <img src="@/assets/2024/news_background.svg" class="page-fix-bg" alt="" />
    </div> -->
    <!-- <img src="@/assets/2022/logo_nobackground.svg" class="about_icon" alt="" /> -->
    
    <!-- <div class="game_list_top"> -->
    <GameList></GameList>
    <!-- </div> -->
  </div>
</template>

<script>

import GameList from '@/components/GameList.vue'

export default {
  name: 'game-list-2025',

  metaInfo: {
    title: '賽事列表'
  },

  components: {
    GameList
  }
}

</script>
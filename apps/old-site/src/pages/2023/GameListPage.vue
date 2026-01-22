<template>
  <div>
    <div class="news_list_page_back_box">
      <img src="@/assets/2023/news_background.svg" class="news_list_page_back" alt="" />
    </div>
    <!-- <img src="@/assets/2022/logo_nobackground.svg" class="about_icon" alt="" /> -->
    
    <div class="game_list_top">
    <GameList></GameList>
    </div>
  </div>
</template>

<script>

import GameList from '@/components/2023/GameList.vue'

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
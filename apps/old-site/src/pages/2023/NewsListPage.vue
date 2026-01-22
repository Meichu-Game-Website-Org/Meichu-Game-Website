<template>
  <div>
    <div>
      <!-- <div class="news_list_page_back"> -->
      <div class="news_list_page_back_box">
        <img src="@/assets/2023/news_background.svg" class="news_list_page_back" alt="" />
      </div>
      <!-- <img src="@/assets/2022/logo_nobackground.svg" class="about_icon" alt="" /> -->
      <!-- </div> -->
      <div class="game_list_top">
      <div class="row">
        <div class="col margin-new">
          
          <div class="newspanel">
          <NewsPanel>
          </NewsPanel></div>
        </div>
        <!-- <div class="col">
          <h2><i class="fab fa-youtube"></i> 宣傳影片</h2>
        </div> -->
      </div>
      </div>

    </div>
  </div>
</template>

<script>

import NewsPanel from '@/components/2023/NewsPanel.vue'
// import GameItem from '@/components/2021/GameItem.vue'

export default {
  name: 'news-list',

  metaInfo() {
    return {
      title: '訊息公告',
      titleTemplate: '%s | 癸卯梅竹',
    }
  },

  components: {
    // GameItem,
    NewsPanel,
  }
}

</script>
<template>
  <div>
    <div>
      <!-- <div class="news_list_page_back_box">
        <img src="@/assets/2024/news_background.svg" class="news_list_page_back" alt="" />
      </div> -->
      <div class="row">
      <div class="col margin-history">
        <!-- <div class="newspanel"> -->
        <NewsPanel>
        </NewsPanel>
      </div>
      <!-- <div class="col">
        <h2><i class="fab fa-youtube"></i> 宣傳影片</h2>
      </div> -->
    </div>
    </div>

  </div>
</template>

<script>

import NewsPanel from '@/components/2024/NewsPanel.vue'
// import GameItem from '@/components/2021/GameItem.vue'

export default {
  name: 'news-list',

  metaInfo() {
    return {
      title: '訊息公告',
      titleTemplate: '%s | 甲辰梅竹',
    }
  },

  components: {
    // GameItem,
    NewsPanel,
  }
}

</script>
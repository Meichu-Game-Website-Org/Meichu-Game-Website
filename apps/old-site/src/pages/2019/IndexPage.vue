<template>
  <div>
    <div class="container">
      <div class="row">

        <div class="col">
          <NewsPanel :is_sticky="true">
            <span slot="title">最新消息</span>
          </NewsPanel>

          <div class="see-all-news">
            <router-link :to="{name: 'news-list'}">
              <i class="fas fa-arrow-circle-right"></i>&nbsp;<span>查看所有消息</span>
            </router-link>
          </div>

          <router-link :to="{name: ''}"></router-link>
        </div>
        <!-- <div class="col">
          <h2><i class="fab fa-youtube"></i> 宣傳影片</h2>
        </div> -->
      </div>

      <h2><i class="fas fa-trophy"></i> 所有賽事</h2>
    </div>

    <GameListPage />

  </div>
</template>

<script>

import GameListPage from './GameListPage.vue'
import NewsPanel from '@/components/2019/NewsPanel.vue'
// import GameItem from '@/components/2019/GameItem.vue'


export default {
  name: 'index',

  components: {
    // GameItem,
    NewsPanel,
    GameListPage
  },
}

</script>
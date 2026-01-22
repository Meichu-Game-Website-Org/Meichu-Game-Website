<template>
  <div>

    <div>
      <div class="row">

        <div class="col">
          <NewsPanel>
            <span slot="title">所有訊息</span>
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

import NewsPanel from '@/components/2020/NewsPanel.vue'
import GameItem from '@/components/2020/GameItem.vue'

export default {
  name: 'news-list',

  metaInfo() {
    return {
      title: '訊息公告',
      titleTemplate: '%s | 庚子梅竹',
    }
  },

  components: {
    GameItem,
    NewsPanel,
  }
}

</script>
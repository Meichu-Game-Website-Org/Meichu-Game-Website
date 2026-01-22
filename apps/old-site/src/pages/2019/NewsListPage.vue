<template>
  <div>

    <div class="container">
      <div class="row">

        <div class="col">
          <NewsPanel>
            <span slot="title">所有消息</span>
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

import NewsPanel from '@/components/2019/NewsPanel.vue'
import GameItem from '@/components/2019/GameItem.vue'

export default {
  name: 'news-list',

  components: {
    GameItem,
    NewsPanel,
  },

  data: function() {
    return {

    }
  },

  created() {


  },

  methods: {



  }
}

</script>
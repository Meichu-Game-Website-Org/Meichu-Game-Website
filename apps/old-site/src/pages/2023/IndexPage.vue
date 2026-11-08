<template>
  <div>
    <!-- <div class="cover">
      <img src="@/assets/2021/cover.jpg" class="bg" alt="">
    </div> -->
    <div class="front_title">
      <img src="@/assets/2023/banner.svg" class="banner__image" alt="" />
    </div>
    <div class="index_pic">
        <img src="@/assets/2023/Rectangle_left.svg" class="rec_left" alt="" />
        <img src="@/assets/2023/fox.svg" class="fox" alt="" />

        <img src="@/assets/2023/words.svg" class="index_title" alt="" />
        <img src="@/assets/2023/Rectangle_right.svg" class="rec_right" alt="" />
        <img src="@/assets/2023/panda.svg" class="panda" alt="" />
    </div>
    <!-- <div class="row">
      <div class="col margin-new">
        <div class="newspanel">
        <NewsPanel :is_sticky="true">
          <span class="message_title">訊息公告</span><img src="@/assets/2022/梅竹_圈-素材.svg" slot="title_circle_behind" class="title_circle_behind" alt="" />
        <div class="see-all-news">
          <router-link :to="{name: 'news-list-2022'}">
            <i class="fas fa-arrow-circle-right"></i>&nbsp;<span>查看所有公告</span>
          </router-link>
        </div>
        </div>
        <router-link :to="{name: ''}"></router-link>
      </div>
      <div class="col">
        <h2><i class="fab fa-youtube"></i> 宣傳影片</h2>
      </div> 
    </div> -->

    <GameList></GameList>

  </div>
</template>

<script>
import GameList from '@/components/2023/GameList.vue'

export default {
  name: 'index',
  metaInfo: {
    title: '癸卯梅竹 | 2023 Meichu Games',
    titleTemplate: '%s',
  },
  components: { GameList }
}
</script>
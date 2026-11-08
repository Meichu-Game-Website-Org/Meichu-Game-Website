<template>
  <div>
    <!-- <div class="cover">
      <img src="@/assets/2021/cover.jpg" class="bg" alt="">
    </div> -->
    <div class="front_title">
      <img src="@/assets/2022/BANNER.svg" class="banner__image" alt="" />
    </div>
    <div class="index_page_back_box">
      <img src="@/assets/2022/背景2_素材.svg" class="news_list_page_back" alt="" />
    </div>
    <div class="index_pic">
        <img src="@/assets/2022/梅-素材.svg" class="Bossom" alt="" />
        <img src="@/assets/2022/狐狸-素材.svg" class="panda" alt="" />

        <img src="@/assets/2022/字-素材.svg" class="index_title" alt="" />

        <img src="@/assets/2022/竹-素材.svg" class="bamboo" alt="" />
        <img src="@/assets/2022/熊貓-素材.svg" class="fox" alt="" />
    </div>
    <!-- <div class="row">
      <div class="col margin-new">
        <div class="newspanel">
        <NewsPanel :is_sticky="true"/>
          <span class="message_title">訊息公告</span><img src="@/assets/2022/梅竹_圈-素材.svg" slot="title_circle_behind" class="title_circle_behind" alt="" />
        <div class="see-all-news">
          <router-link :to="{name: 'news-list-2022'}">
            <i class="fas fa-arrow-circle-right"></i>&nbsp;<span>查看所有公告</span>
          </router-link>
        </div>
        </div>
        <router-link :to="{name: ''}"></router-link>
      </div>
    </div> -->

    <GameList></GameList>

  </div>
</template>

<script>
import GameList from '@/components/2022/GameList.vue'

export default {
  name: 'index',
  metaInfo: {
    title: '壬寅梅竹 | 2022 Meichu Games',
    titleTemplate: '%s',
  },
  components: { GameList }
}
</script>
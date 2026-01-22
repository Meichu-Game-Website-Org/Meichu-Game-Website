<template>
  <!-- <div class="news">
    <h1 class="news__title">
      <span>{{ news.title }}</span>
    </h1>

    <div class="meta">
      <span class="meta-time" title="發佈時間">
        <i class="fas fa-clock"></i> {{ moment(news.created_at).format('YYYY/MM/DD')}}
      </span>
      <span class="meta-org" title="發布單位">
        <i class="fas fa-users"></i> {{ news.org }}
      </span>
    </div>

    <div class="content pre-text">{{ news.content }}</div>

    <a v-if="news.link" :href="news.link" target="_blank" class="related-link">相關連結</a>

    <template v-if="news.files">
      <h4 class="file-list-title">附件 ({{ news.files.length }})</h4>
      <div class="clearfix">
        <div :key="url" v-for="url in news.files" class="file-item">
          <a :href="url" target="_blank" title="另開新視窗看大圖">
            <img :src="url" alt="" class="photo">
          </a>
        </div>
      </div>
    </template>
  </div> -->
  <div class="Courses">
    <div class="news_list_page_back_box">
        <img src="@/assets/2023/news_background.svg" class="news_list_page_back" alt="" />
      </div>
  <img src="@/assets/2023/Course.svg" class="" alt="" />
  <h4 class="file-list-title">開幕</h4>
  <img src="@/assets/2023/開幕.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">足球</h4>
  <img src="@/assets/2023/足球.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">撞球</h4>
  <img src="@/assets/2023/撞球.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">桌球、女桌</h4>
  <img src="@/assets/2023/桌球、女桌.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">劍道</h4>
  <img src="@/assets/2023/劍道.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">羽球</h4>
  <img src="@/assets/2023/羽球.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">橋藝</h4>
  <img src="@/assets/2023/橋藝.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">象棋</h4>
  <img src="@/assets/2023/象棋.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">圍棋</h4>
  <img src="@/assets/2023/圍棋.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">網球、女網</h4>
  <img src="@/assets/2023/網球、女網.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">棒球</h4>
  <img src="@/assets/2023/棒球.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">男籃、女籃</h4>
  <img src="@/assets/2023/男籃、女籃.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">射箭</h4>
  <img src="@/assets/2023/射箭.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">壘球</h4>
  <img src="@/assets/2023/壘球.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">男排、女排</h4>
  <img src="@/assets/2023/男排、女排.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">閉幕</h4>
  <img src="@/assets/2023/閉幕.jpg" alt="" class="photo"/>
  <!-- <h4 class="file-list-title">圍棋</h4>
  <img src="@/assets/2023/圍棋.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">棒球</h4>
  <img src="@/assets/2023/棒球.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">象棋</h4>
  <img src="@/assets/2023/象棋.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">網球、女網</h4>
  <img src="@/assets/2023/網球、女網.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">劍道</h4>
  <img src="@/assets/2023/劍道.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">橋藝</h4>
  <img src="@/assets/2023/橋藝.jpg" alt="" class="photo"/>
  <h4 class="file-list-title">壘球</h4>
  <img src="@/assets/2023/壘球.jpg" alt="" class="photo"/> -->
  </div>
</template>

<script>


// import moment from 'moment'

export default {
  name: 'course-show',
  mounted () {
  window.scrollTo(0, 0)
  },
  metaInfo() {
    return {
      title: this.news.title,
      titleTemplate: '%s | 癸卯梅竹',
    }
  }
}

</script>
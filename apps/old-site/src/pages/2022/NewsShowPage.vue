<template>
  <div class="news">
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
  </div>
</template>

<script>

import { News as NewsApi } from '@meichu/services'
import moment from 'moment'

export default {
  name: 'news-show',

  metaInfo() {
    return {
      title: this.news.title,
      titleTemplate: '%s | 壬寅梅竹',
    }
  },

  data: function() {
    return {
      od: null,
      news: {},
      moment
    }
  },

  created() {
    this.id = this.$route.params.id
    this.fetch()
  },

  methods: {
    fetch() {
      NewsApi.fetchNews(this.id)
        .then((news) => {
          this.news = news
        })
    }
  }


}

</script>
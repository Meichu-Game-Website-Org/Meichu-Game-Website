<template>
  <div>
    <h2><i class="fas fa-fire"></i><slot name="title"></slot></h2>
    <ul class="news-list">
      <li v-for="news in data" class="news-list__item" :key="news">
        <span class="news-list__item__time">{{ moment(news.created_at).format('MM/DD') }}</span>&nbsp;
        <span :class="'news-list__item__type ' + news.type_of">{{ NEWS_TYPE_OF[news.type_of] }}</span>
        <a :href="news.link" v-if="news.type_of == 'link' || news.type_of == 'news'" target="_blank">{{ news.title }}</a>
        <router-link :to="{name: 'news-show-2021', params: {id: news.id}}" v-else>{{ news.title }}</router-link>
        <span class="news-list__item__org">{{ news.org }}</span>
      </li>
    </ul>
  </div>
</template>

<script>


import { News as NewsApi } from '@meichu/services'
import {NEWS_TYPE_OF} from '@/utils'
import moment from 'moment'

export default {
  name: 'news-panel',

  props: ['is_sticky'],

  data: function() {
    return {
      data: [],
      moment,
      NEWS_TYPE_OF
    }
  },

  created() {
    this.fetch()
  },

  methods: {
    fetch() {
      const params = {
        year_id: 53,
        is_sticky: this.is_sticky
      }
      NewsApi.fetchAllNews(params)
        .then((data) => {
          this.data = data.news
        })
    }
  }

}


</script>
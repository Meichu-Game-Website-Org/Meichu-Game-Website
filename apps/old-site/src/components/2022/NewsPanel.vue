<template>
  <div>
    <RequestState :resource="resource" empty-text="目前尚無消息。" @retry="fetch" />
    <template v-if="resource.status === 'success'">
    <h2><slot name="title"></slot><slot name="title_circle"></slot></h2>
    <ul class="news-list">
      <li v-for="news in data" class="news-list__item" :key="news">
        <span class="news-list__item__time">{{ moment(news.created_at).format('MM/DD') }}</span>&nbsp;
        <span :class="'news-list__item__type ' + news.type_of">{{ NEWS_TYPE_OF[news.type_of] }}</span>
        <a :href="news.link" v-if="news.type_of == 'link' || news.type_of == 'news'" target="_blank">{{ news.title }}</a>
        <router-link :to="{name: 'news-show-2022', params: {id: news.id}}" v-else>{{ news.title }}</router-link>
        <span class="news-list__item__org">{{ news.org }}</span>
      </li>
    </ul>
    </template>
  </div>
</template>

<script>
import { archiveResourceMixin, readNewsList } from '@/utils/archive-resource'


import { News as NewsApi, loadResource } from '@meichu/services'
import {NEWS_TYPE_OF} from '@/utils'
import moment from 'moment'

export default {
  mixins: [archiveResourceMixin],
  name: 'news-panel',

  props: ['is_sticky'],

  data: function() {
    return {
      moment,
      NEWS_TYPE_OF
    }
  },

  created() {
    this.fetch()
  },

  computed: {
    data() { return this.resource.data || [] },
  },

  methods: {
    fetch() {
      return loadResource(this.resource, () => NewsApi.fetchAllNews({ year_id: 54, is_sticky: this.is_sticky }).then(readNewsList), news => news.length === 0)
    }
  }

}


</script>
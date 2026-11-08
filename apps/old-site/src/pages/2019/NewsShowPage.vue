<template>
  <div class="container">
    <RequestState :resource="resource" empty-text="找不到這則公告。" @retry="fetch" />
    <template v-if="resource.status === 'success'">

    <h2>
      <span>{{ news.title }}</span>
    </h2>

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
        <div v-for="url in news.files" class="file-item" :key="url.id">
          <a :href="url" target="_blank" title="另開新視窗看大圖">
            <img :src="url" alt="" class="photo">
          </a>
        </div>
      </div>

    </template>

    </template>
  </div>
</template>

<script>
import { archiveResourceMixin } from '@/utils/archive-resource'

import { News as NewsApi, loadResource, readNews } from '@meichu/services'
import moment from 'moment'

export default {
  mixins: [archiveResourceMixin],
  name: 'news-show',

  data: function() {
    return {
      moment
    }
  },

  watch: {
    '$route.params.id': { immediate: true, handler() { this.fetch() } }
  },

  computed: {
    news() { return this.resource.data || {} },
  },

  methods: {
    fetch() {
      const id = this.$route.params.id
      return loadResource(this.resource, () => NewsApi.fetchNews(id).then(readNews))
    }
  }


}

</script>
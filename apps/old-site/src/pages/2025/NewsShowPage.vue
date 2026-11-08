<template>
  <section class="news-page">
    <RequestState :resource="resource" empty-text="找不到這則公告。" @retry="fetch" />
    <article v-if="resource.status === 'success'">
      <h1>{{ news.title }}</h1>
      <div class="news-meta">
        <span v-if="news.created_at">{{ formatDate(news.created_at) }}</span>
        <span v-if="news.org">{{ news.org }}</span>
        <span v-if="news.author">{{ news.author }}</span>
      </div>
      <div class="news-content">{{ news.content }}</div>
      <p v-if="news.link"><a :href="news.link" target="_blank" rel="noopener noreferrer">相關連結（另開視窗）</a></p>
      <section v-if="news.files.length" class="news-files" aria-label="公告附件">
        <h2>附件（{{ news.files.length }}）</h2>
        <ul>
          <li v-for="(url, index) in news.files" :key="index">
            <a :href="url" target="_blank" rel="noopener noreferrer">附件 {{ index + 1 }}（另開視窗）</a>
          </li>
        </ul>
      </section>
    </article>
    <router-link class="back-link" :to="{ name: 'game-list-2025' }">返回賽事列表</router-link>
  </section>
</template>

<script>
import { News as NewsApi, resourceMixin, loadResource, readNews } from '@meichu/services'
import RequestState from '@/components/2025/RequestState.vue'
import moment from 'moment'

export default {
  name: 'news-show-2025',
  mixins: [resourceMixin],
  components: { RequestState },
  computed: { news() { return this.resource.data || {} } },
  metaInfo() { return { title: this.news.title || '公告', titleTemplate: '%s | 乙巳梅竹' } },
  watch: {
    '$route.params.id': { immediate: true, handler() { this.fetch() } }
  },
  methods: {
    fetch() {
      const id = this.$route.params.id
      return loadResource(this.resource, () => NewsApi.fetchNews(id).then(readNews))
    },
    formatDate(value) { return moment(value).format('YYYY/MM/DD') }
  }
}
</script>

<style scoped>
.news-page { width: 87%; max-width: 70ch; margin: 2rem auto 4rem; line-height: 1.8; font-size: max(1rem, 16px); overflow-wrap: anywhere; }
.news-meta { display: flex; flex-wrap: wrap; gap: .5rem 1rem; margin-bottom: 2rem; }
.news-content { white-space: pre-wrap; margin-bottom: 2rem; }
.news-files { margin-top: 2rem; }
.news-files h2 { text-align: left; }
.news-page a { color: inherit; text-decoration: underline; text-underline-offset: .2em; }
.news-page a:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
.news-files li { padding: .5rem 0; }
.news-files a { display: inline-flex; align-items: center; min-height: 44px; }
.back-link { display: inline-block; min-height: 44px; margin-top: 2rem; padding: .5rem 0; }
</style>

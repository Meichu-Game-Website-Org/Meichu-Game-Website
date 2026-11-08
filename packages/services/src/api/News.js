import client from '../client'
import {API_PATH} from '../config'
import { sanitizeNewsUrls } from '../urls'

export default {

  fetchAllNews(params) {
    return client.get(`${API_PATH}/news`, {params})
      .then(response => {
        const data = response.data
        return Array.isArray(data.news) ? { ...data, news: data.news.map(sanitizeNewsUrls) } : data
      })
  },

  fetchNews(newsId) {
    return client.get(`${API_PATH}/news/${newsId}`)
      .then(response => {
        return sanitizeNewsUrls(response.data.news)
      })
  }
}

import client from '../client'
import {API_PATH} from '../config'
import { sanitizeNewsUrls, sanitizeNewsListUrls } from '../urls'

export default {

  fetchAllNews(params) {
    return client.get(`${API_PATH}/news`, {params})
      .then(response => {
        const data = response.data
        return { ...data, news: sanitizeNewsListUrls(data.news) }
      })
  },

  fetchNews(newsId) {
    return client.get(`${API_PATH}/news/${newsId}`)
      .then(response => {
        return sanitizeNewsUrls(response.data.news)
      })
  }
}

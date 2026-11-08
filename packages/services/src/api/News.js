import client from '../client'
import {API_PATH} from '../config'

export default {

  fetchAllNews(params) {
    return client.get(`${API_PATH}/news`, {params})
      .then(response => {
        return response.data
      })
  },

  fetchNews(newsId) {
    return client.get(`${API_PATH}/news/${newsId}`)
      .then(response => {
        return response.data.news
      })
  }
}
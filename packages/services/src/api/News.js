import axios from 'axios'
import {API_PATH} from '../config'

export default {

  fetchAllNews(params) {
    return axios.get(`${API_PATH}/news`, {params})
      .then(response => {
        return response.data
      })
  },

  fetchNews(newsId) {
    return axios.get(`${API_PATH}/news/${newsId}`)
      .then(response => {
        return response.data.news
      })
  }
}
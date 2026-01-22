import axios from 'axios'
import {API_PATH} from '../config'

export default {

  fetchFullArchives() {
    return axios.get(`${API_PATH}/archive/full`)
      .then(response => {
        return response.data
      })
  },

  fetchAllItems() {
    return axios.get(`${API_PATH}/item`)
      .then(response => {
        return response.data
      })
  }
}
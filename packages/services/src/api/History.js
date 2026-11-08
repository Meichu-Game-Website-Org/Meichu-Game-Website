import client from '../client'
import {API_PATH} from '../config'

export default {

  fetchFullArchives() {
    return client.get(`${API_PATH}/archive/full`)
      .then(response => {
        return response.data
      })
  },

  fetchAllItems() {
    return client.get(`${API_PATH}/item`)
      .then(response => {
        return response.data
      })
  }
}
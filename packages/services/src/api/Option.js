import client from '../client'
import {API_PATH} from '../config'

export default {
  fetchOptions(params) {
    return client.get(`${API_PATH}/option`, {params})
      .then((response) => {
        return response.data
      })
  },

}
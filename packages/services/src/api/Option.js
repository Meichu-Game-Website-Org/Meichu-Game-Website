import client from '../client'
import {API_PATH} from '../config'
import { sanitizeOptionUrls } from '../urls'

export default {
  fetchOptions(params) {
    return client.get(`${API_PATH}/option`, {params})
      .then((response) => {
        return sanitizeOptionUrls(response.data)
      })
  },

}

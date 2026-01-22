import axios from 'axios'
import {API_PATH} from '../config'

export default {
  fetchOptions(params) {
    return axios.get(`${API_PATH}/option`, {params})
      .then((response) => {
        return response.data
      })
  },

}
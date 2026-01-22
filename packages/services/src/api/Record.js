import axios from 'axios'
import {API_PATH} from '../config'

export default {
  fetchRecordsByGameId(game_id) {
    return axios.get(`${API_PATH}/game/${game_id}/record`)
      .then((response) => {
        return response.data.records
      })
  }
}
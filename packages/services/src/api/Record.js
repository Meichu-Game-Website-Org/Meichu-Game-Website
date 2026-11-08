import client from '../client'
import {API_PATH} from '../config'

export default {
  fetchRecordsByGameId(game_id) {
    return client.get(`${API_PATH}/game/${game_id}/record`)
      .then((response) => {
        return response.data.records
      })
  }
}
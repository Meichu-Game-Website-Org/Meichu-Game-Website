import client from '../client'
import {API_PATH} from '../config'
import { sanitizeGameUrls, sanitizeGameListUrls } from '../urls'

export default {

  fetchAllGames(params) {
    return client.get(`${API_PATH}/game`, {params})
      .then(response => {
        return sanitizeGameListUrls(response.data.games)
      })
  },

  fetchGame(gameId) {
    return client.get(`${API_PATH}/game/${gameId}`)
      .then(response => {
        return sanitizeGameUrls(response.data.game)
      })
  },

  fetchGameBySlug(gameSlug, params) {
    return client.get(`${API_PATH}/game/slug/${gameSlug}`, {params})
      .then(response => {
        return sanitizeGameUrls(response.data.game)
      })
  }
}

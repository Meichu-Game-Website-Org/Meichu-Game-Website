import client from '../client'
import {API_PATH} from '../config'
import { sanitizeGameUrls } from '../urls'

export default {

  fetchAllGames(params) {
    return client.get(`${API_PATH}/game`, {params})
      .then(response => {
        return Array.isArray(response.data.games) ? response.data.games.map(sanitizeGameUrls) : response.data.games
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

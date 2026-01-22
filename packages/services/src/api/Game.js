import axios from 'axios'
import {API_PATH} from '../config'

export default {

  fetchAllGames(params) {
    return axios.get(`${API_PATH}/game`, {params})
      .then(response => {
        return response.data.games
      })
  },

  fetchGame(gameId) {
    return axios.get(`${API_PATH}/game/${gameId}`)
      .then(response => {
        return response.data.game
      })
  },

  fetchGameBySlug(gameSlug, params) {
    return axios.get(`${API_PATH}/game/slug/${gameSlug}`, {params})
      .then(response => {
        return response.data.game
      })
  }
}
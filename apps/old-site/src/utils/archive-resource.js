import { resourceMixin, readGames } from '@meichu/services'
import RequestState from '@/components/2025/RequestState.vue'

// Share request ordering, unmount cleanup, and recovery UI across archived designs.
export const archiveResourceMixin = {
  mixins: [resourceMixin],
  components: { RequestState }
}

export function readGameMap(games) {
  return Object.fromEntries(readGames(games).map(game => [game.item.slug, game]))
}

export function readNewsList(response) {
  const news = response && response.news
  if (!Array.isArray(news) || news.some(item => !item || typeof item !== 'object' || item.id == null || typeof item.title !== 'string')) {
    const error = new Error('Unexpected news response')
    error.code = 'INVALID_RESPONSE'
    throw error
  }
  return news
}

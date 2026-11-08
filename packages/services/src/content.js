function invalidResponse() {
  const error = new Error('Unexpected API response')
  error.code = 'INVALID_RESPONSE'
  throw error
}

function object(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalidResponse()
  return value
}

function array(value) {
  if (!Array.isArray(value)) invalidResponse()
  return value
}

function text(value) {
  if (typeof value !== 'string') invalidResponse()
  return value
}

function requiredText(value) {
  if (!text(value).trim()) invalidResponse()
  return value
}

export function readGame(game) {
  if (game == null) return null
  object(game)
  requiredText(game.name)
  const result = { ...game }
  for (const key of ['team_nctu', 'team_nthu']) {
    if (game[key] == null) continue
    const team = object(game[key])
    result[key] = { ...team, photo: team.photo ? new URL(text(team.photo), 'https://meichu.games').href : null }
  }
  if (game.news != null) array(game.news).forEach(news => {
    object(news)
    requiredText(news.title)
    if (news.id == null) invalidResponse()
  })
  return result
}

export function readGames(games) {
  return array(games).filter(game => object(game).item).map(game => {
    requiredText(object(game.item).slug)
    text(game.status)
    return {
      ...game,
      time: game.time == null ? '' : text(game.time),
      photo: game.photo ? new URL(text(game.photo), 'https://meichu.games').href : null
    }
  })
}

export function readNews(news) {
  if (news == null) return null
  object(news)
  requiredText(news.title)
  text(news.content)
  const files = news.files == null ? [] : array(news.files).map(url => text(url))
  return { ...news, files }
}

export function readArchives(data) {
  object(data)
  const archives = array(data.archives)
  archives.forEach(archive => {
    object(archive)
    if (object(archive.year).year == null) invalidResponse()
    array(archive.archive).forEach(row => object(row))
  })
  const items = array(data.items).map(item => object(item))
  return { archives, items: items.filter(item => item.slug !== 'opening' && item.slug !== 'closing') }
}

export function readOptions(data) {
  const options = {}
  array(object(data).options).forEach(option => {
    object(option)
    if (option.key === 'about-meichu' || option.key === 'meichu-history') {
      options[option.key] = option.value == null ? '' : text(option.value)
    }
  })
  return options
}

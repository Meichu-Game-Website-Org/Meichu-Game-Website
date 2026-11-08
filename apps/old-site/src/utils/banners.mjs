export function readBannerOptions(data) {
  const options = { banners: [], 'banner-links': [] }
  const records = Array.isArray(data?.options) ? data.options : []
  for (const option of records) {
    if (!option || !Object.prototype.hasOwnProperty.call(options, option.key)) continue
    options[option.key] = Array.isArray(option.value) ? option.value : []
  }
  return options
}

export function createBannerList(options) {
  const images = Array.isArray(options?.banners) ? options.banners : []
  const links = Array.isArray(options?.['banner-links']) ? options['banner-links'] : []
  return images.flatMap((image, index) => {
    if (typeof image !== 'string' || !image.trim()) return []
    const url = typeof links[index] === 'string' ? links[index].trim() : ''
    return [{ image_url: image.trim(), url }]
  })
}

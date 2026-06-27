const getImage = async keyword => {
  const apiKey = process.env.PEXELS_API_KEY

  const cleanKeyword = (keyword || 'travel')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      cleanKeyword,
    )}&per_page=5`,
    {
      headers: {
        Authorization: apiKey,
      },
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Unable to fetch image')
  }

  if (!data.photos || data.photos.length === 0) {
    return 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg'
  }

  const photo =
    data.photos.find(p => p.src?.large) || null

  return photo
    ? photo.src.large
    : 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg'
}

module.exports = getImage
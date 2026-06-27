const generateItinerary = async prompt => {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        max_tokens: 1200,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    },
  )

  const data = await response.json()

  console.log('Status:', response.status)
  console.log('OpenRouter Response:', JSON.stringify(data, null, 2))

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenRouter request failed')
  }

  return data.choices[0].message.content
}

module.exports = generateItinerary
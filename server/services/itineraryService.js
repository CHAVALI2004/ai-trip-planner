const generateItinerary = require('../utils/openrouter')
const getImage = require('../utils/pexels')

const generateAndSaveItinerary = async (db, tripId) => {
  // Get trip
  const trip = await db.get(
    `
    SELECT *
    FROM trips
    WHERE id = ?;
    `,
    [tripId],
  )

  if (!trip) {
    throw new Error('Trip not found')
  }

  // Prevent duplicate generation
  const existing = await db.get(
    `
    SELECT id
    FROM itineraries
    WHERE trip_id = ?
    LIMIT 1;
    `,
    [tripId],
  )

  if (existing) {
    throw new Error('Itinerary already generated')
  }

  // Improved Prompt (STRICT JSON)
  const prompt = `
You are a strict JSON generator.

Return ONLY valid JSON.
No explanation.
No markdown.
No backticks.

Rules:
- Use double quotes only
- No trailing commas
- Escape special characters properly

Schema:
{
  "tripTitle": "",
  "estimatedBudget": "",
  "destinationKeyword": "",
  "days": [
    {
      "day": 1,
      "title": "",
      "description": "",
      "imageKeyword": ""
    }
  ]
}

Trip Details:
Start: ${trip.starting_location}
Destination: ${trip.destination}
Start Date: ${trip.start_date}
End Date: ${trip.end_date}
Members: ${trip.members}
`

  // Call AI
  const aiResponse = await generateItinerary(prompt)

  // Safe JSON extractor
  const extractJSON = text => {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')

    if (start === -1 || end === -1) {
      throw new Error('Invalid AI response format')
    }

    return text.slice(start, end + 1)
  }

  const cleanedResponse = extractJSON(aiResponse)

  let itinerary

  try {
    itinerary = JSON.parse(cleanedResponse)
  } catch (err) {
    console.log('❌ RAW AI RESPONSE:\n', aiResponse)
    throw new Error('Failed to parse AI JSON')
  }

  // Destination image
  const destinationImage = await getImage(
    itinerary.destinationKeyword,
  )

  // Update trip
  await db.run(
    `
    UPDATE trips
    SET
      estimated_budget = ?,
      destination_image = ?
    WHERE id = ?;
    `,
    [
      itinerary.estimatedBudget,
      destinationImage,
      tripId,
    ],
  )

  // Save itinerary days
  for (const day of itinerary.days) {
    const imageUrl = await getImage(day.imageKeyword)

    await db.run(
      `
      INSERT INTO itineraries(
        trip_id,
        day,
        title,
        description,
        image_keyword,
        image_url
      )
      VALUES(?,?,?,?,?,?);
      `,
      [
        tripId,
        day.day,
        day.title,
        day.description,
        day.imageKeyword,
        imageUrl,
      ],
    )
  }

  return itinerary
}

module.exports = {
  generateAndSaveItinerary,
}
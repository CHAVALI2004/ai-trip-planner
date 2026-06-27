const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(cors())

require('dotenv').config()

const generateItinerary = require('./utils/openrouter')
const getImage = require('./utils/pexels')

const {
  generateAndSaveItinerary,
} = require('./services/itineraryService')


const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const dbPath = path.join(__dirname, 'trip.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()


app.post('/register', async (request, response) => {
  const {name, email, password} = request.body

  const userQuery = `
    SELECT * FROM users
    WHERE email = ?
  `

  const dbUser = await db.get(userQuery, [email])

  if (dbUser !== undefined) {
    response.status(400)
    response.send('User already exists')
  } else {
    if (password.length < 6) {
      response.status(400)
      response.send('Password is too short')
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)

      await db.run(
        `
        INSERT INTO users(name,email,password)
        VALUES(?,?,?)
        `,
        [name, email, hashedPassword]
      )

      response.status(200)
      response.send('User created successfully')
    }
  }
})


app.post('/login', async (request, response) => {
  const {email, password} = request.body

  const userQuery = `
    SELECT * FROM users
    WHERE email = ?
  `

  const dbUser = await db.get(userQuery, [email])

  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      dbUser.password,
    )

    if (isPasswordMatched) {
      const payload = {
        userId: dbUser.id,
        email: dbUser.email,
      }

      const jwtToken = jwt.sign(payload, 'MY_SECRET_KEY')

      response.send({
        jwtToken,
        name: dbUser.name,
        email: dbUser.email,
      })
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})

const authenticateToken = (request, response, next) => {
  let jwtToken

  const authHeader = request.headers['authorization']

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }

  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_KEY', (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        request.userId = payload.userId
        request.email = payload.email
        next()
      }
    })
  }
}


app.put('/forgot-password', async (request, response) => {
  const {email, newPassword, confirmPassword} = request.body

  const user = await db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  )

  if (!user) {
    response.status(400)
    response.send('User not found')
    return
  }

  if (newPassword !== confirmPassword) {
    response.status(400)
    response.send('Passwords do not match')
    return
  }

  if (newPassword.length < 6) {
    response.status(400)
    response.send('Password is too short')
    return
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  )

  await db.run(
    `
    UPDATE users
    SET password = ?
    WHERE email = ?
    `,
    [hashedPassword, email]
  )

  response.send('Password updated successfully')
})

app.post('/trips', authenticateToken, async (request, response) => {
  try {
    const {
      startingLocation,
      destination,
      startDate,
      endDate,
      members,
    } = request.body

    const userId = request.userId

    const query = `
      INSERT INTO trips (
        user_id,
        starting_location,
        destination,
        start_date,
        end_date,
        members
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `

    const result = await db.run(query, [
      userId,
      startingLocation,
      destination,
      startDate,
      endDate,
      members,
    ])

    const tripId = result.lastID

    await generateAndSaveItinerary(db, tripId)


    response.status(201).send({
      message: 'Trip Created Successfully',
      tripId,
    })
  } catch (error) {
    console.log(error)
    response.status(500).send(error.message)
  }
})

app.get('/trips', authenticateToken, async (request, response) => {
  const userId = request.userId

  const trips = await db.all(
    `
    SELECT *
    FROM trips
    WHERE user_id = ?
    ORDER BY start_date ASC
    `,
    [userId]
  )

  response.send(trips)
})

app.get('/trips/:tripId', authenticateToken, async (request, response) => {
  try {
    const {tripId} = request.params
    const userId = request.userId

    const trip = await db.get(
      `
      SELECT *
      FROM trips
      WHERE id = ?
      AND user_id = ?;
      `,
      [tripId, userId],
    )

    if (!trip) {
      response.status(404)
      return response.send('Trip not found')
    }

    response.send(trip)
  } catch (error) {
    console.log(error)
    response.status(500).send(error.message)
  }
})

app.delete('/trips/:tripId', authenticateToken, async (request, response) => {
  try {
    const {tripId} = request.params
    const userId = request.userId

    const result = await db.run(
      `
      DELETE FROM trips
      WHERE id = ?
      AND user_id = ?;
      `,
      [tripId, userId],
    )

    if (result.changes === 0) {
      response.status(404)
      return response.send('Trip not found')
    }

    response.send({
      message: 'Trip Deleted Successfully',
    })
  } catch (error) {
    console.log(error)
    response.status(500).send(error.message)
  }
})

app.get(
  '/trips/:tripId/itinerary',
  authenticateToken,
  async (request, response) => {
    try {
      const {tripId} = request.params
      const userId = request.userId

      const trip = await db.get(
        `
        SELECT
          id,
          starting_location,
          destination,
          start_date,
          end_date,
          members,
          estimated_budget,
          destination_image
        FROM trips
        WHERE id = ?
        AND user_id = ?;
        `,
        [tripId, userId],
      )

      if (!trip) {
        response.status(404)
        return response.send('Trip not found')
      }

      const itinerary = await db.all(
        `
        SELECT
          day,
          title,
          description,
          image_keyword,
          image_url
        FROM itineraries
        WHERE trip_id = ?
        ORDER BY day;
        `,
        [tripId],
      )


      response.send({
        trip,
        itinerary,
      })
    } catch (error) {
      console.log(error)
      response.status(500).send(error.message)
    }
  },
)
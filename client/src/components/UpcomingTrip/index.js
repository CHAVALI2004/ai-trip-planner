import {Link} from 'react-router-dom'

import './index.css'

const UpcomingTrip = props => {
  const {trip} = props

  if (!trip || Object.keys(trip).length === 0) {
    return (
      <div className="no-trip-card">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
          alt="no upcoming trip"
          className="no-trip-image"
        />

        <h1 className="no-trip-heading">
          No Upcoming Trips
        </h1>

        <p className="no-trip-description">
          Create your first trip and start planning your journey.
        </p>

        <Link to="/create-trip">
          <button
            type="button"
            className="create-trip-button"
          >
            Create Trip
          </button>
        </Link>
      </div>
    )
  }

  const {
    id,
    destination,
    starting_location,
    start_date,
    end_date,
    members,
    estimated_budget,
    destination_image,
  } = trip

  const imageUrl =
    destination_image?.startsWith('http')
      ? destination_image
      : `https://source.unsplash.com/800x500/?${destination}`

  return (
    <div className="upcoming-trip-card">
      <img
        src={imageUrl}
        alt={destination}
        className="trip-image"
      />

      <div className="trip-details">

        <p className="section-title">
          Upcoming Trip
        </p>

        <h1 className="destination">
          {destination}
        </h1>

        <p className="starting-location">
          From {starting_location}
        </p>

        <div className="trip-info-row">
          <div>
            <p className="label">Start</p>
            <p>{start_date}</p>
          </div>

          <div>
            <p className="label">End</p>
            <p>{end_date}</p>
          </div>
        </div>

        <div className="trip-info-row">
          <div>
            <p className="label">Members</p>
            <p>{members}</p>
          </div>

          <div>
            <p className="label">Budget</p>
            <p>{estimated_budget}</p>
          </div>
        </div>

        <Link to={`/trip/${id}`}>
          <button
            type="button"
            className="view-details-button"
          >
            View Details
          </button>
        </Link>

      </div>
    </div>
  )
}

export default UpcomingTrip

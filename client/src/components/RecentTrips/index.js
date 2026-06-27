import {Link} from 'react-router-dom'

import './index.css'

const RecentTrips = props => {
  const {tripsList} = props

  if (tripsList.length <= 1) {
    return (
      <div className="recent-trips-container">
        <h1 className="recent-heading">Recent Trips</h1>

        <div className="no-recent-trips">
          <p>No Recent Trips</p>
        </div>
      </div>
    )
  }

  const recentTrips = tripsList.slice(1)

  return (
    <div className="recent-trips-container">
      <h1 className="recent-heading">
        Recent Trips
      </h1>

      <ul className="recent-list">
        {recentTrips.map(eachTrip => {
          const {
            id,
            destination,
            start_date,
            end_date,
            estimated_budget,
            destination_image,
          } = eachTrip

          const imageUrl =
            destination_image?.startsWith('http')
              ? destination_image
              : `https://source.unsplash.com/500x350/?${destination}`

          return (
            <li
              className="trip-card"
              key={id}
            >
              <img
                src={imageUrl}
                alt={destination}
                className="trip-card-image"
              />

              <div className="trip-card-details">

                <h2 className="trip-name">
                  {destination}
                </h2>

                <p className="trip-date">
                  {start_date} - {end_date}
                </p>

                <p className="trip-budget">
                  {estimated_budget}
                </p>

                <Link to={`/trip/${id}`}>
                  <button
                    type="button"
                    className="details-button"
                  >
                    View Details
                  </button>
                </Link>

              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RecentTrips

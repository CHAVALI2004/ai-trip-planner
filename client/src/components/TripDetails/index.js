import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link, Redirect} from 'react-router-dom'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class TripDetails extends Component {
  state = {
    trip: {},
    itinerary: [],
    apiStatus: apiStatusConstants.initial,
    isDeleted: false,
  }

  componentDidMount() {
    this.getTripDetails()
  }

  getTripDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {tripId} = match.params

    const response = await fetch(
      `https://ai-trip-planner-v4y6.onrender.com/trips/${tripId}/itinerary`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )

    if (response.ok) {
      const data = await response.json()

      this.setState({
        trip: data.trip,
        itinerary: data.itinerary,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onDeleteTrip = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {tripId} = match.params

    const response = await fetch(
      `https://ai-trip-planner-v4y6.onrender.com/trips/${tripId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    )

    if (response.ok) {
      this.setState({
        isDeleted: true,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader
        type="ThreeDots"
        color="#2563eb"
        height={50}
        width={50}
      />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <h1>Something went wrong</h1>

      <button
        type="button"
        onClick={this.getTripDetails}
      >
        Retry
      </button>
    </div>
  )
    renderSuccessView = () => {
    const {trip, itinerary} = this.state

    const {
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
        : `https://source.unsplash.com/1200x600/?${destination}`

    return (
      <div className="trip-details-container">
        <Link to="/" className="back-link">
          ← Back
        </Link>

        <div className="trip-banner">
          <img
            src={imageUrl}
            alt={destination}
            className="banner-image"
          />

          <div className="banner-overlay">
            <h1 className="destination-heading">
              {destination}
            </h1>

            <p className="trip-route">
              {starting_location} → {destination}
            </p>

            <p className="trip-info">
              📅 {start_date} - {end_date}
            </p>

            <p className="trip-info">
              👥 Members : {members}
            </p>

            <p className="trip-info">
              💰 {estimated_budget}
            </p>
          </div>
        </div>

        <div className="itinerary-section">
          <h2 className="section-heading">
            AI Generated Itinerary
          </h2>

          {itinerary.map(each => (
            <div
              key={each.day}
              className="itinerary-card"
            >
              <img
                src={each.image_url}
                alt={each.title}
                className="itinerary-image"
              />

              <div className="itinerary-details">
                <p className="day-text">
                  Day {each.day}
                </p>

                <h2 className="itinerary-title">
                  {each.title}
                </h2>

                <p className="itinerary-description">
                  {each.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="delete-button"
          onClick={this.onDeleteTrip}
        >
          Delete Trip
        </button>
      </div>
    )
  }

  render() {
    const {apiStatus, isDeleted} = this.state

    if (isDeleted) {
      return <Redirect to="/" />
    }

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }
}

export default TripDetails

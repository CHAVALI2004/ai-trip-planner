import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Sidebar from '../Sidebar'
import UpcomingTrip from '../UpcomingTrip'
import RecentTrips from '../RecentTrips'

import './index.css'

class Home extends Component {
  state = {
    apiStatus: 'INITIAL',
    tripsList: [],
    upcomingTrip: {},
  }

  componentDidMount() {
    this.getTrips()
  }

  getTrips = async () => {
    this.setState({
      apiStatus: 'IN_PROGRESS',
    })

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(
      'http://localhost:3000/trips',
      options,
    )

    if (response.ok) {
      const data = await response.json()

      if (data.length === 0) {
        this.setState({
          tripsList: [],
          apiStatus: 'SUCCESS',
        })
      } else {
        this.setState(
          {
            tripsList: data,
            upcomingTrip: data[0],
          },
          this.getUpcomingTripDetails,
        )
      }
    } else {
      this.setState({
        apiStatus: 'FAILURE',
      })
    }
  }

  getUpcomingTripDetails = async () => {
    const {upcomingTrip} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(
      `http://localhost:3000/trips/${upcomingTrip.id}/itinerary`,
      options,
    )

    if (response.ok) {
      const data = await response.json()

      this.setState({
        upcomingTrip: data.trip,
        apiStatus: 'SUCCESS',
      })
    } else {
      this.setState({
        apiStatus: 'SUCCESS',
      })
    }
  }

  retry = () => {
    this.getTrips()
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
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">
        Something Went Wrong
      </h1>

      <p className="failure-description">
        We couldn't fetch your trips. Please try again.
      </p>

      <button
        type="button"
        className="retry-button"
        onClick={this.retry}
      >
        Retry
      </button>
    </div>
  )

  renderEmptyView = () => (
    <>
      <Header />
      <div className="empty-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
        alt="no trips"
        className="empty-image"
      />

      <h1 className="empty-heading">
        No Trips Yet
      </h1>

      <p className="empty-description">
        Create your first trip to see it here.
      </p>
    </div>
    </>
  )

  renderSuccessView = () => {
    const {
      tripsList,
      upcomingTrip,
    } = this.state

    if (tripsList.length === 0) {
      return this.renderEmptyView()
    }

    return (
      <>
        <Header />

        <h1 className="welcome-heading">
          Welcome Back 👋
        </h1>

        <p className="welcome-description">
          Plan and manage your trips easily.
        </p>

        <div className="cards-container">
          <UpcomingTrip trip={upcomingTrip} />
        </div>

        <RecentTrips tripsList={tripsList} />
      </>
    )
  }

  renderHomeView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'IN_PROGRESS':
        return this.renderLoadingView()

      case 'SUCCESS':
        return this.renderSuccessView()

      case 'FAILURE':
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <Sidebar />

        <div className="main-container">
          {this.renderHomeView()}
        </div>
      </div>
    )
  }
}

export default Home

import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Redirect} from 'react-router-dom'

import './index.css'

class CreateTrip extends Component {
  state = {
    startingLocation: '',
    destination: '',
    startDate: '',
    endDate: '',
    members: 1,
    apiStatus: 'INITIAL',
    errorMsg: '',
    isCreated: false,
  }

  onChangeStartingLocation = event => {
    this.setState({
      startingLocation: event.target.value,
    })
  }

  onChangeDestination = event => {
    this.setState({
      destination: event.target.value,
    })
  }

  onChangeStartDate = event => {
    this.setState({
      startDate: event.target.value,
    })
  }

  onChangeEndDate = event => {
    this.setState({
      endDate: event.target.value,
    })
  }

  onChangeMembers = event => {
    this.setState({
      members: event.target.value,
    })
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {
      startingLocation,
      destination,
      startDate,
      endDate,
      members,
    } = this.state

    if (
      startingLocation === '' ||
      destination === '' ||
      startDate === '' ||
      endDate === ''
    ) {
      this.setState({
        errorMsg: 'All fields are required',
      })
      return
    }

    this.setState({
      apiStatus: 'IN_PROGRESS',
      errorMsg: '',
    })

    const jwtToken = Cookies.get('jwt_token')

    const tripDetails = {
      startingLocation,
      destination,
      startDate,
      endDate,
      members: Number(members),
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripDetails),
    }

    const response = await fetch(
      'http://localhost:3000/trips',
      options,
    )

    if (response.ok) {
      this.setState({
        apiStatus: 'SUCCESS',
        isCreated: true,
      })
    } else {
      const data = await response.text()

      this.setState({
        apiStatus: 'FAILURE',
        errorMsg: data,
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
      <p className="loading-text">
        Generating your AI itinerary...
      </p>
    </div>
  )

  renderForm = () => {
    const {
      startingLocation,
      destination,
      startDate,
      endDate,
      members,
      errorMsg,
    } = this.state

    return (
      <form
        className="create-trip-form"
        onSubmit={this.onSubmitForm}
      >
        <h1 className="create-trip-heading">
          Create New Trip
        </h1>

        <div className="input-container">
          <label className="label" htmlFor="startingLocation">
            Starting Location
          </label>

          <input
            id="startingLocation"
            type="text"
            className="input"
            value={startingLocation}
            onChange={this.onChangeStartingLocation}
            placeholder="Enter starting location"
          />
        </div>

        <div className="input-container">
          <label className="label" htmlFor="destination">
            Destination
          </label>

          <input
            id="destination"
            type="text"
            className="input"
            value={destination}
            onChange={this.onChangeDestination}
            placeholder="Enter destination"
          />
        </div>

        <div className="date-row">
          <div className="input-container">
            <label className="label" htmlFor="startDate">
              Start Date
            </label>

            <input
              id="startDate"
              type="date"
              className="input"
              value={startDate}
              onChange={this.onChangeStartDate}
            />
          </div>

          <div className="input-container">
            <label className="label" htmlFor="endDate">
              End Date
            </label>

            <input
              id="endDate"
              type="date"
              className="input"
              value={endDate}
              onChange={this.onChangeEndDate}
            />
          </div>
        </div>

        <div className="input-container">
          <label className="label" htmlFor="members">
            Members
          </label>

          <input
            id="members"
            type="number"
            min="1"
            className="input"
            value={members}
            onChange={this.onChangeMembers}
          />
        </div>

        {errorMsg !== '' && (
          <p className="error-message">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          className="submit-button"
        >
          Create Trip
        </button>
      </form>
    )
  }

  render() {
    const {apiStatus, isCreated} = this.state

    if (isCreated) {
      return <Redirect to="/" />
    }

    switch (apiStatus) {
      case 'IN_PROGRESS':
        return this.renderLoadingView()

      default:
        return this.renderForm()
    }
  }
}

export default CreateTrip

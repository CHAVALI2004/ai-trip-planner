import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    errorMsg: '',
    showError: false,
    isLoading: false,
  }

  onChangeName = event => {
    this.setState({name: event.target.value})
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeConfirmPassword = event => {
    this.setState({confirmPassword: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {
      name,
      email,
      password,
      confirmPassword,
    } = this.state

    if (password !== confirmPassword) {
      this.setState({
        showError: true,
        errorMsg: 'Passwords do not match',
      })
      return
    }

    this.setState({
      isLoading: true,
      showError: false,
      errorMsg: '',
    })

    const userDetails = {
      name,
      email,
      password,
    }

    const response = await fetch('https://ai-trip-planner-v4y6.onrender.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    })

    if (response.ok) {
      const {history} = this.props
      history.replace('/login')
    } else {
      const error = await response.text()

      this.setState({
        showError: true,
        errorMsg: error,
        isLoading: false,
      })
    }
  }

  render() {
    const jwtToken = Cookies.get('jwtToken')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {
      name,
      email,
      password,
      confirmPassword,
      errorMsg,
      showError,
      isLoading,
    } = this.state

    return (
      <div className="login-bg">
        <div className="login-card">
          <div className="login-left">
            <h1 className="login-heading">
              AI Trip Planner
            </h1>

            <p className="login-description">
              Create your account and start planning unforgettable journeys
              with AI-powered itineraries, weather forecasts and destination
              insights.
            </p>

            <img
              src="https://tinyurl.com/y92v4dfb"
              alt="travel"
              className="login-image"
            />
          </div>

          <div className="login-right">
            <h1 className="form-heading">
              Create Account
            </h1>

            <p className="form-description">
              Join AI Travel Planner today
            </p>

            <form
              className="login-form"
              onSubmit={this.onSubmitForm}
            >
              <label
                className="label"
                htmlFor="name"
              >
                NAME
              </label>

              <input
                id="name"
                type="text"
                className="input"
                placeholder="Enter your name"
                value={name}
                onChange={this.onChangeName}
                required
              />

              <label
                className="label"
                htmlFor="email"
              >
                EMAIL
              </label>

              <input
                id="email"
                type="email"
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={this.onChangeEmail}
                required
              />

              <label
                className="label"
                htmlFor="password"
              >
                PASSWORD
              </label>

              <input
                id="password"
                type="password"
                className="input"
                placeholder="Create password"
                value={password}
                onChange={this.onChangePassword}
                required
              />

              <label
                className="label"
                htmlFor="confirmPassword"
              >
                CONFIRM PASSWORD
              </label>

              <input
                id="confirmPassword"
                type="password"
                className="input"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={this.onChangeConfirmPassword}
                required
              />

              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>

              {showError && (
                <p className="error-msg">
                  {errorMsg}
                </p>
              )}

              <div className="links-container">
                <span>
                  Already have an account?
                </span>

                <Link
                  to="/login"
                  className="link"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Register

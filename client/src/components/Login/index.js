import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'
import './index.css'

class Login extends Component {
  state = {
    email: '',
    password: '',
    showPassword: false,
    errorMsg: '',
    showError: false,
    isLoading: false,
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onTogglePassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })

    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      errorMsg,
      showError: true,
      isLoading: false,
    })
  }

  onSubmitForm = async event => {
    event.preventDefault()

    this.setState({
      isLoading: true,
      showError: false,
      errorMsg: '',
    })

    const {email, password} = this.state

    const userDetails = {
      email,
      password,
    }

    const response = await fetch('https://ai-trip-planner-v4y6.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    })

    if (response.ok) {
      const data = await response.json()

      localStorage.setItem('name', data.name)
      localStorage.setItem('email', data.email)

      this.onSubmitSuccess(data.jwtToken)
    } else {
      const error = await response.text()
      this.onSubmitFailure(error)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {
      email,
      password,
      showPassword,
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
              Plan smarter, travel better. Create AI-powered itineraries,
              discover destinations, and organize every trip in one place.
            </p>

            <img
              src="https://tinyurl.com/y92v4dfb"
              alt="travel"
              className="login-image"
            />
          </div>

          <div className="login-right">
            <h1 className="form-heading">
              Welcome Back
            </h1>

            <p className="form-description">
              Login to continue your journey
            </p>

            <form
              className="login-form"
              onSubmit={this.onSubmitForm}
            >
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

              <div className="password-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input password-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={this.onChangePassword}
                  required
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={this.onTogglePassword}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible />
                  ) : (
                    <AiFillEye />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'Login'}
              </button>

              {showError && (
                <p className="error-msg">
                  {errorMsg}
                </p>
              )}

              <div className="links-container">
                <Link
                  to="/register"
                  className="link"
                >
                  Create Account
                </Link>

                <Link
                  to="/forgot-password"
                  className="link"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
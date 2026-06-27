import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

class ForgotPassword extends Component {
  state = {
    email: '',
    newPassword: '',
    confirmPassword: '',
    errorMsg: '',
    successMsg: '',
    showError: false,
    isLoading: false,
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value})
  }

  onChangeNewPassword = event => {
    this.setState({newPassword: event.target.value})
  }

  onChangeConfirmPassword = event => {
    this.setState({confirmPassword: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {
      email,
      newPassword,
      confirmPassword,
    } = this.state

    if (newPassword !== confirmPassword) {
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
      successMsg: '',
    })

    const userDetails = {
      email,
      newPassword,
      confirmPassword,
    }

    const response = await fetch(
      'http://localhost:3000/forgot-password',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      },
    )

    const data = await response.text()

    if (response.ok) {
      this.setState({
        successMsg: data,
        isLoading: false,
        email: '',
        newPassword: '',
        confirmPassword: '',
      })
    } else {
      this.setState({
        showError: true,
        errorMsg: data,
        isLoading: false,
      })
    }
  }

  render() {
    const {
      email,
      newPassword,
      confirmPassword,
      errorMsg,
      successMsg,
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
              Reset your password securely and continue planning your next
              adventure.
            </p>

            <img
              src="https://tinyurl.com/y92v4dfb"
              alt="travel"
              className="login-image"
            />
          </div>

          <div className="login-right">
            <h1 className="form-heading">
              Forgot Password
            </h1>

            <p className="form-description">
              Create a new password
            </p>

            <form
              className="login-form"
              onSubmit={this.onSubmitForm}
            >
              <label className="label">
                EMAIL
              </label>

              <input
                className="input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={this.onChangeEmail}
                required
              />

              <label className="label">
                NEW PASSWORD
              </label>

              <input
                className="input"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={this.onChangeNewPassword}
                required
              />

              <label className="label">
                CONFIRM PASSWORD
              </label>

              <input
                className="input"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={this.onChangeConfirmPassword}
                required
              />

              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Updating...'
                  : 'Update Password'}
              </button>

              {showError && (
                <p className="error-msg">
                  {errorMsg}
                </p>
              )}

              {successMsg !== '' && (
                <p
                  style={{
                    color: 'green',
                    marginTop: '15px',
                    fontWeight: '500',
                  }}
                >
                  {successMsg}
                </p>
              )}

              <div className="links-container">
                <Link
                  to="/login"
                  className="link"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default ForgotPassword

import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')

    const {history} = props

    history.replace('/login')
  }

  return (
    <nav className="header">
      <Link to="/" className="logo-link">
        <h1 className="logo">
          AI Trip Planner
        </h1>
      </Link>

      <div className="header-right">

        <Link to="/create-trip">
          <button
            type="button"
            className="create-trip-btn"
          >
            + Create Trip
          </button>
        </Link>

        <button
          type="button"
          className="logout-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  )
}

export default withRouter(Header)
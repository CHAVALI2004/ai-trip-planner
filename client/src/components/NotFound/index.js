import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png"
      alt="not found"
      className="not-found-image"
    />

    <h1>Page Not Found</h1>

    <p>
      Sorry, the page you are looking for doesn't exist.
    </p>

    <Link to="/">
      <button type="button" className="home-button">
        Go Home
      </button>
    </Link>
  </div>
)

export default NotFound

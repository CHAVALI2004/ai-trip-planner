import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {
  AiFillHome,
  AiOutlinePlusCircle,
} from 'react-icons/ai'

import {MdTravelExplore} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'
import {FaGithub, FaLinkedin, FaGlobe} from 'react-icons/fa'

import './index.css'

const Sidebar = props => {
  const {history, location} = props
  const userName = localStorage.getItem('name')
  const userEmail = localStorage.getItem('email')

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const {pathname} = location

  return (
    <>
      <div className="sidebar-container">
        <div>
          <h1 className="sidebar-logo">TripAI</h1>

          <ul className="sidebar-list">
            <Link to="/" className="link-item">
              <li
                className={
                  pathname === '/'
                    ? 'sidebar-item active'
                    : 'sidebar-item'
                }
              >
                <AiFillHome className="sidebar-icon" />
                Home
              </li>
            </Link>

            <Link to="/create-trip" className="link-item">
              <li
                className={
                  pathname === '/create-trip'
                    ? 'sidebar-item active'
                    : 'sidebar-item'
                }
              >
                <AiOutlinePlusCircle className="sidebar-icon" />
                Create Trip
              </li>
            </Link>

            <Link to="/" className="link-item">
              <li className="sidebar-item">
                <MdTravelExplore className="sidebar-icon" />
                Trips
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebar-footer">
        <div className="profile-card">
          <div className="profile-card1">
            <img
            src={`https://ui-avatars.com/api/?name=${userName}&background=2563eb&color=fff`}
            alt="profile"
            className="profile-image"
          />

          <div className="profile-con">
            <h3 className="profile-name">
            {userName}
          </h3>

          <p className="profile-role">
            {userEmail}
          </p>
          </div>
          </div>

          <div className="social-icons">
            <FaGithub className="social-icon" />

            <FaLinkedin className="social-icon" />

            <FaGlobe className="social-icon" />
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
          >
            <FiLogOut className="sidebar-icon" />
            Logout
          </button>
        </div>
      </div>
      </div>

      {/* Mobile Navigation */}

      <div className="mobile-sidebar">
        <Link to="/" className="mobile-link">
          <AiFillHome className="mobile-icon" />
        </Link>

        <Link to="/create-trip" className="mobile-link">
          <AiOutlinePlusCircle className="mobile-icon" />
        </Link>

        <button
          type="button"
          className="mobile-logout"
          onClick={onLogout}
        >
          <FiLogOut className="mobile-icon" />
        </button>
      </div>
    </>
  )
}

export default withRouter(Sidebar)
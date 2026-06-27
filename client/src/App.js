import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Home from './components/Home'
import CreateTrip from './components/CreateTrip'
import TripDetails from './components/TripDetails'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />

      <Route exact path="/register" component={Register} />

      <Route
        exact
        path="/forgot-password"
        component={ForgotPassword}
      />

      <ProtectedRoute
        exact
        path="/"
        component={Home}
      />

      <ProtectedRoute
        exact
        path="/create-trip"
        component={CreateTrip}
      />

      <ProtectedRoute
        exact
        path="/trip/:tripId"
        component={TripDetails}
      />

      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default App

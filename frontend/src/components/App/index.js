import React from 'react';
import { Router, Route } from 'react-router-dom';

import SignInPage from "../SignIn";
import LandingPage from '../Landing';
import * as routes from '../../constants/routes';
import history from '../../constants/history';
import Navigation from '../Navigation';
import withSession from '../Session/withSession';

const App = ({ session, refetch }) => (
  <Router history={history}>
    <div>
      <Navigation session={session} />
      <hr />

      <Route
        exact
        path={routes.LANDING}
        component={() => <LandingPage />}
        />

      <Route
        exact
        path={routes.SIGN_IN}
        component={() => <SignInPage refetch={refetch} />}
        />
    </div>
  </Router>
)

export default withSession(App);
import React from 'react'
import LoginPage from "./views/LoginPage/LoginPage";
import LandingPage from "./views/LandingPage/LandingPage"
import PostPage from "./views/PostPage/PostPage";
import ContentManagerPage from "./views/ContentManagerPage/ContentManagerPage";
import { Router, Route } from 'react-router-dom';
import SignInPage from "./components/SignIn";
import PostTablePage from "./components/PostTable";
import withSession from './components/Session/withSession';
import ContentEditorPage from "./components/ContentManager";

import * as routes from './constants/routes';
import history from './constants/history';

const HeavyApp = ({ session, refetch }) => (
  <Router history={history}>
    <div>
      <Route
        exact
        path={routes.LANDING}
        component={() => <LandingPage />}
      />

      <Route
        exact
        path={routes.CONTENT_MANAGER}
        component={() => <ContentManagerPage />}
      />

      <Route
        exact
        path={routes.LOGIN}
        component={() => <LoginPage refetch={refetch} history={history} />}
      />
      <Route
        exact
        path={routes.EDITOR_MANAGER}
        component={() => <ContentEditorPage refetch={refetch} />}
      />
      <Route
        path='/posts/:hash'
        component={PostPage} />
    </div>
  </Router>
)

export default withSession(HeavyApp);
import React from 'react'
import LoginPage from "./views/LoginPage/LoginPage";
import LandingPage from "./views/LandingPage/LandingPage"
import PostPage from "./views/PostPage/PostPage";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import ContentManagerPage from "./views/ContentManagerPage/ContentManagerPage";
import { Router, Route, Redirect } from 'react-router-dom';
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
        component={() => <Redirect to="/posts"/>}
      />

      <Route
        exact
        path="/posts"
        component={() => <LandingPage/>}
      />


      <Route
        path="/filter/:type"
        component={LandingPage}
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
      <Route path="/profile" component={ProfilePage}/>
      <Route
        path='/posts/:hash'
        component={PostPage} />
    </div>
  </Router>
)

export default withSession(HeavyApp);
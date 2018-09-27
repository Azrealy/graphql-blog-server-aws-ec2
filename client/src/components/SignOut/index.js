import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

const SignOutButton = () => (
  <ApolloConsumer>
    {client => (
      <button type="button" onClick={() => signOut(client)}>
        Sign Out
      </button>
    )}
  </ApolloConsumer>
);
const signOut = client => {
    // delete the token store at the localStorage
    localStorage.setItem('token', '')
    client.resetStore();
    // Back to sign in page.
    history.push(routes.LANDING)
}
export {signOut}

export default SignOutButton;
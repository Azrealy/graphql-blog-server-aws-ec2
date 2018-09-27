import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import * as routes from '../../constants/routes';
import { GET_ME } from './queries';

const withAuthorization = conditionFn => Component => props => (
  <Query query={GET_ME}>
    {({ data, networkStatus }) => {
      if (networkStatus < 7) {
        return null;
      }

      if (conditionFn(data)) {
        return <Component {...props} />
      } else {
        alert("you dont have the permission to edit contents.")
        return <Redirect to={routes.SIGN_IN} />
      };
    }}
  </Query>
);

export default withAuthorization;
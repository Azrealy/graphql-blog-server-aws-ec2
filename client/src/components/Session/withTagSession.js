import gql from "graphql-tag";
import React from 'react';
import { Query } from 'react-apollo';
import Loading from "../Loading";
import Error from "../Error";


export const GET_TAGS_LIST = gql`
  query {
    tags {
        id
        name
    }
  }
`

const withTagSession = Component => props => (
  <Query query={GET_TAGS_LIST}>
    {({ data, error, refetch, loading }) => {
    if (loading && !data.tags) {
      return <Loading isCenter={true} />;
    }
    if (error) {
      return <Error error={error}/>;
    }
    return <Component {...props} data={data} refetch={refetch} />;
    }}
  </Query>
)
export default withTagSession;
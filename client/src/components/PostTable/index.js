import React from 'react';
import { Query } from "react-apollo";
import PostTable from './PostTable'
import Loading from '../Loading';
import gql from "graphql-tag";

import POST_FRAGMENT from "../../constants/fragments";

const GET_POSTS_LIST = gql`
  {
    posts {
      edges {
      ...postContent
      }
      postInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_FRAGMENT}
`

const PostTablePage = () => (
    <Query
        query={GET_POSTS_LIST}
        notifyOnNetworkStatusChange={true}
    >
        {({ data, loading, error }) => {
            console.log("data ", data)
            if (loading && !data.posts) {
                return <Loading isCenter={true} />;
            }

            return (
                <PostTable
                    data={data}
                    error={error}
                />
            )
        }}

    </Query>
);

export default PostTablePage;
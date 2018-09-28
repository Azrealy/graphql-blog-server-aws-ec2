import React from 'react';
import { Query } from "react-apollo";
import ErrorMessage from '../Error';
import PostList from '../PostList'
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

const Landing = () => (
  <Query
    query={GET_POSTS_LIST}
    notifyOnNetworkStatusChange={true}
    >
    {({data, loading, error}) => {
        const { posts } = data;
        console.log(data)
    
        if (loading && !posts) {
            return <Loading isCenter={true} />;
          }      
    
        if (error) {
            return <ErrorMessage error={error} />
        }

        return (
          <PostList
            posts={posts.edges}
            />
        )
    }}

  </Query>
);

export default Landing;
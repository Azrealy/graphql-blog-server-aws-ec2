import React from 'react';
import { Query } from "react-apollo";
import ErrorMessage from '../Error';
import PostList from '../PostList'
import Loading from '../Loading';
import { GET_POSTS_LIST } from "./queries";


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
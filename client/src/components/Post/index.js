import React from 'react'
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom'
import ReactMarkdown from "react-markdown";
import gql from "graphql-tag";

import Loading from '../Loading';
import ErrorMessage from '../Error';
import POST_FRAGMENT from "../../constants/fragments";
import PostContent from "./PostContent";

const GET_POST = gql`
  query($id: ID!) {
    post(id: $id) {
      ...postContent
    }
  }
  ${POST_FRAGMENT}
`

const Post = (props) => {

    return (
        <Query 
            query={GET_POST}
            notifyOnNetworkStatusChange={true}
            variables={{ id: props.match.params.number}}>
            {({data, loading, error}) => {
                const { post } = data
                console.log("post", post)
                if (loading && !post) {
                    return <Loading isCenter={true} />;
                }
                if (error) {
                    return <ErrorMessage error={error} />
                }
                return <PostContent {...post} />
            }}
        </Query>
    )

}

export default Post

import React from 'react'
import { Query } from "react-apollo";
import { withRouter } from 'react-router-dom';

import ErrorMessage from '../Error';
import Loading from '../Loading';
import { GET_TAGS_LIST } from "./queries";
import Editor from "../Editor";
import withAuthorization from "../Session/withAuthorization";

const ContentManager = ({ history, isUpdate, post, handleClose}) => (
  <div>
    <Query
      query={GET_TAGS_LIST}
      notifyOnNetworkStatusChange={true}
      >
      {({ data, loading, error, refetch}) => {
        const { tags } = data;

        if (loading && !tags) {
          return <Loading isCenter={true} />;
        }      
  
        if (error) {
            return <ErrorMessage error={error} />
        }

        if (isUpdate && post) {
          const tagIds = post.tags.map(tag=> tag.id)
          return <Editor
                  id={post.id}
                  title={post.title}
                  description={post.description}
                  content={post.content}
                  image={post.image}
                  tags={tags}
                  tagIds={tagIds}
                  handleClose={handleClose}
                  isUpdate={isUpdate}
                  history={history}
                  refetch={refetch} />
        }
        return <Editor 
          tags={tags}
          history={history}
          refetch={refetch}/>
      }}

    </Query>
  </div>
)

export default withAuthorization(
    session => session && session.me && session.me.role === 'ADMIN',
  )(withRouter(ContentManager))
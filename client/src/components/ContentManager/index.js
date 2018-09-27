import React from 'react'
import { Query } from "react-apollo";

import ErrorMessage from '../Error';
import Loading from '../Loading';
import { GET_TAGS_LIST } from "./queries";
import Editor from "../Editor";
import withAuthorization from "../Session/withAuthorization";

const ContentManager = () => (
  <div>
    <Query
      query={GET_TAGS_LIST}
      notifyOnNetworkStatusChange={true}
      >
      {({data, loading, error}) => {
        const { tags } = data;

        if (loading && !tags) {
          return <Loading isCenter={true} />;
        }      
  
        if (error) {
            return <ErrorMessage error={error} />
        }

        return <Editor tags={tags}/>
      }}

    </Query>
  </div>
)

export default withAuthorization(
    session => session && session.me && session.me.role === 'ADMIN',
  )(ContentManager)
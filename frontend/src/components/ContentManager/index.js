import React from 'react'

import Editor from "../Editor";
import withAuthorization from "../Session/withAuthorization";

const ContentManager = () => (
  <div>
    <Editor />
  </div>
)

export default withAuthorization(
    session => session && session.me && session.me.role === 'ADMIN',
  )(ContentManager)
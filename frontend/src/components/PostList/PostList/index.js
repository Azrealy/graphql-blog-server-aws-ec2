import React from 'react'
import PostItem from "../PostItem";

const PostList = ({
    posts
}) => (
  <div>
    {posts.map(( post ) => (
      <div key={posts.id}>
        <PostItem {...post} />
      </div>
    ))}
  </div>
)

export default PostList;
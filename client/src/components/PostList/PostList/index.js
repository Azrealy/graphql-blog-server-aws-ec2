import React from 'react'
import PostItem from "../PostItem";

const PostList = ({
    posts
}) => (
  <div>
    {posts.map(( post ) => (
      <div key={post.id}>
          <PostItem {...post} />
      </div>
    ))}
  </div>
)

export default PostList;
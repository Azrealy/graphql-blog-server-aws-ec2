import React from 'react';
import Link from '../../Link';
import ReactMarkdown from "react-markdown";

const PostItem = ({
    title,
    description,
    content,
    createdAt,
    tags,
}) => (
  <div>
    <h2>
      <Link href={"#"}>{title}</Link>
    </h2>

    <h3>{description}</h3>
    <ReactMarkdown source={content}/>
    {tags.map(({ id, name }) => (<p key={id}> {name} </p>))}
  </div>
)

export default PostItem
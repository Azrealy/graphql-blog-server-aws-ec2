import React from 'react';
import Link from '../../Link';
import ReactMarkdown from "react-markdown";

const PostItem = ({
    title,
    description,
    text,
    createdAt,
    tags,
}) => (
  <div>
    <h2>
      <Link href={"#"}>{title}</Link>
    </h2>

    <h3>{description}</h3>
    <ReactMarkdown source={text}/>
    {tags.map(({ text }) => (<p> {text} </p>))}
  </div>
)

export default PostItem
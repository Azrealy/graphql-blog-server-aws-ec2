import React from 'react';
import ReactMarkdown from "react-markdown";

const PostContent = ({
    id,
    title,
    description,
    image,
    content,
    createdAt,
    tags,
}) => (
        <div>
            <img src={image} alt="HTML5 Icon" />
            <h2>{title}</h2>

            <h3>{description}</h3>
            <ReactMarkdown source={content} />
            {tags.map(({ id, name }) => (<p key={id}> {name} </p>))}
        </div>
    )

export default PostContent
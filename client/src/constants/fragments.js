import gql from "graphql-tag";

const POST_FRAGMENT = gql`
    fragment postContent on Post {
        id
        title
        content
        description
        image
        createdAt
        tags {
            id
            name
        }
    }
`

export default POST_FRAGMENT
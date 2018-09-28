import gql from "graphql-tag";

const POST_FRAGMENT = gql`
    fragment postContent on Post {
        id
        title
        content
        description
        createdAt
        tags {
            id
            name
        }
    }
`

export default POST_FRAGMENT
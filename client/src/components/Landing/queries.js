import gql from "graphql-tag";

export const GET_POSTS_LIST = gql`
  query {
    posts {
        edges {
            id
            title
            description
            text
            createdAt
            tags {
                id
                text
            }
        }
    }
  }
`
import gql from "graphql-tag";

export const GET_POSTS_LIST = gql`
  query {
    posts {
        edges {
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
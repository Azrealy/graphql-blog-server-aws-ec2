import gql from "graphql-tag";

export const GET_TAGS_LIST = gql`
  query {
    tags {
        id
        name
    }
  }
`
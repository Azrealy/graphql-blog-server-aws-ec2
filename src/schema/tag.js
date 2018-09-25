import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        tags: [Tag!]
        tag(id: ID!): Tag
    }

    type Tag {
        id: ID!,
        text: String!
    }
`
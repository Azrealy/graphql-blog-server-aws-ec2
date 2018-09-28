import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        tags: [Tag]
        tag(id: ID!): Tag
    }

    extend type Mutation {
        addTag (
            name: String!
        ): Tag
        deleteTag (
            id: Int!
        ): Boolean
    }

    type Tag {
        id: ID!,
        name: String!
        posts: [Post]
    }
`
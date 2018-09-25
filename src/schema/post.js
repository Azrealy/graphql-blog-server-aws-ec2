import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        posts(cursor: String, limit: Int): PostConnection!
        post(id: ID!): Post!
    }


    type PostConnection {
        edges: [Post!]!
        postInfo: PostInfo!
    }

    type PostInfo {
        hasNextPage: Boolean!
        endCursor: String!
    }

    type Post {
        id: ID!
        title: String!
        description: String!
        tags: [Tag!]
        text: String!
        createdAt: String!
    }
`
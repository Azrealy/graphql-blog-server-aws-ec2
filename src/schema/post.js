import { gql } from 'apollo-server-express';

export default gql`
    
    scalar DateTime

    extend type Query {
        posts(cursor: String, limit: Int): PostConnection!
        post(id: ID!): Post!
    }

    extend type Mutation {
        createPost(
            title: String!,
            description: String!,
            content: String!,
            tags: [ID!]!
        ): Post!
        deletePost(
            id: ID!
        ): Boolean!
        updatePost(
            id: ID!,
            title: String!,
            description: String!,
            content: String!,
            tags: [ID!]!
        ): Post!

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
        tags: [Tag!]!
        content: String!
        createdAt: String!
    }
`
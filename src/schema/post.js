import { gql } from 'apollo-server-express';

export default gql`
    
    scalar DateTime

    extend type Query {
        posts(forward: Boolean, cursor: String, limit: Int): PostConnection!
        post(filename: String, id: ID): Post!
    }

    extend type Mutation {
        createPost(
            filename: String!,
            title: String!,
            description: String!,
            image: String!,
            content: String!,
            tags: [ID!]!
        ): Post!
        deletePost(
            id: ID!
        ): Boolean!
        updatePost(
            id: ID!,
            filename: String!,
            title: String!,
            description: String!,
            image: String!,
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
        startCursor: String!
        endCursor: String!
        count: Int!
    }

    type Post {
        id: ID!
        filename: String!
        title: String!
        description: String!
        image: String!
        tags: [Tag!]!
        content: String!
        createdAt: String!
    }
`
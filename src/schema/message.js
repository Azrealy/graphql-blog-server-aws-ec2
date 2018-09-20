import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages(cursor: String, limit: Int):  MessageConnection!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Boolean!
  }

  type MessageConnection {
      edges: [Message!]!
      pageInfo: PageInfo!
  }

  type PageInfo {
      hasNextPage: Boolean!
      endCursor: String!
  }

  type Message {
    id: ID!
    createdAt: String!
    text: String!
    user: User!
  }
  extend type Subscription {
      messageCreated: MessageCreated!
  }
  type MessageCreated {
      message: Message!
  }
`;